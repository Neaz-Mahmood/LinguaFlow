import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConversationMessage, ConversationRole, MessageGenerationStatus } from '../../entities/conversation-message.entity';
import { ConversationSession, ConversationStatus } from '../../entities/conversation-session.entity';
import { VoiceSession, VoiceSessionEndedReason, VoiceSessionStatus } from '../../entities/voice-session.entity';
import { VoiceUsageEvent, VoiceUsageKind } from '../../entities/voice-usage-event.entity';
import { User } from '../../entities/user.entity';
import { Story } from '../../entities/story.entity';
import { ConversationsService } from '../conversations/conversations.service';
import { EntitlementsService } from '../entitlements/entitlements.service';
import { VoiceAiProvider } from './voice-ai.provider';
import { estimateCostMicros } from './pricing.constants';
import {
  defaultScenario,
  isSupportedTargetLanguage,
  normalizeTargetLanguage,
} from '../../common/supported-languages';
import { FlowSessionsService } from '../flow-sessions/flow-sessions.service';

export interface VoiceTurnResult {
  transcript: string;
  replyText: string;
  replyAudioBase64: string;
  correction: { text: string; audioBase64: string | null } | null;
  quota: { practiceMinutesRemaining: number };
  sessionState: VoiceSessionStatus;
}

@Injectable()
export class VoiceService {
  constructor(
    @InjectRepository(VoiceSession) private readonly voiceSessions: Repository<VoiceSession>,
    @InjectRepository(VoiceUsageEvent) private readonly usageEvents: Repository<VoiceUsageEvent>,
    @InjectRepository(ConversationSession) private readonly convSessions: Repository<ConversationSession>,
    @InjectRepository(ConversationMessage) private readonly messages: Repository<ConversationMessage>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Story) private readonly stories: Repository<Story>,
    private readonly entitlements: EntitlementsService,
    private readonly flowSessions: FlowSessionsService,
    private readonly ai: VoiceAiProvider,
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async createSession(user: User, mode: 'standard' | 'realtime') {
    const sessionCapSec = await this.entitlements.assertCanStartVoice(user, mode);
    await this.entitlements.grantOnboardingBonusIfEligible(user);

    if (!isSupportedTargetLanguage(user.targetLanguage)) {
      throw new BadRequestException(
        `Voice is not available for ${user.targetLanguage}.`,
      );
    }
    const targetLanguage = normalizeTargetLanguage(user.targetLanguage);

    // Link to a ConversationSession so voice turns feed the existing assessment pipeline.
    const flow = await this.flowSessions.getTodaySession(user.id);
    let convSession = await this.convSessions.findOne({ where: { flowSessionId: flow.id } });
    if (!convSession) {
      const story = await this.stories.findOne({
        where: { level: user.currentLevel, language: targetLanguage },
      });
      const fallback = defaultScenario(targetLanguage);
      convSession = await this.convSessions.save(
        this.convSessions.create({
          userId: user.id,
          flowSessionId: flow.id,
          targetLanguage,
          nativeLanguage: user.nativeLanguage,
          cefrLevel: user.currentLevel,
          scenario: {
            storyId: story?.id ?? null,
            title: story?.title ?? fallback.title,
            context: story?.contentTarget ?? fallback.context,
          },
          status: ConversationStatus.ACTIVE,
          companionModel: this.config.get<string>('OPENAI_VOICE_LLM_MODEL', 'gpt-4o-mini'),
          criticModel: this.config.get<string>('OPENAI_CRITIC_MODEL', 'gpt-5.4-nano'),
        }),
      );
    }

    const voiceSession = await this.voiceSessions.save(
      this.voiceSessions.create({
        userId: user.id,
        conversationSessionId: convSession.id,
        targetLanguage,
        nativeLanguage: user.nativeLanguage,
        cefrLevel: user.currentLevel,
        mode: mode as any,
        sessionCapSeconds: sessionCapSec,
        sttModel: this.config.get<string>('OPENAI_STT_MODEL', 'gpt-4o-mini-transcribe'),
        ttsModel: this.config.get<string>('OPENAI_TTS_MODEL', 'gpt-4o-mini-tts'),
        llmModel: this.config.get<string>('OPENAI_VOICE_LLM_MODEL', 'gpt-4o-mini'),
      }),
    );

    const quota = await this.entitlements.getQuotaSnapshot(user.id);
    return { voiceSessionId: voiceSession.id, conversationSessionId: convSession.id, sessionCapSec, quota };
  }

  async processTurn(
    user: User,
    sessionId: string,
    audioBuffer: Buffer,
    mimeType: string,
    clientTurnId: string,
  ): Promise<VoiceTurnResult> {
    const voiceSession = await this.voiceSessions.findOne({ where: { id: sessionId } });
    if (!voiceSession) throw new NotFoundException('Voice session not found');
    if (voiceSession.userId !== user.id) throw new ForbiddenException();
    if (voiceSession.status !== VoiceSessionStatus.ACTIVE) {
      throw new ConflictException('Voice session is no longer active');
    }

    // Check idempotency via clientTurnId stored as a ConversationMessage clientMessageId.
    const existing = await this.messages.findOne({
      where: { sessionId: voiceSession.conversationSessionId!, clientMessageId: clientTurnId },
    });
    if (existing) {
      const assistant = await this.messages.findOne({
        where: { sessionId: voiceSession.conversationSessionId!, orderIndex: existing.orderIndex + 1 },
      });
      if (assistant?.generationStatus === MessageGenerationStatus.PERSISTED) {
        const quota = await this.entitlements.getQuotaSnapshot(user.id);
        return this.buildTurnResult(existing.content, assistant.content, null, quota.practiceMinutesRemaining, voiceSession.status, user, voiceSession);
      }
      throw new ConflictException('Turn is still being processed');
    }

    const limits = this.entitlements.getEntitlements(user);

    // 1. Transcribe
    const { text: transcript, userSpeakingSec } = await this.ai.transcribe(
      audioBuffer,
      mimeType,
      voiceSession.targetLanguage,
    );
    if (!transcript.trim()) throw new BadRequestException('No speech detected');

    // 2. Reserve seconds (atomic, bonus-first)
    const { grantedSec, allowed } = await this.entitlements.reserveVoiceSeconds(
      user.id,
      voiceSession.mode as any,
      userSpeakingSec,
      { sessionId, model: voiceSession.sttModel, language: voiceSession.targetLanguage },
    );

    // 3. Load conversation context
    const convSession = await this.convSessions.findOneOrFail({
      where: { id: voiceSession.conversationSessionId! },
    });
    const transcript_msgs = await this.messages.find({
      where: { sessionId: convSession.id },
      order: { orderIndex: 'ASC' },
    });

    // 4. Save learner turn
    const learnerMsg = await this.messages.save(
      this.messages.create({
        sessionId: convSession.id,
        orderIndex: transcript_msgs.length,
        role: ConversationRole.LEARNER,
        content: transcript,
        clientMessageId: clientTurnId,
        generationStatus: MessageGenerationStatus.PERSISTED,
      }),
    );

    // 5. Generate reply
    const { text: replyText, inputTokens, outputTokens } = await this.ai.converse(
      convSession,
      [...transcript_msgs, learnerMsg],
      { short: limits.shortResponses },
    );

    // 6. Save assistant turn
    await this.messages.save(
      this.messages.create({
        sessionId: convSession.id,
        orderIndex: transcript_msgs.length + 1,
        role: ConversationRole.ASSISTANT,
        content: replyText,
        clientMessageId: null,
        generationStatus: MessageGenerationStatus.PERSISTED,
      }),
    );

    // 7. Synthesize reply audio
    const { audio: replyAudio, audioSec: replyAudioSec } = await this.ai.synthesize(
      replyText,
      voiceSession.targetLanguage,
    );

    // 8. Build correction (basic = text only, no TTS for correction)
    let correction: { text: string; audioBase64: string | null } | null = null;
    if (limits.feedbackDepth !== 'basic' || transcript_msgs.length === 0) {
      // Provide one simple correction hint derived from the reply context.
      // Full deep feedback comes from the assessment pipeline at session end.
      const correctionText = `Try: "${replyText}"`;
      let correctionAudio: string | null = null;
      if (limits.audioCorrections) {
        const { audio } = await this.ai.synthesize(correctionText, voiceSession.targetLanguage);
        correctionAudio = audio.toString('base64');
      }
      correction = { text: correctionText, audioBase64: correctionAudio };
    }

    // 9. Update session counters
    await this.voiceSessions.update(sessionId, {
      userSpeakingSeconds: () => `user_speaking_seconds + ${grantedSec}`,
      aiSpeakingSeconds: () => `ai_speaking_seconds + ${replyAudioSec}`,
      wallClockSeconds: () => `wall_clock_seconds + ${userSpeakingSec + replyAudioSec}`,
    });

    // 10. Write usage events for LLM and TTS
    await this.usageEvents.save([
      this.usageEvents.create({
        userId: user.id,
        voiceSessionId: sessionId,
        kind: VoiceUsageKind.LLM,
        model: voiceSession.llmModel,
        targetLanguage: voiceSession.targetLanguage,
        inputTokens,
        outputTokens,
        estCostMicros: estimateCostMicros(voiceSession.llmModel, { inputTokens, outputTokens }).toString(),
      }),
      this.usageEvents.create({
        userId: user.id,
        voiceSessionId: sessionId,
        kind: VoiceUsageKind.TTS,
        model: voiceSession.ttsModel,
        targetLanguage: voiceSession.targetLanguage,
        audioSecondsOut: replyAudioSec,
        estCostMicros: estimateCostMicros(voiceSession.ttsModel, { audioSecondsOut: replyAudioSec }).toString(),
      }),
    ]);

    // 11. Cap session if quota was clamped or wall-clock exceeded
    const updatedSession = await this.voiceSessions.findOneOrFail({ where: { id: sessionId } });
    let finalStatus: VoiceSessionStatus = voiceSession.status;
    if (!allowed || updatedSession.wallClockSeconds >= voiceSession.sessionCapSeconds) {
      await this.voiceSessions.update(sessionId, {
        status: VoiceSessionStatus.CAPPED,
        endedAt: new Date(),
        endedReason: VoiceSessionEndedReason.CAP,
      });
      finalStatus = VoiceSessionStatus.CAPPED;
    }

    const quota = await this.entitlements.getQuotaSnapshot(user.id);
    return this.buildTurnResult(transcript, replyText, correction, quota.practiceMinutesRemaining, finalStatus, user, voiceSession, replyAudio);
  }

  async getQuota(userId: number) {
    return this.entitlements.getQuotaSnapshot(userId);
  }

  async endSession(user: User, sessionId: string, reason: 'user' | 'silence' | 'error') {
    const voiceSession = await this.voiceSessions.findOne({ where: { id: sessionId } });
    if (!voiceSession) throw new NotFoundException('Voice session not found');
    if (voiceSession.userId !== user.id) throw new ForbiddenException();
    if (voiceSession.status === VoiceSessionStatus.ENDED) {
      return { status: voiceSession.status };
    }
    const reasonMap: Record<string, VoiceSessionEndedReason> = {
      user: VoiceSessionEndedReason.USER,
      silence: VoiceSessionEndedReason.SILENCE,
      error: VoiceSessionEndedReason.ERROR,
    };
    await this.voiceSessions.update(sessionId, {
      status: VoiceSessionStatus.ENDED,
      endedAt: new Date(),
      endedReason: reasonMap[reason] ?? VoiceSessionEndedReason.USER,
    });

    // Auto-enqueue assessment if enough learner turns exist.
    if (voiceSession.conversationSessionId) {
      const learnerCount = await this.messages.count({
        where: { sessionId: voiceSession.conversationSessionId, role: ConversationRole.LEARNER },
      });
      if (learnerCount >= 3) {
        // Reuse the conversations finalize path by updating flow session.
        await this.flowSessions.updateSession(user.id, { output_completed: true });
      }
    }

    const quota = await this.entitlements.getQuotaSnapshot(user.id);
    return { status: VoiceSessionStatus.ENDED, quota };
  }

  private buildTurnResult(
    transcript: string,
    replyText: string,
    correction: { text: string; audioBase64: string | null } | null,
    practiceMinutesRemaining: number,
    sessionState: VoiceSessionStatus,
    _user: User,
    _session: VoiceSession,
    replyAudio?: Buffer,
  ): VoiceTurnResult {
    return {
      transcript,
      replyText,
      replyAudioBase64: replyAudio ? replyAudio.toString('base64') : '',
      correction,
      quota: { practiceMinutesRemaining },
      sessionState,
    };
  }
}

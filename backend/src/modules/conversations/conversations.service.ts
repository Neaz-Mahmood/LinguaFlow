import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { DataSource, Repository } from 'typeorm';
import {
  ConversationMessage,
  ConversationRole,
  MessageGenerationStatus,
} from '../../entities/conversation-message.entity';
import {
  ConversationSession,
  ConversationStatus,
} from '../../entities/conversation-session.entity';
import { Flashcard } from '../../entities/flashcard.entity';
import { Story } from '../../entities/story.entity';
import { User } from '../../entities/user.entity';
import { FlowSessionsService } from '../flow-sessions/flow-sessions.service';
import { ConversationAiProvider } from './conversation-ai.provider';
import { ConversationFeedbackV1 } from './conversation-feedback';
import { ASSESSMENT_QUEUE } from './conversations.processor';
import {
  defaultScenario,
  isSupportedTargetLanguage,
  normalizeTargetLanguage,
} from '../../common/supported-languages';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(ConversationSession)
    private readonly sessions: Repository<ConversationSession>,
    @InjectRepository(ConversationMessage)
    private readonly messages: Repository<ConversationMessage>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Story) private readonly stories: Repository<Story>,
    @InjectRepository(Flashcard)
    private readonly flashcards: Repository<Flashcard>,
    private readonly flowSessions: FlowSessionsService,
    private readonly dataSource: DataSource,
    private readonly ai: ConversationAiProvider,
    private readonly config: ConfigService,
    @InjectQueue(ASSESSMENT_QUEUE) private readonly assessmentQueue: Queue,
  ) {}

  private async owned(id: string, userId: number) {
    const session = await this.sessions.findOne({ where: { id } });
    if (!session) throw new NotFoundException('Conversation session not found');
    if (session.userId !== userId)
      throw new ForbiddenException('Conversation session is not yours');
    return session;
  }

  private async serialize(session: ConversationSession) {
    const messages = await this.messages.find({
      where: { sessionId: session.id },
      order: { orderIndex: 'ASC' },
    });
    return {
      ...session,
      messages,
      learnerTurnCount: messages.filter(
        (message) => message.role === ConversationRole.LEARNER,
      ).length,
      maxLearnerTurns: 8,
    };
  }

  async createOrResume(userId: number) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (!isSupportedTargetLanguage(user.targetLanguage)) {
      throw new BadRequestException(
        `AI conversation is not available for ${user.targetLanguage}. Supported: Spanish, French, German, Japanese.`,
      );
    }
    const targetLanguage = normalizeTargetLanguage(user.targetLanguage);
    const flow = await this.flowSessions.getTodaySession(userId);
    let session = await this.sessions.findOne({
      where: { flowSessionId: flow.id },
    });
    if (!session) {
      const story = await this.stories.findOne({
        where: { level: user.currentLevel, language: targetLanguage },
      });
      const fallback = defaultScenario(targetLanguage);
      try {
        session = await this.sessions.save(
          this.sessions.create({
            userId,
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
            companionModel: this.config.get<string>(
              'OPENAI_COMPANION_MODEL',
              'gpt-5.4-nano',
            ),
            criticModel: this.config.get<string>(
              'OPENAI_CRITIC_MODEL',
              'gpt-5.4-nano',
            ),
          }),
        );
      } catch {
        session = await this.sessions.findOne({
          where: { flowSessionId: flow.id },
        });
        if (!session)
          throw new ServiceUnavailableException(
            'Could not create conversation session',
          );
      }
    }
    const count = await this.messages.count({
      where: { sessionId: session.id },
    });
    if (count === 0 && session.status === ConversationStatus.ACTIVE) {
      const opening = await this.ai.companion(session, []);
      try {
        await this.messages.save(
          this.messages.create({
            sessionId: session.id,
            orderIndex: 0,
            role: ConversationRole.ASSISTANT,
            content: opening,
            clientMessageId: null,
            generationStatus: MessageGenerationStatus.PERSISTED,
          }),
        );
      } catch {
        // A concurrent create request persisted the opening first.
      }
    }
    return this.serialize(session);
  }

  async get(userId: number, id: string) {
    return this.serialize(await this.owned(id, userId));
  }

  async send(
    userId: number,
    id: string,
    text: string,
    clientMessageId: string,
  ) {
    const clean = text.trim();
    if (!clean) throw new BadRequestException('Message cannot be empty');
    const existing = await this.messages.findOne({
      where: { sessionId: id, clientMessageId },
    });
    if (existing) {
      const assistant = await this.messages.findOne({
        where: { sessionId: id, orderIndex: existing.orderIndex + 1 },
      });
      if (
        !assistant ||
        assistant.generationStatus === MessageGenerationStatus.GENERATING
      ) {
        throw new ConflictException('This message is still being processed');
      }
      if (assistant.generationStatus === MessageGenerationStatus.FAILED) {
        throw new ServiceUnavailableException(
          'The previous generation failed; send a new message.',
        );
      }
      return { userMessage: existing, assistantMessage: assistant };
    }

    const reserved = await this.dataSource.transaction(async (manager) => {
      const sessionRepo = manager.getRepository(ConversationSession);
      const messageRepo = manager.getRepository(ConversationMessage);
      const session = await sessionRepo.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!session)
        throw new NotFoundException('Conversation session not found');
      if (session.userId !== userId)
        throw new ForbiddenException('Conversation session is not yours');
      if (session.status !== ConversationStatus.ACTIVE) {
        throw new ConflictException(
          'This conversation is no longer accepting messages',
        );
      }
      const transcript = await messageRepo.find({
        where: { sessionId: id },
        order: { orderIndex: 'ASC' },
      });
      if (
        transcript.some(
          (message) =>
            message.generationStatus === MessageGenerationStatus.GENERATING,
        )
      ) {
        throw new ConflictException(
          'Wait for the current reply before sending another message',
        );
      }
      if (
        transcript.filter(
          (message) => message.role === ConversationRole.LEARNER,
        ).length >= 8
      ) {
        throw new BadRequestException(
          'This conversation has reached its eight-reply limit',
        );
      }
      const next = transcript.length;
      const userMessage = await messageRepo.save(
        messageRepo.create({
          sessionId: id,
          orderIndex: next,
          role: ConversationRole.LEARNER,
          content: clean,
          clientMessageId,
          generationStatus: MessageGenerationStatus.PERSISTED,
        }),
      );
      const assistantMessage = await messageRepo.save(
        messageRepo.create({
          sessionId: id,
          orderIndex: next + 1,
          role: ConversationRole.ASSISTANT,
          content: '',
          clientMessageId: null,
          generationStatus: MessageGenerationStatus.GENERATING,
        }),
      );
      return {
        session,
        transcript: [...transcript, userMessage],
        userMessage,
        assistantMessage,
      };
    });

    try {
      const reply = await this.ai.companion(
        reserved.session,
        reserved.transcript,
      );
      reserved.assistantMessage.content = reply;
      reserved.assistantMessage.generationStatus =
        MessageGenerationStatus.PERSISTED;
      await this.messages.save(reserved.assistantMessage);
      return {
        userMessage: reserved.userMessage,
        assistantMessage: reserved.assistantMessage,
      };
    } catch (error) {
      reserved.assistantMessage.generationStatus =
        MessageGenerationStatus.FAILED;
      await this.messages.save(reserved.assistantMessage);
      throw error;
    }
  }

  async finalize(userId: number, id: string) {
    const session = await this.owned(id, userId);
    const generating = await this.messages.count({
      where: {
        sessionId: id,
        generationStatus: MessageGenerationStatus.GENERATING,
      },
    });
    if (generating)
      throw new ConflictException(
        'Wait for the current reply before finalizing',
      );
    const turnCount = await this.messages.count({
      where: { sessionId: id, role: ConversationRole.LEARNER },
    });
    if (turnCount < 3)
      throw new BadRequestException(
        'At least three learner replies are required',
      );
    if (
      [
        ConversationStatus.ASSESSMENT_QUEUED,
        ConversationStatus.ASSESSING,
        ConversationStatus.COMPLETED,
      ].includes(session.status)
    ) {
      return { id: session.id, status: session.status };
    }

    await this.flowSessions.updateSession(userId, { output_completed: true });
    session.status = ConversationStatus.ASSESSMENT_QUEUED;
    session.finalizedAt ||= new Date();
    session.assessmentAttempt += 1;
    session.failureCode = null;
    session.failureMessage = null;
    await this.sessions.save(session);
    try {
      await this.assessmentQueue.add(
        'assess',
        { sessionId: session.id },
        {
          jobId: `assessment-${session.id}-${session.assessmentAttempt}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: 100,
          removeOnFail: 100,
        },
      );
    } catch (error) {
      session.status = ConversationStatus.ASSESSMENT_FAILED;
      session.failureCode = 'queue_unavailable';
      session.failureMessage =
        error instanceof Error
          ? error.message.slice(0, 500)
          : 'Queue unavailable';
      await this.sessions.save(session);
      throw new ServiceUnavailableException(
        'Assessment could not be queued; your Daily Flow is complete.',
      );
    }
    return { id: session.id, status: session.status };
  }

  async mineCorrection(userId: number, id: string, correctionId: string) {
    const session = await this.owned(id, userId);
    if (session.status !== ConversationStatus.COMPLETED || !session.feedback) {
      throw new ConflictException('Feedback is not ready');
    }
    const correction = (
      session.feedback as ConversationFeedbackV1
    ).corrections.find((item) => item.id === correctionId);
    if (!correction) throw new NotFoundException('Correction not found');
    const existing = await this.flashcards.findOne({
      where: {
        userId,
        conversationSessionId: id,
        conversationCorrectionId: correctionId,
      },
    });
    if (existing) return existing;
    try {
      return await this.flashcards.save(
        this.flashcards.create({
          userId,
          word: correction.correctedText,
          translation: correction.translation,
          contextSentence: correction.correctedText,
          contextTranslation: correction.translation,
          cardKind: 'sentence',
          conversationSessionId: id,
          conversationCorrectionId: correctionId,
          easiness: 2.5,
          interval: 0,
          repetitions: 0,
          nextReviewDate: new Date(),
        }),
      );
    } catch {
      return this.flashcards.findOneOrFail({
        where: {
          userId,
          conversationSessionId: id,
          conversationCorrectionId: correctionId,
        },
      });
    }
  }
}

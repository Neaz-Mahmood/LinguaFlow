import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import {
  ConversationMessage,
  ConversationRole,
} from '../../entities/conversation-message.entity';
import {
  ConversationSession,
  ConversationStatus,
} from '../../entities/conversation-session.entity';
import { ConversationAiProvider } from './conversation-ai.provider';
import { validateAndScoreFeedback } from './conversation-feedback';

export const ASSESSMENT_QUEUE = 'conversation-assessment';

@Processor(ASSESSMENT_QUEUE, { concurrency: 2 })
export class ConversationsProcessor extends WorkerHost {
  private readonly logger = new Logger(ConversationsProcessor.name);

  constructor(
    @InjectRepository(ConversationSession)
    private readonly sessions: Repository<ConversationSession>,
    @InjectRepository(ConversationMessage)
    private readonly messages: Repository<ConversationMessage>,
    private readonly ai: ConversationAiProvider,
  ) {
    super();
  }

  async process(job: Job<{ sessionId: string }>): Promise<void> {
    const session = await this.sessions.findOne({
      where: { id: job.data.sessionId },
    });
    if (!session || session.status === ConversationStatus.COMPLETED) return;
    session.status = ConversationStatus.ASSESSING;
    session.failureCode = null;
    session.failureMessage = null;
    await this.sessions.save(session);

    try {
      const transcript = await this.messages.find({
        where: { sessionId: session.id },
        order: { orderIndex: 'ASC' },
      });
      const raw = await this.ai.assess(session, transcript);
      const learner = transcript
        .filter((message) => message.role === ConversationRole.LEARNER)
        .map(({ id, content }) => ({ id, content }));
      session.feedback = validateAndScoreFeedback(raw, learner);
      session.feedbackVersion = 'conversation-feedback-v1';
      session.status = ConversationStatus.COMPLETED;
      session.assessedAt = new Date();
      await this.sessions.save(session);
      this.logger.log({
        event: 'assessment_completed',
        sessionId: session.id,
        jobId: job.id,
      });
    } catch (error) {
      const attempts = job.opts.attempts || 1;
      if (job.attemptsMade + 1 >= attempts) {
        session.status = ConversationStatus.ASSESSMENT_FAILED;
        session.failureCode = 'critic_failed';
        session.failureMessage =
          error instanceof Error
            ? error.message.slice(0, 500)
            : 'Unknown critic failure';
        await this.sessions.save(session);
      }
      this.logger.error({
        event: 'assessment_attempt_failed',
        sessionId: session.id,
        jobId: job.id,
        retryCount: job.attemptsMade,
        status: session.status,
      });
      throw error;
    }
  }
}

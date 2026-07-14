import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationMessage } from '../../entities/conversation-message.entity';
import { ConversationSession } from '../../entities/conversation-session.entity';
import { Flashcard } from '../../entities/flashcard.entity';
import { Story } from '../../entities/story.entity';
import { User } from '../../entities/user.entity';
import { FlowSessionsModule } from '../flow-sessions/flow-sessions.module';
import {
  ConversationAiProvider,
  OpenAiResponsesProvider,
} from './conversation-ai.provider';
import {
  ASSESSMENT_QUEUE,
  ConversationsProcessor,
} from './conversations.processor';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationSession,
      ConversationMessage,
      User,
      Story,
      Flashcard,
    ]),
    BullModule.registerQueue({ name: ASSESSMENT_QUEUE }),
    FlowSessionsModule,
  ],
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    ConversationsProcessor,
    OpenAiResponsesProvider,
    { provide: ConversationAiProvider, useExisting: OpenAiResponsesProvider },
  ],
  exports: [ConversationsService],
})
export class ConversationsModule {}

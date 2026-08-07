import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoiceSession } from '../../entities/voice-session.entity';
import { VoiceUsageEvent } from '../../entities/voice-usage-event.entity';
import { ConversationSession } from '../../entities/conversation-session.entity';
import { ConversationMessage } from '../../entities/conversation-message.entity';
import { User } from '../../entities/user.entity';
import { Story } from '../../entities/story.entity';
import { EntitlementsModule } from '../entitlements/entitlements.module';
import { FlowSessionsModule } from '../flow-sessions/flow-sessions.module';
import { VoiceAiProvider } from './voice-ai.provider';
import { OpenAiVoiceProvider } from './openai-voice.provider';
import { VoiceService } from './voice.service';
import { VoiceController } from './voice.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VoiceSession,
      VoiceUsageEvent,
      ConversationSession,
      ConversationMessage,
      User,
      Story,
    ]),
    EntitlementsModule,
    FlowSessionsModule,
  ],
  providers: [
    OpenAiVoiceProvider,
    { provide: VoiceAiProvider, useExisting: OpenAiVoiceProvider },
    VoiceService,
  ],
  controllers: [VoiceController],
})
export class VoiceModule {}

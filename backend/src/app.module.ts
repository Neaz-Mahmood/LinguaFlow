import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Story } from './entities/story.entity';
import { Flashcard } from './entities/flashcard.entity';
import { FlowSession } from './entities/flow-session.entity';
import { ConversationSession } from './entities/conversation-session.entity';
import { ConversationMessage } from './entities/conversation-message.entity';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StoriesModule } from './modules/stories/stories.module';
import { FlashcardsModule } from './modules/flashcards/flashcards.module';
import { FlowSessionsModule } from './modules/flow-sessions/flow-sessions.module';
import { SimulatorsModule } from './modules/simulators/simulators.module';
import { ConversationsModule } from './modules/conversations/conversations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgrespassword'),
        database: config.get<string>('DB_DATABASE', 'linguaflow'),
        entities: [
          User,
          Story,
          Flashcard,
          FlowSession,
          ConversationSession,
          ConversationMessage,
        ],
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', '127.0.0.1'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    AuthModule,
    UsersModule,
    StoriesModule,
    FlashcardsModule,
    FlowSessionsModule,
    SimulatorsModule,
    ConversationsModule,
  ],
})
export class AppModule {}

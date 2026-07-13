import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowSession } from '../../entities/flow-session.entity';
import { User } from '../../entities/user.entity';
import { Story } from '../../entities/story.entity';
import { Flashcard } from '../../entities/flashcard.entity';
import { FlowSessionsService } from './flow-sessions.service';
import { FlowSessionsController } from './flow-sessions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FlowSession, User, Story, Flashcard])],
  providers: [FlowSessionsService],
  controllers: [FlowSessionsController],
  exports: [FlowSessionsService],
})
export class FlowSessionsModule {}

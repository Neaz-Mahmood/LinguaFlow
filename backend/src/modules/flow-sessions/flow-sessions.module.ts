import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowSession } from '../../entities/flow-session.entity';
import { FlowSessionsService } from './flow-sessions.service';
import { FlowSessionsController } from './flow-sessions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FlowSession])],
  providers: [FlowSessionsService],
  controllers: [FlowSessionsController],
  exports: [FlowSessionsService],
})
export class FlowSessionsModule {}

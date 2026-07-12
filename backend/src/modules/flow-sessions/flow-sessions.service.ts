import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlowSession } from '../../entities/flow-session.entity';

@Injectable()
export class FlowSessionsService {
  constructor(
    @InjectRepository(FlowSession)
    private sessionsRepository: Repository<FlowSession>,
  ) {}

  async getTodaySession(): Promise<FlowSession> {
    const today = new Date().toISOString().split('T')[0];
    let session = await this.sessionsRepository.findOne({
      where: { userId: 1, date: today as any },
    });

    if (!session) {
      session = this.sessionsRepository.create({
        userId: 1,
        date: today as any,
        comprehensibleInputCompleted: false,
        srsCompleted: false,
        shadowingCompleted: false,
        outputCompleted: false,
      });
      await this.sessionsRepository.save(session);
    }
    return session;
  }

  async updateSession(data: any): Promise<FlowSession> {
    const session = await this.getTodaySession();
    if (!session) {
      throw new NotFoundException('Flow session not found');
    }

    if (data.comprehensible_input_completed !== undefined) {
      session.comprehensibleInputCompleted = data.comprehensible_input_completed;
    }
    if (data.srs_completed !== undefined) {
      session.srsCompleted = data.srs_completed;
    }
    if (data.shadowing_completed !== undefined) {
      session.shadowingCompleted = data.shadowing_completed;
    }
    if (data.output_completed !== undefined) {
      session.outputCompleted = data.output_completed;
    }
    if (data.shadowing_score !== undefined) {
      session.shadowingScore = Number(data.shadowing_score);
    }
    if (data.quick_output_response !== undefined) {
      session.quickOutputResponse = data.quick_output_response;
    }
    if (data.quick_output_feedback !== undefined) {
      session.quickOutputFeedback = data.quick_output_feedback;
    }

    return this.sessionsRepository.save(session);
  }
}

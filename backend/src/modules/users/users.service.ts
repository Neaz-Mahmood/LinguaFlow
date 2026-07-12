import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { FlowSession } from '../../entities/flow-session.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(FlowSession)
    private sessionsRepository: Repository<FlowSession>,
  ) {}

  async getUserById(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async onboardUser(
    userId: number,
    data: {
      target_language: string;
      native_language?: string;
      current_level: string;
      daily_commitment: number;
      strategy_preference: string;
      goals?: string[];
    },
  ): Promise<User> {
    const user = await this.getUserById(userId);

    user.targetLanguage = data.target_language || 'Spanish';
    user.nativeLanguage = data.native_language || 'English';
    user.currentLevel = data.current_level || 'A1';
    user.dailyCommitment = Number(data.daily_commitment) || 15;
    user.strategyPreference = data.strategy_preference || 'input';
    user.goals = data.goals || [];
    user.onboardingCompleted = true;

    if (user.strategyPreference === 'input-heavy') {
      user.contentRatios = { input: 0.6, srs: 0.2, output: 0.2 };
    } else if (user.strategyPreference === 'output-first') {
      user.contentRatios = { input: 0.3, srs: 0.2, output: 0.5 };
    } else {
      user.contentRatios = { input: 0.4, srs: 0.3, output: 0.3 };
    }

    await this.usersRepository.save(user);

    const today = new Date().toISOString().split('T')[0];
    const session = await this.sessionsRepository.findOne({
      where: { userId: user.id, date: today as any },
    });
    if (session) {
      await this.sessionsRepository.remove(session);
    }

    const newSession = this.sessionsRepository.create({
      userId: user.id,
      date: today as any,
      comprehensibleInputCompleted: false,
      srsCompleted: false,
      shadowingCompleted: false,
      outputCompleted: false,
    });
    await this.sessionsRepository.save(newSession);

    return user;
  }
}

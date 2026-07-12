import { Injectable } from '@nestjs/common';
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

  async getDefaultUser(): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { id: 1 } });
    if (!user) {
      user = this.usersRepository.create({
        id: 1,
        targetLanguage: 'Spanish',
        currentLevel: 'A1',
        dailyCommitment: 15,
        strategyPreference: 'input',
      });
      await this.usersRepository.save(user);
    }
    return user;
  }

  async onboardUser(data: {
    target_language: string;
    current_level: string;
    daily_commitment: number;
    strategy_preference: string;
  }): Promise<User> {
    let user = await this.getDefaultUser();
    
    user.targetLanguage = data.target_language || 'Spanish';
    user.currentLevel = data.current_level || 'A1';
    user.dailyCommitment = Number(data.daily_commitment) || 15;
    user.strategyPreference = data.strategy_preference || 'input';
    
    await this.usersRepository.save(user);

    // Reset today's session
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { FlowSession } from '../../entities/flow-session.entity';
import { User } from '../../entities/user.entity';
import { Story } from '../../entities/story.entity';
import { Flashcard } from '../../entities/flashcard.entity';

@Injectable()
export class FlowSessionsService {
  constructor(
    @InjectRepository(FlowSession)
    private sessionsRepository: Repository<FlowSession>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    @InjectRepository(Flashcard)
    private flashcardsRepository: Repository<Flashcard>,
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
        stepsCompleted: 0,
      });
      await this.sessionsRepository.save(session);
    }
    return session;
  }

  async getTodayFullSession(): Promise<any> {
    const session = await this.getTodaySession();
    const user = await this.usersRepository.findOne({ where: { id: 1 } });
    const level = user ? user.currentLevel : 'A1';

    // 1. Fetch stories for user level
    const stories = await this.storiesRepository.find({ where: { level } });
    const story = stories[0] ? {
      id: stories[0].id,
      title: stories[0].title,
      level: stories[0].level,
      content_target: stories[0].contentTarget,
      content_english: stories[0].contentEnglish,
      words: stories[0].wordsJson ? JSON.parse(stories[0].wordsJson) : {},
      sentences: stories[0].sentencesJson ? JSON.parse(stories[0].sentencesJson) : [],
    } : null;

    // 2. Fetch due flashcards
    const todayStr = new Date().toISOString().split('T')[0];
    const dueCards = await this.flashcardsRepository.find({
      where: {
        userId: 1,
        nextReviewDate: LessThanOrEqual(todayStr as any),
      },
    });

    // 3. Shadowing phrase: use first sentence of the story as default
    const shadowPhrase = story && story.sentences && story.sentences[0]
      ? story.sentences[0]
      : { target: 'Sofía va a la cafetería todas las mañanas.', english: 'Sofía goes to the coffee shop every morning.' };

    // 4. Output prompt: question about the story
    const outputPrompt = story
      ? `¿Qué compró el personaje principal en la historia "${story.title}"?`
      : '¿Qué hiciste hoy? Responde en español.';

    return {
      story,
      dueCards,
      shadowPhrase,
      outputPrompt,
      streakCount: user ? user.streakCount : 0,
      stepsCompleted: session.stepsCompleted,
      session,
    };
  }

  async updateSession(data: any): Promise<FlowSession> {
    const session = await this.getTodaySession();
    const user = await this.usersRepository.findOne({ where: { id: 1 } });

    if (data.comprehensible_input_completed !== undefined && data.comprehensible_input_completed !== session.comprehensibleInputCompleted) {
      session.comprehensibleInputCompleted = data.comprehensible_input_completed;
      if (session.comprehensibleInputCompleted && session.stepsCompleted < 1) {
        session.stepsCompleted = 1;
      }
    }
    if (data.srs_completed !== undefined && data.srs_completed !== session.srsCompleted) {
      session.srsCompleted = data.srs_completed;
      if (session.srsCompleted && session.stepsCompleted < 2) {
        session.stepsCompleted = 2;
      }
    }
    if (data.shadowing_completed !== undefined && data.shadowing_completed !== session.shadowingCompleted) {
      session.shadowingCompleted = data.shadowing_completed;
      if (session.shadowingCompleted && session.stepsCompleted < 3) {
        session.stepsCompleted = 3;
      }
    }
    if (data.output_completed !== undefined && data.output_completed !== session.outputCompleted) {
      session.outputCompleted = data.output_completed;
      if (session.outputCompleted && session.stepsCompleted < 4) {
        session.stepsCompleted = 4;

        // --- STREAK LOGIC ---
        if (user) {
          const todayStr = new Date().toISOString().split('T')[0];
          
          if (user.lastActiveDate !== todayStr) {
            // Check if last active was yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (user.lastActiveDate === yesterdayStr) {
              user.streakCount += 1;
            } else {
              user.streakCount = 1; // missed a day, reset to 1
            }
            user.lastActiveDate = todayStr;
            await this.usersRepository.save(user);
          }
        }
      }
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

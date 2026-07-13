import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Flashcard } from '../../entities/flashcard.entity';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectRepository(Flashcard)
    private flashcardRepository: Repository<Flashcard>,
  ) {}

  // Standard SuperMemo SM-2 algorithm
  updateSM2(easiness: number, interval: number, repetitions: number, quality: number) {
    let newInterval = 0;
    let newRepetitions = 0;
    let newEasiness = easiness;

    if (quality < 0 || quality > 5) {
      quality = 3;
    }

    if (quality >= 3) {
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easiness);
      }
      newRepetitions = repetitions + 1;
    } else {
      newRepetitions = 0;
      newInterval = 1;
    }

    newEasiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEasiness < 1.3) {
      newEasiness = 1.3;
    }

    return {
      easiness: newEasiness,
      interval: newInterval,
      repetitions: newRepetitions,
    };
  }

  async mineCard(
    userId: number,
    data: {
      word: string;
      translation: string;
      context_sentence?: string;
      context_translation?: string;
    },
  ): Promise<Flashcard> {
    const cleanWord = data.word.trim();

    let existing = await this.flashcardRepository.findOne({
      where: { userId, word: cleanWord },
    });

    if (existing) {
      return existing;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const card = this.flashcardRepository.create({
      userId,
      word: cleanWord,
      translation: data.translation,
      contextSentence: data.context_sentence || '',
      contextTranslation: data.context_translation || '',
      easiness: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: todayStr as any,
    });

    return this.flashcardRepository.save(card);
  }

  async getReviewCards(userId: number): Promise<Flashcard[]> {
    const todayStr = new Date().toISOString().split('T')[0];

    return this.flashcardRepository.find({
      where: {
        userId,
        nextReviewDate: LessThanOrEqual(todayStr as any),
      },
    });
  }

  async reviewCard(
    userId: number,
    cardId: number,
    quality: number,
  ): Promise<Flashcard> {
    const card = await this.flashcardRepository.findOne({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new NotFoundException('Flashcard not found');
    }

    const { easiness, interval, repetitions } = this.updateSM2(
      card.easiness,
      card.interval,
      card.repetitions,
      quality,
    );

    card.easiness = easiness;
    card.interval = interval;
    card.repetitions = repetitions;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);
    card.nextReviewDate = nextDate.toISOString().split('T')[0] as any;

    return this.flashcardRepository.save(card);
  }
}

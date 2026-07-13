import { Repository } from 'typeorm';
import { Flashcard } from '../../entities/flashcard.entity';
export declare class FlashcardsService {
    private flashcardRepository;
    constructor(flashcardRepository: Repository<Flashcard>);
    updateSM2(easiness: number, interval: number, repetitions: number, quality: number): {
        easiness: number;
        interval: number;
        repetitions: number;
    };
    mineCard(userId: number, data: {
        word: string;
        translation: string;
        context_sentence?: string;
        context_translation?: string;
    }): Promise<Flashcard>;
    getReviewCards(userId: number): Promise<Flashcard[]>;
    reviewCard(userId: number, cardId: number, quality: number): Promise<Flashcard>;
}

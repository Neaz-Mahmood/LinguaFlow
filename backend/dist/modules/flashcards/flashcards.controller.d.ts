import { FlashcardsService } from './flashcards.service';
export declare class FlashcardsController {
    private readonly flashcardsService;
    constructor(flashcardsService: FlashcardsService);
    mine(data: any): Promise<{
        status: string;
        card: import("../../entities/flashcard.entity").Flashcard;
    }>;
    getReview(): Promise<import("../../entities/flashcard.entity").Flashcard[]>;
    review(cardId: number, data: any): Promise<{
        status: string;
        card: import("../../entities/flashcard.entity").Flashcard;
    }>;
}

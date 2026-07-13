import { User } from '../../entities/user.entity';
import { MineFlashcardDto, ReviewFlashcardDto } from './dto/flashcard.dto';
import { FlashcardsService } from './flashcards.service';
export declare class FlashcardsController {
    private readonly flashcardsService;
    constructor(flashcardsService: FlashcardsService);
    mine(user: User, data: MineFlashcardDto): Promise<{
        status: string;
        card: import("../../entities/flashcard.entity").Flashcard;
    }>;
    getReview(user: User): Promise<import("../../entities/flashcard.entity").Flashcard[]>;
    review(user: User, cardId: number, data: ReviewFlashcardDto): Promise<{
        status: string;
        card: import("../../entities/flashcard.entity").Flashcard;
    }>;
}

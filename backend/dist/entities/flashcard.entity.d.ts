import { User } from './user.entity';
export declare class Flashcard {
    id: number;
    userId: number;
    word: string;
    translation: string;
    contextSentence: string;
    contextTranslation: string;
    easiness: number;
    interval: number;
    repetitions: number;
    nextReviewDate: Date;
    user: User;
}

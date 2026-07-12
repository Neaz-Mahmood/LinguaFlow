import { Flashcard } from './flashcard.entity';
import { FlowSession } from './flow-session.entity';
export declare class User {
    id: number;
    targetLanguage: string;
    currentLevel: string;
    dailyCommitment: number;
    strategyPreference: string;
    createdAt: Date;
    flashcards: Flashcard[];
    sessions: FlowSession[];
}

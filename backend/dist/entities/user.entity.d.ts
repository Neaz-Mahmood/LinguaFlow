import { Flashcard } from './flashcard.entity';
import { FlowSession } from './flow-session.entity';
export declare class User {
    id: number;
    email: string | null;
    name: string | null;
    googleSub: string | null;
    onboardingCompleted: boolean;
    targetLanguage: string;
    nativeLanguage: string;
    currentLevel: string;
    dailyCommitment: number;
    strategyPreference: string;
    goals: string[];
    contentRatios: Record<string, number>;
    streakCount: number;
    lastActiveDate: string;
    createdAt: Date;
    flashcards: Flashcard[];
    sessions: FlowSession[];
}

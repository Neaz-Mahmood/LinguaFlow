import { User } from './user.entity';
export declare class FlowSession {
    id: number;
    userId: number;
    date: Date;
    comprehensibleInputCompleted: boolean;
    srsCompleted: boolean;
    shadowingCompleted: boolean;
    outputCompleted: boolean;
    shadowingScore: number;
    quickOutputResponse: string;
    quickOutputFeedback: string;
    user: User;
}

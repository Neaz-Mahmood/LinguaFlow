import { Repository } from 'typeorm';
import { FlowSession } from '../../entities/flow-session.entity';
import { User } from '../../entities/user.entity';
import { Story } from '../../entities/story.entity';
import { Flashcard } from '../../entities/flashcard.entity';
export declare class FlowSessionsService {
    private sessionsRepository;
    private usersRepository;
    private storiesRepository;
    private flashcardsRepository;
    constructor(sessionsRepository: Repository<FlowSession>, usersRepository: Repository<User>, storiesRepository: Repository<Story>, flashcardsRepository: Repository<Flashcard>);
    getTodaySession(userId: number): Promise<FlowSession>;
    getTodayFullSession(userId: number): Promise<any>;
    updateSession(userId: number, data: any): Promise<FlowSession>;
}

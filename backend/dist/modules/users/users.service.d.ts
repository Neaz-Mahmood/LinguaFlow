import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { FlowSession } from '../../entities/flow-session.entity';
export declare class UsersService {
    private usersRepository;
    private sessionsRepository;
    constructor(usersRepository: Repository<User>, sessionsRepository: Repository<FlowSession>);
    getDefaultUser(): Promise<User>;
    onboardUser(data: {
        target_language: string;
        native_language?: string;
        current_level: string;
        daily_commitment: number;
        strategy_preference: string;
        goals?: string[];
    }): Promise<User>;
}

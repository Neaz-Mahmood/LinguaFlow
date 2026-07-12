import { Repository } from 'typeorm';
import { FlowSession } from '../../entities/flow-session.entity';
export declare class FlowSessionsService {
    private sessionsRepository;
    constructor(sessionsRepository: Repository<FlowSession>);
    getTodaySession(): Promise<FlowSession>;
    updateSession(data: any): Promise<FlowSession>;
}

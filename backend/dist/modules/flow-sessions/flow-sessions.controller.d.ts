import { User } from '../../entities/user.entity';
import { FlowSessionsService } from './flow-sessions.service';
export declare class FlowSessionsController {
    private readonly sessionsService;
    constructor(sessionsService: FlowSessionsService);
    get(user: User): Promise<import("../../entities/flow-session.entity").FlowSession>;
    getTodayFull(user: User): Promise<any>;
    update(user: User, data: any): Promise<import("../../entities/flow-session.entity").FlowSession>;
}

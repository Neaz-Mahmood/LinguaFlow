import { FlowSessionsService } from './flow-sessions.service';
export declare class FlowSessionsController {
    private readonly sessionsService;
    constructor(sessionsService: FlowSessionsService);
    get(): Promise<import("../../entities/flow-session.entity").FlowSession>;
    update(data: any): Promise<import("../../entities/flow-session.entity").FlowSession>;
}

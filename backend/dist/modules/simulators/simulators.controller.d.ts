import { SimulatorsService } from './simulators.service';
export declare class SimulatorsController {
    private readonly simulatorsService;
    constructor(simulatorsService: SimulatorsService);
    evaluateShadowing(targetSentence: string, transcript?: string): Promise<any>;
    quickOutputReply(message: string, storyTitle: string): Promise<any>;
}

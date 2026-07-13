import { EvaluateShadowingDto, QuickOutputReplyDto } from './dto/simulators.dto';
import { SimulatorsService } from './simulators.service';
export declare class SimulatorsController {
    private readonly simulatorsService;
    constructor(simulatorsService: SimulatorsService);
    evaluateShadowing(body: EvaluateShadowingDto): Promise<any>;
    quickOutputReply(body: QuickOutputReplyDto): Promise<any>;
}

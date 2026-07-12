import { Controller, Post, Body } from '@nestjs/common';
import { SimulatorsService } from './simulators.service';

@Controller('api')
export class SimulatorsController {
  constructor(private readonly simulatorsService: SimulatorsService) {}

  @Post('shadowing/evaluate')
  async evaluateShadowing(
    @Body('target_sentence') targetSentence: string,
    @Body('transcript') transcript?: string,
  ) {
    // In NestJS express parser, if sent via urlencoded/json, it populates @Body
    return this.simulatorsService.evaluateShadowing(targetSentence, transcript);
  }

  @Post('quick-output/reply')
  async quickOutputReply(
    @Body('message') message: string,
    @Body('story_title') storyTitle: string,
  ) {
    return this.simulatorsService.evaluateQuickOutput(message, storyTitle);
  }
}

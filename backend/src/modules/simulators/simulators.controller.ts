import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SimulatorsService } from './simulators.service';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class SimulatorsController {
  constructor(private readonly simulatorsService: SimulatorsService) {}

  @Post('shadowing/evaluate')
  async evaluateShadowing(
    @Body('target_sentence') targetSentence: string,
    @Body('transcript') transcript?: string,
  ) {
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

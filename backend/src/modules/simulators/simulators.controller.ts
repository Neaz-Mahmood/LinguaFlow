import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  EvaluateShadowingDto,
  QuickOutputReplyDto,
} from './dto/simulators.dto';
import { SimulatorsService } from './simulators.service';

@ApiTags('simulators')
@ApiBearerAuth('access-token')
@Controller('api')
@UseGuards(JwtAuthGuard)
export class SimulatorsController {
  constructor(private readonly simulatorsService: SimulatorsService) {}

  @Post('shadowing/evaluate')
  @ApiOperation({ summary: 'Evaluate a shadowing attempt' })
  async evaluateShadowing(@Body() body: EvaluateShadowingDto) {
    return this.simulatorsService.evaluateShadowing(
      body.target_sentence,
      body.transcript,
    );
  }

  @Post('quick-output/reply')
  @ApiOperation({ summary: 'Evaluate a quick-output reply' })
  async quickOutputReply(@Body() body: QuickOutputReplyDto) {
    return this.simulatorsService.evaluateQuickOutput(
      body.message,
      body.story_title,
    );
  }
}

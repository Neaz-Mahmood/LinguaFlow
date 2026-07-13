import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateFlowSessionDto } from './dto/update-flow-session.dto';
import { FlowSessionsService } from './flow-sessions.service';

@ApiTags('flow-session')
@ApiBearerAuth('access-token')
@Controller('api/flow-session')
@UseGuards(JwtAuthGuard)
export class FlowSessionsController {
  constructor(private readonly sessionsService: FlowSessionsService) {}

  @Get()
  @ApiOperation({ summary: "Get today's flow session entity" })
  async get(@CurrentUser() user: User) {
    return this.sessionsService.getTodaySession(user.id);
  }

  @Get('today')
  @ApiOperation({
    summary: "Get today's full daily flow payload (story, cards, prompts)",
  })
  async getTodayFull(@CurrentUser() user: User) {
    return this.sessionsService.getTodayFullSession(user.id);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update step completion flags for today’s session' })
  async update(@CurrentUser() user: User, @Body() data: UpdateFlowSessionDto) {
    return this.sessionsService.updateSession(user.id, data);
  }
}

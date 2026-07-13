import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FlowSessionsService } from './flow-sessions.service';

@Controller('api/flow-session')
@UseGuards(JwtAuthGuard)
export class FlowSessionsController {
  constructor(private readonly sessionsService: FlowSessionsService) {}

  @Get()
  async get(@CurrentUser() user: User) {
    return this.sessionsService.getTodaySession(user.id);
  }

  @Get('today')
  async getTodayFull(@CurrentUser() user: User) {
    return this.sessionsService.getTodayFullSession(user.id);
  }

  @Post('update')
  async update(@CurrentUser() user: User, @Body() data: any) {
    return this.sessionsService.updateSession(user.id, data);
  }
}

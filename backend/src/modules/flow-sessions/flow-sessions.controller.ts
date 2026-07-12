import { Controller, Get, Post, Body } from '@nestjs/common';
import { FlowSessionsService } from './flow-sessions.service';

@Controller('api/flow-session')
export class FlowSessionsController {
  constructor(private readonly sessionsService: FlowSessionsService) {}

  @Get()
  async get() {
    return this.sessionsService.getTodaySession();
  }

  @Get('today')
  async getTodayFull() {
    return this.sessionsService.getTodayFullSession();
  }

  @Post('update')
  async update(@Body() data: any) {
    return this.sessionsService.updateSession(data);
  }
}

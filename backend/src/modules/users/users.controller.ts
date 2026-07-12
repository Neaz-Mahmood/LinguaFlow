import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('api/user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async get(@CurrentUser() user: User) {
    return this.usersService.getUserById(user.id);
  }

  @Post('onboard')
  async onboard(@CurrentUser() user: User, @Body() data: any) {
    const updated = await this.usersService.onboardUser(user.id, data);
    return { status: 'success', user: updated };
  }
}

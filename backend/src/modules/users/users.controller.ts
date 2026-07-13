import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UsersService } from './users.service';

@Controller('api/user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async get(@CurrentUser() user: User) {
    return this.usersService.getUserById(user.id);
  }

  @Patch('preferences')
  async updatePreferences(
    @CurrentUser() user: User,
    @Body() data: UpdatePreferencesDto,
  ) {
    const updated = await this.usersService.updatePreferences(user.id, data);
    return { status: 'success', user: updated };
  }

  @Post('onboard')
  async onboard(@CurrentUser() user: User, @Body() data: any) {
    const updated = await this.usersService.onboardUser(user.id, data);
    return { status: 'success', user: updated };
  }
}

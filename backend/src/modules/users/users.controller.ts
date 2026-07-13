import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UsersService } from './users.service';

@ApiTags('user')
@ApiBearerAuth('access-token')
@Controller('api/user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user profile' })
  async get(@CurrentUser() user: User) {
    return this.usersService.getUserById(user.id);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update UI locale and theme preferences' })
  async updatePreferences(
    @CurrentUser() user: User,
    @Body() data: UpdatePreferencesDto,
  ) {
    const updated = await this.usersService.updatePreferences(user.id, data);
    return { status: 'success', user: updated };
  }

  @Post('onboard')
  @ApiOperation({ summary: 'Complete onboarding and set learning profile' })
  async onboard(@CurrentUser() user: User, @Body() data: OnboardUserDto) {
    const updated = await this.usersService.onboardUser(user.id, data);
    return { status: 'success', user: updated };
  }
}

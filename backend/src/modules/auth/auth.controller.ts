import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async google(@Body('idToken') idToken: string) {
    return this.authService.signInWithGoogle(idToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return this.authService.getMe(user);
  }
}

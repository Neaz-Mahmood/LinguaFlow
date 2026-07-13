import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { GoogleAuthDto, SignInDto, SignupDto } from './dto/email-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create an account with email and password' })
  async signup(@Body() body: SignupDto) {
    return this.authService.signUp(body.email, body.password, body.name);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in with email and password' })
  async signin(@Body() body: SignInDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('google')
  @ApiOperation({ summary: 'Sign in with a Google ID token' })
  async google(@Body() body: GoogleAuthDto) {
    return this.authService.signInWithGoogle(body.idToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Return the current authenticated user' })
  async me(@CurrentUser() user: User) {
    return this.authService.getMe(user);
  }
}

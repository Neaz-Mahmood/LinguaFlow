import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  private audiences: string[];

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.config.get<string>('GOOGLE_WEB_CLIENT_ID'),
    );

    this.audiences = [
      this.config.get<string>('GOOGLE_WEB_CLIENT_ID'),
      this.config.get<string>('GOOGLE_IOS_CLIENT_ID'),
      this.config.get<string>('GOOGLE_ANDROID_CLIENT_ID'),
    ].filter((id): id is string => Boolean(id));
  }

  async signInWithGoogle(idToken: string) {
    if (!idToken) {
      throw new UnauthorizedException('Missing Google ID token');
    }

    if (this.audiences.length === 0) {
      throw new UnauthorizedException(
        'Google client IDs are not configured on the server',
      );
    }

    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.audiences,
      });
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Google token missing required claims');
    }

    let user = await this.usersRepository.findOne({
      where: { googleSub: payload.sub },
    });

    if (!user) {
      user = await this.usersRepository.findOne({
        where: { email: payload.email },
      });
    }

    if (!user) {
      user = this.usersRepository.create({
        googleSub: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0] || 'Language Learner',
        nativeLanguage: 'English',
        goals: ['general'],
        contentRatios: { input: 0.5, output: 0.5 },
        onboardingCompleted: false,
        targetLanguage: 'Spanish',
        currentLevel: 'A1',
        dailyCommitment: 15,
        strategyPreference: 'input',
      });
    } else {
      user.googleSub = user.googleSub || payload.sub;
      user.email = user.email || payload.email;
      user.name = user.name || payload.name || null;
    }

    user = await this.usersRepository.save(user);

    const accessToken = await this.jwtService.signAsync({ sub: user.id });

    return {
      accessToken,
      user,
      needsOnboarding: !user.onboardingCompleted,
    };
  }

  async getMe(user: User) {
    return {
      user,
      needsOnboarding: !user.onboardingCompleted,
    };
  }
}

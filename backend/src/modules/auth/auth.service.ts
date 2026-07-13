import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

type PublicUser = Omit<User, 'passwordHash'>;

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

  private toPublicUser(user: User): PublicUser {
    const { passwordHash: _passwordHash, ...publicUser } = user as User & {
      passwordHash?: string | null;
    };
    return publicUser;
  }

  private async issueAuthResponse(user: User) {
    const accessToken = await this.jwtService.signAsync({ sub: user.id });
    return {
      accessToken,
      user: this.toPublicUser(user),
      needsOnboarding: !user.onboardingCompleted,
    };
  }

  private createDefaultProfile(overrides: Partial<User>): User {
    return this.usersRepository.create({
      nativeLanguage: 'English',
      goals: ['general'],
      contentRatios: { input: 0.5, output: 0.5 },
      onboardingCompleted: false,
      targetLanguage: 'Spanish',
      currentLevel: 'A1',
      dailyCommitment: 15,
      strategyPreference: 'input',
      ...overrides,
    });
  }

  async signUp(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.save(
      this.createDefaultProfile({
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0] || 'Language Learner',
        passwordHash,
      }),
    );

    return this.issueAuthResponse(user);
  }

  async signIn(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: normalizedEmail })
      .getOne();

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueAuthResponse(user);
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
      user = this.createDefaultProfile({
        googleSub: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0] || 'Language Learner',
      });
    } else {
      user.googleSub = user.googleSub || payload.sub;
      user.email = user.email || payload.email;
      user.name = user.name || payload.name || null;
    }

    user = await this.usersRepository.save(user);

    return this.issueAuthResponse(user);
  }

  async getMe(user: User) {
    return {
      user: this.toPublicUser(user),
      needsOnboarding: !user.onboardingCompleted,
    };
  }
}

import { IsEnum, IsUUID } from 'class-validator';
import { VoiceSessionMode } from '../../../entities/voice-session.entity';

export class CreateVoiceSessionDto {
  @IsEnum(VoiceSessionMode)
  mode: VoiceSessionMode = VoiceSessionMode.STANDARD;
}

export class SendVoiceTurnDto {
  @IsUUID()
  clientTurnId: string;
}

export class EndVoiceSessionDto {
  @IsEnum(['user', 'silence', 'error'])
  reason: 'user' | 'silence' | 'error';
}

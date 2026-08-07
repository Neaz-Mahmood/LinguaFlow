import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { VoiceSession } from './voice-session.entity';

export enum VoiceUsageKind {
  STT = 'stt',
  LLM = 'llm',
  TTS = 'tts',
}

@Entity('voice_usage_events')
@Index(['userId', 'createdAt'])
export class VoiceUsageEvent {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'user_id' }) userId: number;

  @Index()
  @Column({ name: 'voice_session_id', type: 'uuid' })
  voiceSessionId: string;

  @Column({ type: 'enum', enum: VoiceUsageKind }) kind: VoiceUsageKind;
  @Column() model: string;
  @Column({ name: 'target_language' }) targetLanguage: string;

  @Column({ name: 'user_speaking_seconds', default: 0 }) userSpeakingSeconds: number;
  @Column({ name: 'input_tokens', type: 'int', nullable: true }) inputTokens: number | null;
  @Column({ name: 'output_tokens', type: 'int', nullable: true }) outputTokens: number | null;
  @Column({ name: 'audio_seconds_in', type: 'int', nullable: true }) audioSecondsIn:
    number | null;
  @Column({ name: 'audio_seconds_out', type: 'int', nullable: true }) audioSecondsOut:
    number | null;

  // Estimated cost in millionths of a currency unit (integer micros, no float).
  @Column({ name: 'est_cost_micros', type: 'bigint', default: 0 }) estCostMicros: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => VoiceSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'voice_session_id' })
  voiceSession: VoiceSession;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ConversationSession } from './conversation-session.entity';

export enum VoiceSessionMode {
  STANDARD = 'standard',
  REALTIME = 'realtime',
}

export enum VoiceSessionStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  CAPPED = 'capped',
  ABORTED = 'aborted',
}

export enum VoiceSessionEndedReason {
  USER = 'user',
  CAP = 'cap',
  SILENCE = 'silence',
  ERROR = 'error',
}

@Entity('voice_sessions')
@Index(['userId', 'createdAt'])
export class VoiceSession {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'user_id' }) userId: number;

  @Column({ name: 'conversation_session_id', type: 'uuid', nullable: true })
  conversationSessionId: string | null;

  @Column({ name: 'target_language' }) targetLanguage: string;
  @Column({ name: 'native_language' }) nativeLanguage: string;
  @Column({ name: 'cefr_level', length: 2 }) cefrLevel: string;

  @Column({ type: 'enum', enum: VoiceSessionMode, default: VoiceSessionMode.STANDARD })
  mode: VoiceSessionMode;

  @Column({ type: 'enum', enum: VoiceSessionStatus, default: VoiceSessionStatus.ACTIVE })
  status: VoiceSessionStatus;

  @Column({ name: 'user_speaking_seconds', default: 0 }) userSpeakingSeconds: number;
  @Column({ name: 'ai_speaking_seconds', default: 0 }) aiSpeakingSeconds: number;
  @Column({ name: 'wall_clock_seconds', default: 0 }) wallClockSeconds: number;
  @Column({ name: 'session_cap_seconds' }) sessionCapSeconds: number;

  @Column({ name: 'stt_model' }) sttModel: string;
  @Column({ name: 'tts_model' }) ttsModel: string;
  @Column({ name: 'llm_model' }) llmModel: string;

  @Column({
    name: 'ended_reason',
    type: 'enum',
    enum: VoiceSessionEndedReason,
    nullable: true,
  })
  endedReason: VoiceSessionEndedReason | null;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ name: 'ended_at', type: 'timestamptz', nullable: true }) endedAt: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ConversationSession, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'conversation_session_id' })
  conversationSession: ConversationSession | null;
}

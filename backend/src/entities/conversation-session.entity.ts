import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FlowSession } from './flow-session.entity';
import { User } from './user.entity';
import { ConversationMessage } from './conversation-message.entity';

export enum ConversationStatus {
  ACTIVE = 'active',
  ASSESSMENT_QUEUED = 'assessment_queued',
  ASSESSING = 'assessing',
  COMPLETED = 'completed',
  ASSESSMENT_FAILED = 'assessment_failed',
}

@Entity('conversation_sessions')
@Index(['flowSessionId'], { unique: true })
@Index(['userId', 'createdAt'])
export class ConversationSession {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'user_id' }) userId: number;
  @Column({ name: 'flow_session_id' }) flowSessionId: number;
  @Column({ name: 'target_language' }) targetLanguage: string;
  @Column({ name: 'native_language' }) nativeLanguage: string;
  @Column({ name: 'cefr_level', length: 2 }) cefrLevel: string;
  @Column('jsonb') scenario: {
    storyId: number | null;
    title: string;
    context: string;
  };
  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;
  @Column({ name: 'feedback_version', type: 'varchar', nullable: true }) feedbackVersion:
    string | null;
  @Column('jsonb', { nullable: true }) feedback: Record<string, unknown> | null;
  @Column({ name: 'companion_prompt_version', default: 'companion-v1' })
  companionPromptVersion: string;
  @Column({ name: 'critic_prompt_version', default: 'critic-v1' })
  criticPromptVersion: string;
  @Column({ name: 'companion_model' }) companionModel: string;
  @Column({ name: 'critic_model' }) criticModel: string;
  @Column({ name: 'assessment_attempt', default: 0 }) assessmentAttempt: number;
  @Column({ name: 'failure_code', type: 'varchar', nullable: true }) failureCode: string | null;
  @Column({ name: 'failure_message', type: 'varchar', nullable: true }) failureMessage:
    string | null;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ name: 'finalized_at', type: 'timestamptz', nullable: true })
  finalizedAt: Date | null;
  @Column({ name: 'assessed_at', type: 'timestamptz', nullable: true })
  assessedAt: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => FlowSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flow_session_id' })
  flowSession: FlowSession;
  @OneToMany(() => ConversationMessage, (message) => message.session, {
    cascade: true,
  })
  messages: ConversationMessage[];
}

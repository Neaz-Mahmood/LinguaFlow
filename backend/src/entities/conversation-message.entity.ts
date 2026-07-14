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
import { ConversationSession } from './conversation-session.entity';

export enum ConversationRole {
  LEARNER = 'learner',
  ASSISTANT = 'assistant',
}
export enum MessageGenerationStatus {
  PERSISTED = 'persisted',
  GENERATING = 'generating',
  FAILED = 'failed',
}

@Entity('conversation_messages')
@Index(['sessionId', 'orderIndex'], { unique: true })
@Index(['sessionId', 'clientMessageId'], { unique: true })
export class ConversationMessage {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'session_id', type: 'uuid' }) sessionId: string;
  @Column({ name: 'order_index' }) orderIndex: number;
  @Column({ type: 'enum', enum: ConversationRole }) role: ConversationRole;
  @Column('text') content: string;
  @Column({ name: 'client_message_id', type: 'uuid', nullable: true })
  clientMessageId: string | null;
  @Column({
    name: 'generation_status',
    type: 'enum',
    enum: MessageGenerationStatus,
    default: MessageGenerationStatus.PERSISTED,
  })
  generationStatus: MessageGenerationStatus;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  @ManyToOne(() => ConversationSession, (session) => session.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: ConversationSession;
}

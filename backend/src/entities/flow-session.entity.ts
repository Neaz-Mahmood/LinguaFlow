import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('flow_sessions')
export class FlowSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column('date', { default: () => 'CURRENT_DATE' })
  date: Date;

  @Column({ default: 0 })
  stepsCompleted: number;

  @Column({ default: false })
  comprehensibleInputCompleted: boolean;

  @Column({ default: false })
  srsCompleted: boolean;

  @Column({ default: false })
  shadowingCompleted: boolean;

  @Column({ default: false })
  outputCompleted: boolean;

  @Column('float', { default: 0.0 })
  shadowingScore: number;

  @Column('text', { nullable: true })
  quickOutputResponse: string;

  @Column('text', { nullable: true })
  quickOutputFeedback: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

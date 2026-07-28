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

@Entity('voice_quotas')
export class VoiceQuota {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id' }) userId: number;

  @Column({ name: 'period_start', type: 'timestamptz' }) periodStart: Date;
  @Column({ name: 'period_end', type: 'timestamptz' }) periodEnd: Date;

  @Column({ name: 'standard_seconds_used', default: 0 }) standardSecondsUsed: number;
  @Column({ name: 'realtime_seconds_used', default: 0 }) realtimeSecondsUsed: number;
  @Column({ name: 'bonus_seconds_granted', default: 0 }) bonusSecondsGranted: number;
  @Column({ name: 'bonus_seconds_used', default: 0 }) bonusSecondsUsed: number;

  @Column({ name: 'plan_snapshot', type: 'varchar', default: 'free' })
  planSnapshot: 'free' | 'pro' | 'max';

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

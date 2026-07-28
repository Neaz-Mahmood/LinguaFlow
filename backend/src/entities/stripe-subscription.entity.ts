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

@Entity('stripe_subscriptions')
export class StripeSubscription {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Index()
  @Column({ name: 'user_id' }) userId: number;

  @Column({ name: 'stripe_subscription_id', unique: true }) stripeSubscriptionId: string;
  @Column({ name: 'stripe_price_id' }) stripePriceId: string;
  @Column() status: string;

  @Column({ name: 'current_period_start', type: 'timestamptz' }) currentPeriodStart: Date;
  @Column({ name: 'current_period_end', type: 'timestamptz' }) currentPeriodEnd: Date;
  @Column({ name: 'cancel_at_period_end', default: false }) cancelAtPeriodEnd: boolean;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

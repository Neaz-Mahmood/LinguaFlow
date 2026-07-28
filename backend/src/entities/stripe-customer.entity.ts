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

@Entity('stripe_customers')
export class StripeCustomer {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id' }) userId: number;

  @Column({ name: 'stripe_customer_id', unique: true }) stripeCustomerId: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

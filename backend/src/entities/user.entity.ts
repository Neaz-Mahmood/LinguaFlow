import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Flashcard } from './flashcard.entity';
import { FlowSession } from './flow-session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Spanish' })
  targetLanguage: string;

  @Column({ default: 'English' })
  nativeLanguage: string;

  @Column({ default: 'A1' })
  currentLevel: string;

  @Column({ default: 15 })
  dailyCommitment: number; // minutes

  @Column({ default: 'input' })
  strategyPreference: string; // 'input', 'output', 'balanced'

  @Column('simple-array', { nullable: true })
  goals: string[];

  @Column('jsonb', { nullable: true })
  contentRatios: Record<string, number>;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Flashcard, (flashcard) => flashcard.user)
  flashcards: Flashcard[];

  @OneToMany(() => FlowSession, (session) => session.user)
  sessions: FlowSession[];
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Flashcard } from './flashcard.entity';
import { FlowSession } from './flow-session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  googleSub: string | null;

  @Column({ type: 'varchar', nullable: true, select: false })
  passwordHash: string | null;

  @Column({ default: false })
  onboardingCompleted: boolean;

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

  @Column({ default: 0 })
  streakCount: number;

  @Column({ type: 'varchar', default: 'en' })
  uiLocale: string; // 'en' | 'es' | 'fr' | 'de'

  @Column({ type: 'varchar', default: 'system' })
  themeMode: string; // 'light' | 'dark' | 'system'

  @Column({ type: 'date', nullable: true })
  lastActiveDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Flashcard, (flashcard) => flashcard.user)
  flashcards: Flashcard[];

  @OneToMany(() => FlowSession, (session) => session.user)
  sessions: FlowSession[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('flashcards')
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  @Index()
  word: string;

  @Column()
  translation: string;

  @Column('text')
  contextSentence: string;

  @Column('text')
  contextTranslation: string;

  // SM-2 SRS variables
  @Column('float', { default: 2.5 })
  easiness: number;

  @Column({ default: 0 })
  interval: number; // in days

  @Column({ default: 0 })
  repetitions: number;

  @Column('date', { default: () => 'CURRENT_DATE' })
  nextReviewDate: Date;

  @ManyToOne(() => User, (user) => user.flashcards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

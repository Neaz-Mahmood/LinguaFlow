import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('flashcards')
@Index(['userId', 'conversationSessionId', 'conversationCorrectionId'], {
  unique: true,
  where:
    '"conversation_session_id" IS NOT NULL AND "conversation_correction_id" IS NOT NULL',
})
export class Flashcard {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'user_id' }) userId: number;
  @Column() @Index() word: string;
  @Column() translation: string;
  @Column('text') contextSentence: string;
  @Column('text') contextTranslation: string;
  @Column({ name: 'card_kind', default: 'word' }) cardKind: 'word' | 'sentence';
  @Column({ name: 'conversation_session_id', type: 'uuid', nullable: true })
  conversationSessionId: string | null;
  @Column({ name: 'conversation_correction_id', type: 'varchar', nullable: true })
  conversationCorrectionId: string | null;

  @Column('float', { default: 2.5 }) easiness: number;
  @Column({ default: 0 }) interval: number;
  @Column({ default: 0 }) repetitions: number;
  @Column('date', { default: () => 'CURRENT_DATE' }) nextReviewDate: Date;

  @ManyToOne(() => User, (user) => user.flashcards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

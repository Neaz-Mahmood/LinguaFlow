import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  title: string;

  @Column()
  @Index()
  level: string; // A1, A2, B1, B2

  /** Target language of the story content (Spanish, French, German, Japanese). */
  @Column({ default: 'Spanish' })
  @Index()
  language: string;

  @Column('text')
  contentTarget: string;

  @Column('text')
  contentEnglish: string;

  @Column('text', { nullable: true })
  wordsJson: string; // JSON dictionary word -> translation

  @Column('text', { nullable: true })
  sentencesJson: string; // JSON array of {"target": "...", "english": "..."}
}

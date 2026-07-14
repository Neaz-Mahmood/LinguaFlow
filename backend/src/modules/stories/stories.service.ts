import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from '../../entities/story.entity';
import { User } from '../../entities/user.entity';
import { normalizeTargetLanguage } from '../../common/supported-languages';
import { SEED_STORIES } from './seed-stories';

@Injectable()
export class StoriesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedDatabase();
  }

  async seedDatabase() {
    // Backfill language on legacy rows created before multi-language support.
    await this.storiesRepository
      .createQueryBuilder()
      .update(Story)
      .set({ language: 'Spanish' })
      .where('language IS NULL OR language = :empty', { empty: '' })
      .execute()
      .catch(() => undefined);

    let inserted = 0;
    for (const data of SEED_STORIES) {
      const existing = await this.storiesRepository.findOne({
        where: {
          language: data.language,
          level: data.level,
          title: data.title,
        },
      });
      if (existing) continue;

      await this.storiesRepository.save(
        this.storiesRepository.create({
          title: data.title,
          level: data.level,
          language: data.language,
          contentTarget: data.contentTarget,
          contentEnglish: data.contentEnglish,
          wordsJson: JSON.stringify(data.words),
          sentencesJson: JSON.stringify(data.sentences),
        }),
      );
      inserted += 1;
    }

    if (inserted > 0) {
      console.log(
        `PostgreSQL database seeded with ${inserted} new story/stories.`,
      );
    } else {
      console.log('Story catalog is up to date. Skipping seed inserts.');
    }
  }

  async getStoriesForUser(userId: number): Promise<any[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const level = user ? user.currentLevel : 'A1';
    const language = normalizeTargetLanguage(user?.targetLanguage);

    const stories = await this.storiesRepository.find({
      where: { level, language },
    });

    return stories.map((s) => ({
      id: s.id,
      title: s.title,
      level: s.level,
      language: s.language,
      content_target: s.contentTarget,
      content_english: s.contentEnglish,
      words: s.wordsJson ? JSON.parse(s.wordsJson) : {},
      sentences: s.sentencesJson ? JSON.parse(s.sentencesJson) : [],
    }));
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlashcardsService } from './flashcards.service';
import { Flashcard } from '../../entities/flashcard.entity';

describe('FlashcardsService SM-2 Algorithm', () => {
  let service: FlashcardsService;
  let repository: Repository<Flashcard>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlashcardsService,
        {
          provide: getRepositoryToken(Flashcard),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FlashcardsService>(FlashcardsService);
    repository = module.get<Repository<Flashcard>>(getRepositoryToken(Flashcard));
  });

  it('should verify SM-2 mathematical updates', () => {
    // 1. Initial review: Quality 4 (reps: 0 -> 1, interval: 0 -> 1, easiness: 2.5 -> 2.5)
    let easiness = 2.5;
    let interval = 0;
    let repetitions = 0;

    let res = service.updateSM2(easiness, interval, repetitions, 4);
    expect(res.repetitions).toBe(1);
    expect(res.interval).toBe(1);
    expect(res.easiness).toBe(2.5); // 2.5 + (0.1 - (5-4)*(0.08 + (5-4)*0.02)) = 2.5 + (0.1 - 0.1) = 2.5

    // 2. Second review: Quality 4 (reps: 1 -> 2, interval: 1 -> 6, easiness: 2.5)
    easiness = res.easiness;
    interval = res.interval;
    repetitions = res.repetitions;

    res = service.updateSM2(easiness, interval, repetitions, 4);
    expect(res.repetitions).toBe(2);
    expect(res.interval).toBe(6);

    // 3. Third review: Quality 5 (reps: 2 -> 3, interval: 6 -> round(6 * 2.5) = 15)
    easiness = res.easiness;
    interval = res.interval;
    repetitions = res.repetitions;

    res = service.updateSM2(easiness, interval, repetitions, 5);
    expect(res.repetitions).toBe(3);
    expect(res.interval).toBe(15);
    expect(res.easiness).toBeGreaterThan(2.5); // Easiness should increase on quality 5

    // 4. Incorrect recall: Quality 1 (reps -> 0, interval -> 1)
    easiness = res.easiness;
    interval = res.interval;
    repetitions = res.repetitions;

    res = service.updateSM2(easiness, interval, repetitions, 1);
    expect(res.repetitions).toBe(0);
    expect(res.interval).toBe(1);
    expect(res.easiness).toBeLessThan(easiness); // Easiness should drop on quality 1
  });
});

import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Story } from '../../entities/story.entity';
import { User } from '../../entities/user.entity';
export declare class StoriesService implements OnApplicationBootstrap {
    private storiesRepository;
    private usersRepository;
    constructor(storiesRepository: Repository<Story>, usersRepository: Repository<User>);
    onApplicationBootstrap(): Promise<void>;
    seedDatabase(): Promise<void>;
    getStoriesForUser(userId: number): Promise<any[]>;
}

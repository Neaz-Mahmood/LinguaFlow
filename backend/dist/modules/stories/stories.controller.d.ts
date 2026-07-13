import { User } from '../../entities/user.entity';
import { StoriesService } from './stories.service';
export declare class StoriesController {
    private readonly storiesService;
    constructor(storiesService: StoriesService);
    getStories(user: User): Promise<any[]>;
}

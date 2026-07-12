import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoriesService } from './stories.service';

@Controller('api/stories')
@UseGuards(JwtAuthGuard)
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async getStories(@CurrentUser() user: User) {
    return this.storiesService.getStoriesForUser(user.id);
  }
}

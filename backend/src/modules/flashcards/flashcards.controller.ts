import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FlashcardsService } from './flashcards.service';

@Controller('api/flashcards')
@UseGuards(JwtAuthGuard)
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post('mine')
  async mine(@CurrentUser() user: User, @Body() data: any) {
    const card = await this.flashcardsService.mineCard(user.id, data);
    return { status: 'created', card };
  }

  @Get('review')
  async getReview(@CurrentUser() user: User) {
    return this.flashcardsService.getReviewCards(user.id);
  }

  @Post('review/:id')
  async review(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) cardId: number,
    @Body() data: any,
  ) {
    const quality = Number(data.quality) ?? 3;
    const card = await this.flashcardsService.reviewCard(user.id, cardId, quality);
    return { status: 'success', card };
  }
}

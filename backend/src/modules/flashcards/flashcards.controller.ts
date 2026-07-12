import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';

@Controller('api/flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post('mine')
  async mine(@Body() data: any) {
    const card = await this.flashcardsService.mineCard(data);
    return { status: 'created', card };
  }

  @Get('review')
  async getReview() {
    return this.flashcardsService.getReviewCards();
  }

  @Post('review/:id')
  async review(@Param('id', ParseIntPipe) cardId: number, @Body() data: any) {
    const quality = Number(data.quality) ?? 3;
    const card = await this.flashcardsService.reviewCard(cardId, quality);
    return { status: 'success', card };
  }
}

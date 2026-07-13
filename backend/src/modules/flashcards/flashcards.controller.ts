import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MineFlashcardDto, ReviewFlashcardDto } from './dto/flashcard.dto';
import { FlashcardsService } from './flashcards.service';

@ApiTags('flashcards')
@ApiBearerAuth('access-token')
@Controller('api/flashcards')
@UseGuards(JwtAuthGuard)
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post('mine')
  @ApiOperation({ summary: 'Mine a new vocabulary flashcard' })
  async mine(@CurrentUser() user: User, @Body() data: MineFlashcardDto) {
    const card = await this.flashcardsService.mineCard(user.id, data);
    return { status: 'created', card };
  }

  @Get('review')
  @ApiOperation({ summary: 'Get flashcards due for review' })
  async getReview(@CurrentUser() user: User) {
    return this.flashcardsService.getReviewCards(user.id);
  }

  @Post('review/:id')
  @ApiOperation({ summary: 'Submit a flashcard review quality score' })
  @ApiParam({ name: 'id', type: Number, description: 'Flashcard id' })
  async review(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) cardId: number,
    @Body() data: ReviewFlashcardDto,
  ) {
    const card = await this.flashcardsService.reviewCard(
      user.id,
      cardId,
      data.quality,
    );
    return { status: 'success', card };
  }
}

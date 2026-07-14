import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendConversationMessageDto } from './dto/conversation.dto';
import { ConversationsService } from './conversations.service';

@ApiTags('conversation-sessions')
@ApiBearerAuth('access-token')
@Controller('api/conversation-sessions')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversations: ConversationsService) {}

  @Post()
  @ApiOperation({
    summary: "Create or resume today's target-language conversation",
  })
  create(@CurrentUser() user: User) {
    return this.conversations.createOrResume(user.id);
  }

  @Get(':id')
  get(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.conversations.get(user.id, id);
  }

  @Post(':id/messages')
  send(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SendConversationMessageDto,
  ) {
    return this.conversations.send(
      user.id,
      id,
      body.text,
      body.clientMessageId,
    );
  }

  @Post(':id/finalize')
  @HttpCode(HttpStatus.ACCEPTED)
  finalize(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.conversations.finalize(user.id, id);
  }

  @Post(':id/corrections/:correctionId/mine')
  mine(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('correctionId') correctionId: string,
  ) {
    return this.conversations.mineCorrection(user.id, id, correctionId);
  }
}

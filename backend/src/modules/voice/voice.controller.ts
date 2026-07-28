import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { VoiceService } from './voice.service';
import { CreateVoiceSessionDto, EndVoiceSessionDto, SendVoiceTurnDto } from './dto/voice.dto';

@ApiTags('voice')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/voice')
export class VoiceController {
  constructor(private readonly voice: VoiceService) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Create a new voice session' })
  async createSession(@CurrentUser() user: User, @Body() dto: CreateVoiceSessionDto) {
    return this.voice.createSession(user, dto.mode as 'standard' | 'realtime');
  }

  @Post('sessions/:id/turns')
  @ApiOperation({ summary: 'Send a voice turn (audio blob)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('audio'))
  async sendTurn(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() audio: Express.Multer.File,
    @Body() dto: SendVoiceTurnDto,
  ) {
    return this.voice.processTurn(
      user,
      id,
      audio.buffer,
      audio.mimetype,
      dto.clientTurnId,
    );
  }

  @Post('sessions/:id/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End a voice session' })
  async endSession(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EndVoiceSessionDto,
  ) {
    return this.voice.endSession(user, id, dto.reason);
  }

  @Get('quota')
  @ApiOperation({ summary: 'Get current voice quota snapshot' })
  async getQuota(@CurrentUser() user: User) {
    return this.voice.getQuota(user.id);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoiceQuota } from '../../entities/voice-quota.entity';
import { VoiceUsageEvent } from '../../entities/voice-usage-event.entity';
import { User } from '../../entities/user.entity';
import { EntitlementsService } from './entitlements.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoiceQuota, VoiceUsageEvent, User])],
  providers: [EntitlementsService],
  exports: [EntitlementsService],
})
export class EntitlementsModule {}

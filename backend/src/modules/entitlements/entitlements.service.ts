import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { VoiceQuota } from '../../entities/voice-quota.entity';
import { VoiceUsageEvent, VoiceUsageKind } from '../../entities/voice-usage-event.entity';
import { User } from '../../entities/user.entity';
import {
  ONBOARDING_BONUS_SEC,
  PLAN_LIMITS,
  PlanId,
  PlanLimits,
  VoiceMode,
} from './plan-config';

export interface QuotaSnapshot {
  plan: PlanId;
  practiceMinutesRemaining: number;
  standardRemainingSec: number;
  realtimeRemainingSec: number;
  periodEnd: Date;
}

export interface ReserveResult {
  allowed: boolean;
  grantedSec: number;
}

@Injectable()
export class EntitlementsService {
  constructor(
    @InjectRepository(VoiceQuota) private readonly quotas: Repository<VoiceQuota>,
    @InjectRepository(VoiceUsageEvent) private readonly events: Repository<VoiceUsageEvent>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  getEntitlements(user: User): PlanLimits {
    return PLAN_LIMITS[user.plan as PlanId] ?? PLAN_LIMITS.free;
  }

  async getQuotaSnapshot(userId: number): Promise<QuotaSnapshot> {
    const user = await this.users.findOneOrFail({ where: { id: userId } });
    const quota = await this.getOrCreateQuota(userId, user.plan as PlanId);
    const limits = PLAN_LIMITS[user.plan as PlanId] ?? PLAN_LIMITS.free;

    const standardAllowanceSec = limits.standardMinutes * 60;
    const realtimeAllowanceSec = limits.realtimeMinutes * 60;

    const standardRemainingSec = Math.max(
      0,
      standardAllowanceSec + quota.bonusSecondsGranted - quota.bonusSecondsUsed - quota.standardSecondsUsed,
    );
    const realtimeRemainingSec = Math.max(
      0,
      realtimeAllowanceSec - quota.realtimeSecondsUsed,
    );

    return {
      plan: user.plan as PlanId,
      practiceMinutesRemaining: Math.floor(standardRemainingSec / 60),
      standardRemainingSec,
      realtimeRemainingSec,
      periodEnd: quota.periodEnd,
    };
  }

  async assertCanStartVoice(user: User, mode: VoiceMode): Promise<number> {
    if (!user.emailVerified) {
      throw new ForbiddenException('Please verify your email before using voice.');
    }
    const limits = this.getEntitlements(user);
    if (mode === 'realtime' && !limits.realtime) {
      throw new ForbiddenException('Realtime voice requires the Max plan.');
    }
    const snapshot = await this.getQuotaSnapshot(user.id);
    const remaining = mode === 'realtime' ? snapshot.realtimeRemainingSec : snapshot.standardRemainingSec;
    if (remaining <= 0) {
      throw new HttpException(
        { message: 'No voice minutes remaining. Upgrade to continue.', code: 'quota_exhausted' },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }
    return limits.sessionCapSec;
  }

  async grantOnboardingBonusIfEligible(user: User): Promise<void> {
    if (user.onboardingBonusGrantedAt) return;
    await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const quotaRepo = manager.getRepository(VoiceQuota);
      const fresh = await userRepo.findOne({
        where: { id: user.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!fresh || fresh.onboardingBonusGrantedAt) return;
      fresh.onboardingBonusGrantedAt = new Date();
      await userRepo.save(fresh);
      const quota = await quotaRepo.findOne({ where: { userId: user.id } });
      if (quota) {
        quota.bonusSecondsGranted += ONBOARDING_BONUS_SEC;
        await quotaRepo.save(quota);
      }
    });
    // Refresh the in-memory user so callers see the updated field.
    user.onboardingBonusGrantedAt = user.onboardingBonusGrantedAt ?? new Date();
  }

  async reserveVoiceSeconds(
    userId: number,
    mode: VoiceMode,
    requestedSec: number,
    meta: { sessionId: string; model: string; language: string },
  ): Promise<ReserveResult> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const quotaRepo = manager.getRepository(VoiceQuota);
      const eventRepo = manager.getRepository(VoiceUsageEvent);

      const user = await userRepo.findOneOrFail({ where: { id: userId } });
      const limits = PLAN_LIMITS[user.plan as PlanId] ?? PLAN_LIMITS.free;

      let quota = await quotaRepo.findOne({
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!quota) {
        quota = await this.createQuotaInTxn(quotaRepo, userId, user.plan as PlanId);
      } else {
        quota = await this.lazyResetIfNeeded(quotaRepo, quota, user.plan as PlanId);
      }

      let grantedSec: number;
      let allowed: boolean;

      if (mode === 'realtime') {
        const allowanceSec = limits.realtimeMinutes * 60;
        const remainingSec = Math.max(0, allowanceSec - quota.realtimeSecondsUsed);
        grantedSec = Math.min(requestedSec, remainingSec);
        allowed = grantedSec >= requestedSec;
        quota.realtimeSecondsUsed += grantedSec;
      } else {
        // Spend bonus first, then standard allowance.
        const bonusRemaining = Math.max(0, quota.bonusSecondsGranted - quota.bonusSecondsUsed);
        const standardAllowanceSec = limits.standardMinutes * 60;
        const standardRemaining = Math.max(0, standardAllowanceSec - quota.standardSecondsUsed);
        const totalRemaining = bonusRemaining + standardRemaining;
        grantedSec = Math.min(requestedSec, totalRemaining);
        allowed = grantedSec >= requestedSec;

        const bonusSpend = Math.min(grantedSec, bonusRemaining);
        const standardSpend = grantedSec - bonusSpend;
        quota.bonusSecondsUsed += bonusSpend;
        quota.standardSecondsUsed += standardSpend;
      }

      await quotaRepo.save(quota);

      if (grantedSec > 0) {
        await eventRepo.save(
          eventRepo.create({
            userId,
            voiceSessionId: meta.sessionId,
            kind: VoiceUsageKind.STT,
            model: meta.model,
            targetLanguage: meta.language,
            userSpeakingSeconds: grantedSec,
            estCostMicros: '0',
          }),
        );
      }

      return { allowed, grantedSec };
    });
  }

  // --- helpers ---

  private async getOrCreateQuota(userId: number, plan: PlanId): Promise<VoiceQuota> {
    let quota = await this.quotas.findOne({ where: { userId } });
    if (!quota) {
      quota = await this.createQuotaInTxn(this.quotas, userId, plan);
    } else if (new Date() >= quota.periodEnd) {
      quota = await this.lazyResetIfNeeded(this.quotas, quota, plan);
    }
    return quota;
  }

  private async createQuotaInTxn(
    repo: Repository<VoiceQuota>,
    userId: number,
    plan: PlanId,
  ): Promise<VoiceQuota> {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    try {
      return await repo.save(
        repo.create({
          userId,
          periodStart: now,
          periodEnd,
          planSnapshot: plan,
          standardSecondsUsed: 0,
          realtimeSecondsUsed: 0,
          bonusSecondsGranted: 0,
          bonusSecondsUsed: 0,
        }),
      );
    } catch {
      // Concurrent insert — fetch the row that won.
      return repo.findOneOrFail({ where: { userId } });
    }
  }

  private async lazyResetIfNeeded(
    repo: Repository<VoiceQuota>,
    quota: VoiceQuota,
    plan: PlanId,
  ): Promise<VoiceQuota> {
    if (new Date() < quota.periodEnd) return quota;
    quota.periodStart = quota.periodEnd;
    const next = new Date(quota.periodEnd);
    next.setMonth(next.getMonth() + 1);
    quota.periodEnd = next;
    quota.standardSecondsUsed = 0;
    quota.realtimeSecondsUsed = 0;
    // Bonus does not roll over; reset used counter but keep granted as-is
    // so the one-time grant is not re-awarded.
    quota.bonusSecondsUsed = quota.bonusSecondsGranted; // fully consumed on reset
    quota.planSnapshot = plan;
    return repo.save(quota);
  }
}

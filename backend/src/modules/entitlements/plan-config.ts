export type PlanId = 'free' | 'pro' | 'max';
export type FeedbackDepth = 'basic' | 'detailed' | 'deep';
export type VoiceMode = 'standard' | 'realtime';

export interface PlanLimits {
  standardMinutes: number;
  realtimeMinutes: number;
  sessionCapSec: number;
  feedbackDepth: FeedbackDepth;
  historyDays: number | null; // null = unlimited
  realtime: boolean;
  shortResponses: boolean;
  audioCorrections: boolean;
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    standardMinutes: 15,
    realtimeMinutes: 0,
    sessionCapSec: 300,
    feedbackDepth: 'basic',
    historyDays: 7,
    realtime: false,
    shortResponses: true,
    audioCorrections: false,
  },
  pro: {
    standardMinutes: 200,
    realtimeMinutes: 0,
    sessionCapSec: 1800,
    feedbackDepth: 'detailed',
    historyDays: null,
    realtime: false,
    shortResponses: false,
    audioCorrections: true,
  },
  max: {
    standardMinutes: 350,
    realtimeMinutes: 100,
    sessionCapSec: 3600,
    feedbackDepth: 'deep',
    historyDays: null,
    realtime: true,
    shortResponses: false,
    audioCorrections: true,
  },
};

// One-time onboarding bonus granted on first voice eligibility (10 minutes).
export const ONBOARDING_BONUS_SEC = 600;

/**
 * Maps Stripe Price IDs to plans. Read from env at call time so tests and
 * different environments resolve their own price IDs.
 */
export function stripePriceToPlan(priceId: string): PlanId | null {
  if (priceId && priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  if (priceId && priceId === process.env.STRIPE_PRICE_MAX) return 'max';
  return null;
}

export function planForPrice(priceId: string): PlanId {
  return stripePriceToPlan(priceId) ?? 'free';
}

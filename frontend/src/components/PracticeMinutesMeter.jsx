import React from 'react';
import { useSubscription } from '../../context/SubscriptionProvider';

export default function PracticeMinutesMeter() {
  const sub = useSubscription();
  if (!sub || !sub.loaded) return null;

  const { quota, plan } = sub;
  const { practiceMinutesRemaining, periodEnd } = quota;

  const resetLabel = periodEnd
    ? new Date(periodEnd).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.85rem',
        backgroundColor: practiceMinutesRemaining <= 2
          ? 'var(--lf-error-container, #fde8e8)'
          : 'var(--lf-surface-container-low)',
        borderRadius: '9999px',
        fontSize: '0.85rem',
        fontWeight: 500,
        color: 'var(--lf-on-surface)',
        whiteSpace: 'nowrap',
      }}
    >
      <span>🎙️</span>
      <span>
        {practiceMinutesRemaining} min left
        {resetLabel && <span style={{ fontWeight: 400, opacity: 0.7 }}> · resets {resetLabel}</span>}
      </span>
      {plan === 'free' && practiceMinutesRemaining <= 2 && (
        <span style={{ color: 'var(--lf-primary)', fontWeight: 600, marginLeft: '0.25rem' }}>
          Upgrade
        </span>
      )}
    </div>
  );
}

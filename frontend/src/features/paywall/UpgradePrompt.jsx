import React from 'react';
import { createCheckoutSession } from '../../lib/api';

export default function UpgradePrompt({ reason = 'quota', onDismiss, onNavigateToPricing }) {
  const messages = {
    quota: { title: 'You\'ve used all your practice minutes', body: 'Upgrade to keep speaking and learning.' },
    cap: { title: 'Session limit reached', body: 'Free sessions are capped at 5 minutes. Upgrade for longer conversations.' },
    realtime: { title: 'Realtime voice requires Max', body: 'Upgrade to Max for live, interruption-based voice practice.' },
  };
  const { title, body } = messages[reason] || messages.quota;

  async function handleUpgrade(plan) {
    try {
      const { url } = await createCheckoutSession(plan);
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
      onClick={onDismiss}
    >
      <div
        style={{
          backgroundColor: '#fff', borderRadius: '16px', padding: '2rem',
          maxWidth: '420px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎙️</div>
        <h2 style={{ margin: '0 0 0.5rem', color: 'var(--lf-deep-navy)', fontSize: '1.25rem' }}>{title}</h2>
        <p style={{ margin: '0 0 1.5rem', color: 'var(--lf-on-surface-variant)', fontSize: '0.95rem' }}>{body}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => handleUpgrade('pro')}
            style={{
              padding: '0.85rem', backgroundColor: 'var(--lf-deep-navy)', color: '#fff',
              border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem',
            }}
          >
            Upgrade to Pro — £17.99/mo
          </button>
          <button
            type="button"
            onClick={() => handleUpgrade('max')}
            style={{
              padding: '0.85rem', backgroundColor: 'transparent', color: 'var(--lf-deep-navy)',
              border: '1px solid var(--lf-deep-navy)', borderRadius: '8px', fontWeight: 600,
              cursor: 'pointer', fontSize: '1rem',
            }}
          >
            Upgrade to Max — £39.99/mo
          </button>
          {onNavigateToPricing && (
            <button
              type="button"
              onClick={onNavigateToPricing}
              style={{
                background: 'none', border: 'none', color: 'var(--lf-on-surface-variant)',
                cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline',
              }}
            >
              Compare plans
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

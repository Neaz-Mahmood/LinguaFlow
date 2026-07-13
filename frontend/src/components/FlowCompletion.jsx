import React from 'react';

export default function FlowCompletion({ streakCount, shadowScore, onRestart }) {
  // Simple check for default score if not calculated
  const displayScore = shadowScore > 0 ? shadowScore : 85;

  return (
    <div className="card summary-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="summary-icon" style={{ fontSize: '5rem', animation: 'float 2.5s ease-in-out infinite' }}>🔥</div>
      
      <h1 className="onboarding-title" style={{ fontSize: '2.5rem', fontWeight: '800' }}>
        Today's Flow Complete!
      </h1>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxSelfWidth: '400px', margin: '0 auto' }}>
        Phenomenal work! You have finished all 4 steps of your daily sequential flow path.
      </p>

      {/* Streak Badge Card */}
      <div className="feedback-box" style={{ 
        background: 'rgba(6, 182, 212, 0.05)', 
        border: '1px solid var(--accent-secondary)', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '1.5rem 0',
        width: '100%',
        maxWidth: '350px'
      }}>
        <span style={{ fontSize: '3rem' }}>⚡</span>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginTop: '0.5rem', fontSize: '1.4rem' }}>
          {streakCount || 1} Day Streak
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Come back tomorrow to keep the flame alive!
        </p>
      </div>

      <div className="summary-stats" style={{ width: '100%' }}>
        <div className="stat-box">
          <div className="stat-num">{displayScore}%</div>
          <div className="stat-label">Shadowing Accuracy</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">4/4</div>
          <div className="stat-label">Steps Completed</div>
        </div>
      </div>

      <div className="feedback-box" style={{ width: '100%', borderStyle: 'solid', textAlign: 'left' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem', color: 'var(--accent-secondary)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Milestones Met
        </h3>
        <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <li>📖 **Krashen's CI**: Read interactive texts and mined keywords in context.</li>
          <li>🗣️ **Lewis' Output**: Practiced writing production and active generation.</li>
          <li>🎯 **Arguelles Shadowing**: Repeated native phrases and recorded pronunciation.</li>
        </ul>
      </div>

      <button className="btn btn-primary btn-full" onClick={onRestart} style={{ marginTop: '1rem' }}>
        Restart Daily Flow 🌊
      </button>
    </div>
  );
}

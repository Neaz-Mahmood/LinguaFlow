import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Home({
  user,
  onStartLearning,
  onNavigateToPricing,
  onNavigateToSignIn,
  onNavigateToSignUp,
}) {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Complete 5 Vocab Cards', completed: true },
    { id: 2, text: 'Practice Speaking 10m', completed: false },
    { id: 3, text: 'Review Business Basics', completed: false },
    { id: 4, text: 'Listen to French Podcast', completed: false },
  ]);

  const toggleGoal = (id) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'Learner';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--lf-background-faint)' }}>
      {/* Top Navigation */}
      <Navbar
        onBootstrap={() => {}}
        onNavigateToPricing={onNavigateToPricing}
        onNavigateToSignIn={onNavigateToSignIn}
        onNavigateToSignUp={onNavigateToSignUp}
        isLoggedIn={Boolean(user)}
      />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '2.5rem var(--margin-desktop)',
          boxSizing: 'border-box',
        }}
      >
        {/* Welcome Hero Section */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            marginBottom: '2.5rem',
          }}
        >
          {/* Hero Greeting */}
          <div>
            <h1
              className="headline-lg"
              style={{
                color: 'var(--lf-deep-navy)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                margin: '0 0 0.5rem 0',
              }}
            >
              Welcome back, {userName}!
            </h1>
            <p
              className="body-lg"
              style={{
                color: 'var(--lf-subtle-gray)',
                margin: '0 0 1.5rem 0',
                maxWidth: '540px',
              }}
            >
              You've mastered 12 new phrases this week. Ready to tackle Business Basics?
            </p>
            <button
              type="button"
              onClick={onStartLearning}
              style={{
                backgroundColor: 'var(--lf-deep-navy)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.85rem 1.75rem',
                fontFamily: 'var(--font-family-body)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 12px rgba(28, 43, 51, 0.15)',
                transition: 'opacity 0.15s ease',
              }}
            >
              <span>Start Learning</span>
              <span style={{ fontSize: '1.2rem' }}>▶</span>
            </button>
          </div>

          {/* Daily Progress Widget */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #c3c7ca',
                borderRadius: '16px',
                padding: '1.75rem 2.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '280px',
              }}
            >
              <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1rem' }}>
                <svg width="120" height="120" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F0F2F5"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="var(--lf-deep-navy)"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-family-heading)',
                    fontSize: '1.65rem',
                    fontWeight: 700,
                    color: 'var(--lf-deep-navy)',
                  }}
                >
                  75%
                </div>
              </div>
              <span
                className="label-md"
                style={{
                  color: 'var(--lf-subtle-gray)',
                  letterSpacing: '0.1em',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Daily Progress
              </span>
            </div>
          </div>
        </section>

        {/* Bento Grid: Daily Goals & Active Paths */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Daily Goals Checklist */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #c3c7ca',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 className="title-md" style={{ color: 'var(--lf-deep-navy)', margin: 0, fontWeight: 600 }}>
                  Daily Goals
                </h2>
                <span style={{ fontSize: '1.25rem', color: 'var(--lf-subtle-gray)' }}>☑</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {goals.map((goal) => (
                  <li
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '4px',
                        border: goal.completed ? '2px solid var(--lf-deep-navy)' : '2px solid #c3c7ca',
                        backgroundColor: goal.completed ? 'var(--lf-deep-navy)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {goal.completed && '✓'}
                    </div>
                    <span
                      className="body-md"
                      style={{
                        color: goal.completed ? 'var(--lf-subtle-gray)' : 'var(--lf-on-surface)',
                        textDecoration: goal.completed ? 'line-through' : 'none',
                        fontSize: '0.95rem',
                      }}
                    >
                      {goal.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                marginTop: '1.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--lf-background-faint)',
                borderRadius: '8px',
              }}
            >
              <span className="label-sm" style={{ color: 'var(--lf-on-surface-variant)', fontSize: '0.85rem' }}>
                Current Streak: <strong style={{ color: 'var(--lf-deep-navy)' }}>14 Days</strong> 🔥
              </span>
            </div>
          </div>

          {/* Active Learning Paths Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 className="title-md" style={{ color: 'var(--lf-deep-navy)', margin: 0, fontWeight: 600 }}>
              Active Paths
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {/* Path 1: Business Basics */}
              <div
                onClick={onStartLearning}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #c3c7ca',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  transition: 'border-color 0.15s ease, transform 0.15s ease',
                }}
              >
                <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--lf-primary-fixed)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', marginBottom: '0.85rem' }}>
                  💼
                </div>
                <h3 className="headline-lg-mobile" style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.35rem 0', fontSize: '1.15rem' }}>
                  Business Basics
                </h3>
                <p className="body-md" style={{ color: 'var(--lf-subtle-gray)', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                  Master essential terminology for meetings and negotiations.
                </p>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    <span className="label-sm" style={{ color: 'var(--lf-subtle-gray)' }}>Progress</span>
                    <span className="label-sm" style={{ color: 'var(--lf-deep-navy)', fontWeight: 700 }}>45%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--lf-background-faint)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '45%', height: '100%', backgroundColor: 'var(--lf-deep-navy)', borderRadius: '9999px' }} />
                  </div>
                </div>
              </div>

              {/* Path 2: Travel Prep */}
              <div
                onClick={onStartLearning}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #c3c7ca',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  transition: 'border-color 0.15s ease, transform 0.15s ease',
                }}
              >
                <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--lf-primary-fixed)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', marginBottom: '0.85rem' }}>
                  ✈️
                </div>
                <h3 className="headline-lg-mobile" style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.35rem 0', fontSize: '1.15rem' }}>
                  Travel Prep
                </h3>
                <p className="body-md" style={{ color: 'var(--lf-subtle-gray)', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                  Survive and thrive in foreign cities with local phrases.
                </p>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    <span className="label-sm" style={{ color: 'var(--lf-subtle-gray)' }}>Progress</span>
                    <span className="label-sm" style={{ color: 'var(--lf-deep-navy)', fontWeight: 700 }}>80%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--lf-background-faint)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '80%', height: '100%', backgroundColor: 'var(--lf-deep-navy)', borderRadius: '9999px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Path 3: Daily Essentials */}
            <div
              onClick={onStartLearning}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #c3c7ca',
                borderRadius: '16px',
                padding: '1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--lf-primary-fixed)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', flexShrink: 0 }}>
                  ☕
                </div>
                <div>
                  <h3 className="headline-lg-mobile" style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.25rem 0', fontSize: '1.15rem' }}>
                    Daily Essentials
                  </h3>
                  <p className="body-md" style={{ color: 'var(--lf-subtle-gray)', fontSize: '0.875rem', margin: 0 }}>
                    Master the art of small talk and casual conversation in everyday settings.
                  </p>
                </div>
              </div>

              <span className="label-sm" style={{ backgroundColor: 'var(--lf-primary-fixed)', color: 'var(--lf-deep-navy)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontWeight: 600 }}>
                Level 4 Completed
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

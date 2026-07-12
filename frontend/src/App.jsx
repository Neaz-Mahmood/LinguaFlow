import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import ComprehensibleInput from './components/ComprehensibleInput';
import SpacedRepetition from './components/SpacedRepetition';
import Shadowing from './components/Shadowing';
import QuickOutput from './components/QuickOutput';

const VIEW_STATES = {
  ONBOARDING: 'onboarding',
  INPUT: 'input',
  SRS: 'srs',
  SHADOWING: 'shadowing',
  OUTPUT: 'output',
  SUMMARY: 'summary'
};

export default function App() {
  const [viewState, setViewState] = useState(VIEW_STATES.ONBOARDING);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Fetch User
      const userRes = await fetch("http://localhost:8000/api/user");
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        
        // 2. Fetch Session
        const sessionRes = await fetch("http://localhost:8000/api/flow-session");
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setSession(sessionData);

          // Determine starting step based on completed session properties
          if (!sessionData.comprehensible_input_completed) {
            setViewState(VIEW_STATES.INPUT);
          } else if (!sessionData.srs_completed) {
            setViewState(VIEW_STATES.SRS);
          } else if (!sessionData.shadowing_completed) {
            setViewState(VIEW_STATES.SHADOWING);
          } else if (!sessionData.output_completed) {
            setViewState(VIEW_STATES.OUTPUT);
          } else {
            setViewState(VIEW_STATES.SUMMARY);
          }
        }
      }
    } catch (err) {
      console.warn("Backend not running or offline. Starting onboarding fallback.", err);
      setViewState(VIEW_STATES.ONBOARDING);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = (updatedUser) => {
    setUser(updatedUser);
    // Restart session at Comprehensible Input
    setViewState(VIEW_STATES.INPUT);
    fetchInitialData();
  };

  const resetSession = async () => {
    if (confirm("Reset today's flow progress? This will delete flashcards mined today and reset scores.")) {
      setLoading(true);
      try {
        await fetch("http://localhost:8000/api/user/onboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_language: user?.target_language || "Spanish",
            current_level: user?.current_level || "A1",
            daily_commitment: user?.daily_commitment || 20,
            strategy_preference: user?.strategy_preference || "input"
          })
        });
        await fetchInitialData();
      } catch (err) {
        console.error(err);
        setViewState(VIEW_STATES.ONBOARDING);
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="logo" style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}>🌊 LinguaFlow</div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading Daily Flow Engine...</p>
      </div>
    );
  }

  // Helper to check steps completion for visual progress indicators
  const isCompleted = (step) => {
    if (!session) return false;
    switch(step) {
      case VIEW_STATES.INPUT: return session.comprehensible_input_completed;
      case VIEW_STATES.SRS: return session.srs_completed;
      case VIEW_STATES.SHADOWING: return session.shadowing_completed;
      case VIEW_STATES.OUTPUT: return session.output_completed;
      default: return false;
    }
  };

  const isActive = (step) => viewState === step;

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo" onClick={fetchInitialData} style={{ cursor: 'pointer' }}>
          🌊 LinguaFlow
        </div>
        
        {viewState !== VIEW_STATES.ONBOARDING && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={resetSession}>
              Reset Session
            </button>
            <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setViewState(VIEW_STATES.ONBOARDING)}>
              Set Profile
            </button>
          </div>
        )}
      </header>

      {/* Progress Tracker */}
      {viewState !== VIEW_STATES.ONBOARDING && viewState !== VIEW_STATES.SUMMARY && (
        <div className="flow-progress">
          <div className={`progress-step ${isActive(VIEW_STATES.INPUT) ? 'active' : ''} ${isCompleted(VIEW_STATES.INPUT) ? 'completed' : ''}`}>
            <div className="step-indicator">1</div>
            <div className="step-label">Input</div>
          </div>
          <div className={`progress-step ${isActive(VIEW_STATES.SRS) ? 'active' : ''} ${isCompleted(VIEW_STATES.SRS) ? 'completed' : ''}`}>
            <div className="step-indicator">2</div>
            <div className="step-label">SRS</div>
          </div>
          <div className={`progress-step ${isActive(VIEW_STATES.SHADOWING) ? 'active' : ''} ${isCompleted(VIEW_STATES.SHADOWING) ? 'completed' : ''}`}>
            <div className="step-indicator">3</div>
            <div className="step-label">Shadow</div>
          </div>
          <div className={`progress-step ${isActive(VIEW_STATES.OUTPUT) ? 'active' : ''} ${isCompleted(VIEW_STATES.OUTPUT) ? 'completed' : ''}`}>
            <div className="step-indicator">4</div>
            <div className="step-label">Output</div>
          </div>
        </div>
      )}

      <main style={{ flex: 1 }}>
        {viewState === VIEW_STATES.ONBOARDING && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        
        {viewState === VIEW_STATES.INPUT && (
          <ComprehensibleInput onComplete={() => {
            setSession(prev => ({ ...prev, comprehensible_input_completed: true }));
            setViewState(VIEW_STATES.SRS);
          }} />
        )}

        {viewState === VIEW_STATES.SRS && (
          <SpacedRepetition onComplete={() => {
            setSession(prev => ({ ...prev, srs_completed: true }));
            setViewState(VIEW_STATES.SHADOWING);
          }} />
        )}

        {viewState === VIEW_STATES.SHADOWING && (
          <Shadowing onComplete={() => {
            setSession(prev => ({ ...prev, shadowing_completed: true }));
            setViewState(VIEW_STATES.OUTPUT);
          }} />
        )}

        {viewState === VIEW_STATES.OUTPUT && (
          <QuickOutput onComplete={() => {
            setSession(prev => ({ ...prev, output_completed: true }));
            setViewState(VIEW_STATES.SUMMARY);
          }} />
        )}

        {viewState === VIEW_STATES.SUMMARY && (
          <div className="card summary-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="summary-icon">🏆</div>
            <h1 className="onboarding-title">Daily Flow Completed!</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Excellent job! You have fully completed your {user?.daily_commitment} minute sequential flow path for today.
            </p>

            <div className="summary-stats">
              <div className="stat-box">
                <div className="stat-num">{user?.current_level}</div>
                <div className="stat-label">Proficiency Level</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">
                  {session?.shadowing_score ? `${session.shadowing_score}%` : '85%'}
                </div>
                <div className="stat-label">Shadowing Accuracy</div>
              </div>
            </div>

            <div className="feedback-box" style={{ width: '100%', borderStyle: 'solid' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>
                Polyglot Milestones Unlocked
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                📖 **Krashen's CI**: Mined new vocabulary in context.<br />
                🗣️ **Lewis' Speak From Day One**: Practiced grammar correction & chat output.<br />
                🎯 **Arguelles Shadowing**: Verified pronunciation cadence.
              </p>
            </div>

            <button className="btn btn-primary btn-full" onClick={resetSession}>
              Start New Daily Flow 🌊
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

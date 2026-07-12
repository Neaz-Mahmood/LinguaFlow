import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import DailyFlowContainer from './components/DailyFlowContainer';

const VIEW_STATES = {
  ONBOARDING: 'onboarding',
  FLOW: 'flow'
};

export default function App() {
  const [viewState, setViewState] = useState(VIEW_STATES.ONBOARDING);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const userRes = await fetch("http://localhost:8000/api/user");
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        
        // If they have completed onboarding, go straight to their daily flow
        if (userData && userData.currentLevel) {
          setViewState(VIEW_STATES.FLOW);
        } else {
          setViewState(VIEW_STATES.ONBOARDING);
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
    setViewState(VIEW_STATES.FLOW);
  };

  const resetSession = async () => {
    if (confirm("Reset today's flow progress? This will delete flashcards mined today and reset scores.")) {
      setLoading(true);
      try {
        await fetch("http://localhost:8000/api/user/onboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_language: user?.targetLanguage || "Spanish",
            native_language: user?.nativeLanguage || "English",
            current_level: user?.currentLevel || "A1",
            daily_commitment: user?.dailyCommitment || 20,
            strategy_preference: user?.strategyPreference || "input-heavy",
            goals: user?.goals || []
          })
        });
        // Hard-reload components
        window.location.reload();
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

  return (
    <div className="app-container">
      <header className="header" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

      <main style={{ flex: 1 }}>
        {viewState === VIEW_STATES.ONBOARDING && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        
        {viewState === VIEW_STATES.FLOW && (
          <DailyFlowContainer onResetProfile={() => setViewState(VIEW_STATES.ONBOARDING)} />
        )}
      </main>
    </div>
  );
}

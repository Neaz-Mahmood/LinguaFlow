import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import DailyFlowContainer from './components/DailyFlowContainer';
import SignIn from './components/SignIn';
import { apiFetch, clearToken, fetchMe, getToken } from './lib/api';

const VIEW_STATES = {
  AUTH: 'auth',
  ONBOARDING: 'onboarding',
  FLOW: 'flow',
};

export default function App() {
  const [viewState, setViewState] = useState(VIEW_STATES.AUTH);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootstrap();
  }, []);

  const routeForUser = (authUser, needsOnboarding) => {
    setUser(authUser);
    if (needsOnboarding || !authUser?.onboardingCompleted) {
      setViewState(VIEW_STATES.ONBOARDING);
    } else {
      setViewState(VIEW_STATES.FLOW);
    }
  };

  const bootstrap = async () => {
    try {
      if (!getToken()) {
        setViewState(VIEW_STATES.AUTH);
        return;
      }

      const me = await fetchMe();
      routeForUser(me.user, me.needsOnboarding);
    } catch {
      clearToken();
      setViewState(VIEW_STATES.AUTH);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (data) => {
    routeForUser(data.user, data.needsOnboarding);
  };

  const handleOnboardingComplete = (updatedUser) => {
    setUser(updatedUser);
    setViewState(VIEW_STATES.FLOW);
  };

  const handleSignOut = () => {
    clearToken();
    setUser(null);
    setViewState(VIEW_STATES.AUTH);
  };

  const resetSession = async () => {
    if (
      confirm(
        "Reset today's flow progress? This will delete flashcards mined today and reset scores.",
      )
    ) {
      setLoading(true);
      try {
        await apiFetch('/api/user/onboard', {
          method: 'POST',
          body: JSON.stringify({
            target_language: user?.targetLanguage || 'Spanish',
            native_language: user?.nativeLanguage || 'English',
            current_level: user?.currentLevel || 'A1',
            daily_commitment: user?.dailyCommitment || 20,
            strategy_preference: user?.strategyPreference || 'input-heavy',
            goals: user?.goals || [],
          }),
        });
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
      <div
        className="app-container"
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <div className="logo" style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}>
          🌊 LinguaFlow
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Loading Daily Flow Engine...
        </p>
      </div>
    );
  }

  if (viewState === VIEW_STATES.AUTH) {
    return <SignIn onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-container">
      <header className="header" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div className="logo" onClick={bootstrap} style={{ cursor: 'pointer' }}>
          🌊 LinguaFlow
        </div>

        {viewState !== VIEW_STATES.ONBOARDING && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={resetSession}
            >
              Reset Session
            </button>
            <button
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={() => setViewState(VIEW_STATES.ONBOARDING)}
            >
              Set Profile
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={handleSignOut}
            >
              Sign out
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

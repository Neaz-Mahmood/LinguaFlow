import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { HStack } from '@astryxdesign/core/Layout';
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
    toast.success('Signed out');
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
          LinguaFlow
        </div>
        <Text type="supporting" color="secondary" as="p">
          Loading Daily Flow Engine...
        </Text>
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
          LinguaFlow
        </div>

        {viewState !== VIEW_STATES.ONBOARDING && (
          <HStack gap={2}>
            <Button label="Reset Session" variant="secondary" size="sm" onClick={resetSession} />
            <Button
              label="Set Profile"
              variant="primary"
              size="sm"
              onClick={() => setViewState(VIEW_STATES.ONBOARDING)}
            />
            <Button label="Sign out" variant="secondary" size="sm" onClick={handleSignOut} />
          </HStack>
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

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@astryxdesign/core/Text';
import Onboarding from './features/onboarding/Onboarding';
import DailyFlowContainer from './features/daily-flow/DailyFlowContainer';
import SignIn from './features/auth/SignIn';
import Pricing from './features/pricing/Pricing';
import Home from './features/home/Home';
import LandingPage from './features/landing/LandingPage';
import AppLayout from './components/layout/AppLayout';
import { useAuthSession, VIEW_STATES } from './hooks/useAuthSession';

export default function App() {
  const { t } = useTranslation();
  const {
    viewState,
    user,
    loading,
    bootstrap,
    handleAuthSuccess,
    handleOnboardingComplete,
    handleSignOut,
    resetSession,
    openOnboarding,
  } = useAuthSession();

  const [activePage, setActivePage] = useState('landing'); // 'landing' | 'pricing' | 'signin' | 'home' | 'flow'

  if (loading) {
    return (
      <div
        className="app-container"
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <div className="logo" style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}>
          {t('common.brand')}
        </div>
        <Text type="supporting" color="secondary" as="p">
          {t('common.loadingEngine')}
        </Text>
      </div>
    );
  }

  // Active view routing logic
  if (activePage === 'pricing') {
    return (
      <Pricing
        onNavigateHome={() => setActivePage('landing')}
        onNavigateToSignIn={() => setActivePage('signin')}
        onNavigateToSignUp={() => setActivePage('signin')}
      />
    );
  }

  if (activePage === 'signin' || (viewState === VIEW_STATES.AUTH && activePage !== 'landing')) {
    return (
      <SignIn
        onSuccess={(data) => {
          handleAuthSuccess(data);
          setActivePage('home');
        }}
        onNavigateToPricing={() => setActivePage('pricing')}
      />
    );
  }

  if (viewState === VIEW_STATES.AUTH && activePage === 'landing') {
    return (
      <LandingPage
        onStartLearning={() => setActivePage('signin')}
        onNavigateToSignIn={() => setActivePage('signin')}
        onNavigateToSignUp={() => setActivePage('signin')}
        onNavigateToPricing={() => setActivePage('pricing')}
      />
    );
  }

  if (viewState === VIEW_STATES.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (activePage === 'home' || activePage === 'landing') {
    return (
      <Home
        user={user}
        onStartLearning={() => setActivePage('flow')}
        onNavigateToPricing={() => setActivePage('pricing')}
        onNavigateToSignIn={() => handleSignOut()}
        onNavigateToSignUp={() => handleSignOut()}
      />
    );
  }

  return (
    <AppLayout
      onBootstrap={() => setActivePage('home')}
      onSignOut={() => {
        handleSignOut();
        setActivePage('landing');
      }}
      resetSession={resetSession}
      openOnboarding={openOnboarding}
      onNavigateToPricing={() => setActivePage('pricing')}
    >
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setActivePage('home')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--lf-deep-navy)',
            fontFamily: 'var(--font-family-body)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
            padding: 0,
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
      <DailyFlowContainer onResetProfile={openOnboarding} />
    </AppLayout>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@astryxdesign/core/Text';
import Onboarding from './features/onboarding/Onboarding';
import DailyFlowContainer from './features/daily-flow/DailyFlowContainer';
import SignIn from './features/auth/SignIn';
import AppLayout from './components/layout/AppLayout';
import { useAuthSession, VIEW_STATES } from './hooks/useAuthSession';

export default function App() {
  const { t } = useTranslation();
  const {
    viewState,
    loading,
    bootstrap,
    handleAuthSuccess,
    handleOnboardingComplete,
    handleSignOut,
    resetSession,
    openOnboarding,
  } = useAuthSession();

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

  if (viewState === VIEW_STATES.AUTH) {
    return <SignIn onSuccess={handleAuthSuccess} />;
  }

  if (viewState === VIEW_STATES.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <AppLayout
      onBootstrap={bootstrap}
      onSignOut={handleSignOut}
      resetSession={resetSession}
      openOnboarding={openOnboarding}
    >
      <DailyFlowContainer onResetProfile={openOnboarding} />
    </AppLayout>
  );
}

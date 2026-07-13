import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { HStack } from '@astryxdesign/core/Layout';
import Onboarding from './features/onboarding/Onboarding';
import DailyFlowContainer from './features/daily-flow/DailyFlowContainer';
import SignIn from './features/auth/SignIn';
import PreferencesControls from './features/preferences/PreferencesControls';
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

  return (
    <div className="app-container">
      <header className="header" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div className="logo" onClick={bootstrap} style={{ cursor: 'pointer' }}>
          {t('common.brand')}
        </div>

        {viewState !== VIEW_STATES.ONBOARDING && (
          <HStack gap={2}>
            <PreferencesControls compact />
            <Button
              label={t('common.resetSession')}
              variant="secondary"
              size="sm"
              onClick={resetSession}
            />
            <Button
              label={t('common.setProfile')}
              variant="primary"
              size="sm"
              onClick={openOnboarding}
            />
            <Button
              label={t('common.signOut')}
              variant="secondary"
              size="sm"
              onClick={handleSignOut}
            />
          </HStack>
        )}
      </header>

      <main style={{ flex: 1 }}>
        {viewState === VIEW_STATES.ONBOARDING && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}

        {viewState === VIEW_STATES.FLOW && (
          <DailyFlowContainer onResetProfile={openOnboarding} />
        )}
      </main>
    </div>
  );
}

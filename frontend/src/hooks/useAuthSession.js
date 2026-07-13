import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { apiFetch, clearToken, fetchMe, getToken } from '../lib/api';
import { usePreferences } from './usePreferences';

/** @type {Record<string, import('../model/auth').ViewState>} */
export const VIEW_STATES = {
  AUTH: 'auth',
  ONBOARDING: 'onboarding',
  FLOW: 'flow',
};

export function useAuthSession() {
  const { t } = useTranslation();
  const { applyFromUser } = usePreferences();
  const [viewState, setViewState] = useState(VIEW_STATES.AUTH);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const routeForUser = useCallback(
    (authUser, needsOnboarding) => {
      setUser(authUser);
      applyFromUser(authUser);
      if (needsOnboarding || !authUser?.onboardingCompleted) {
        setViewState(VIEW_STATES.ONBOARDING);
      } else {
        setViewState(VIEW_STATES.FLOW);
      }
    },
    [applyFromUser],
  );

  const bootstrap = useCallback(async () => {
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
  }, [routeForUser]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const handleAuthSuccess = useCallback(
    (data) => {
      routeForUser(data.user, data.needsOnboarding);
    },
    [routeForUser],
  );

  const handleOnboardingComplete = useCallback(
    (updatedUser) => {
      setUser(updatedUser);
      applyFromUser(updatedUser);
      setViewState(VIEW_STATES.FLOW);
    },
    [applyFromUser],
  );

  const handleSignOut = useCallback(() => {
    clearToken();
    setUser(null);
    setViewState(VIEW_STATES.AUTH);
    toast.success(t('auth.signedOut'));
  }, [t]);

  const resetSession = useCallback(async () => {
    if (!confirm(t('app.resetConfirm'))) return;

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
  }, [t, user]);

  const openOnboarding = useCallback(() => {
    setViewState(VIEW_STATES.ONBOARDING);
  }, []);

  return {
    viewState,
    user,
    loading,
    bootstrap,
    handleAuthSuccess,
    handleOnboardingComplete,
    handleSignOut,
    resetSession,
    openOnboarding,
    VIEW_STATES,
  };
}

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import {
  configureGoogleAuth,
  fetchMe,
  getStoredToken,
  signInWithEmail,
  signInWithGoogleNative,
  signOut,
  signUpWithEmail,
} from '../lib/authService';
import { AuthMode, AuthUser, ViewState } from '../model';
import { usePreferences } from './usePreferences';

export function useAuthSession() {
  const { t } = useTranslation();
  const { ready, applyFromUser } = usePreferences();
  const [view, setView] = useState<ViewState>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    configureGoogleAuth();
  }, []);

  const routeForAuth = useCallback(
    (authUser: AuthUser, needsOnboarding: boolean) => {
      setUser(authUser);
      applyFromUser(authUser);
      setView(
        needsOnboarding || !authUser.onboardingCompleted ? 'onboarding' : 'flow',
      );
    },
    [applyFromUser],
  );

  const bootstrap = useCallback(async () => {
    try {
      const token = await getStoredToken();
      if (!token) {
        setView('auth');
        return;
      }

      const me = await fetchMe(token);
      routeForAuth(me.user, me.needsOnboarding);
    } catch {
      await signOut();
      setView('auth');
    }
  }, [routeForAuth]);

  useEffect(() => {
    if (!ready) return;
    bootstrap();
  }, [ready, bootstrap]);

  const handleGoogleSignIn = useCallback(async () => {
    setSigningIn(true);
    try {
      const result = await signInWithGoogleNative();
      Toast.show({
        type: 'success',
        text1: t('auth.signedInSuccess'),
      });
      routeForAuth(result.user, result.needsOnboarding);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: t('auth.signInFailed'),
        text2: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSigningIn(false);
    }
  }, [routeForAuth, t]);

  const handleEmailAuth = useCallback(
    async (
      mode: AuthMode,
      payload: { email: string; password: string; name?: string },
    ) => {
      setSigningIn(true);
      try {
        const result =
          mode === 'signup'
            ? await signUpWithEmail(payload.email, payload.password, payload.name ?? '')
            : await signInWithEmail(payload.email, payload.password);
        Toast.show({
          type: 'success',
          text1:
            mode === 'signup' ? t('auth.accountCreated') : t('auth.signedInSuccess'),
        });
        routeForAuth(result.user, result.needsOnboarding);
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: mode === 'signup' ? t('auth.authFailed') : t('auth.signInFailed'),
          text2: err instanceof Error ? err.message : undefined,
        });
      } finally {
        setSigningIn(false);
      }
    },
    [routeForAuth, t],
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
    setView('auth');
    Toast.show({
      type: 'success',
      text1: t('auth.signedOut'),
    });
  }, [t]);

  const completeOnboarding = useCallback(() => {
    setView('flow');
  }, []);

  return {
    ready,
    view,
    user,
    signingIn,
    handleGoogleSignIn,
    handleEmailAuth,
    handleSignOut,
    completeOnboarding,
  };
}

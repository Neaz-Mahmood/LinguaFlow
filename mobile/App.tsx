import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import './src/i18n';
import { AuthUser } from './src/lib/api';
import {
  configureGoogleAuth,
  fetchMe,
  getStoredToken,
  signInWithEmail,
  signInWithGoogleNative,
  signOut,
  signUpWithEmail,
} from './src/lib/authService';
import SignInScreen from './src/screens/SignInScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DailyFlowScreen from './src/screens/DailyFlowScreen';
import { PreferencesProvider, usePreferences } from './src/preferences/PreferencesProvider';
import { ThemeProvider, useAppTheme } from './src/theme';

type ViewState = 'loading' | 'auth' | 'onboarding' | 'flow';

function AppShell() {
  const { t } = useTranslation();
  const { colorScheme, colors } = useAppTheme();
  const { ready, applyFromUser } = usePreferences();
  const [view, setView] = useState<ViewState>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    configureGoogleAuth();
  }, []);

  useEffect(() => {
    if (!ready) return;
    bootstrap();
  }, [ready]);

  const routeForAuth = (authUser: AuthUser, needsOnboarding: boolean) => {
    setUser(authUser);
    applyFromUser(authUser);
    setView(
      needsOnboarding || !authUser.onboardingCompleted ? 'onboarding' : 'flow',
    );
  };

  const bootstrap = async () => {
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
  };

  const handleGoogleSignIn = async () => {
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
  };

  const handleEmailAuth = async (
    mode: 'signin' | 'signup',
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
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setView('auth');
    Toast.show({
      type: 'success',
      text1: t('auth.signedOut'),
    });
  };

  const statusStyle = colorScheme === 'dark' ? 'light' : 'dark';

  if (!ready || view === 'loading') {
    return (
      <View style={[styles.loading, { backgroundColor: colors.backgroundBody }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <StatusBar style={statusStyle} />
      </View>
    );
  }

  return (
    <>
      {view === 'auth' ? (
        <>
          <SignInScreen
            loading={signingIn}
            onGoogleSignIn={handleGoogleSignIn}
            onEmailAuth={handleEmailAuth}
          />
          <StatusBar style={statusStyle} />
        </>
      ) : null}

      {view === 'onboarding' && user ? (
        <>
          <OnboardingScreen
            user={user}
            onComplete={() => setView('flow')}
            onSignOut={handleSignOut}
          />
          <StatusBar style={statusStyle} />
        </>
      ) : null}

      {view === 'flow' && user ? (
        <>
          <DailyFlowScreen user={user} onSignOut={handleSignOut} />
          <StatusBar style={statusStyle} />
        </>
      ) : null}

      <Toast />
    </>
  );
}

function ThemedRoot() {
  const { themeMode } = usePreferences();
  return (
    <ThemeProvider themeMode={themeMode}>
      <AppShell />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <ThemedRoot />
    </PreferencesProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

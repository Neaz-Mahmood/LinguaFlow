import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
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
import { theme } from './src/theme';

type ViewState = 'loading' | 'auth' | 'onboarding' | 'flow';

export default function App() {
  const [view, setView] = useState<ViewState>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    configureGoogleAuth();
    bootstrap();
  }, []);

  const routeForAuth = (authUser: AuthUser, needsOnboarding: boolean) => {
    setUser(authUser);
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
        text1: 'Signed in successfully',
      });
      routeForAuth(result.user, result.needsOnboarding);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Google sign-in failed',
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
          mode === 'signup'
            ? 'Account created successfully'
            : 'Signed in successfully',
      });
      routeForAuth(result.user, result.needsOnboarding);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: mode === 'signup' ? 'Sign-up failed' : 'Sign-in failed',
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
      text1: 'Signed out',
    });
  };

  return (
    <>
      {view === 'loading' ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <StatusBar style="light" />
        </View>
      ) : null}

      {view === 'auth' ? (
        <>
          <SignInScreen
            loading={signingIn}
            onGoogleSignIn={handleGoogleSignIn}
            onEmailAuth={handleEmailAuth}
          />
          <StatusBar style="light" />
        </>
      ) : null}

      {view === 'onboarding' && user ? (
        <>
          <OnboardingScreen
            user={user}
            onComplete={() => setView('flow')}
            onSignOut={handleSignOut}
          />
          <StatusBar style="light" />
        </>
      ) : null}

      {view === 'flow' && user ? (
        <>
          <DailyFlowScreen user={user} onSignOut={handleSignOut} />
          <StatusBar style="light" />
        </>
      ) : null}

      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.colors.backgroundBody,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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

type ViewState = 'loading' | 'auth' | 'onboarding' | 'flow';

export default function App() {
  const [view, setView] = useState<ViewState>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      const result = await signInWithGoogleNative();
      routeForAuth(result.user, result.needsOnboarding);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setSigningIn(false);
    }
  };

  const handleEmailAuth = async (
    mode: 'signin' | 'signup',
    email: string,
    password: string,
  ) => {
    if (!email || password.length < 8) {
      setError('Enter a valid email and a password of at least 8 characters.');
      return;
    }

    setSigningIn(true);
    setError(null);
    try {
      const result =
        mode === 'signup'
          ? await signUpWithEmail(email, password)
          : await signInWithEmail(email, password);
      routeForAuth(result.user, result.needsOnboarding);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : mode === 'signup'
            ? 'Sign-up failed'
            : 'Sign-in failed',
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setView('auth');
  };

  if (view === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7dd3c7" />
        <StatusBar style="light" />
      </View>
    );
  }

  if (view === 'auth') {
    return (
      <>
        <SignInScreen
          loading={signingIn}
          error={error}
          onGoogleSignIn={handleGoogleSignIn}
          onEmailAuth={handleEmailAuth}
        />
        <StatusBar style="light" />
      </>
    );
  }

  if (view === 'onboarding' && user) {
    return (
      <>
        <OnboardingScreen
          user={user}
          onComplete={() => setView('flow')}
          onSignOut={handleSignOut}
        />
        <StatusBar style="dark" />
      </>
    );
  }

  if (user) {
    return (
      <>
        <DailyFlowScreen user={user} onSignOut={handleSignOut} />
        <StatusBar style="light" />
      </>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#0b1f2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

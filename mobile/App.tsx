import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import './src/i18n';
import SignInScreen from './src/features/auth/SignInScreen';
import OnboardingScreen from './src/features/onboarding/OnboardingScreen';
import DailyFlowScreen from './src/features/daily-flow/DailyFlowScreen';
import { AppLayout } from './src/components/layout';
import { PreferencesProvider } from './src/features/preferences/PreferencesProvider';
import { ThemeProvider } from './src/theme';
import { useAppTheme } from './src/hooks/useAppTheme';
import { usePreferences } from './src/hooks/usePreferences';
import { useAuthSession } from './src/hooks/useAuthSession';

function AppShell() {
  const { colorScheme, colors } = useAppTheme();
  const {
    ready,
    view,
    user,
    signingIn,
    handleGoogleSignIn,
    handleEmailAuth,
    handleSignOut,
    completeOnboarding,
  } = useAuthSession();

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
            onComplete={completeOnboarding}
            onSignOut={handleSignOut}
          />
          <StatusBar style={statusStyle} />
        </>
      ) : null}

      {view === 'flow' && user ? (
        <>
          <AppLayout onSignOut={handleSignOut}>
            <DailyFlowScreen user={user} />
          </AppLayout>
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

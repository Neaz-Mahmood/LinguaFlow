import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import { apiFetch, AuthUser } from './api';

const TOKEN_KEY = 'linguaflow_access_token';

export type GoogleAuthResult = {
  accessToken: string;
  user: AuthUser;
  needsOnboarding: boolean;
};

export type EmailAuthResult = GoogleAuthResult;

export function configureGoogleAuth() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    offlineAccess: true,
  });
}

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function storeToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function signInWithGoogleNative(): Promise<GoogleAuthResult> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();
  const idToken =
    (response as { data?: { idToken?: string | null } }).data?.idToken ??
    (response as { idToken?: string | null }).idToken;

  if (!idToken) {
    throw new Error('No Identity Token returned from Google.');
  }

  const data = await apiFetch<GoogleAuthResult>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });

  await storeToken(data.accessToken);
  return data;
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<EmailAuthResult> {
  const data = await apiFetch<EmailAuthResult>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await storeToken(data.accessToken);
  return data;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<EmailAuthResult> {
  const data = await apiFetch<EmailAuthResult>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await storeToken(data.accessToken);
  return data;
}

export async function fetchMe(token: string) {
  return apiFetch<{ user: AuthUser; needsOnboarding: boolean }>(
    '/api/auth/me',
    {},
    token,
  );
}

export async function signOut(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignore Google sign-out failures when already signed out.
  }
  await clearToken();
}

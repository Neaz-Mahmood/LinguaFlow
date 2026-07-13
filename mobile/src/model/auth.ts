export type AuthUser = {
  id: number;
  email: string | null;
  name: string | null;
  onboardingCompleted: boolean;
  targetLanguage?: string;
  nativeLanguage?: string;
  currentLevel?: string;
  goals?: string[];
  uiLocale?: string;
  themeMode?: string;
};

export type ViewState = 'loading' | 'auth' | 'onboarding' | 'flow';

export type GoogleAuthResult = {
  accessToken: string;
  user: AuthUser;
  needsOnboarding: boolean;
};

export type EmailAuthResult = GoogleAuthResult;

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
};

export type AuthMode = 'signin' | 'signup';

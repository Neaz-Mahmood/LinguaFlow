const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export type AuthUser = {
  id: number;
  email: string | null;
  name: string | null;
  onboardingCompleted: boolean;
  targetLanguage?: string;
  nativeLanguage?: string;
  currentLevel?: string;
  goals?: string[];
};

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

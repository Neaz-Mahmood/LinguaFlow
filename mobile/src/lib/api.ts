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
  uiLocale?: string;
  themeMode?: string;
};

function parseErrorMessage(text: string, status: number): string {
  try {
    const json = JSON.parse(text) as { message?: string | string[] };
    if (typeof json.message === 'string') return json.message;
    if (Array.isArray(json.message)) return json.message.join(', ');
  } catch {
    // fall through
  }
  return text || `Request failed: ${status}`;
}

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
    throw new Error(parseErrorMessage(text, res.status));
  }

  return res.json() as Promise<T>;
}

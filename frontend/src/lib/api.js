const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'linguaflow_access_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
  }

  return res;
}

export async function signInWithGoogleIdToken(idToken) {
  const res = await apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Google sign-in failed');
  }

  const data = await res.json();
  setToken(data.accessToken);
  return data;
}

async function parseAuthError(res, fallback) {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (typeof json.message === 'string') return json.message;
    if (Array.isArray(json.message)) return json.message.join(', ');
  } catch {
    // fall through
  }
  return text || fallback;
}

export async function signUpWithEmail(email, password) {
  const res = await apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseAuthError(res, 'Sign-up failed'));
  }

  const data = await res.json();
  setToken(data.accessToken);
  return data;
}

export async function signInWithEmail(email, password) {
  const res = await apiFetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseAuthError(res, 'Sign-in failed'));
  }

  const data = await res.json();
  setToken(data.accessToken);
  return data;
}

export async function fetchMe() {
  const res = await apiFetch('/api/auth/me');
  if (!res.ok) {
    throw new Error('Not authenticated');
  }
  return res.json();
}

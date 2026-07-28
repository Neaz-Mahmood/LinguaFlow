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

export async function signUpWithEmail(email, password, name) {
  const res = await apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
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

export async function updatePreferences(prefs) {
  const res = await apiFetch('/api/user/preferences', {
    method: 'PATCH',
    body: JSON.stringify(prefs),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update preferences');
  }

  return res.json();
}

export async function fetchQuota() {
  const res = await apiFetch('/api/voice/quota');
  if (!res.ok) throw new Error('Failed to fetch quota');
  return res.json();
}

export async function createCheckoutSession(plan) {
  const res = await apiFetch('/api/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) throw new Error('Failed to create checkout session');
  return res.json();
}

export async function openBillingPortal() {
  const res = await apiFetch('/api/billing/portal', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to open billing portal');
  return res.json();
}

export async function createVoiceSession(mode = 'standard') {
  const res = await apiFetch('/api/voice/sessions', {
    method: 'POST',
    body: JSON.stringify({ mode }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.message || 'Failed to create voice session');
    err.status = res.status;
    err.code = data.code;
    throw err;
  }
  return res.json();
}

export async function sendVoiceTurn(sessionId, audioBlob, clientTurnId) {
  const form = new FormData();
  form.append('audio', audioBlob, 'turn.webm');
  form.append('clientTurnId', clientTurnId);
  const res = await apiFetch(`/api/voice/sessions/${sessionId}/turns`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.message || 'Voice turn failed');
    err.status = res.status;
    err.code = data.code;
    throw err;
  }
  return res.json();
}

export async function endVoiceSession(sessionId, reason = 'user') {
  const res = await apiFetch(`/api/voice/sessions/${sessionId}/end`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('Failed to end voice session');
  return res.json();
}

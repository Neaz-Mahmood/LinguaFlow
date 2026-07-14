import {
  ConversationMessagePair,
  ConversationSession,
} from '../model/conversation';
import { apiFetch } from './api';
import { getStoredToken } from './authService';

async function authenticated<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getStoredToken();
  if (!token) {
    throw new Error('Your session expired. Please sign in again.');
  }
  return apiFetch<T>(path, options, token);
}

export function createOrResumeConversation(): Promise<ConversationSession> {
  return authenticated('/api/conversation-sessions', { method: 'POST' });
}

export function getConversation(id: string): Promise<ConversationSession> {
  return authenticated(`/api/conversation-sessions/${id}`);
}

export function sendConversationMessage(
  id: string,
  text: string,
  clientMessageId: string,
): Promise<ConversationMessagePair> {
  return authenticated(`/api/conversation-sessions/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text, clientMessageId }),
  });
}

export function finalizeConversation(
  id: string,
): Promise<{ id: string; status: ConversationSession['status'] }> {
  return authenticated(`/api/conversation-sessions/${id}/finalize`, {
    method: 'POST',
  });
}

export function mineConversationCorrection(
  id: string,
  correctionId: string,
): Promise<{ id: number }> {
  return authenticated(
    `/api/conversation-sessions/${id}/corrections/${encodeURIComponent(correctionId)}/mine`,
    { method: 'POST' },
  );
}

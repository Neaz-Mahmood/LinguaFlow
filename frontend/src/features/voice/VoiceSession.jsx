import React, { useState, useRef, useCallback } from 'react';
import { createVoiceSession, sendVoiceTurn } from '../../lib/api';
import { useSubscription } from '../../context/SubscriptionProvider';
import UpgradePrompt from '../paywall/UpgradePrompt';

const STATE = { IDLE: 'idle', CONNECTING: 'connecting', LISTENING: 'listening', THINKING: 'thinking', SPEAKING: 'speaking', ERROR: 'error' };

export default function VoiceSession({ language = 'Spanish', onEnd }) {
  const { quota } = useSubscription();
  const [uiState, setUiState] = useState(STATE.IDLE);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const sessionRef = useRef(null);
  const recognitionRef = useRef(null);

  const startSession = useCallback(async () => {
    if (quota && quota.minutesRemaining <= 0) {
      setShowUpgrade(true);
      return;
    }
    setUiState(STATE.CONNECTING);
    setError(null);
    try {
      const session = await createVoiceSession({ language });
      sessionRef.current = session;
      startListening();
    } catch (e) {
      setError(e.message || 'Failed to start session');
      setUiState(STATE.ERROR);
    }
  }, [language, quota]);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      setUiState(STATE.ERROR);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = sessionRef.current?.locale || 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setUiState(STATE.LISTENING);
    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') {
        setError(`Recognition error: ${e.error}`);
        setUiState(STATE.ERROR);
      }
    };
    recognition.onresult = async (e) => {
      const userText = e.results[0][0].transcript;
      setTranscript((t) => [...t, { role: 'user', text: userText }]);
      setUiState(STATE.THINKING);
      try {
        const { reply } = await sendVoiceTurn({ sessionId: sessionRef.current.sessionId, text: userText });
        setTranscript((t) => [...t, { role: 'assistant', text: reply }]);
        speak(reply);
      } catch (err) {
        if (err.status === 402) { setShowUpgrade(true); setUiState(STATE.IDLE); return; }
        setError(err.message || 'Failed to get reply');
        setUiState(STATE.ERROR);
      }
    };
    recognition.start();
  }, []);

  const speak = useCallback((text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setUiState(STATE.SPEAKING);
    utterance.onend = () => startListening();
    utterance.onerror = () => startListening();
    window.speechSynthesis.speak(utterance);
  }, [startListening]);

  const endSession = useCallback(() => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    sessionRef.current = null;
    setUiState(STATE.IDLE);
    onEnd?.();
  }, [onEnd]);

  const stateLabel = {
    [STATE.IDLE]: 'Tap to start',
    [STATE.CONNECTING]: 'Connecting…',
    [STATE.LISTENING]: 'Listening…',
    [STATE.THINKING]: 'Thinking…',
    [STATE.SPEAKING]: 'Speaking…',
    [STATE.ERROR]: 'Error',
  }[uiState];

  const isActive = uiState !== STATE.IDLE && uiState !== STATE.ERROR;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem 1rem' }}>
      {showUpgrade && <UpgradePrompt reason="quota" onDismiss={() => setShowUpgrade(false)} />}

      <button
        type="button"
        onClick={isActive ? endSession : startSession}
        disabled={uiState === STATE.CONNECTING}
        style={{
          width: 96, height: 96, borderRadius: '50%',
          backgroundColor: uiState === STATE.LISTENING ? 'var(--lf-coral)' : 'var(--lf-deep-navy)',
          border: 'none', cursor: uiState === STATE.CONNECTING ? 'wait' : 'pointer',
          fontSize: '2.5rem', color: '#fff',
          boxShadow: uiState === STATE.LISTENING ? '0 0 0 12px rgba(255,99,71,0.2)' : '0 4px 16px rgba(0,0,0,0.15)',
          transition: 'all 0.2s',
        }}
        aria-label={isActive ? 'End session' : 'Start voice session'}
      >
        {isActive ? '⏹' : '🎙️'}
      </button>

      <p style={{ margin: 0, color: 'var(--lf-on-surface-variant)', fontSize: '0.95rem' }}>{stateLabel}</p>

      {error && (
        <p style={{ margin: 0, color: 'var(--lf-coral)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>
      )}

      {transcript.length > 0 && (
        <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {transcript.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? 'var(--lf-deep-navy)' : 'var(--lf-surface-variant)',
                color: msg.role === 'user' ? '#fff' : 'var(--lf-on-surface)',
                padding: '0.65rem 1rem', borderRadius: '12px',
                maxWidth: '80%', fontSize: '0.95rem', lineHeight: 1.5,
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

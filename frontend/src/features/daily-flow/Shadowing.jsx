import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { apiFetch } from '../../lib/api';

export default function Shadowing({ onComplete }) {
  const { t } = useTranslation();
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [evaluation, setEvaluation] = useState(null);
  const [typedTranscript, setTypedTranscript] = useState('');
  const [showSimInput, setShowSimInput] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchStoriesAndSentences();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fetchStoriesAndSentences = async () => {
    try {
      const res = await apiFetch('/api/stories');
      if (res.ok) {
        const stories = await res.json();
        if (stories.length > 0) {
          const storySentences = stories[0].sentences || [];
          setSentences(storySentences);
        }
      }
    } catch (err) {
      console.error('Error fetching sentences:', err);
    }
  };

  const speakSentence = () => {
    if (sentences.length === 0) return;
    const target = sentences[currentIndex].target;
    const utterance = new SpeechSynthesisUtterance(target);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    setEvaluation(null);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        submitEvaluation(audioBlob, null);
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.warn(t('shadowing.micDenied'), err);
      setShowSimInput(true);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const submitEvaluation = async (blob, transcriptOverride) => {
    const target = sentences[currentIndex].target;
    const formData = new FormData();
    formData.append('target_sentence', target);

    if (blob) {
      formData.append('audio', blob, 'recording.wav');
    }
    if (transcriptOverride) {
      formData.append('transcript', transcriptOverride);
    }

    try {
      const res = await apiFetch('/api/shadowing/evaluate', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setEvaluation(data);
      }
    } catch (err) {
      console.error('Evaluation error:', err);
    }
  };

  const handleSimulatedSubmit = () => {
    if (!typedTranscript.trim()) return;
    submitEvaluation(null, typedTranscript);
    setTypedTranscript('');
  };

  const handleNextSentence = () => {
    setEvaluation(null);
    setAudioUrl(null);
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleCompleteShadowing();
    }
  };

  const handleCompleteShadowing = async () => {
    try {
      const avgScore = evaluation ? evaluation.score : 85;
      await apiFetch('/api/flow-session/update', {
        method: 'POST',
        body: JSON.stringify({
          shadowing_completed: true,
          shadowing_score: avgScore,
        }),
      });
    } catch (err) {
      console.error(err);
    }
    onComplete();
  };

  if (sentences.length === 0) {
    return (
      <div className="lf-card">
        <Text display="block" justify="center">
          {t('shadowing.loading')}
        </Text>
      </div>
    );
  }

  const currentSentence = sentences[currentIndex];

  return (
    <div className="lf-card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <Heading level={2}>{t('shadowing.title')}</Heading>
      <Text type="supporting" color="secondary" as="p" display="block" justify="center">
        {t('shadowing.subtitle')}
      </Text>

      <div className="shadowing-prompt">
        <Button label={t('shadowing.listen')} variant="secondary" size="sm" onClick={speakSentence} />
        <Text type="large" display="block" weight="medium">
          &quot;{currentSentence.target}&quot;
        </Text>
        <Text type="supporting" color="secondary" display="block">
          ({currentSentence.english})
        </Text>
      </div>

      <div className="voice-recording-area">
        <div className="record-btn-container">
          <button
            type="button"
            className={`record-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            aria-label={isRecording ? t('shadowing.stopRecording') : t('shadowing.startRecording')}
          >
            🎤
          </button>
          <div className="record-pulse-ring"></div>
        </div>

        <div
          className="recording-status"
          style={{
            color: isRecording ? 'var(--color-error)' : 'var(--color-text-secondary)',
          }}
        >
          {isRecording
            ? t('shadowing.recording', { seconds: recordingSeconds })
            : t('shadowing.clickMic')}
        </div>
      </div>

      {showSimInput && (
        <div className="feedback-box">
          <VStack gap={2}>
            <Text type="label" weight="semibold" display="block">
              {t('shadowing.simulatorTitle')}
            </Text>
            <HStack gap={2}>
              <div style={{ flex: 1 }}>
                <TextInput
                  label={t('shadowing.transcript')}
                  isLabelHidden
                  value={typedTranscript}
                  onChange={setTypedTranscript}
                  placeholder={t('shadowing.transcriptPlaceholder')}
                />
              </div>
              <Button
                label={t('shadowing.evaluate')}
                variant="primary"
                onClick={handleSimulatedSubmit}
              />
            </HStack>
            <Button
              label={t('shadowing.autoFill')}
              variant="ghost"
              size="sm"
              onClick={() => setTypedTranscript(currentSentence.target)}
            />
          </VStack>
        </div>
      )}

      {audioUrl && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <audio src={audioUrl} controls style={{ width: '100%', maxWidth: '300px' }} />
        </div>
      )}

      {evaluation && (
        <div style={{ animation: 'fadeIn 0.3s ease-out', marginTop: '1rem' }}>
          <div className="shadowing-score-display">
            <div
              className={`score-circle ${evaluation.score >= 80 ? 'excellent' : evaluation.score < 50 ? 'needs-work' : ''}`}
            >
              {evaluation.score}%
            </div>
            <Text type="supporting" color="secondary">
              {t('shadowing.accuracyScore')}
            </Text>
          </div>

          <div className="feedback-sentence">
            {evaluation.feedback.map((item, idx) => (
              <span key={idx} className={`feedback-word ${item.status}`}>
                {item.word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="btn-row" style={{ marginTop: '2.5rem' }}>
        <Button
          label={showSimInput ? t('shadowing.hideSimulator') : t('shadowing.simulatorMode')}
          variant="secondary"
          onClick={() => setShowSimInput(!showSimInput)}
        />
        <Button
          label={
            currentIndex < sentences.length - 1
              ? t('shadowing.nextSentence')
              : t('shadowing.complete')
          }
          variant="primary"
          onClick={handleNextSentence}
        />
      </div>
    </div>
  );
}

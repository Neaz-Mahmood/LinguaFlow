import React, { useState, useEffect, useRef } from 'react';

export default function Shadowing({ onComplete }) {
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [evaluation, setEvaluation] = useState(null);
  const [typedTranscript, setTypedTranscript] = useState("");
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
      const res = await fetch("http://localhost:8000/api/stories");
      if (res.ok) {
        const stories = await res.json();
        if (stories.length > 0) {
          // Flatten sentences from the current story
          const storySentences = stories[0].sentences || [];
          setSentences(storySentences);
        }
      }
    } catch (err) {
      console.error("Error fetching sentences:", err);
    }
  };

  const speakSentence = () => {
    if (sentences.length === 0) return;
    const target = sentences[currentIndex].target;
    const utterance = new SpeechSynthesisUtterance(target);
    utterance.lang = 'es-ES'; // Spanish voice
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    setEvaluation(null);

    // Setup timer
    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
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
        
        // Auto-submit audio to backend
        submitEvaluation(audioBlob, null);
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.warn("Microphone access denied or unavailable. Fallback to simulator text mode enabled.", err);
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
      // Stop all tracks on the stream to release the mic
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const submitEvaluation = async (blob, transcriptOverride) => {
    const target = sentences[currentIndex].target;
    const formData = new FormData();
    formData.append("target_sentence", target);
    
    if (blob) {
      formData.append("audio", blob, "recording.wav");
    }
    if (transcriptOverride) {
      formData.append("transcript", transcriptOverride);
    }

    try {
      const res = await fetch("http://localhost:8000/api/shadowing/evaluate", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setEvaluation(data);
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    }
  };

  const handleSimulatedSubmit = () => {
    if (!typedTranscript.trim()) return;
    submitEvaluation(null, typedTranscript);
    setTypedTranscript("");
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
      await fetch("http://localhost:8000/api/flow-session/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          shadowing_completed: true,
          shadowing_score: avgScore
        })
      });
    } catch (err) {
      console.error(err);
    }
    onComplete();
  };

  if (sentences.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center' }}>Loading shadowing materials...</p>
      </div>
    );
  }

  const currentSentence = sentences[currentIndex];

  return (
    <div className="card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <h2 className="story-title" style={{ marginBottom: '0.25rem' }}>Shadowing Practice</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        Listen to the native sentence, click record, and repeat it aloud (Arguelles Shadowing).
      </p>

      <div className="shadowing-prompt">
        <button className="play-sentence-btn" onClick={speakSentence}>
          🔊 Listen Sentence
        </button>
        <div style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
          "{currentSentence.target}"
        </div>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          ({currentSentence.english})
        </div>
      </div>

      <div className="voice-recording-area">
        <div className="record-btn-container">
          <button 
            className={`record-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            🎤
          </button>
          <div className="record-pulse-ring"></div>
        </div>

        <div className="recording-status" style={{ color: isRecording ? 'var(--danger)' : 'var(--text-secondary)' }}>
          {isRecording ? `Recording... (${recordingSeconds}s)` : "Click mic to speak"}
        </div>
      </div>

      {showSimInput && (
        <div className="feedback-box" style={{ background: 'var(--bg-secondary)', borderStyle: 'solid' }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            Simulator Text Mode (For environments without microhpone access)
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="chat-input"
              value={typedTranscript}
              onChange={(e) => setTypedTranscript(e.target.value)}
              placeholder={`Type target sentence to simulate speaking...`}
              onKeyDown={(e) => e.key === 'Enter' && handleSimulatedSubmit()}
            />
            <button className="btn btn-primary" onClick={handleSimulatedSubmit}>Evaluate</button>
          </div>
          <button 
            className="play-sentence-btn"
            style={{ marginTop: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.75rem', background: 'transparent', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}
            onClick={() => setTypedTranscript(currentSentence.target)}
          >
            Auto-fill target
          </button>
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
            <div className={`score-circle ${evaluation.score >= 80 ? 'excellent' : evaluation.score < 50 ? 'needs-work' : ''}`}>
              {evaluation.score}%
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Accuracy Evaluation Score</span>
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
        <button 
          className="btn btn-secondary" 
          onClick={() => setShowSimInput(!showSimInput)}
        >
          {showSimInput ? "Hide Simulator" : "Simulator Mode"}
        </button>

        <button 
          className="btn btn-primary" 
          onClick={handleNextSentence}
        >
          {currentIndex < sentences.length - 1 ? "Next Sentence" : "Complete Shadowing"}
        </button>
      </div>
    </div>
  );
}

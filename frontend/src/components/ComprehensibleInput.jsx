import React, { useEffect, useState, useRef } from 'react';
import { apiFetch } from '../lib/api';

export default function ComprehensibleInput({ onComplete }) {
  const [stories, setStories] = useState([]);
  const [currentStoryIdx, setCurrentStoryIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [showFullTranslation, setShowFullTranslation] = useState(false);
  const [minedWords, setMinedWords] = useState(new Set());
  const [notification, setNotification] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await apiFetch("/api/stories");
      if (res.ok) {
        const data = await res.json();
        setStories(data);
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };

  const cleanWord = (word) => {
    return word.toLowerCase().replace(/[¡!¿?,\.\'\";\(\)]/g, "").trim();
  };

  const handleWordClick = (e, rawWord) => {
    e.stopPropagation();
    const word = cleanWord(rawWord);
    if (!word || !story) return;

    // Find translation
    const translation = story.words[word] || story.words[word.toLowerCase()] || "Translation not found";
    
    // Find context sentence
    let contextSentence = "";
    let contextTranslation = "";
    if (story.sentences) {
      const match = story.sentences.find(s => cleanWord(s.target).includes(word));
      if (match) {
        contextSentence = match.target;
        contextTranslation = match.english;
      }
    }

    // Get click coordinates
    const rect = e.target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    setTooltipPos({
      top: rect.bottom - containerRect.top + 8,
      left: Math.max(10, Math.min(rect.left - containerRect.left, containerRect.width - 260))
    });

    setSelectedWord({
      raw: rawWord,
      clean: word,
      translation,
      contextSentence,
      contextTranslation
    });
  };

  const handleMineWord = async () => {
    if (!selectedWord) return;

    try {
      const res = await apiFetch("/api/flashcards/mine", {
        method: "POST",
        body: JSON.stringify({
          word: selectedWord.clean,
          translation: selectedWord.translation,
          context_sentence: selectedWord.contextSentence,
          context_translation: selectedWord.contextTranslation
        })
      });

      if (res.ok) {
        setMinedWords(prev => {
          const next = new Set(prev);
          next.add(selectedWord.clean);
          return next;
        });
        setNotification(`Mined "${selectedWord.clean}" into Flashcards!`);
        setTimeout(() => setNotification(""), 3000);
      }
    } catch (err) {
      console.error("Error mining word:", err);
    } finally {
      setSelectedWord(null);
    }
  };

  // Close tooltip on clicking elsewhere
  useEffect(() => {
    const closeTooltip = () => setSelectedWord(null);
    window.addEventListener('click', closeTooltip);
    return () => window.removeEventListener('click', closeTooltip);
  }, []);

  const handleNextStep = async () => {
    try {
      await apiFetch("/api/flow-session/update", {
        method: "POST",
        body: JSON.stringify({ comprehensible_input_completed: true })
      });
    } catch (err) {
      console.error(err);
    }
    onComplete();
  };

  if (stories.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center' }}>Loading story list...</p>
      </div>
    );
  }

  const story = stories[currentStoryIdx];

  // Render text with clickable words
  const renderStoryText = () => {
    const paragraphs = story.content_target.split('\n');
    return paragraphs.map((para, pIdx) => {
      const words = para.split(' ');
      return (
        <p key={pIdx} style={{ marginBottom: '1.2rem' }}>
          {words.map((w, wIdx) => {
            const clean = cleanWord(w);
            const isMined = minedWords.has(clean);
            return (
              <span key={wIdx}>
                <span
                  className="interactive-word"
                  style={isMined ? { borderBottomColor: 'var(--success)', color: 'var(--success)' } : {}}
                  onClick={(e) => handleWordClick(e, w)}
                >
                  {w}
                </span>{' '}
              </span>
            );
          })}
        </p>
      );
    });
  };

  return (
    <div className="card" ref={containerRef} style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="story-header">
        <span className="story-level-badge">{story.level} Comprehensible Input</span>
        <h2 className="story-title" style={{ marginTop: '0.5rem' }}>{story.title}</h2>
      </div>

      <div className="story-body">
        {renderStoryText()}
      </div>

      {selectedWord && (
        <div
          className="translation-tooltip"
          style={{ top: `${tooltipPos.top}px`, left: `${tooltipPos.left}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="tooltip-target">{selectedWord.raw}</div>
          <div className="tooltip-translation">{selectedWord.translation}</div>
          <button className="tooltip-mine-btn" onClick={handleMineWord}>
            {minedWords.has(selectedWord.clean) ? "✓ Added to SRS" : "Add to Flashcards (Mine)"}
          </button>
        </div>
      )}

      {notification && (
        <div className="mined-notification">
          🌊 {notification}
        </div>
      )}

      <button
        className="play-sentence-btn"
        onClick={() => setShowFullTranslation(!showFullTranslation)}
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
      >
        {showFullTranslation ? "Hide English Translation" : "Show English Translation"}
      </button>

      {showFullTranslation && (
        <div className="translation-box" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {story.content_english}
        </div>
      )}

      <div className="btn-row" style={{ marginTop: '2.5rem' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentStoryIdx((currentStoryIdx + 1) % stories.length)}
          disabled={stories.length <= 1}
        >
          Next Story
        </button>

        <button className="btn btn-primary" onClick={handleNextStep}>
          Mark Read & Continue
        </button>
      </div>
    </div>
  );
}

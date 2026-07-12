import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function SpacedRepetition({ onComplete }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewCards();
  }, []);

  const fetchReviewCards = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/flashcards/review");
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (err) {
      console.error("Error fetching review cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const submitReview = async (quality) => {
    const card = cards[currentIndex];
    try {
      const res = await apiFetch(`/api/flashcards/review/${card.id}`, {
        method: "POST",
        body: JSON.stringify({ quality })
      });
      
      if (res.ok) {
        setIsFlipped(false);
        // Move to next card
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // Finished all due cards!
          handleCompleteSRS();
        }
      }
    } catch (err) {
      console.error("Error submitting flashcard review:", err);
      // Fallback
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleCompleteSRS();
      }
    }
  };

  const handleCompleteSRS = async () => {
    try {
      await apiFetch("/api/flow-session/update", {
        method: "POST",
        body: JSON.stringify({ srs_completed: true })
      });
    } catch (err) {
      console.error(err);
    }
    onComplete();
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center' }}>Loading daily reviews...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="card" style={{ animation: 'fadeIn 0.3s ease-out', textAlign: 'center' }}>
        <h2 className="story-title" style={{ marginBottom: '1rem' }}>Spaced Repetition (SRS)</h2>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌱</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          All caught up! You have no flashcards due for review today. Keep reading stories and mining new words to populate your deck.
        </p>
        <button className="btn btn-primary btn-full" onClick={handleCompleteSRS}>
          Continue to Shadowing
        </button>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <h2 className="story-title" style={{ marginBottom: '0.25rem' }}>Spaced Repetition (SRS)</h2>
      <div className="srs-status">
        Card {currentIndex + 1} of {cards.length} due today
      </div>

      <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
        <div className="flashcard-inner">
          {/* FRONT */}
          <div className="flashcard-face flashcard-front">
            <span className="flashcard-label">Target Word</span>
            <div className="flashcard-word">{card.word}</div>
            {card.context_sentence && (
              <>
                <span className="flashcard-label" style={{ marginTop: '1.5rem' }}>Context Sentence</span>
                <div className="flashcard-context">"{card.context_sentence}"</div>
              </>
            )}
            <div className="flashcard-hint">Click card to reveal translation</div>
          </div>

          {/* BACK */}
          <div className="flashcard-face flashcard-back">
            <span className="flashcard-label">English Translation</span>
            <div className="flashcard-word" style={{ color: 'var(--accent-secondary)' }}>{card.translation}</div>
            {card.context_translation && (
              <>
                <span className="flashcard-label" style={{ marginTop: '1.5rem' }}>Sentence Translation</span>
                <div className="flashcard-context" style={{ color: 'var(--text-primary)' }}>"{card.context_translation}"</div>
              </>
            )}
            <div className="flashcard-hint" style={{ color: 'var(--text-muted)' }}>How well did you recall this?</div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="srs-ratings">
          <div className="ratings-grid">
            <button className="rating-btn rating-0" onClick={() => submitReview(0)}>
              0 <span>Forgot</span>
            </button>
            <button className="rating-btn rating-1" onClick={() => submitReview(1)}>
              1 <span>Wrong</span>
            </button>
            <button className="rating-btn rating-2" onClick={() => submitReview(2)}>
              2 <span>Close</span>
            </button>
            <button className="rating-btn rating-3" onClick={() => submitReview(3)}>
              3 <span>Okay</span>
            </button>
            <button className="rating-btn rating-4" onClick={() => submitReview(4)}>
              4 <span>Good</span>
            </button>
            <button className="rating-btn rating-5" onClick={() => submitReview(5)}>
              5 <span>Easy</span>
            </button>
          </div>
        </div>
      )}

      {!isFlipped && (
        <div className="btn-row" style={{ marginTop: '2.5rem' }}>
          <button className="btn btn-secondary" onClick={handleCompleteSRS}>
            Skip SRS
          </button>
        </div>
      )}
    </div>
  );
}

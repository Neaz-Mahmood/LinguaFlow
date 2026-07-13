import React, { useEffect, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
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
      const res = await apiFetch('/api/flashcards/review');
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (err) {
      console.error('Error fetching review cards:', err);
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
        method: 'POST',
        body: JSON.stringify({ quality }),
      });

      if (res.ok) {
        setIsFlipped(false);
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          handleCompleteSRS();
        }
      }
    } catch (err) {
      console.error('Error submitting flashcard review:', err);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleCompleteSRS();
      }
    }
  };

  const handleCompleteSRS = async () => {
    try {
      await apiFetch('/api/flow-session/update', {
        method: 'POST',
        body: JSON.stringify({ srs_completed: true }),
      });
    } catch (err) {
      console.error(err);
    }
    onComplete();
  };

  if (loading) {
    return (
      <div className="lf-card">
        <Text display="block" justify="center">
          Loading daily reviews...
        </Text>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="lf-card" style={{ animation: 'fadeIn 0.3s ease-out', textAlign: 'center' }}>
        <Heading level={2}>Spaced Repetition (SRS)</Heading>
        <div style={{ fontSize: '3rem', margin: '1.5rem 0' }}>🌱</div>
        <Text type="supporting" color="secondary" as="p" display="block">
          All caught up! You have no flashcards due for review today. Keep reading stories and mining
          new words to populate your deck.
        </Text>
        <div style={{ marginTop: '2rem' }}>
          <Button label="Continue to Shadowing" variant="primary" onClick={handleCompleteSRS} />
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="lf-card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <Heading level={2}>Spaced Repetition (SRS)</Heading>
      <div className="srs-status">
        Card {currentIndex + 1} of {cards.length} due today
      </div>

      <div
        className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}
        onClick={handleCardClick}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-front">
            <span className="flashcard-label">Target Word</span>
            <div className="flashcard-word">{card.word}</div>
            {card.context_sentence && (
              <>
                <span className="flashcard-label" style={{ marginTop: '1.5rem' }}>
                  Context Sentence
                </span>
                <div className="flashcard-context">&quot;{card.context_sentence}&quot;</div>
              </>
            )}
            <div className="flashcard-hint">Click card to reveal translation</div>
          </div>

          <div className="flashcard-face flashcard-back">
            <span className="flashcard-label">English Translation</span>
            <div className="flashcard-word accent">{card.translation}</div>
            {card.context_translation && (
              <>
                <span className="flashcard-label" style={{ marginTop: '1.5rem' }}>
                  Sentence Translation
                </span>
                <div className="flashcard-context">&quot;{card.context_translation}&quot;</div>
              </>
            )}
            <div className="flashcard-hint">How well did you recall this?</div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="srs-ratings">
          <div className="ratings-grid">
            {[
              [0, 'Forgot'],
              [1, 'Wrong'],
              [2, 'Close'],
              [3, 'Okay'],
              [4, 'Good'],
              [5, 'Easy'],
            ].map(([quality, label]) => (
              <button
                key={quality}
                type="button"
                className={`rating-btn rating-${quality}`}
                onClick={() => submitReview(quality)}
              >
                {quality} <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!isFlipped && (
        <div className="btn-row" style={{ marginTop: '2.5rem' }}>
          <Button label="Skip SRS" variant="secondary" onClick={handleCompleteSRS} />
        </div>
      )}
    </div>
  );
}

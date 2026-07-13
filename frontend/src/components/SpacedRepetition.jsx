import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { apiFetch } from '../lib/api';

export default function SpacedRepetition({ onComplete }) {
  const { t } = useTranslation();
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
          {t('srs.loading')}
        </Text>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="lf-card" style={{ animation: 'fadeIn 0.3s ease-out', textAlign: 'center' }}>
        <Heading level={2}>{t('srs.title')}</Heading>
        <div style={{ fontSize: '3rem', margin: '1.5rem 0' }}>🌱</div>
        <Text type="supporting" color="secondary" as="p" display="block">
          {t('srs.allCaughtUp')}
        </Text>
        <div style={{ marginTop: '2rem' }}>
          <Button
            label={t('srs.continueShadowing')}
            variant="primary"
            onClick={handleCompleteSRS}
          />
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];
  const ratings = [
    [0, t('srs.ratingForgot')],
    [1, t('srs.ratingWrong')],
    [2, t('srs.ratingClose')],
    [3, t('srs.ratingOkay')],
    [4, t('srs.ratingGood')],
    [5, t('srs.ratingEasy')],
  ];

  return (
    <div className="lf-card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <Heading level={2}>{t('srs.title')}</Heading>
      <div className="srs-status">
        {t('srs.cardOf', { current: currentIndex + 1, total: cards.length })}
      </div>

      <div
        className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}
        onClick={handleCardClick}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-front">
            <span className="flashcard-label">{t('srs.targetWord')}</span>
            <div className="flashcard-word">{card.word}</div>
            {card.context_sentence && (
              <>
                <span className="flashcard-label" style={{ marginTop: '1.5rem' }}>
                  {t('srs.contextSentence')}
                </span>
                <div className="flashcard-context">&quot;{card.context_sentence}&quot;</div>
              </>
            )}
            <div className="flashcard-hint">{t('srs.revealHint')}</div>
          </div>

          <div className="flashcard-face flashcard-back">
            <span className="flashcard-label">{t('srs.englishTranslation')}</span>
            <div className="flashcard-word accent">{card.translation}</div>
            {card.context_translation && (
              <>
                <span className="flashcard-label" style={{ marginTop: '1.5rem' }}>
                  {t('srs.sentenceTranslation')}
                </span>
                <div className="flashcard-context">&quot;{card.context_translation}&quot;</div>
              </>
            )}
            <div className="flashcard-hint">{t('srs.recallHint')}</div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="srs-ratings">
          <div className="ratings-grid">
            {ratings.map(([quality, label]) => (
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
          <Button label={t('srs.skip')} variant="secondary" onClick={handleCompleteSRS} />
        </div>
      )}
    </div>
  );
}

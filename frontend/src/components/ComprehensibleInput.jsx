import React, { useEffect, useState, useRef } from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { apiFetch } from '../lib/api';

export default function ComprehensibleInput({ onComplete }) {
  const [stories, setStories] = useState([]);
  const [currentStoryIdx, setCurrentStoryIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [showFullTranslation, setShowFullTranslation] = useState(false);
  const [minedWords, setMinedWords] = useState(new Set());
  const [notification, setNotification] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await apiFetch('/api/stories');
      if (res.ok) {
        const data = await res.json();
        setStories(data);
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  };

  const cleanWord = (word) => {
    return word
      .toLowerCase()
      .replace(/[¡!¿?,\.\'\";\(\)]/g, '')
      .trim();
  };

  const handleWordClick = (e, rawWord) => {
    e.stopPropagation();
    const word = cleanWord(rawWord);
    if (!word || !story) return;

    const translation =
      story.words[word] || story.words[word.toLowerCase()] || 'Translation not found';

    let contextSentence = '';
    let contextTranslation = '';
    if (story.sentences) {
      const match = story.sentences.find((s) => cleanWord(s.target).includes(word));
      if (match) {
        contextSentence = match.target;
        contextTranslation = match.english;
      }
    }

    const rect = e.target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setTooltipPos({
      top: rect.bottom - containerRect.top + 8,
      left: Math.max(10, Math.min(rect.left - containerRect.left, containerRect.width - 260)),
    });

    setSelectedWord({
      raw: rawWord,
      clean: word,
      translation,
      contextSentence,
      contextTranslation,
    });
  };

  const handleMineWord = async () => {
    if (!selectedWord) return;

    try {
      const res = await apiFetch('/api/flashcards/mine', {
        method: 'POST',
        body: JSON.stringify({
          word: selectedWord.clean,
          translation: selectedWord.translation,
          context_sentence: selectedWord.contextSentence,
          context_translation: selectedWord.contextTranslation,
        }),
      });

      if (res.ok) {
        setMinedWords((prev) => {
          const next = new Set(prev);
          next.add(selectedWord.clean);
          return next;
        });
        setNotification(`Mined "${selectedWord.clean}" into Flashcards!`);
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (err) {
      console.error('Error mining word:', err);
    } finally {
      setSelectedWord(null);
    }
  };

  useEffect(() => {
    const closeTooltip = () => setSelectedWord(null);
    window.addEventListener('click', closeTooltip);
    return () => window.removeEventListener('click', closeTooltip);
  }, []);

  const handleNextStep = async () => {
    try {
      await apiFetch('/api/flow-session/update', {
        method: 'POST',
        body: JSON.stringify({ comprehensible_input_completed: true }),
      });
    } catch (err) {
      console.error(err);
    }
    onComplete();
  };

  if (stories.length === 0) {
    return (
      <div className="lf-card">
        <Text display="block" justify="center">
          Loading story list...
        </Text>
      </div>
    );
  }

  const story = stories[currentStoryIdx];

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
                  className={`interactive-word${isMined ? ' is-mined' : ''}`}
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
    <div className="lf-card" ref={containerRef} style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="story-header">
        <Badge label={`${story.level} Comprehensible Input`} variant="cyan" />
        <Heading level={2}>{story.title}</Heading>
      </div>

      <div className="story-body">{renderStoryText()}</div>

      {selectedWord && (
        <div
          className="translation-tooltip"
          style={{ top: `${tooltipPos.top}px`, left: `${tooltipPos.left}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="tooltip-target">{selectedWord.raw}</div>
          <div className="tooltip-translation">{selectedWord.translation}</div>
          <Button
            label={minedWords.has(selectedWord.clean) ? 'Added to SRS' : 'Add to Flashcards (Mine)'}
            variant="primary"
            size="sm"
            onClick={handleMineWord}
          />
        </div>
      )}

      {notification && <div className="mined-notification">{notification}</div>}

      <Button
        label={showFullTranslation ? 'Hide English Translation' : 'Show English Translation'}
        variant="secondary"
        onClick={() => setShowFullTranslation(!showFullTranslation)}
      />

      {showFullTranslation && (
        <div className="translation-box" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {story.content_english}
        </div>
      )}

      <div className="btn-row" style={{ marginTop: '2.5rem' }}>
        <Button
          label="Next Story"
          variant="secondary"
          onClick={() => setCurrentStoryIdx((currentStoryIdx + 1) % stories.length)}
          isDisabled={stories.length <= 1}
        />
        <Button label="Mark Read & Continue" variant="primary" onClick={handleNextStep} />
      </div>
    </div>
  );
}

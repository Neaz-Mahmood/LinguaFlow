import React, { useState, useEffect } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { apiFetch } from '../lib/api';

export default function QuickOutput({ onComplete }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [grammarFeedback, setGrammarFeedback] = useState('');
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      const res = await apiFetch('/api/stories');
      if (res.ok) {
        const stories = await res.json();
        if (stories.length > 0) {
          const activeStory = stories[0];
          setStory(activeStory);

          setMessages([
            {
              sender: 'ai',
              text: `¡Hola! Siguiendo nuestra lectura de "${activeStory.title}", responde esta pregunta en español: ¿Qué compró Sofía en la cafetería? (o escribe sobre el personaje de tu historia).`,
            },
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!inputVal.trim() || loading) return;

    const userMsgText = inputVal.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsgText }]);
    setInputVal('');
    setLoading(true);
    setGrammarFeedback('');

    try {
      const res = await apiFetch('/api/quick-output/reply', {
        method: 'POST',
        body: JSON.stringify({
          message: userMsgText,
          story_title: story ? story.title : 'la historia',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
        if (data.correction) {
          setGrammarFeedback(data.correction);
        }
      }
    } catch (err) {
      console.error('Error sending response:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '¡Buen intento! Tu respuesta es interesante. Sigue practicando tu producción activa todos los días.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    try {
      await apiFetch('/api/flow-session/update', {
        method: 'POST',
        body: JSON.stringify({
          output_completed: true,
          quick_output_response: messages
            .filter((m) => m.sender === 'user')
            .map((m) => m.text)
            .join(' | '),
          quick_output_feedback: grammarFeedback,
        }),
      });
    } catch (err) {
      console.error(err);
    }
    onComplete();
  };

  return (
    <div className="lf-card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <Heading level={2}>Quick Output</Heading>
      <Text type="supporting" color="secondary" as="p" display="block" justify="center">
        Practice speaking or typing from Day One. Speak/type a response to the prompt.
      </Text>

      <div className="quick-output-chat">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-bubble ${m.sender}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble ai" style={{ opacity: 0.7 }}>
            Typing feedback...
          </div>
        )}
      </div>

      {grammarFeedback && (
        <div
          className="feedback-box"
          style={{ animation: 'fadeIn 0.25s ease-out', marginBottom: '1rem' }}
          dangerouslySetInnerHTML={{ __html: grammarFeedback.replace(/\n/g, '<br />') }}
        />
      )}

      <div className="chat-input-wrapper">
        <div style={{ flex: 1 }}>
          <TextInput
            label="Response"
            isLabelHidden
            value={inputVal}
            onChange={setInputVal}
            placeholder="Type your response in Spanish..."
            isDisabled={loading}
          />
        </div>
        <Button
          label="Send"
          variant="primary"
          onClick={handleSend}
          isDisabled={loading || !inputVal.trim()}
          isLoading={loading}
        />
      </div>

      <div className="btn-row" style={{ marginTop: '2rem' }}>
        <Button
          label="Complete Today's Flow"
          variant="secondary"
          onClick={handleFinish}
          isDisabled={messages.length < 2}
        />
      </div>
    </div>
  );
}

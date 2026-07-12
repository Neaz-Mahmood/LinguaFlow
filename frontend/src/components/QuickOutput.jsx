import React, { useState, useEffect } from 'react';

export default function QuickOutput({ onComplete }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [grammarFeedback, setGrammarFeedback] = useState("");
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/stories");
      if (res.ok) {
        const stories = await res.json();
        if (stories.length > 0) {
          const activeStory = stories[0];
          setStory(activeStory);
          
          // Add initial AI prompt message
          setMessages([
            {
              sender: "ai",
              text: `¡Hola! Siguiendo nuestra lectura de "${activeStory.title}", responde esta pregunta en español: ¿Qué compró Sofía en la cafetería? (o escribe sobre el personaje de tu historia).`
            }
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
    setMessages(prev => [...prev, { sender: "user", text: userMsgText }]);
    setInputVal("");
    setLoading(true);
    setGrammarFeedback("");

    try {
      const res = await fetch("http://localhost:8000/api/quick-output/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          story_title: story ? story.title : "la historia"
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Add AI reply message
        setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
        
        // Add grammar correction
        if (data.correction) {
          setGrammarFeedback(data.correction);
        }
      }
    } catch (err) {
      console.error("Error sending response:", err);
      // Fallback
      setMessages(prev => [...prev, { sender: "ai", text: "¡Buen intento! Tu respuesta es interesante. Sigue practicando tu producción activa todos los días." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    try {
      await fetch("http://localhost:8000/api/flow-session/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          output_completed: true,
          quick_output_response: messages.filter(m => m.sender === 'user').map(m => m.text).join(" | "),
          quick_output_feedback: grammarFeedback
        })
      });
    } catch (err) {
      console.error(err);
    }
    onComplete();
  };

  return (
    <div className="card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <h2 className="story-title" style={{ marginBottom: '0.25rem' }}>Quick Output</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        Practice speaking or typing from Day One. Speak/type a response to the prompt.
      </p>

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
        <div className="feedback-box" style={{ animation: 'fadeIn 0.25s ease-out' }} dangerouslySetInnerHTML={{ __html: grammarFeedback.replace(/\n/g, '<br />') }}>
        </div>
      )}

      <div className="chat-input-wrapper">
        <input
          type="text"
          className="chat-input"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type your response in Spanish..."
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          className="btn btn-primary" 
          onClick={handleSend}
          disabled={loading || !inputVal.trim()}
        >
          Send
        </button>
      </div>

      <div className="btn-row" style={{ marginTop: '2rem' }}>
        <button 
          className="btn btn-secondary btn-full" 
          onClick={handleFinish}
          disabled={messages.length < 2}
        >
          Complete Today's Flow 🌊
        </button>
      </div>
    </div>
  );
}

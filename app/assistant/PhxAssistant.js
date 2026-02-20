'use client'

import { useState, useRef, useEffect } from 'react'

const suggestedQuestions = [
  "What spaces are available right now?",
  "I need a creative office for a small team",
  "Do you have retail or restaurant space?",
  "What makes PHX JAX different?",
  "How do I schedule a tour?",
]

export default function PhxAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to PHX JAX — Jacksonville's Phoenix Arts & Innovation District. I'm Phx, your leasing guide. Whether you're a creative agency, startup, maker, or restaurateur, we likely have a space that fits. What brings you here today?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userMessage = text || input.trim()
    if (!userMessage || loading) return

    setInput('')
    setShowSuggestions(false)
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()
      const reply = data.content || "I'm having trouble connecting right now. Please try again."
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Please try again in a moment.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .chat-container { width: 100%; max-width: 720px; display: flex; flex-direction: column; }

        .header { display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid #2a2a24; }

        .district-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; color: #c8a96e; text-transform: uppercase; margin-bottom: 8px; }

        .logo { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 300; color: #f0ebe0; letter-spacing: -0.02em; line-height: 1; }

        .logo span { color: #c8a96e; font-style: italic; }

        .tagline { font-family: 'DM Mono', monospace; font-size: 10px; color: #5a5a4a; letter-spacing: 0.12em; margin-top: 8px; text-transform: uppercase; }

        .messages-area { display: flex; flex-direction: column; gap: 20px; min-height: 300px; max-height: 480px; overflow-y: auto; padding-right: 8px; scrollbar-width: thin; scrollbar-color: #2a2a24 transparent; }

        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-thumb { background: #2a2a24; border-radius: 2px; }

        .message { display: flex; flex-direction: column; gap: 4px; animation: fadeUp 0.3s ease forwards; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .message-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; }

        .message.assistant .message-label { color: #c8a96e; }
        .message.user .message-label { color: #5a5a4a; align-self: flex-end; }

        .message-bubble { padding: 16px 20px; border-radius: 2px; line-height: 1.7; }

        .message.assistant .message-bubble { background: #181815; border: 1px solid #2a2a24; border-left: 2px solid #c8a96e; color: #d4cfc2; font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 300; }

        .message.user .message-bubble { background: #1e1e18; border: 1px solid #2a2a24; color: #a0998a; font-family: 'DM Mono', monospace; font-size: 13px; align-self: flex-end; max-width: 85%; }

        .typing-indicator { display: flex; gap: 5px; align-items: center; padding: 18px 20px; background: #181815; border: 1px solid #2a2a24; border-left: 2px solid #c8a96e; border-radius: 2px; width: fit-content; }

        .typing-dot { width: 5px; height: 5px; background: #c8a96e; border-radius: 50%; animation: pulse 1.4s ease infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse { 0%, 60%, 100% { opacity: 0.3; transform: scale(1); } 30% { opacity: 1; transform: scale(1.2); } }

        .suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }

        .suggestion-btn { background: transparent; border: 1px solid #2a2a24; color: #7a7a68; padding: 8px 14px; font-family: 'DM Mono', monospace; font-size: 11px; cursor: pointer; border-radius: 2px; transition: all 0.2s ease; letter-spacing: 0.04em; }

        .suggestion-btn:hover { border-color: #c8a96e; color: #c8a96e; background: rgba(200,169,110,0.05); }

        .input-area { margin-top: 24px; border-top: 1px solid #2a2a24; padding-top: 20px; display: flex; gap: 12px; align-items: flex-end; }

        .chat-input { flex: 1; background: #121210; border: 1px solid #2a2a24; border-radius: 2px; padding: 14px 16px; color: #d4cfc2; font-family: 'DM Mono', monospace; font-size: 13px; outline: none; transition: border-color 0.2s ease; line-height: 1.5; resize: none; }

        .chat-input::placeholder { color: #3a3a30; }
        .chat-input:focus { border-color: #c8a96e; }

        .send-btn { background: #c8a96e; border: none; color: #0d0d0b; width: 50px; height: 50px; border-radius: 2px; cursor: pointer; font-size: 18px; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .send-btn:hover { background: #dfc080; }
        .send-btn:disabled { background: #2a2a24; color: #5a5a4a; cursor: not-allowed; }

        .footer { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }

        .footer-text { font-family: 'DM Mono', monospace; font-size: 9px; color: #3a3a30; letter-spacing: 0.12em; text-transform: uppercase; }

        .footer-link { font-family: 'DM Mono', monospace; font-size: 9px; color: #c8a96e; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; opacity: 0.7; }
      `}</style>

      <div className="chat-container">
        <div className="header">
          <div className="district-label">Phoenix Arts & Innovation District</div>
          <div className="logo">PHX <span>JAX</span></div>
          <div className="tagline">Jacksonville, Florida — Leasing Assistant</div>
        </div>

        <div className="messages-area">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="message-label">{msg.role === 'assistant' ? 'Phx — Leasing Guide' : 'You'}</div>
              <div className="message-bubble">
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-label">Phx — Leasing Guide</div>
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}

          {showSuggestions && messages.length === 1 && (
            <div className="suggestions">
              {suggestedQuestions.map((q, i) => (
                <button key={i} className="suggestion-btn" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <textarea
            className="chat-input"
            placeholder="Ask about spaces, availability, tours..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>→</button>
        </div>

        <div className="footer">
          <span className="footer-text">Powered by Claude AI · Metro 1</span>
          <a className="footer-link" href="mailto:leasing@phxjax.com">Contact Leasing Team</a>
        </div>
      </div>
    </div>
  )
}

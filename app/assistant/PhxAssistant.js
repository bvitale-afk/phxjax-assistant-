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
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .chat-container { width: 100%; max-width: 700px; display: flex; flex-direction: column; }

        .header { display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #000; }

        .district-label { font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.25em; color: #888; text-transform: uppercase; margin-bottom: 10px; }

        .logo { font-family: 'Montserrat', sans-serif; font-size: 38px; font-weight: 700; color: #000; letter-spacing: -0.02em; line-height: 1; text-transform: uppercase; }

        .tagline { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 400; color: #888; letter-spacing: 0.1em; margin-top: 8px; text-transform: uppercase; }

        .messages-area { display: flex; flex-direction: column; gap: 16px; min-height: 320px; max-height: 500px; overflow-y: auto; padding-right: 4px; scrollbar-width: thin; scrollbar-color: #ddd transparent; }

        .messages-area::-webkit-scrollbar { width: 3px; }
        .messages-area::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

        .message { display: flex; flex-direction: column; gap: 5px; animation: fadeUp 0.25s ease forwards; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        .message-label { font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; }

        .message.assistant .message-label { color: #000; }
        .message.user .message-label { color: #aaa; align-self: flex-end; }

        .message-bubble { padding: 16px 20px; line-height: 1.7; }

        .message.assistant .message-bubble { background: #f7f7f5; border-left: 3px solid #000; color: #1a1a1a; font-family: 'Source Serif 4', serif; font-size: 15px; font-weight: 300; }

        .message.user .message-bubble { background: #000; color: #fff; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 400; align-self: flex-end; max-width: 80%; }

        .typing-indicator { display: flex; gap: 5px; align-items: center; padding: 18px 20px; background: #f7f7f5; border-left: 3px solid #000; width: fit-content; }

        .typing-dot { width: 5px; height: 5px; background: #000; border-radius: 50%; animation: pulse 1.4s ease infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse { 0%, 60%, 100% { opacity: 0.2; transform: scale(1); } 30% { opacity: 1; transform: scale(1.2); } }

        .suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }

        .suggestion-btn { background: transparent; border: 1px solid #000; color: #000; padding: 8px 14px; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; letter-spacing: 0.06em; text-transform: uppercase; }

        .suggestion-btn:hover { background: #000; color: #fff; }

        .input-area { margin-top: 24px; border-top: 1px solid #e0e0e0; padding-top: 20px; display: flex; gap: 10px; align-items: flex-end; }

        .chat-input { flex: 1; background: #f7f7f5; border: 1px solid #e0e0e0; padding: 14px 16px; color: #1a1a1a; font-family: 'Montserrat', sans-serif; font-size: 13px; resize: none; outline: none; transition: border-color 0.15s ease; line-height: 1.5; }

        .chat-input::placeholder { color: #bbb; }
        .chat-input:focus { border-color: #000; }

        .send-btn { background: #000; border: none; color: #fff; width: 50px; height: 50px; cursor: pointer; font-size: 18px; transition: background 0.15s ease; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .send-btn:hover { background: #333; }
        .send-btn:disabled { background: #ddd; color: #aaa; cursor: not-allowed; }

        .footer { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }

        .footer-text { font-family: 'Montserrat', sans-serif; font-size: 9px; color: #bbb; letter-spacing: 0.12em; text-transform: uppercase; }

        .footer-link { font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 600; color: #000; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; border-bottom: 1px solid #000; padding-bottom: 1px; }

        .footer-link:hover { opacity: 0.6; }
      `}</style>

      <div className="chat-container">
        <div className="header">
          <div className="district-label">Phoenix Arts & Innovation District</div>
          <div className="logo">PHX JAX</div>
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

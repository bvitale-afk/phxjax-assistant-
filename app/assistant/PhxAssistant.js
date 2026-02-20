'use client'

import { useState, useRef, useEffect } from 'react'

const quickQuestions = [
  "What F&B spaces are available?",
  "I'm looking for a retail or studio space",
  "What does it cost to open here?",
  "Tell me about the community & foot traffic",
  "How do I schedule a tour?",
]

export default function PhxAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to PHX JAX — Jacksonville's Phoenix Arts & Innovation District. I'm Phx, your leasing guide. Whether you're a restaurateur, retailer, maker, or creative entrepreneur, we likely have a space that fits. What kind of operation are you looking to open?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userMessage = text || input.trim()
    if (!userMessage || loading) return

    setInput('')
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
      background: '#f5f2ee',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .chat-container { width: 100%; max-width: 700px; display: flex; flex-direction: column; }

        .header { display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #2d2d6b; }

        .district-label { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.22em; color: #2d2d6b; text-transform: uppercase; margin-bottom: 10px; }

        .logo { font-family: 'Inter', sans-serif; font-size: 36px; font-weight: 700; color: #2d2d6b; letter-spacing: -0.02em; line-height: 1; text-transform: uppercase; }

        .tagline { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 400; color: #8a8a9a; letter-spacing: 0.1em; margin-top: 8px; text-transform: uppercase; }

        .messages-area { display: flex; flex-direction: column; gap: 16px; min-height: 320px; max-height: 420px; overflow-y: auto; padding-right: 4px; scrollbar-width: thin; scrollbar-color: #d8d4ce transparent; }

        .messages-area::-webkit-scrollbar { width: 3px; }
        .messages-area::-webkit-scrollbar-thumb { background: #d8d4ce; border-radius: 2px; }

        .message { display: flex; flex-direction: column; gap: 5px; animation: fadeUp 0.25s ease forwards; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        .message-label { font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; }

        .message.assistant .message-label { color: #2d2d6b; }
        .message.user .message-label { color: #aaa; align-self: flex-end; }

        .message-bubble { padding: 16px 20px; line-height: 1.7; font-family: 'Inter', sans-serif; }

        .message.assistant .message-bubble { background: #edeae5; border-left: 3px solid #2d2d6b; color: #1a1a2e; font-size: 14px; font-weight: 400; }

        .message.user .message-bubble { background: #2d2d6b; color: #fff; font-size: 13px; font-weight: 400; align-self: flex-end; max-width: 80%; }

        .typing-indicator { display: flex; gap: 5px; align-items: center; padding: 18px 20px; background: #edeae5; border-left: 3px solid #2d2d6b; width: fit-content; }

        .typing-dot { width: 5px; height: 5px; background: #2d2d6b; border-radius: 50%; animation: pulse 1.4s ease infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse { 0%, 60%, 100% { opacity: 0.2; transform: scale(1); } 30% { opacity: 1; transform: scale(1.2); } }

        .input-area { margin-top: 24px; border-top: 1px solid #d8d4ce; padding-top: 20px; display: flex; gap: 10px; align-items: flex-end; }

        .chat-input { flex: 1; background: #edeae5; border: 1px solid #d8d4ce; padding: 14px 16px; color: #1a1a2e; font-family: 'Inter', sans-serif; font-size: 13px; resize: none; outline: none; transition: border-color 0.15s ease; line-height: 1.5; }

        .chat-input::placeholder { color: #bbb; }
        .chat-input:focus { border-color: #2d2d6b; }

        .send-btn { background: #2d2d6b; border: none; color: #fff; width: 50px; height: 50px; cursor: pointer; font-size: 18px; transition: background 0.15s ease; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .send-btn:hover { background: #3d3d8b; }
        .send-btn:disabled { background: #d8d4ce; color: #aaa; cursor: not-allowed; }

        .quick-questions { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 7px; }

        .quick-label { font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 600; color: #bbb; letter-spacing: 0.18em; text-transform: uppercase; width: 100%; margin-bottom: 2px; }

        .quick-btn { background: transparent; border: 1px solid #c8c4be; color: #666; padding: 7px 12px; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; letter-spacing: 0.04em; white-space: nowrap; }

        .quick-btn:hover { border-color: #2d2d6b; color: #2d2d6b; background: #edeae5; }

        .footer { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }

        .footer-text { font-family: 'Inter', sans-serif; font-size: 9px; color: #bbb; letter-spacing: 0.12em; text-transform: uppercase; }

        .footer-link { font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 600; color: #2d2d6b; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; border-bottom: 1px solid #2d2d6b; padding-bottom: 1px; }

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

        <div className="quick-questions">
          <div className="quick-label">Quick Questions</div>
          {quickQuestions.map((q, i) => (
            <button key={i} className="quick-btn" onClick={() => sendMessage(q)}>{q}</button>
          ))}
        </div>

        <div className="footer">
          <span className="footer-text">Powered by Claude AI · Metro 1</span>
          <a className="footer-link" href="mailto:leasing@phxjax.com">Contact Leasing Team</a>
        </div>
      </div>
    </div>
  )
}

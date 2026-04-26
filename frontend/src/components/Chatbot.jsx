import React, { useState } from 'react';
import { MessageSquare, X, Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('options'); // 'options' or 'chat'
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleStartChat = () => {
    setView('chat');
    setMessages([{ text: "Hi! I'm an AI assistant. How can I help you today?", isBot: true }]);
  };

  const handleSendMessage = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setMessages([...messages, { text: inputValue, isBot: false }]);
      setInputValue('');
      // Simulate bot typing
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Thanks for reaching out! Our team will get back to you shortly.", isBot: true }]);
      }, 1000);
    }
  };

  const handleBack = () => {
    if (view === 'chat') {
      setView('options');
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <button className="chatbot-back" onClick={handleBack}>
                &lt;
              </button>
              <div className="chatbot-avatar">
                <Bot size={20} />
              </div>
              <div className="chatbot-title-container">
                <div className="chatbot-title">RankFox Ai</div>
                <div className="chatbot-subtitle">chatbot and helper</div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {view === 'options' ? (
              <>
                <div className="chat-message bot-message">
                  <div className="message-text">
                    Welcome to RankFox 👋<br />
                    How can we help you today?
                  </div>
                  <div className="message-time">Just now</div>
                </div>

                <div className="chat-message bot-message">
                  <div className="message-text">
                    Please select one of the options below:
                    <div className="chat-options">
                      <button className="chat-option-btn" onClick={handleStartChat}>Start Chat</button>
                      <button className="chat-option-btn" onClick={() => alert('Feedback form coming soon!')}>Submit Feedback</button>
                      <button className="chat-option-btn" onClick={() => alert('FAQs coming soon!')}>Browse FAQs</button>
                    </div>
                  </div>
                  <div className="message-time">Just now</div>
                </div>
              </>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.isBot ? 'bot-message' : 'user-message'}`}>
                    <div className="message-text" style={{ background: msg.isBot ? '#2a2a2a' : '#3b82f6' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            {view === 'options' ? (
              <input type="text" placeholder="Choose an option" disabled className="chatbot-input" />
            ) : (
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="chatbot-input" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleSendMessage}
                autoFocus
              />
            )}
            <div className="chatbot-footer">
              Driven by RankFox AI
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={24} color="#fff" /> : <MessageSquare size={24} color="#fff" />}
      </button>
    </>
  );
}

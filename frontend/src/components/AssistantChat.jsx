import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './AssistantChat.css';

const AssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hi! I am the PalatePro Assistant. What flavours are you craving today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const storedUser = localStorage.getItem('palateUser');
      const userInfo = storedUser ? JSON.parse(storedUser) : null;
      const token = userInfo?.token;

      if (!token) {
        setMessages(prev => [...prev, { sender: 'assistant', text: 'Please log in so I can personalize your recommendations!' }]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { sender: 'assistant', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'assistant', text: data.message || 'Sorry, I encountered an error.' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'assistant', text: 'Network error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="assistant-container">
      {isOpen ? (
        <div className="assistant-window">
          <div className="assistant-header">
            <div className="assistant-title">
              <FaRobot className="assistant-icon" />
              <span>PalatePro AI</span>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          
          <div className="assistant-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message-bubble assistant typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="assistant-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask for recommendations..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      ) : (
        <button className="assistant-fab" onClick={() => setIsOpen(true)}>
          <FaRobot />
        </button>
      )}
    </div>
  );
};

export default AssistantChat;

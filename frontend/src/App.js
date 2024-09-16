import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BasicTable from './table';
import LottiePlayer from './lootiePlayer'; // Import the LottiePlayer component

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setMessages([...messages, { text: input, user: 'User' }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, type: data.type, user: 'Chatbot' },
      ]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Error: Could not connect to the server.', user: 'Chatbot' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.user}`}>
              {msg.user === 'Chatbot' && msg.type === 1 ? (
                <div>{msg.text}</div>
              ) : msg.user === 'Chatbot' ? (
                <div><BasicTable customers={msg.text} /></div>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {isTyping && <div className="typing-indicator">Processing...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isTyping}
          />
          <button onClick={sendMessage} disabled={isTyping}>
            {isTyping ? '...' : 'Send'}
          </button>
        </div>
      </div>
      {/* Moved LottiePlayer outside the chat-container */}
      <div className="lottie-player-container">
        <LottiePlayer
          src="https://lottie.host/5962b3cf-c7d1-4e70-a319-eccb74f3dea1/8QlDbS1WkV.json"
          height={100}
          width={100}
        />
      </div>
    </div>
  );
}

export default App;

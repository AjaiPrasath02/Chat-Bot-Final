import React, { useState, useRef, useEffect } from 'react';
import BasicTable from './table';
import './App.css';

function App({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      const response = await fetch('http://localhost:5000/chathistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      console.log(data.response);
      setMessages(data.response);
    };
    fetchChatHistory();  
    return () => setMessages(null);
  }, [userId]); // Make sure to include userId as a dependency
  
  useEffect(() => {
    scrollToBottom();
    console.log(messages);
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '' || !userId) return;

    setMessages([...messages, { text: input, user: 'User' }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, userId }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, user: 'Chatbot' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Error: Could not connect to the server.', user: 'Chatbot' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages && messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user}`}>
            {msg.text && (msg.text.startsWith('[') ? <BasicTable data={msg.text} /> : msg.text)}
          </div>
        ))}
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
  );
}

export default App;

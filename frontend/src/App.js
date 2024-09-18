import React, { useState, useRef, useEffect } from 'react';
import { Navigate} from 'react-router-dom'; // Import useNavigate for redirecting
import BasicTable from './table';
import './App.css';
//import { Link } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player'; // Import the Lottie Player


function App({ userId, setUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false); // State to track logout status

  //const navigate = useNavigate(); // useNavigate hook for redirecting

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
      setMessages(data.response);
    };
    fetchChatHistory();
    return () => setMessages(null);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Error: Could not connect to the server.', user: 'Chatbot' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Remove userId from localStorage
    setUserId(null);
    setIsLoggedOut(true); // Set logged out state to true
  };

  if (isLoggedOut) {
    return <Navigate to="/login" />; // Redirect to login page after logout
  }

  return (
    <div>
      {/* Logout Button outside the app-container */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <div className="app-container">
        <div className="bot-title">
          <span>Smart Bot</span>
          <Player
            autoplay
            loop
            src="https://lottie.host/31668093-ff5d-4e08-9585-08d197cbe5b0/aTvtm2oBU9.json"
            style={{ height: '60px', width: '100px' }}
          />
        </div>

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
      </div>
    </div>
  );
}

export default App;

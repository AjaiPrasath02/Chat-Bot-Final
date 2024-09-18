// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Register from './Register';
import App from './App';

function MainApp() {
  const [userId, setUserId] = React.useState(() => {
    return localStorage.getItem('userId');
  });

  React.useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUserId={setUserId} />} />
        <Route path="/login" element={!userId ? <Login setUserId={setUserId} /> : <App userId={userId} />} />
        <Route path="/register" element={!userId ? <Register setUserId={setUserId} /> : <App userId={userId} />} />
        <Route path="/chat" element={userId ? <App userId={userId} setUserId={setUserId} /> : <Login setUserId={setUserId} />} />
      </Routes>
    </Router>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);

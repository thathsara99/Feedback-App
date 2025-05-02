import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FeedbackPage from './pages/FeedbackPage';
import ThankYouPage from './pages/ThankYouPage';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/thankyou" element={<ThankYouPage />} />
    </Routes>
  );
}

export default App;
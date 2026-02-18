import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

function Community() {
  const navigate = useNavigate();
  return (
    <div className="about-page">
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <h1>Users Community</h1>
      </div>

      <div className="about-content">
        <h2>Join the Community</h2>
        <p>Connect with other users and share feedback.</p>
        <p>
          <a href="https://chat.whatsapp.com/" target="_blank" rel="noreferrer">WhatsApp Group</a>
        </p>
        <p>
          <a href="https://t.me/" target="_blank" rel="noreferrer">Telegram Channel</a>
        </p>
        <p>
          <a href="mailto:feedback@example.com" target="_blank" rel="noreferrer">Email Feedback</a>
        </p>
      </div>
    </div>
  );
}

export default Community;

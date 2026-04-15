import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Membership.css';

function Membership({ theme }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`membership-page theme-${theme}`}>
      <div className="membership-header">
        <h1>Membership</h1>
        <p>Sign in or create an account to unlock member features</p>
      </div>

      <div className="membership-content">
        <div className="features-card">
          <div className="feature-item">
            <span className="feature-text">Save favorite hymns and notes</span>
          </div>
          <div className="feature-item">
            <span className="feature-text">Access responsive readings and choruses</span>
          </div>
          <div className="feature-item">
            <span className="feature-text">Sync preferences across devices</span>
          </div>
        </div>

        <div className="membership-actions">
          <button
            className="membership-btn login-btn"
            onClick={() => navigate('/signin', { state: { redirectTo: location.state?.redirectTo || '/' } })}
          >
            Log In
          </button>
          <button
            className="membership-btn signup-btn"
            onClick={() => navigate('/signup', { state: { redirectTo: location.state?.redirectTo || '/' } })}
          >
            Sign Up
          </button>
        </div>

        <p className="membership-note">
          Continue as guest from the More tab if you prefer. You can join anytime.
        </p>
      </div>
    </div>
  );
}

export default Membership;

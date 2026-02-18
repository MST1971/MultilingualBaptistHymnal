import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './About.css';

function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="about-page">
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <h1>User Profile</h1>
      </div>

      <div className="about-content">
        {user ? (
          <>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>Provider: {user.provider}</p>
          </>
        ) : (
          <p>No user signed in.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;

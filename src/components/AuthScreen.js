import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './About.css';

function AuthScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      const redirectTo = location.state && location.state.redirectTo ? location.state.redirectTo : '/settings/profile';
      navigate(redirectTo, { replace: true });
    }
  }, [user, location, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('hymnAppIntroSeen');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="about-page">
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <h1>Sign In</h1>
      </div>

      <div className="about-content">
        {user ? (
          <>
            <p>Signed in as {user.name} ({user.email})</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <p>Choose a provider to continue</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={signInWithGoogle}>Continue with Google</button>
              <button disabled title="Coming soon">Continue with Facebook</button>
              <button disabled title="Coming soon">Continue with Twitter</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthScreen;

import React from 'react';
import './Navbar.css';

function Navbar({ theme, onThemeChange }) {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <div className="theme-switcher">
          <button 
            className={`theme-button ${theme === 'light' ? 'active' : ''}`}
            onClick={() => onThemeChange('light')}
          >
            <span className="icon">☀️</span>
          </button>
          <button 
            className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => onThemeChange('dark')}
          >
            <span className="icon">🌙</span>
          </button>
          <button 
            className={`theme-button ${theme === 'blue' ? 'active' : ''}`}
            onClick={() => onThemeChange('blue')}
          >
            <span className="icon">🌊</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

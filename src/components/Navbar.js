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
            title="Light Theme"
          >
            <span className="icon"><i className="fas fa-sun"></i></span>
          </button>
          <button 
            className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => onThemeChange('dark')}
            title="Dark Theme"
          >
            <span className="icon"><i className="fas fa-moon"></i></span>
          </button>
          <button 
            className={`theme-button ${theme === 'blue' ? 'active' : ''}`}
            onClick={() => onThemeChange('blue')}
            title="Blue Theme"
          >
            <span className="icon"><i className="fas fa-cloud-sun"></i></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

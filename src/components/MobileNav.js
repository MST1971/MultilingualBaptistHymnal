import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileNav.css';

function MobileNav() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {isExpanded && <div className="nav-overlay" onClick={() => setIsExpanded(false)} />}
      <nav className={`mobile-nav ${isExpanded ? 'expanded' : ''}`}>
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => setIsExpanded(false)}
        >
          <span className="nav-icon">
            <i className="fas fa-home"></i>
          </span>
          <span className="nav-label">Home</span>
          {location.pathname === '/' && <div className="active-indicator" />}
        </Link>

        <Link 
          to="/hymns" 
          className={`nav-item ${location.pathname === '/hymns' ? 'active' : ''}`}
          onClick={() => setIsExpanded(false)}
        >
          <span className="nav-icon">
            <i className="fas fa-book"></i>
          </span>
          <span className="nav-label">Hymn A-Z</span>
          {location.pathname === '/hymns' && <div className="active-indicator" />}
        </Link>

        <Link 
          to="/favorites" 
          className={`nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}
          onClick={() => setIsExpanded(false)}
        >
          <span className="nav-icon">
            <i className="fas fa-star"></i>
          </span>
          <span className="nav-label">Favourite</span>
          {location.pathname === '/favorites' && <div className="active-indicator" />}
        </Link>

        <Link 
          to="/feelings" 
          className={`nav-item ${location.pathname.startsWith('/feelings') ? 'active' : ''}`}
          onClick={() => setIsExpanded(false)}
        >
          <span className="nav-icon">
            <i className="fas fa-heart"></i>
          </span>
          <span className="nav-label">Feeling</span>
          {location.pathname.startsWith('/feelings') && <div className="active-indicator" />}
        </Link>

        <Link 
          to="/settings" 
          className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
          onClick={() => setIsExpanded(false)}
        >
          <span className="nav-icon">
            <i className="fas fa-ellipsis-h"></i>
          </span>
          <span className="nav-label">More</span>
          {location.pathname === '/settings' && <div className="active-indicator" />}
        </Link>
      </nav>
    </>
  );
}

export default MobileNav;

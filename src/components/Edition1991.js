import React from 'react';
import { Link } from 'react-router-dom';
import './Edition.css';
import { useNavigate } from 'react-router-dom';

function Edition1991() {
  const navigate = useNavigate();

  return (
    <div className="edition-page">
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <div className="header-spacer"></div>
      </div>
      <h1>1991 Baptist Hymnal</h1>
      <div className="edition-info">
        <p>The 1991 Baptist Hymnal was published by Convention Press and contains 666 hymns and worship songs.</p>
      </div>
      
      <div className="hymn-section">
        <h2>Popular Hymns</h2>
        <div className="hymn-grid">
          {[1, 2, 3, 4, 5, 6].map(id => (
            <Link to={`/hymn/${id}`} key={id} className="hymn-card">
              <div className="hymn-number">{id}</div>
              <div className="hymn-title">Holy, Holy, Holy</div>
            </Link>
          ))}
        </div>
      </div>
      
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
}

export default Edition1991; 
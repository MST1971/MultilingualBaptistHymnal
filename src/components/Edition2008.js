import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Edition.css';

function Edition2008() {
  const navigate = useNavigate();

  return (
    <div className="edition-page">
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <div className="header-spacer"></div>
      </div>

      <h1>2008 Baptist Hymnal</h1>
      <div className="edition-info">
        <p>The 2008 Baptist Hymnal was published by LifeWay Worship and contains 674 hymns, worship songs, and responsive readings.</p>
      </div>
      
      <div className="hymn-section">
        <h2>Popular Hymns</h2>
        <div className="hymn-grid">
          {[1, 2, 3, 4, 5, 6].map(id => (
            <Link to={`/hymn/${id}`} key={id} className="hymn-card">
              <div className="hymn-number">{id}</div>
              <div className="hymn-title">In Christ Alone</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Edition2008; 
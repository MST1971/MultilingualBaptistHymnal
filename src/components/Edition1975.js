import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Edition.css';

function Edition1975({ theme }) {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  
  // Function to go back to the previous page
  const goBack = () => {
    navigate(-1);
  };

  // Function to toggle history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Function to convert hymn title to URL-friendly slug
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_');
  };

  // Sample hymn data
  const hymns = [
    { id: 1, title: "How Great Thou Art", tune: "O STORE GUD" },
    { id: 2, title: "Amazing Grace", tune: "NEW BRITAIN" },
    { id: 3, title: "Blessed Assurance", tune: "ASSURANCE" },
    { id: 4, title: "It Is Well with My Soul", tune: "VILLE DU HAVRE" },
    { id: 5, title: "Great Is Thy Faithfulness", tune: "FAITHFULNESS" },
    { id: 6, title: "Victory in Jesus", tune: "HARTFORD" },
    { id: 7, title: "Because He Lives", tune: "RESURRECTION" },
    { id: 8, title: "Just As I Am", tune: "WOODWORTH" },
    { id: 9, title: "The Old Rugged Cross", tune: "THE OLD RUGGED CROSS" },
    { id: 10, title: "At Calvary", tune: "CALVARY" },
    { id: 11, title: "What a Friend We Have in Jesus", tune: "CONVERSE" },
    { id: 12, title: "I Love to Tell the Story", tune: "HANKEY" }
  ];

  return (
    <div className={`edition-page theme-${theme}`}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={goBack}>
          <span className="icon">←</span>
        </button>
        <div className="header-spacer"></div>
      </div>
      
      <div className="edition-topic-section">
        <div className="edition-header">
          <div className="edition-title">1975 Baptist Hymnal</div>
          <div className="edition-topic">Southern Baptist Convention</div>
        </div>
      </div>
      
      <div className="edition-meta">
        <span>Published: 1975</span>
        <span className="meta-separator">•</span>
        <span>Publisher: Convention Press</span>
      </div>
      
      <div className="edition-meta">
        <span>Hymns: 576</span>
        <span className="meta-separator">•</span>
        <span>Editor: William J. Reynolds</span>
        <span className="meta-separator">•</span>
        <button className="history-toggle" onClick={toggleHistory}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>
      
      {showHistory && (
        <div className="edition-history-box">
          <p>The 1975 Baptist Hymnal was a significant update that incorporated more contemporary gospel songs while maintaining traditional hymns. It was widely used in Southern Baptist churches through the 1980s and early 1990s.</p>
        </div>
      )}
      
      <div className="hymn-list-section">
        <div className="hymn-grid">
          {hymns.map(hymn => (
            <Link to={`/hymn/${createSlug(hymn.title)}`} key={hymn.id} className="hymn-card">
              <div className="hymn-number">{hymn.id}</div>
              <div className="hymn-title">{hymn.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Edition1975; 
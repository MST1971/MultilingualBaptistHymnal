import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Edition.css';

import { hymns2008 as allHymns } from '../data/hymns2008';

function Edition2008({ theme }) {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const hymnsPerPage = 50;
  
  // Load saved data on initial render
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('hymnFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    } else {
      // Check for legacy 2008 favorites
      const legacyFavorites = localStorage.getItem('hymnFavorites2008');
      if (legacyFavorites) {
        const parsedLegacy = JSON.parse(legacyFavorites);
        const prefixedLegacy = parsedLegacy.map(id => id.toString().startsWith('2008-') ? id : `2008-${id}`);
        setFavorites(prefixedLegacy);
        // We'll save them to the common storage in toggleFavorite or a separate useEffect
      }
    }
    
    const savedPage = localStorage.getItem('hymn2008Page');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);
  
  // Save current page to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hymn2008Page', currentPage.toString());
  }, [currentPage]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  const toggleFavorite = (e, hymnId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favoriteId = `2008-${hymnId}`;
    const newFavorites = favorites.includes(favoriteId)
      ? favorites.filter(id => id !== favoriteId)
      : [...favorites, favoriteId];
    
    setFavorites(newFavorites);
    localStorage.setItem('hymnFavorites', JSON.stringify(newFavorites));
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    document.querySelector('.hymn-list-section').scrollTop = 0;
  };

  const filteredHymns = allHymns.filter(hymn => 
    hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hymn.number.toString().includes(searchTerm) ||
    (hymn.tune && hymn.tune.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredHymns.length / hymnsPerPage);
  const startIndex = (currentPage - 1) * hymnsPerPage;
  const endIndex = startIndex + hymnsPerPage;
  const currentHymns = filteredHymns.slice(startIndex, endIndex);

  return (
    <div className={`edition-page theme-${theme}`}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={handleGoBack}>
          <span className="icon">←</span>
        </button>
        <div className="header-spacer"></div>
      </div>
      
      <div className="edition-topic-section">
        <div className="edition-header-stacked">
          <div className="edition-title">2008 Baptist Hymnal</div>
        </div>
      </div>
      
      <div className="edition-meta">
        <span>Denomination: Baptist</span>
        <span className="meta-separator">•</span>
        <span>Published: 2008</span>
        <span className="meta-separator">•</span>
        <span>Publisher: LifeWay Worship</span>
      </div>
      
      <div className="edition-meta">
        <span>Hymns: {allHymns.length}</span>
        <span className="meta-separator">•</span>
        <button className="history-toggle" onClick={toggleHistory}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>
      
      {showHistory && (
        <div className="edition-history-box">
          <p>The 2008 Baptist Hymnal was published by LifeWay Worship and contains 674 hymns, worship songs, and responsive readings.</p>
        </div>
      )}
      
      <div className="hymn-list-section">
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search hymns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-button" 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            
            <div className="page-info">
              Page {currentPage} of {totalPages}
            </div>
            
            <button 
              className="pagination-button" 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        )}
        
        <div className="hymn-grid">
          {currentHymns.map(hymn => (
            <Link to={`/hymn/${hymn.number}?edition=2008`} key={hymn.number} className="hymn-card">
              <div className="hymn-number">{hymn.number}</div>
              <div className="hymn-title">{hymn.title}</div>
              <button 
                className={`favorite-button ${favorites.includes(`2008-${hymn.number}`) ? 'active' : ''}`}
                onClick={(e) => toggleFavorite(e, hymn.number)}
              >
                <span className="favorite-icon">
                  {favorites.includes(`2008-${hymn.number}`) ? '★' : '☆'}
                </span>
              </button>
            </Link>
          ))}
        </div>
        
        {filteredHymns.length === 0 && (
          <div className="no-results">
            <p>No hymns found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Edition2008;
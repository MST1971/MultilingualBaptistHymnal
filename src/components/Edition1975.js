import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Edition.css';

function Edition1975({ theme }) {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const itemsPerPage = 50;

  // Load saved data on initial render
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('hymnFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Load last viewed page from localStorage
    const savedPage = localStorage.getItem('hymn1975Page');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);
  
  // Save current page to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hymn1975Page', currentPage.toString());
  }, [currentPage]);
  
  const goBack = () => {
    navigate(-1);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Function to toggle favorite status
  const toggleFavorite = (e, hymnId) => {
    e.preventDefault(); // Prevent navigation to hymn detail
    e.stopPropagation(); // Prevent event bubbling
    
    const favoriteId = `1975-${hymnId}`;
    const newFavorites = favorites.includes(favoriteId)
      ? favorites.filter(id => id !== favoriteId)
      : [...favorites, favoriteId];
    
    setFavorites(newFavorites);
    localStorage.setItem('hymnFavorites', JSON.stringify(newFavorites));
  };

  // Import hymns from shared data
  const { hymns1975 } = require('../data/hymns1975');
  
  // Filter hymns
  const filteredHymns = useMemo(() => {
    if (!searchQuery) return hymns1975;
    const lowerQuery = searchQuery.toLowerCase();
    return hymns1975.filter(hymn => 
      hymn.title.toLowerCase().includes(lowerQuery) || 
      hymn.number.toString().includes(lowerQuery) ||
      (hymn.tune && hymn.tune.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, hymns1975]);

  // Pagination
  const totalPages = Math.ceil(filteredHymns.length / itemsPerPage) || 1;
  
  // Reset to page 1 if search changes
  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const currentHymns = filteredHymns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll to top of list
    const section = document.querySelector('.hymn-list-section');
    if (section) section.scrollTop = 0;
  };

  return (
    <div className={`edition-page theme-${theme}`}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={goBack}>
          <span className="icon">←</span>
        </button>
        <div className="header-spacer"></div>
      </div>
      
      <div className="edition-topic-section">
        <div className="edition-header" style={{ flexDirection: 'column', alignItems: 'center' }}>
          <div className="edition-title" style={{ fontSize: '20px' }}>1975 Baptist Hymnal</div>
          <div className="edition-topic">Southern Baptist Convention</div>
        </div>
      </div>
      
      <div className="edition-meta" style={{ gap: '10px', flexWrap: 'wrap' }}>
        <span>Published: 1975</span>
        <span className="meta-separator">•</span>
        <span>Publisher: Convention Press</span>
      </div>
      
      <div className="edition-meta" style={{ gap: '10px', flexWrap: 'wrap' }}>
        <span>Hymns: 512</span>
        <span className="meta-separator">•</span>
        <span>Editor: William J. Reynolds</span>
        <span className="meta-separator">•</span>
        <button className="history-toggle" onClick={toggleHistory} style={{ 
          background: 'transparent', 
          border: '1px solid #ccc', 
          padding: '4px 8px', 
          borderRadius: '4px',
          color: 'inherit'
        }}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>
      
      {showHistory && (
        <div className="edition-history-box">
          <p>The 1975 Baptist Hymnal was a significant update that incorporated more contemporary gospel songs while maintaining traditional hymns. It was widely used in Southern Baptist churches through the 1980s and early 1990s.</p>
        </div>
      )}

      <div className="hymn-list-section">
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search hymns, numbers, or tunes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        
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
        
        <div className="hymn-grid">
          {currentHymns.map(hymn => (
            <Link to={`/hymn/${hymn.number}?edition=1975`} key={hymn.id} className="hymn-card">
              <div className="hymn-number">{hymn.number}</div>
              <div className="hymn-title">{hymn.title}</div>
              <button 
                className={`favorite-button ${favorites.includes(`1975-${hymn.number}`) ? 'active' : ''}`}
                onClick={(e) => toggleFavorite(e, hymn.number)}
              >
                <span className="favorite-icon">
                  {favorites.includes(`1975-${hymn.number}`) ? '★' : '☆'}
                </span>
              </button>
            </Link>
          ))}
        </div>
        
        {currentHymns.length === 0 && (
          <div className="no-results">
            <p>No hymns found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Edition1975;
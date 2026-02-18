import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hausaHymns } from '../data/hymnsHausa';
import './Edition.css';

function EditionHausa({ theme }) {
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
    }
    
    // Load last viewed page from localStorage
    const savedPage = localStorage.getItem('hymnHausaPage');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);
  
  // Save current page to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hymnHausaPage', currentPage.toString());
  }, [currentPage]);

  // Function to handle pagination
  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll to top of list
    document.querySelector('.hymn-list-section').scrollTop = 0;
  };

  // Filter hymns based on search term
  const filteredHymns = hausaHymns.filter(hymn => 
    hymn.title.toLowerCase().includes(searchTerm.toLowerCase())  ||
    hymn.number.toString().includes(searchTerm) ||
    hymn.theme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredHymns.length / hymnsPerPage);
  const startIndex = (currentPage - 1) * hymnsPerPage;
  const endIndex = startIndex + hymnsPerPage;
  const currentHymns = filteredHymns.slice(startIndex, endIndex);

  // Function to toggle history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  // Function to toggle favorite status
  const toggleFavorite = (e, hymnId) => {
    e.preventDefault(); // Prevent navigation to hymn detail
    e.stopPropagation(); // Prevent event bubbling
    
    const newFavorites = favorites.includes(hymnId)
      ? favorites.filter(id => id !== hymnId)
      : [...favorites, hymnId];
    
    setFavorites(newFavorites);
    localStorage.setItem('hymnFavorites', JSON.stringify(newFavorites));
  };

  return (
    <div className={`edition-page theme-${theme}`}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <div className="header-spacer"></div>
      </div>
      
      <div className="edition-topic-section">
        <div className="edition-header-stacked">
          <div className="edition-title">Hausa Baptist Hymnal</div>
          <div className="edition-topic">Littafin Wakoki Baptist na Hausa</div>
        </div>
      </div>
      
      <div className="edition-meta">
        <span>Published: 2024</span>
        <span className="meta-separator">•</span>
        <span>Publisher: Baptist Convention</span>
      </div>
      
      <div className="edition-meta">
        <span>Hymns: {hausaHymns.length}</span>
        <span className="meta-separator">•</span>
        <span>Language: Hausa</span>
        <span className="meta-separator">•</span>
        <button className="history-toggle" onClick={toggleHistory}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>
      
      {showHistory && (
        <div className="edition-history-box">
          <p>Littafin Wakoki Baptist na Hausa ya kunshi wakoki gargajiya da aka fassara zuwa harshen Hausa. The Hausa Baptist Hymnal contains traditional Baptist hymns translated into the Hausa language with cultural adaptations for Hausa-speaking congregations.</p>
        </div>
      )}

      
      <div className="hymn-list-section">
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Nemo waka ko jigo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        
        {/* Pagination Controls */}
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
            <Link to={`/hausa-hymn/${hymn.id}`} key={hymn.id} className="hymn-card">
              <div className="hymn-number">{hymn.number}</div>
              <div className="hymn-title">{hymn.title}</div>
              <button 
                className={`favorite-button ${favorites.includes(hymn.id) ? 'active' : ''}`}
                onClick={(e) => toggleFavorite(e, hymn.id)}
              >
                <span className="favorite-icon">
                  {favorites.includes(hymn.id) ? '★' : '☆'}
                </span>
              </button>
            </Link>
          ))}
        </div>
        
        {filteredHymns.length === 0 && (
          <div className="no-results">
            <p>Babu waka da ta dace da binciken ku.</p>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default EditionHausa;

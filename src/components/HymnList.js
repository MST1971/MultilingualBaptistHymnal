import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { hausaHymns } from '../data/hymnsHausa';
import { hymns1956 } from '../data/Edition1956';
import { hymns1975 } from '../data/hymns1975';
import { hymns1991 } from '../data/hymns1991';
import { hymns2008 } from '../data/hymns2008';
import { yorubaHymns } from '../data/hymnsYoruba';
import { igboHymns } from '../data/hymnsIgbo';
import './HymnList.css';

function HymnList({ theme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [language, setLanguage] = useState('1956');
  const [currentPage, setCurrentPage] = useState(1);
  const hymnsPerPage = 50;

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('hymnFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('hymnsLanguage');
    if (savedLang) {
      if (savedLang === 'english') {
        setLanguage('1956');
        localStorage.setItem('hymnsLanguage', '1956');
      } else {
        setLanguage(savedLang);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hymnsLanguage', language);
  }, [language]);

  // Load search query from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    if (query) {
      setSearchQuery(decodeURIComponent(query));
    }
  }, [location.search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, language]);

  // Save search to history
  const saveToHistory = (query) => {
    if (query.trim()) {
      const newHistory = [
        { query, type: searchType, timestamp: new Date().toISOString() },
        ...searchHistory.slice(0, 9) // Keep only last 10 searches
      ];
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    saveToHistory(searchQuery);
  };

  // Function to go back to the previous page
  const goBack = () => {
    navigate(-1);
  };

  // Add function to clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchType('all');
    setShowAdvanced(false);
    setShowHistory(false);
  };




  const sourceHymns = language === '1956' ? hymns1956
    : language === '1975' ? hymns1975
    : language === '1991' ? hymns1991
    : language === '2008' ? hymns2008
    : language === 'yoruba' ? yorubaHymns
    : language === 'igbo' ? igboHymns
    : hausaHymns;

  // Handle search filter based on type
  const filteredHymns = sourceHymns.filter(hymn => {
    const query = searchQuery.toLowerCase();
    switch (searchType) {
      case 'number':
        return hymn.number.toString().includes(query);
      case 'title':
        return hymn.title.toLowerCase().includes(query);
      case 'author':
        return hymn.author?.toLowerCase().includes(query);
      case 'tune':
        return hymn.tune?.toLowerCase().includes(query);
      case 'lyrics':
        return hymn.lyrics?.some(line =>
          line.toLowerCase().includes(query)
        );
      case 'all':
      default:
        return (
          hymn.number.toString().includes(query) ||
          hymn.title.toLowerCase().includes(query) ||
          hymn.author?.toLowerCase().includes(query) ||
          hymn.tune?.toLowerCase().includes(query) ||
          hymn.lyrics?.some(line => line.toLowerCase().includes(query))
        );
    }
  });

  // Simulate loading state when searching
  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setNoResults(filteredHymns.length === 0);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setNoResults(false);
    }
  }, [searchQuery, filteredHymns.length]);

  const sortedHymns = [...filteredHymns].sort((a, b) => a.title.localeCompare(b.title));
  const totalPages = Math.ceil(sortedHymns.length / hymnsPerPage) || 1;
  const startIndex = (currentPage - 1) * hymnsPerPage;
  const endIndex = startIndex + hymnsPerPage;
  const currentHymns = sortedHymns.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
    const listEl = document.querySelector('.hymn-list');
    if (listEl) listEl.scrollTop = 0;
  };

  const getFavoriteId = (hymn) => {
    if (language === '1975') return `1975-${hymn.number}`;
    if (language === '1991') return `1991-${hymn.number}`;
    if (language === '2008') return `2008-${hymn.number}`;
    if (language === '1956') return hymn.number;
    return hymn.id;
  };

  // Toggle favorite status
  const toggleFavorite = (e, hymn) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    const idToSave = getFavoriteId(hymn);

    const newFavorites = favorites.includes(idToSave)
      ? favorites.filter(id => id !== idToSave)
      : [...favorites, idToSave];

    setFavorites(newFavorites);
    localStorage.setItem('hymnFavorites', JSON.stringify(newFavorites));
  };

  return (
    <div className={`hymn-list theme-${theme}`}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={goBack}>
          <span className="icon">←</span>
        </button>
        <h1>The Hymns: Alphabetical Order</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-container">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search hymns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-button"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            <button
              type="button"
              className="advanced-search-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '▼' : '▶'}
            </button>
          </div>

          {showAdvanced && (
            <div className="advanced-search-options">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="search-type-select"
              >
                <option value="all">All Fields</option>
                <option value="number">Number</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="tune">Tune</option>
                <option value="lyrics">Lyrics</option>
              </select>

              <button
                type="button"
                className="search-history-toggle"
                onClick={() => setShowHistory(!showHistory)}
              >
                Search History
              </button>
            </div>
          )}
        </form>
        <div className="language-switch-bar">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="settings-select"
            style={{ maxWidth: '320px' }}
          >
            <option value="1956">1956</option>
            <option value="1975">1975</option>
            <option value="1991">1991</option>
            <option value="2008">2008</option>
            <option value="yoruba">Yoruba</option>
            <option value="igbo">Igbo</option>
            <option value="hausa">Hausa</option>
          </select>
        </div>

        {showHistory && (
          <div className="search-history-panel">
            <h3>Recent Searches</h3>
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => {
                  setSearchQuery(item.query);
                  setSearchType(item.type);
                  setShowHistory(false);
                }}
              >
                <span>{item.query}</span>
                <span className="history-type">{item.type}</span>
                <span className="history-time">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Searching hymns...</p>
        </div>
      ) : noResults ? (
        <div className="no-results">
          <p>No hymns found matching "{searchQuery}"</p>
          <button
            className="clear-search-link"
            onClick={handleClearSearch}
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            <div className="page-info">
              Page {currentPage} of {totalPages}
            </div>
            <button
              className="pagination-button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
          <div className="hymn-grid">
            {currentHymns.map(hymn => (
              <Link
                to={
                  ['1956', '1975', '1991', '2008'].includes(language) ? `/hymn/${hymn.number}?edition=${language}` :
                    language === 'yoruba' ? `/yoruba-hymn/${hymn.id}` :
                      language === 'igbo' ? `/igbo-hymn/${hymn.id}` :
                        `/hausa-hymn/${hymn.id}`
                }
                key={hymn.id}
                className="hymn-card"
              >
                <div className="hymn-number">{hymn.number}</div>
                <div className="hymn-title">{hymn.title}</div>
                <button
                  className={`favorite-button ${favorites.includes(getFavoriteId(hymn)) ? 'active' : ''}`}
                  onClick={(e) => toggleFavorite(e, hymn)}
                  aria-label={
                    favorites.includes(getFavoriteId(hymn))
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                >
                  <span className="favorite-icon">
                    {favorites.includes(getFavoriteId(hymn)) ? '★' : '☆'}
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HymnList;

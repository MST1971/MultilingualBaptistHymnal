import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { choruses } from '../data/choruses';
import { chorusesYoruba } from '../data/chorusesYoruba';
import { chorusesIgbo } from '../data/chorusesIgbo';
import { chorusesHausa } from '../data/chorusesHausa';
import './HymnList.css'; // For grid and card styles
import './Edition.css'; // For basic layout
import { useSettings } from '../context/SettingsContext';

function ChorusesList({ theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { language: settingsLanguage } = useSettings();
  const [language, setLanguage] = useState('english');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const savedLang = localStorage.getItem('chorusesLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    } else if (settingsLanguage) {
      const normalized = String(settingsLanguage).toLowerCase();
      const mapped = normalized === 'english' ? 'english'
        : normalized === 'yoruba' ? 'yoruba'
        : normalized === 'igbo' ? 'igbo'
        : normalized === 'hausa' ? 'hausa'
        : 'english';
      setLanguage(mapped);
    }
  }, [settingsLanguage]);

  useEffect(() => {
    localStorage.setItem('chorusesLanguage', language);
  }, [language]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, language]);

  const currentChoruses = language === 'english' ? choruses
    : language === 'yoruba' ? chorusesYoruba
    : language === 'igbo' ? chorusesIgbo
    : chorusesHausa;

  const filteredChoruses = currentChoruses.filter(chorus => {
    const searchLower = searchTerm.toLowerCase();
    return (
      chorus.title.toLowerCase().includes(searchLower) ||
      chorus.content.toLowerCase().includes(searchLower) ||
      chorus.id.toString().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredChoruses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredChoruses.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className={`edition-page theme-${theme}`} style={{ paddingBottom: '100px' }}>
      <div className="header-top-row">
        <Link to="/" className="back-button icon-only">
           <span className="icon">←</span>
        </Link>
        <h1>Choruses</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="search-container">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="settings-select"
          style={{ marginTop: '10px', marginBottom: '15px', maxWidth: '280px' }}
        >
          <option value="english">English</option>
          <option value="yoruba">Yoruba</option>
          <option value="igbo">Igbo</option>
          <option value="hausa">Hausa</option>
        </select>

        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search choruses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search-button"
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-controls" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginTop: '15px',
            alignItems: 'center'
          }}>
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className="nav-arrow"
              style={{ position: 'static', transform: 'none' }}
            >
              <span className="icon">←</span>
            </button>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className="nav-arrow"
              style={{ position: 'static', transform: 'none' }}
            >
              <span className="icon">→</span>
            </button>
          </div>
        )}
      </div>

      <div className="hymn-grid">
        {currentItems.map((chorus) => (
          <Link 
            to={`/chorus/${chorus.id}`} 
            key={chorus.id}
            className="hymn-card"
          >
            <span className="hymn-number">{chorus.id}</span>
            <span className="hymn-title">{chorus.title}</span>
          </Link>
        ))}
      </div>
      
      {filteredChoruses.length === 0 && (
        <div className="no-results">
          <p>No choruses found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}

export default ChorusesList;

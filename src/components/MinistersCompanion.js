import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Edition.css';
import './HymnList.css';
import { useSettings } from '../context/SettingsContext';
import { ministerCompanionData } from '../data/ministerCompanionData';

function MinistersCompanion({ theme }) {
  const navigate = useNavigate();
  const { language: settingsLanguage } = useSettings();
  const [language, setLanguage] = useState('english');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedLang = localStorage.getItem('ministersCompanionLanguage');
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
    localStorage.setItem('ministersCompanionLanguage', language);
  }, [language]);

  const getFilteredItems = () => {
    // Currently only English data is available
    return ministerCompanionData.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredItems = getFilteredItems();

  return (
    <div className={`edition-page theme-${theme}`} style={{ paddingBottom: '100px' }}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
           <span className="icon">←</span>
        </button>
        <h1>Minister's Companion</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search topics..."
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
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="settings-select"
          style={{ marginTop: '10px', maxWidth: '280px' }}
        >
          <option value="english">English</option>
          <option value="yoruba">Yoruba</option>
          <option value="igbo">Igbo</option>
          <option value="hausa">Hausa</option>
        </select>
      </div>

      <div className="hymn-section">
        {filteredItems.length === 0 ? (
          <div className="no-results" style={{ textAlign: 'center', padding: '20px' }}>
            <p>No items found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="hymn-grid">
            {filteredItems.map((item, index) => (
              <Link to={`/ministers-companion/${item.id}`} key={item.id} className="hymn-card">
                <div className="hymn-number">{index + 1}</div>
                <div className="hymn-title">{item.title}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MinistersCompanion;

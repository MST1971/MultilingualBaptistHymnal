import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { feelingsData } from '../data/feelings';
import { hymns as englishHymnsObj } from '../data/hymns';
import { yorubaHymns } from '../data/hymnsYoruba';
import { hausaHymns } from '../data/hymnsHausa';
import { igboHymns } from '../data/hymnsIgbo';
import './FeelingList.css';

function FeelingList({ theme }) {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('english');
  const [searchTerm, setSearchTerm] = useState('');
  
  const englishHymns = Object.values(englishHymnsObj);

  useEffect(() => {
    const savedLang = localStorage.getItem('hymnsLanguage');
    if (savedLang) {
      if (['1956', '1975', '1991', '2008'].includes(savedLang)) {
        setLanguage('english');
      } else if (['yoruba', 'hausa', 'igbo'].includes(savedLang)) {
        setLanguage(savedLang);
      } else {
        setLanguage('english');
      }
    }
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('hymnsLanguage', lang);
  };

  const getHymnCount = (feelingId) => {
    const feeling = feelingsData.find(f => f.id === feelingId);
    if (!feeling || !feeling.keywords) return 0;

    let hymns = [];
    let keywords = [];

    if (language === 'english') {
      hymns = englishHymns;
      keywords = feeling.keywords.english;
    } else if (language === 'yoruba') {
      hymns = yorubaHymns;
      keywords = feeling.keywords.yoruba;
    } else if (language === 'hausa') {
      hymns = hausaHymns;
      keywords = feeling.keywords.hausa;
    } else if (language === 'igbo') {
      hymns = igboHymns;
      keywords = feeling.keywords.igbo;
    }

    if (!keywords || keywords.length === 0) return 0;

    // Filter hymns
    const count = hymns.filter(hymn => {
      const title = hymn.title ? hymn.title.toLowerCase() : '';
      const lyrics = Array.isArray(hymn.lyrics) 
        ? hymn.lyrics.join(' ').toLowerCase() 
        : (hymn.lyrics || '').toLowerCase();
      
      return keywords.some(keyword => 
        title.includes(keyword.toLowerCase()) || lyrics.includes(keyword.toLowerCase())
      );
    }).length;

    return count;
  };

  const filteredFeelings = feelingsData.filter(feeling => {
    const titleText = (feeling.title && feeling.title[language]) || (feeling.title && feeling.title.english) || '';
    const title = titleText.toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={`feeling-list-container theme-${theme}`}>
      <div className="feeling-header">
        <h1>Feelings</h1>
        <div className="language-selector">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="settings-select"
            style={{ maxWidth: '200px' }}
          >
            <option value="english">English</option>
            <option value="yoruba">Yoruba</option>
            <option value="hausa">Hausa</option>
            <option value="igbo">Igbo</option>
          </select>
        </div>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="action-buttons">
        <Link to="/reading-plans" className="action-btn" style={{ textDecoration: 'none', textAlign: 'center', display: 'block' }}>Reading Plans</Link>
        <Link to="/find-church" className="action-btn" style={{ textDecoration: 'none', textAlign: 'center', display: 'block' }}>Find a Church</Link>
      </div>

      <div className="feelings-grid">
        {filteredFeelings.map(feeling => (
          <Link 
            to={`/feelings/${feeling.id}`} 
            key={feeling.id} 
            className="feeling-card"
            style={{ background: `linear-gradient(135deg, ${feeling.color} 0%, ${feeling.color}dd 100%)` }}
          >
            <div className="feeling-content">
              <h3>{(feeling.title && feeling.title[language]) || (feeling.title && feeling.title.english)}</h3>
              <div className="hymn-count">
                {getHymnCount(feeling.id)} hymns
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Spacer for bottom nav */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}

export default FeelingList;

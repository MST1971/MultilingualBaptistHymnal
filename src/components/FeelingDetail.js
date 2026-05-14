import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { feelingsData } from '../data/feelings';
import { hymns as englishHymnsObj } from '../data/hymns';
import { yorubaHymns } from '../data/hymnsYoruba';
import { hausaHymns } from '../data/hymnsHausa';
import { igboHymns } from '../data/hymnsIgbo';
import './FeelingDetail.css';
import './HymnList.css';

function FeelingDetail({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('english');
  const [hymns, setHymns] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('hymnFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const getFavoriteId = () => `FEEL-${id}`;

  const toggleFavorite = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const favoriteId = getFavoriteId();
    const newFavorites = favorites.includes(favoriteId)
      ? favorites.filter(favId => favId !== favoriteId)
      : [...favorites, favoriteId];
    
    setFavorites(newFavorites);
    localStorage.setItem('hymnFavorites', JSON.stringify(newFavorites));
  };

  const feeling = feelingsData.find(f => f.id === id);
  const englishHymns = Object.values(englishHymnsObj);

  useEffect(() => {
    const savedLang = localStorage.getItem('hymnsLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    if (!feeling) return;

    let allHymns = [];
    let keywords = [];

    if (language === 'english') {
      allHymns = englishHymns;
      keywords = feeling.keywords.english;
    } else if (language === 'yoruba') {
      allHymns = yorubaHymns;
      keywords = feeling.keywords.yoruba;
    } else if (language === 'hausa') {
      allHymns = hausaHymns;
      keywords = feeling.keywords.hausa;
    } else if (language === 'igbo') {
      allHymns = igboHymns;
      keywords = feeling.keywords.igbo;
    }

    const filtered = allHymns.filter(hymn => {
      const title = hymn.title ? hymn.title.toLowerCase() : '';
      const lyrics = Array.isArray(hymn.lyrics) 
        ? hymn.lyrics.join(' ').toLowerCase() 
        : (hymn.lyrics || '').toLowerCase();
      
      // If no keywords are defined for the language, include all hymns
      if (!keywords || keywords.length === 0) return true;

      return keywords.some(keyword => 
        title.includes(keyword.toLowerCase()) || lyrics.includes(keyword.toLowerCase())
      );
    });

    setHymns(filtered);
  }, [id, language, feeling]); // Added dependencies

  if (!feeling) {
    return <div className="feeling-detail-container">Feeling not found</div>;
  }

  const getHymnLink = (hymn) => {
    if (language === 'english') return `/hymn/${hymn.number}`;
    if (language === 'yoruba') return `/yoruba-hymn/${hymn.id}`;
    if (language === 'hausa') return `/hausa-hymn/${hymn.id}`;
    if (language === 'igbo') return `/igbo-hymn/${hymn.id}`;
    return '#';
  };

  return (
    <div className={`feeling-detail-container ${theme}`}>
      <div className="detail-header" style={{ backgroundColor: feeling.color }}>
        <div className="header-top-row" style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '15px' }}>
          <button className="back-btn" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: '18px', margin: 0 }}>{feeling.title[language]}</h1>
          </div>
          <button 
            className={`favorite-button ${favorites.includes(getFavoriteId()) ? 'active' : ''}`}
            onClick={toggleFavorite}
            title={favorites.includes(getFavoriteId()) ? "Remove from favorites" : "Add to favorites"}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', color: 'inherit' }}
          >
            <span className="favorite-icon" style={{ fontSize: '20px', color: favorites.includes(getFavoriteId()) ? 'gold' : 'inherit' }}>
              {favorites.includes(getFavoriteId()) ? '★' : '☆'}
            </span>
          </button>
        </div>
        <div className="header-content">
          <p>{hymns.length} hymns</p>
        </div>
      </div>

      <div className="hymns-list">
        {hymns.length === 0 ? (
          <div className="no-hymns">
            <p>No hymns found for this feeling in {language}.</p>
          </div>
        ) : (
          hymns.map((hymn, index) => (
            <Link to={getHymnLink(hymn)} key={index} className="hymn-item">
              <span className="hymn-number">{hymn.number}</span>
              <div className="hymn-info">
                <h3>{hymn.title}</h3>
              </div>
              <i className="fas fa-chevron-right"></i>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default FeelingDetail;

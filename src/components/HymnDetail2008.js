import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HymnDetail.css';

import { hymnDetails2008ByNumber } from '../data/hymnDetails2008';

function HymnDetail2008({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('hymnFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const getFavoriteId = () => `2008-${id.replace('2008H', '').replace('2008-', '')}`;

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

  // Safely parse ID
  let num;
  if (id && id.startsWith('2008H')) {
    num = parseInt(id.replace('2008H', ''), 10);
  } else {
    num = parseInt(id, 10);
  }

  const hymn = hymnDetails2008ByNumber[num];

  // Format title in proper title case
  const formatTitleCase = (title) => {
    if (typeof title !== 'string') return '';
    const lowercaseWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in',
      'into', 'nor', 'of', 'on', 'or', 'over', 'so', 'the', 'to', 'up', 'with'];
    const words = title.split(' ');
    return words.map((word, index) => {
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      if (lowercaseWords.includes(word.toLowerCase())) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePreviousHymn = () => {
    if (num > 1) {
      navigate(`/hymn2008/${num - 1}`);
    }
  };

  const handleNextHymn = () => {
    if (num < 674) {
      navigate(`/hymn2008/${num + 1}`);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Hymn ${hymn.number}: ${hymn.title}`,
          text: `Check out this beautiful hymn: ${hymn.title} (Hymn ${hymn.number})`,
          url: window.location.origin + `/hymn2008/${hymn.number}`
        });
      } else {
        setShowShareTooltip(!showShareTooltip);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const copyLink = () => {
    const url = window.location.origin + `/hymn2008/${hymn.number}`;
    navigator.clipboard.writeText(url);
    setShowShareTooltip(false);
  };

  if (!hymn) {
    return (
      <div className={`hymn-detail-page theme-${theme}`}>
        <div className="header-top-row">
          <button className="back-button icon-only" onClick={() => navigate(-1)}>
            <span className="icon">←</span>
          </button>
          <div className="header-spacer"></div>
        </div>
        <div className="hymn-topic-section">
          <h1>Hymn {id}</h1>
          <div className="hymn-topic">Unknown Theme</div>
          <div className="hymn-source">2008 Baptist Hymnal</div>
        </div>
        <div className="hymn-content">
          <div className="navigation-arrows">
            <button className="nav-arrow prev-arrow" onClick={handleGoBack}>
              <span className="icon">←</span>
            </button>
          </div>
          <div className="metadata-box">
             <div className="metadata-item">
               <span className="label">Number:</span>
               <span className="value">{id}</span>
             </div>
             <div className="metadata-item">
               <span className="value" style={{textAlign: 'center', width: '100%', fontStyle: 'italic'}}>
                 Hymn details not available.
               </span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  let stanzaCounter = 1;

  return (
    <div className={`hymn-detail-page theme-${theme}`}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <div className="header-spacer"></div>
        <button 
          className={`favorite-button ${favorites.includes(getFavoriteId()) ? 'active' : ''}`}
          onClick={toggleFavorite}
          title={favorites.includes(getFavoriteId()) ? "Remove from favorites" : "Add to favorites"}
        >
          <span className="favorite-icon">
            {favorites.includes(getFavoriteId()) ? '★' : '☆'}
          </span>
        </button>
      </div>

      <div className="hymn-topic-section">
        <h1>{formatTitleCase(hymn.title)}</h1>
        <div className="hymn-topic">{hymn.theme ? hymn.theme.toUpperCase() : 'GENERAL'}</div>
        <div className="hymn-source">2008 Baptist Hymnal</div>
      </div>

      <div className="hymn-content">
        <div className="navigation-arrows">
          <button
            className="nav-arrow prev-arrow"
            onClick={handlePreviousHymn}
            disabled={num <= 1}
          >
            <span className="icon">←</span>
          </button>
          <button
            className="nav-arrow next-arrow"
            onClick={handleNextHymn}
            disabled={num >= 674}
          >
            <span className="icon">→</span>
          </button>
        </div>

        <div className="floating-share" style={{ top: '35%' }}>
          <button
            className="share-button"
            onClick={() => setShowNoteModal(true)}
            aria-label="Add note"
            style={{ marginBottom: '10px' }}
          >
            <span className="icon">📝</span>
          </button>
          <button
            className="share-button"
            onClick={handleShare}
            aria-label="Share hymn"
          >
            <span className="icon">↗️</span>
          </button>
          {showShareTooltip && (
            <div className="share-tooltip visible">
              <div className="share-option" onClick={copyLink}>
                <span className="icon">📋</span>
                Copy Link
              </div>
              <div className="share-option" onClick={() => setShowShareTooltip(false)}>
                <span className="icon">✕</span>
                Close
              </div>
            </div>
          )}
        </div>

        <div className="metadata-box">
          <div className="metadata-item">
            <span className="label">Number:</span>
            <span className="value">{hymn.number}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Author:</span>
            <span className="value">{hymn.author || ''}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Composer:</span>
            <span className="value">{hymn.composer || ''}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Tune:</span>
            <span className="value">{hymn.tune || ''}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Meter:</span>
            <span className="value">{hymn.meter || ''}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Key:</span>
            <span className="value">{hymn.key || ''}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Year:</span>
            <span className="value">{hymn.year || ''}</span>
          </div>
          <div className="metadata-item" data-type="scripture">
            <span className="label">Scripture:</span>
            <span className="value">{hymn.scripture || ''}</span>
          </div>
        </div>

        <div className="lyrics" style={{
          userSelect: 'text',
          WebkitUserSelect: 'text',
          MozUserSelect: 'text',
          msUserSelect: 'text'
        }}>
          {hymn.lyrics && hymn.lyrics.map((verseObj, index) => (
            <div key={`stanza-${index}`} className="stanza" style={{ marginTop: 0, marginBottom: '20px', display: 'flex', flexDirection: 'row' }}>
              <div className="stanza-number" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                {verseObj.verse ? `${verseObj.verse}.` : `${stanzaCounter++}.`}
              </div>
              <div className="stanza-text">
                {verseObj.text.map((line, lineIndex) => (
                  <div key={lineIndex} className="line" style={{ marginTop: 0, marginBottom: '1px' }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {hymn.chorus && (
             <div className="refrain" style={{ fontStyle: 'italic', marginLeft: '40px', marginTop: '12px', marginBottom: '12px' }}>
                {hymn.chorus.lines.map((line, lineIndex) => (
                   <div key={lineIndex} className="line" style={{ ...(lineIndex > 0 ? { marginLeft: '45px' } : {}), marginTop: 0, marginBottom: '4px' }}>
                     {line}
                   </div>
                ))}
             </div>
          )}
        </div>

        <div className="hymn-history">
          <h3>History</h3>
          <p>{hymn.history || ''}</p>
        </div>
      </div>

      {showNoteModal && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '500px',
            color: theme === 'dark' ? '#fff' : '#000'
          }}>
            <h3>Hymn Note</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your personal notes for this hymn..."
              style={{
                width: '100%', height: '150px', marginTop: '10px', marginBottom: '20px',
                padding: '10px', borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: theme === 'dark' ? '#444' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
                fontFamily: 'inherit'
              }}
            />
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowNoteModal(false)} style={{
                padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                backgroundColor: '#ccc'
              }}>Cancel</button>
              <button onClick={() => setShowNoteModal(false)} style={{
                padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                backgroundColor: '#4a90e2', color: 'white'
              }}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HymnDetail2008;

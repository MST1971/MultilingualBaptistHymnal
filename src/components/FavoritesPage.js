import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHymnById } from '../data/hymns';
import { hymns1975 } from '../data/hymns1975';
import { hymns1991 } from '../data/hymns1991';
import { hymns2008 } from '../data/hymns2008';
import { yorubaHymns } from '../data/hymnsYoruba';
import { hausaHymns } from '../data/hymnsHausa';
import { igboHymns } from '../data/hymnsIgbo';
import { ministerCompanionData } from '../data/ministerCompanionData';
import { feelingsData } from '../data/feelings';
import { choruses } from '../data/choruses';
import { chorusesYoruba } from '../data/chorusesYoruba';
import { chorusesIgbo } from '../data/chorusesIgbo';
import { chorusesHausa } from '../data/chorusesHausa';
import { responsiveReadings, yorubaResponsiveReadings, igboResponsiveReadings, hausaResponsiveReadings } from '../data/responsiveReadings';
import './FavoritesPage.css';

function FavoritesPage({ theme }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recent'); // Default to Recent as per image
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [notes, setNotes] = useState({});

  // Load saved data on initial render
  useEffect(() => {
    // Load favorites
    const savedFavorites = localStorage.getItem('hymnFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Load notes
    const savedNotes = localStorage.getItem('hymnNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    // Load recents or seed with demo data
    const savedRecents = localStorage.getItem('recentlyVisitedHymns');
    if (savedRecents) {
      setRecents(JSON.parse(savedRecents));
    } else {
      // Demo data from the image
      const demoRecents = [
        { number: '291', title: "Oh, for a thousand tongues to sing", category: "Unknown", timestamp: "1/26/2026 6:28:22 AM" },
        { number: '001', title: "Praise God, from whom all blessings flow", category: "Praise", timestamp: "1/26/2026 6:26:08 AM" },
        { number: '337', title: "O Jesus, I have promised", category: "Unknown", timestamp: "1/25/2026 6:54:58 PM" },
        { number: '313', title: "Sweet hour of prayer", category: "Unknown", timestamp: "1/25/2026 11:36:59 AM" }
      ];
      setRecents(demoRecents);
      localStorage.setItem('recentlyVisitedHymns', JSON.stringify(demoRecents));
    }
  }, []);

  const handleHymnClick = (id) => {
    const idStr = id.toString();
    if (idStr.startsWith('CHO-')) {
      const parts = idStr.split('-');
      const langMap = { 'E': 'english', 'Y': 'yoruba', 'I': 'igbo', 'H': 'hausa' };
      const langCode = parts[1];
      const chorusId = parts[2];
      navigate(`/chorus/${chorusId}?lang=${langMap[langCode] || 'english'}`);
    } else if (idStr.startsWith('RR-')) {
      const readingId = idStr.substring(3);
      navigate(`/reading/${readingId}`);
    } else if (idStr.startsWith('MC-')) {
      const itemId = idStr.substring(3);
      navigate(`/ministers-companion/${itemId}`);
    } else if (idStr.startsWith('CC-')) {
      navigate('/church-covenant');
    } else if (idStr.startsWith('FEEL-')) {
      const feelingId = idStr.substring(5);
      navigate(`/feelings/${feelingId}`);
    } else if (idStr.startsWith('YBH')) {
      navigate(`/yoruba-hymn/${idStr}`);
    } else if (idStr.startsWith('HBH')) {
      navigate(`/hausa-hymn/${idStr}`);
    } else if (idStr.startsWith('IBH')) {
      navigate(`/igbo-hymn/${idStr}`);
    } else if (idStr.startsWith('1975-')) {
      navigate(`/hymn/${idStr.split('-')[1]}?edition=1975`);
    } else if (idStr.startsWith('1991-')) {
      navigate(`/hymn/${idStr.split('-')[1]}?edition=1991`);
    } else if (idStr.startsWith('2008-')) {
      navigate(`/hymn/${idStr.split('-')[1]}?edition=2008`);
    } else if (idStr.startsWith('1956-')) {
      navigate(`/hymn/${idStr.split('-')[1]}?edition=1956`);
    } else {
      navigate(`/hymn/${id}`);
    }
  };

  const renderContent = () => {
    if (activeTab === 'recent') {
      return (
        <>
          <div className="tab-content-header">
            <h3>Visited / Sang Hymns</h3>
            <p>History of hymns you visited or sang</p>
          </div>
          <div className="hymn-list">
            {recents.map((hymn, index) => (
              <div key={index} className="hymn-list-card" onClick={() => handleHymnClick(hymn.number)}>
                <div className="hymn-badge">{hymn.number}</div>
                <div className="hymn-info">
                  <h4 className="hymn-title-text">{hymn.title}</h4>
                  <div className="hymn-meta">{hymn.category || 'Unknown'}</div>
                  <div className="hymn-timestamp">{hymn.timestamp}</div>
                </div>
              </div>
            ))}
            {recents.length === 0 && <p className="empty-state">No recently visited hymns.</p>}
          </div>
        </>
      );
    } else if (activeTab === 'favorites') {
      return (
        <>
          <div className="tab-content-header">
            <h3>My Favorites</h3>
            <p>Hymns you have marked as favorite</p>
          </div>
          <div className="hymn-list">
            {favorites.length > 0 ? (
              favorites.map((id, index) => {
                let hymn = null;
                let title = `Hymn ${id}`;
                let category = 'Saved Favorite';
                const idStr = id.toString();

                if (idStr.startsWith('CHO-')) {
                  const parts = idStr.split('-');
                  const langCode = parts[1];
                  const chorusId = parts[2];
                  let source = choruses;
                  let langName = "English";
                  if (langCode === 'Y') { source = chorusesYoruba; langName = "Yoruba"; }
                  else if (langCode === 'I') { source = chorusesIgbo; langName = "Igbo"; }
                  else if (langCode === 'H') { source = chorusesHausa; langName = "Hausa"; }
                  
                  hymn = source.find(c => c.id.toString() === chorusId.toString());
                  if (hymn) {
                    title = hymn.title;
                    category = `${langName} Chorus`;
                  }
                } else if (idStr.startsWith('RR-')) {
                  const readingId = idStr.substring(3);
                  const isNumeric = !isNaN(readingId) && !isNaN(parseFloat(readingId));
                  if (isNumeric) {
                    hymn = responsiveReadings.find(r => r.id === parseInt(readingId));
                    category = "Responsive Reading";
                  } else if (readingId.startsWith('YRR')) {
                    hymn = yorubaResponsiveReadings.find(r => r.id === readingId);
                    category = "Yoruba Responsive Reading";
                  } else if (readingId.startsWith('IRR')) {
                    hymn = igboResponsiveReadings.find(r => r.id === readingId);
                    category = "Igbo Responsive Reading";
                  } else if (readingId.startsWith('HRR')) {
                    hymn = hausaResponsiveReadings.find(r => r.id === readingId);
                    category = "Hausa Responsive Reading";
                  }
                  if (hymn) {
                     title = hymn.title;
                   }
                 } else if (idStr.startsWith('MC-')) {
                   const itemId = idStr.substring(3);
                   hymn = ministerCompanionData.find(m => m.id === itemId);
                   if (hymn) {
                     title = hymn.title;
                     category = "Minister's Companion";
                   }
                 } else if (idStr.startsWith('CC-')) {
                   title = "Church Covenant";
                   category = "Covenant";
                 } else if (idStr.startsWith('FEEL-')) {
                   const feelingId = idStr.substring(5);
                   const feeling = feelingsData.find(f => f.id === feelingId);
                   if (feeling) {
                     title = feeling.title.english;
                     category = "Feeling";
                   }
                 } else if (idStr.startsWith('YBH')) {
                  const num = idStr.includes('-') ? idStr.split('-')[1] : idStr.replace('YBH', '');
                  hymn = yorubaHymns.find(h => h.id === `YBH${num}`);
                  if (hymn) {
                    title = hymn.title;
                    category = "Yoruba Hymn";
                  }
                } else if (idStr.startsWith('HBH')) {
                  const num = idStr.includes('-') ? idStr.split('-')[1] : idStr.replace('HBH', '');
                  hymn = hausaHymns.find(h => h.id === `HBH${num}`);
                  if (hymn) {
                    title = hymn.title;
                    category = hymn.theme || "Hausa Hymn";
                  }
                } else if (idStr.startsWith('IBH')) {
                  const num = idStr.includes('-') ? idStr.split('-')[1] : idStr.replace('IBH', '');
                  hymn = igboHymns.find(h => h.id === `IBH${num}`);
                  if (hymn) {
                    title = hymn.title;
                    category = hymn.theme || "Igbo Hymn";
                  }
                } else if (idStr.startsWith('1975-')) {
                  const num = idStr.split('-')[1];
                  hymn = hymns1975.find(h => h.number.toString() === num.toString());
                  if (hymn) {
                    title = hymn.title;
                    category = "1975 Baptist Hymnal";
                  }
                } else if (idStr.startsWith('1991-')) {
                  const num = idStr.split('-')[1];
                  hymn = hymns1991.find(h => h.number.toString() === num.toString());
                  if (hymn) {
                    title = hymn.title;
                    category = "1991 Baptist Hymnal";
                  }
                } else if (idStr.startsWith('2008-')) {
                  const num = idStr.split('-')[1];
                  hymn = hymns2008.find(h => h.number.toString() === num.toString());
                  if (hymn) {
                    title = hymn.title;
                    category = "2008 Baptist Hymnal";
                  }
                } else if (idStr.startsWith('1956-')) {
                  const num = idStr.split('-')[1];
                  hymn = getHymnById(num);
                  if (hymn) {
                    title = hymn.title;
                    category = "1956 Baptist Hymnal";
                  }
                } else {
                  // legacy 1956 Edition without prefix
                  hymn = getHymnById(id);
                  if (hymn) {
                    title = hymn.title;
                    category = "1956 Baptist Hymnal";
                  }
                }
                
                const displayBadge = idStr.includes('-') ? idStr.split('-').pop() :
                                   idStr.startsWith('YBH') ? idStr.substring(3) :
                                   idStr.startsWith('HBH') ? idStr.substring(3) :
                                   idStr.startsWith('IBH') ? idStr.substring(3) : idStr;
                
                return (
                  <div key={index} className="hymn-list-card" onClick={() => handleHymnClick(id)}>
                    <div className="hymn-badge">{displayBadge}</div>
                    <div className="hymn-info">
                      <h4 className="hymn-title-text">{title}</h4>
                      <div className="hymn-meta">{category}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-state">No favorites added yet.</p>
            )}
          </div>
        </>
      );
    } else if (activeTab === 'notes') {
      const noteKeys = Object.keys(notes);
      return (
        <>
          <div className="tab-content-header">
            <h3>My Notes</h3>
            <p>Personal notes on hymns</p>
          </div>
          <div className="hymn-list">
            {noteKeys.length > 0 ? (
              noteKeys.map((id, index) => {
                let hymn = null;
                let title = `Hymn ${id}`;
                const idStr = id.toString();
                
                if (idStr.startsWith('YBH')) {
                  const num = idStr.includes('-') ? idStr.split('-')[1] : idStr.replace('YBH', '');
                  hymn = yorubaHymns.find(h => h.id === `YBH${num}`);
                  if (hymn) title = hymn.title;
                } else if (idStr.startsWith('HBH')) {
                  const num = idStr.includes('-') ? idStr.split('-')[1] : idStr.replace('HBH', '');
                  hymn = hausaHymns.find(h => h.id === `HBH${num}`);
                  if (hymn) title = hymn.title;
                } else if (idStr.startsWith('IBH')) {
                  const num = idStr.includes('-') ? idStr.split('-')[1] : idStr.replace('IBH', '');
                  hymn = igboHymns.find(h => h.id === `IBH${num}`);
                  if (hymn) title = hymn.title;
                } else if (idStr.startsWith('1975-')) {
                  const num = idStr.split('-')[1];
                  hymn = hymns1975.find(h => h.number.toString() === num.toString());
                  if (hymn) title = hymn.title;
                } else if (idStr.startsWith('1991-')) {
                  const num = idStr.split('-')[1];
                  hymn = hymns1991.find(h => h.number.toString() === num.toString());
                  if (hymn) title = hymn.title;
                } else if (idStr.startsWith('2008-')) {
                  const num = idStr.split('-')[1];
                  hymn = hymns2008.find(h => h.number.toString() === num.toString());
                  if (hymn) title = hymn.title;
                } else if (idStr.startsWith('1956-')) {
                  const num = idStr.split('-')[1];
                  hymn = getHymnById(num);
                  if (hymn) title = hymn.title;
                } else {
                  hymn = getHymnById(id);
                  if (hymn) title = hymn.title;
                }

                const notePreview = notes[id].length > 50 ? notes[id].substring(0, 50) + '...' : notes[id];
                
                return (
                  <div key={index} className="hymn-list-card" onClick={() => handleHymnClick(id)}>
                    <div className="hymn-badge" style={{backgroundColor: '#e67e22'}}>📝</div>
                    <div className="hymn-info">
                      <h4 className="hymn-title-text">{title}</h4>
                      <div className="hymn-meta">{notePreview}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-state">No notes created yet.</p>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <div className={`my-hymns-container theme-${theme}`}>
      <h1 className="my-hymns-title">My Hymns</h1>
      
      <div className="tabs-header">
        <div 
          className={`tab-item ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </div>
        <div 
          className={`tab-item ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </div>
        <div 
          className={`tab-item ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </div>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default FavoritesPage; 
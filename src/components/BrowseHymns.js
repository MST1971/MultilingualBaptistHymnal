import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hausaHymns } from '../data/hymnsHausa';
import { hymns1956 } from '../data/Edition1956';
import { hymns1975 } from '../data/hymns1975';
import { hymns1991 } from '../data/hymns1991';
import { hymns2008 } from '../data/hymns2008';
import { yorubaHymns } from '../data/hymnsYoruba';
import { igboHymns } from '../data/hymnsIgbo';
import './BrowseHymns.css';
import { useSettings } from '../context/SettingsContext';

const translations = {
  english: {
    Author: 'Author',
    Composer: 'Composer',
    Tune: 'Tune',
    Meter: 'Meter',
    Key: 'Key',
    SearchPlaceholder: 'Search',
    NoResults: 'No',
    Found: 'found matching',
    BrowseHymns: 'Browse Hymns',
    BackTo: 'Back to'
  },
  yoruba: {
    Author: 'Olukọwe',
    Composer: 'Olupilẹṣẹ',
    Tune: 'Ohun Orin',
    Meter: 'Iwọn',
    Key: 'Kọkọrọ',
    SearchPlaceholder: 'Wa',
    NoResults: 'Ko si',
    Found: 'to baamu',
    BrowseHymns: 'Ṣawakiri Awọn Orin',
    BackTo: 'Pada si'
  },
  hausa: {
    Author: 'Marubuci',
    Composer: 'Mawaki',
    Tune: 'Waka',
    Meter: "Ma'auni",
    Key: 'Mabuɗi',
    SearchPlaceholder: 'Nema',
    NoResults: 'Babu',
    Found: 'da aka samu daidai da',
    BrowseHymns: 'Bincika Wakoki',
    BackTo: 'Koma zuwa'
  },
  igbo: {
    Author: 'Odee',
    Composer: 'Onye Dere',
    Tune: 'Olu',
    Meter: 'Mita',
    Key: 'Igodo',
    SearchPlaceholder: 'Chọọ',
    NoResults: 'Onweghị',
    Found: 'hụrụ',
    BrowseHymns: 'Chọgharịa Abu',
    BackTo: 'Laghachi na'
  }
};

function BrowseHymns({ theme }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Author');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { language: settingsLanguage } = useSettings();
  const [language, setLanguage] = useState('1956');

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('hymnsLanguage');
    if (savedLang) {
      if (savedLang === 'english') {
        setLanguage('1956');
      } else {
        setLanguage(savedLang);
      }
    } else if (settingsLanguage) {
      const normalized = String(settingsLanguage).toLowerCase();
      const mapped = normalized === 'english' ? '1956'
        : normalized === 'yoruba' ? 'yoruba'
        : normalized === 'igbo' ? 'igbo'
        : normalized === 'hausa' ? 'hausa'
        : '1956';
      setLanguage(mapped);
      localStorage.setItem('hymnsLanguage', mapped);
    }
  }, [settingsLanguage]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('hymnsLanguage', language);
  }, [language]);

  // Determine current translation language
  const currentLangKey = useMemo(() => {
    if (language === 'yoruba') return 'yoruba';
    if (language === 'hausa') return 'hausa';
    if (language === 'igbo') return 'igbo';
    return 'english';
  }, [language]);

  const t = translations[currentLangKey];

  // Determine which hymns to use
  const currentHymns = useMemo(() => {
    switch (language) {
      case '1956': return hymns1956;
      case '1975': return hymns1975;
      case '1991': return hymns1991;
      case '2008': return hymns2008;
      case 'yoruba': return yorubaHymns;
      case 'igbo': return igboHymns;
      case 'hausa': return hausaHymns;
      default: return hymns1956;
    }
  }, [language]);

  // Extract data based on category
  const groupedData = useMemo(() => {
    const groups = {};
    const normalize = (str) => str ? str.toString().trim() : 'Unknown';

    currentHymns.forEach(hymn => {
      let key = 'Unknown';
      
      switch (activeCategory) {
        case 'Author':
          key = normalize(hymn.author);
          break;
        case 'Composer':
          key = normalize(hymn.composer);
          break;
        case 'Tune':
          key = normalize(hymn.tune);
          break;
        case 'Meter':
          key = normalize(hymn.meter);
          break;
        case 'Key':
          key = normalize(hymn.key);
          break;
        default:
          key = 'Unknown';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(hymn);
    });

    return groups;
  }, [currentHymns, activeCategory]);

  // Filter items based on search
  const displayItems = useMemo(() => {
    const items = Object.keys(groupedData).sort();
    if (!searchTerm) return items;
    return items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groupedData, searchTerm]);

  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
      setSearchTerm('');
    } else {
      navigate(-1);
    }
  };

  const getHymnLink = (hymn) => {
    if (['1956', '1975', '1991', '2008'].includes(language)) {
      return `/hymn/${hymn.number}?edition=${language}`;
    } else if (language === 'yoruba') {
      return `/yoruba-hymn/${hymn.id}`;
    } else if (language === 'igbo') {
      return `/igbo-hymn/${hymn.id}`;
    } else {
      return `/hausa-hymn/${hymn.id}`;
    }
  };

  return (
    <div className={`browse-hymns-container theme-${theme}`}>
      <div className="browse-header">
        <button className="back-button" onClick={handleBack}>
          ←
        </button>
        <h1>{selectedItem ? selectedItem : t.BrowseHymns}</h1>
      </div>

      {!selectedItem && (
        <>
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

          <div className="category-pills">
            {['Author', 'Composer', 'Tune', 'Meter', 'Key'].map(cat => (
              <button
                key={cat}
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchTerm('');
                }}
              >
                {t[cat]}
              </button>
            ))}
          </div>

          <div className="browse-search-container">
            <input
              type="text"
              className="browse-search-input"
              placeholder={`${t.SearchPlaceholder} ${t[activeCategory]}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="browse-list">
            {displayItems.map(item => (
              <div 
                key={item} 
                className="browse-list-item"
                onClick={() => setSelectedItem(item)}
              >
                <h3 className="browse-item-title">{item}</h3>
                <span className="browse-item-count">{groupedData[item].length}</span>
              </div>
            ))}
            {displayItems.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                {t.NoResults} {t[activeCategory].toLowerCase()} {t.Found} "{searchTerm}"
              </div>
            )}
          </div>
        </>
      )}

      {selectedItem && (
        <div className="hymn-list-view">
           <button className="back-button-sub" onClick={handleBack}>
              ← {t.BackTo} {t[activeCategory]}s
            </button>
          <div className="browse-list">
            {groupedData[selectedItem].map(hymn => (
              <Link 
                key={hymn.id} 
                to={getHymnLink(hymn)}
                className="browse-hymn-card"
              >
                <span className="browse-hymn-number">{hymn.number}</span>
                <h3 className="browse-hymn-title">{hymn.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseHymns;

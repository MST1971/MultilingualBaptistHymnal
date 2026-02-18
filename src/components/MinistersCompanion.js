import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MinistersCompanion.css';
import { useSettings } from '../context/SettingsContext';

function MinistersCompanion({ theme }) {
  const navigate = useNavigate();
  const { language: settingsLanguage } = useSettings();
  const [language, setLanguage] = useState('english');

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

  const resourcesContent = {
    english: {
      title: "Minister's Resources",
      intro: "This section will contain resources for ministers including:",
      items: [
        "Liturgies and Orders of Service",
        "Prayers for Various Occasions",
        "Scripture Readings",
        "Sermon Notes & Helps"
      ],
      badge: "Coming Soon"
    },
    yoruba: {
      title: "Awọn Ohun Elo fun Oluso-agutan",
      intro: "Abala yii yoo ni awọn ohun elo fun awọn oluso-agutan pẹlu:",
      items: [
        "Awọn Ilana Ijọsin",
        "Adura fun Awọn Igba Oniruru",
        "Awọn Eko Bibeli",
        "Awọn Akọsilẹ Iwaasu"
      ],
      badge: "A N Bọ"
    },
    igbo: {
      title: "Ngwa Ọrụ Maka Onye Ozi",
      intro: "Nkebi a ga-enwe ngwa ọrụ maka ndị ozi gụnyere:",
      items: [
        "Usoro Ofufe",
        "Ekpere Maka Oge Dị Iche Iche",
        "Ọgụgụ Akwụkwọ Nsọ",
        "Ihe Edeturu Maka Ozizi"
      ],
      badge: "Ọ Na-abịa"
    },
    hausa: {
      title: "Kayan Aiki don Mai Wa'azi",
      intro: "Wannan bangare zai kunshi kayan aiki ga masu wa'azi ciki har da:",
      items: [
        "Tsarin Ibada",
        "Addu'o'i na Lokuta Daban-daban",
        "Karatun Nassosi",
        "Bayanan Wa'azi"
      ],
      badge: "Yana Zuwa"
    }
  };

  const currentContent = resourcesContent[language] || resourcesContent.english;

  return (
    <div className={`ministers-companion-page theme-${theme}`}>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>{currentContent.title}</h1>
      </div>

      <div className="language-switch-container" style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="settings-select"
          style={{ maxWidth: '280px' }}
        >
          <option value="english">English</option>
          <option value="yoruba">Yoruba</option>
          <option value="igbo">Igbo</option>
          <option value="hausa">Hausa</option>
        </select>
      </div>
      
      <div className="content-placeholder">
        <div className="icon-large">
          <i className="fas fa-user-tie"></i>
        </div>
        <h2>{currentContent.title}</h2>
        <p style={{ 
          fontSize: '11px', 
          lineHeight: '1.5', 
          fontFamily: "'Merriweather', serif",
          textAlign: 'justify'
        }}>{currentContent.intro}</p>
        <ul className="feature-list" style={{ 
          fontSize: '11px', 
          lineHeight: '1.5', 
          fontFamily: "'Merriweather', serif",
          textAlign: 'justify'
        }}>
          {currentContent.items.map((item, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
          ))}
        </ul>
        <div className="coming-soon-badge">{currentContent.badge}</div>
      </div>
    </div>
  );
}

export default MinistersCompanion;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ReadingPlans.css';
import { useSettings } from '../context/SettingsContext';

function ReadingPlans({ theme }) {
  const navigate = useNavigate();
  const { language: settingsLanguage } = useSettings();
  const [language, setLanguage] = useState('english');
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const savedLang = localStorage.getItem('hymnsLanguage');
    if (savedLang) {
      if (['1956', '1975', '1991', '2008'].includes(savedLang)) {
        setLanguage('english');
      } else if (['yoruba', 'hausa', 'igbo', 'english'].includes(savedLang)) {
        setLanguage(savedLang);
      }
    } else if (settingsLanguage) {
      const normalized = String(settingsLanguage).toLowerCase();
      const mapped = normalized === 'english' ? 'english'
        : normalized === 'yoruba' ? 'yoruba'
        : normalized === 'igbo' ? 'igbo'
        : normalized === 'hausa' ? 'hausa'
        : 'english';
      setLanguage(mapped);
    }
    const savedPlans = localStorage.getItem('readingPlans');
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, [settingsLanguage]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('hymnsLanguage', lang);
  };

  const translations = {
    createNew: {
      english: 'Create New',
      yoruba: 'Ṣẹda Tuntun',
      hausa: 'Ƙirƙiri Sabo',
      igbo: 'Mepụta Ọhụrụ'
    }
  };

  const planTypes = [
    { 
      id: 'worship', 
      title: {
        english: 'Worship Service',
        yoruba: 'Isin Ijọsin',
        hausa: 'Ibada',
        igbo: 'Ozi Ofufe'
      }, 
      color: '#4285f4' 
    },
    { 
      id: 'wedding', 
      title: {
        english: 'Wedding',
        yoruba: 'Igbeyawo',
        hausa: 'Aure',
        igbo: 'Agbamakwụkwọ'
      }, 
      color: '#ff8c00' 
    },
    { 
      id: 'funeral', 
      title: {
        english: 'Funeral',
        yoruba: 'Isinku',
        hausa: "Jana'iza",
        igbo: 'Ekwamozu'
      }, 
      color: '#636672' 
    },
    { 
      id: 'baptism', 
      title: {
        english: 'Baptism',
        yoruba: 'Iribomi',
        hausa: 'Baftisma',
        igbo: 'Baptism'
      }, 
      color: '#2bb6c8' 
    },
    { 
      id: 'thanksgiving', 
      title: {
        english: 'Thanksgiving',
        yoruba: 'Idupẹ',
        hausa: 'Godiya',
        igbo: 'Ekele'
      }, 
      color: '#8d725e' 
    },
    { 
      id: 'youth', 
      title: {
        english: 'Youth Service',
        yoruba: 'Isin Awọn Ọdọ',
        hausa: 'Ibadan Matasa',
        igbo: 'Ozi Ndị Ntorobịa'
      }, 
      color: '#5e81f4' 
    },
    { 
      id: 'christmas', 
      title: {
        english: 'Christmas',
        yoruba: 'Keresimesi',
        hausa: 'Kirsimeti',
        igbo: 'Keresimesi'
      }, 
      color: '#1a9e6d' 
    },
    { 
      id: 'easter', 
      title: {
        english: 'Easter',
        yoruba: 'Ajinde',
        hausa: 'Ista',
        igbo: 'Ista'
      }, 
      color: '#e03a3e' 
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  const filteredPlanTypes = planTypes.filter(type => {
    const titleText = type.title[language] || '';
    return titleText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={`reading-plans-container theme-${theme}`}>
      <div className="plans-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate('/feelings')}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>Reading Plans</h1>
        </div>
        <div className="language-selector">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="settings-select"
            style={{ maxWidth: '280px' }}
          >
            <option value="english">English</option>
            <option value="yoruba">Yoruba</option>
            <option value="igbo">Igbo</option>
            <option value="hausa">Hausa</option>
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

      <div className="plans-grid">
        {filteredPlanTypes.map(type => (
          <Link 
            to={`/create-plan/${type.id}`} 
            state={{ title: type.title[language], color: type.color }}
            key={type.id} 
            className="plan-card"
            style={{ background: `linear-gradient(135deg, ${type.color} 0%, ${type.color}dd 100%)` }}
          >
            <div className="plan-content">
              <h3>{type.title[language]}</h3>
              <p className="plan-action">{translations.createNew[language]}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="your-plans-section">
        <h2>Your Plans</h2>
        {plans.length === 0 ? (
          <p className="no-plans">No plans created yet.</p>
        ) : (
          <div className="saved-plans-list">
            {plans.map((plan, index) => (
              <div key={index} className="saved-plan-item">
                <div className="plan-avatar">
                  {plan.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="plan-details">
                  <h3>{plan.name}</h3>
                  <div className="plan-meta">
                    <span>{formatDate(plan.date)}</span>
                  </div>
                  <p className="plan-note">{plan.notes}</p>
                  <div className="plan-hymns">
                    {plan.hymns.map((hymn, idx) => (
                      <span key={idx} className="hymn-chip">{hymn}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Spacer for bottom nav */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}

export default ReadingPlans;

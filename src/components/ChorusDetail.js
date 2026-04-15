import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { choruses } from '../data/choruses';
import { chorusesYoruba } from '../data/chorusesYoruba';
import { chorusesIgbo } from '../data/chorusesIgbo';
import { chorusesHausa } from '../data/chorusesHausa';
import './HymnList.css'; // For shared styles
import './Edition.css'; // For navigation arrows

function ChorusDetail({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chorus, setChorus] = useState(null);
  const [language, setLanguage] = useState('english');

  const getChorusesForLanguage = (lang) => {
    const normalized = String(lang || '').toLowerCase();
    if (normalized === 'yoruba') return chorusesYoruba;
    if (normalized === 'igbo') return chorusesIgbo;
    if (normalized === 'hausa') return chorusesHausa;
    return choruses;
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('chorusesLanguage');
    setLanguage(savedLang || 'english');
  }, []);

  useEffect(() => {
    const chorusId = parseInt(id);
    const currentChoruses = getChorusesForLanguage(language);
    const foundChorus = currentChoruses.find(c => c.id === chorusId);
    if (foundChorus) {
      setChorus(foundChorus);
    } else {
      navigate('/choruses');
    }
  }, [id, navigate, language]);

  if (!chorus) return null;

  const currentChoruses = getChorusesForLanguage(language);
  const currentIndex = currentChoruses.findIndex(c => c.id === chorus.id);
  const prevChorus = currentIndex > 0 ? currentChoruses[currentIndex - 1] : null;
  const nextChorus = currentIndex !== -1 && currentIndex < currentChoruses.length - 1 ? currentChoruses[currentIndex + 1] : null;

  const handleNext = () => {
    if (nextChorus) navigate(`/chorus/${nextChorus.id}`);
  };

  const handlePrev = () => {
    if (prevChorus) navigate(`/chorus/${prevChorus.id}`);
  };

  // Determine category based on ID (approximate distribution based on user request)
  // 1. Praise, 2. Thanksgiving, 3. Victory, 4. Affirmation, 5. Worship
  const getCategory = (id) => {
    if (id <= 78) return "1. Praise";
    if (id <= 84) return "2. Thanksgiving";
    if (id <= 88) return "3. Victory";
    if (id <= 134) return "4. Affirmation";
    return "5. Worship";
  };

  const isSolfa = (line) => {
    // Check if line consists mostly of sol-fa notes (d,r,m,f,s,l,t), punctuation, numbers (including subscripts), and repetition markers (2x, 2ce)
    // Allow spaces, colons, dots, hyphens, bars, forward slashes, parentheses, exclamation marks, greater than, and superscript 1
    // Also allow 'a' for notes like 'ta', 'ma'
    // Ignore (echo) for detection purposes
    const cleanLine = line.replace(/\(echo\)/gi, '').trim();
    // \u2080-\u2089 matches subscript numbers 0-9
    // \u00B9 matches superscript 1
    const solfaRegex = /^[\s\d:;.,\-drmfslt|/xcen\u2080-\u2089\u00B9()!>a]+$/i;
    // Ensure it has at least some solfa characters to avoid matching just punctuation
    const hasNotes = /[drmfslt]/i.test(cleanLine);
    return solfaRegex.test(cleanLine) && hasNotes;
  };

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (isSolfa(line)) {
        return (
          <span key={index} className="solfa-line">
            {line}
          </span>
        );
      }
      return (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`edition-page theme-${theme}`} style={{ paddingBottom: '100px' }}>
      <div className="header-top-row">
        <Link to="/choruses" className="back-button icon-only">
           <span className="icon">←</span>
        </Link>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: '18px', margin: 0 }}>{getCategory(chorus.id)}</h1>
        </div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="hymn-list-section" style={{ height: 'auto', background: 'transparent', padding: '0' }}>
        <h2 style={{ 
          fontSize: '18px', 
          color: 'orange', 
          marginTop: '10px', 
          marginBottom: '20px', 
          textAlign: 'center' 
        }}>
          {chorus.id}. {chorus.title}
        </h2>
        
        <div className="reading-content" style={{ 
          fontSize: '11px', 
          lineHeight: '1.5', 
          fontFamily: "'Merriweather', serif",
          whiteSpace: 'pre-wrap',
          textAlign: 'left'
        }}>
          {formatContent(chorus.content)}
        </div>
      </div>

      <div className="navigation-arrows">
        <button
          className="nav-arrow prev-arrow"
          onClick={handlePrev}
          disabled={!prevChorus}
        >
          <span className="icon">←</span>
        </button>
        <button
          className="nav-arrow next-arrow"
          onClick={handleNext}
          disabled={!nextChorus}
        >
          <span className="icon">→</span>
        </button>
      </div>
    </div>
  );
}

export default ChorusDetail;

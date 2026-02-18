import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { responsiveReadings, yorubaResponsiveReadings, igboResponsiveReadings, hausaResponsiveReadings } from '../data/responsiveReadings';
import './Edition.css';

function ReadingDetail({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reading, setReading] = useState(null);

  useEffect(() => {
    let foundReading = null;
    // Check if id is numeric (English readings have numeric IDs)
    const isNumeric = !isNaN(id) && !isNaN(parseFloat(id));

    if (isNumeric) {
      const readingId = parseInt(id);
      foundReading = responsiveReadings.find(r => r.id === readingId);
    } else {
      // Check other languages
      if (id.startsWith('YRR')) {
        foundReading = yorubaResponsiveReadings.find(r => r.id === id);
      } else if (id.startsWith('IRR')) {
        foundReading = igboResponsiveReadings.find(r => r.id === id);
      } else if (id.startsWith('HRR')) {
        foundReading = hausaResponsiveReadings.find(r => r.id === id);
      }
    }

    if (foundReading) {
      setReading(foundReading);
    } else {
      navigate('/responsive-reading');
    }
  }, [id, navigate]);

  if (!reading) return null;

  // Determine which list the reading belongs to
  let currentList = responsiveReadings;
  if (typeof reading.id === 'string') {
    if (reading.id.startsWith('YRR')) currentList = yorubaResponsiveReadings;
    else if (reading.id.startsWith('IRR')) currentList = igboResponsiveReadings;
    else if (reading.id.startsWith('HRR')) currentList = hausaResponsiveReadings;
  }

  const currentIndex = currentList.findIndex(r => r.id === reading.id);
  const prevReading = currentIndex > 0 ? currentList[currentIndex - 1] : null;
  const nextReading = currentIndex !== -1 && currentIndex < currentList.length - 1 ? currentList[currentIndex + 1] : null;

  return (
    <div className={`edition-page theme-${theme}`} style={{ paddingBottom: '100px' }}>
      <div className="header-top-row">
        <Link to="/responsive-reading" className="back-button icon-only">
          <span className="icon">←</span>
        </Link>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ color: 'orange', margin: 0, fontSize: '18px' }}>{reading.id}. {reading.title}</h1>
          {reading.scripture && (
            <p style={{ margin: '5px 0 0', fontSize: '12px', fontStyle: 'italic', color: 'inherit' }}>
              {reading.scripture}
            </p>
          )}
        </div>
        <div style={{ width: '40px' }}></div> {/* Spacer for alignment */}
      </div>

      <div className="hymn-list-section" style={{ height: 'auto', background: 'transparent', padding: '0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {reading.verses.map((verse, index) => {
            const verseNumber = index + 1;
            const isEven = verseNumber % 2 === 0;
            
            return (
              <div 
                key={index} 
                style={{ 
                  marginBottom: '20px', // Increased margin between verses
                  fontWeight: isEven ? 'bold' : 'normal',
                  fontSize: '11px', // Match hymn font size
                  lineHeight: '1.5', // Reduced line height within verse
                  fontFamily: "'Merriweather', serif", // Match hymn font
                  textAlign: 'justify' // Align to both sides
                }}
              >
                {verse}
              </div>
            );
          })}
        </div>
      </div>

      <div className="navigation-arrows">
        {prevReading ? (
          <Link to={`/reading/${prevReading.id}`} className="nav-arrow prev-arrow">
            <span className="icon">←</span>
          </Link>
        ) : (
          <button className="nav-arrow prev-arrow" disabled>
            <span className="icon">←</span>
          </button>
        )}
        
        {nextReading ? (
          <Link to={`/reading/${nextReading.id}`} className="nav-arrow next-arrow">
            <span className="icon">→</span>
          </Link>
        ) : (
          <button className="nav-arrow next-arrow" disabled>
            <span className="icon">→</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ReadingDetail;

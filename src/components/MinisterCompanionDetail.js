import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ministerCompanionData } from '../data/ministerCompanionData';
import './Edition.css';

function MinisterCompanionDetail({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = ministerCompanionData.find(d => d.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!item) {
    return (
      <div className={`edition-page theme-${theme}`} style={{ paddingBottom: '100px' }}>
        <div className="header-top-row">
          <Link to="/ministers-companion" className="back-button icon-only">
            <span className="icon">←</span>
          </Link>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1>Not Found</h1>
          </div>
          <div style={{ width: '40px' }}></div>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Item not found
        </div>
      </div>
    );
  }

  const currentIndex = ministerCompanionData.findIndex(d => d.id === id);
  const prevItem = currentIndex > 0 ? ministerCompanionData[currentIndex - 1] : null;
  const nextItem = currentIndex !== -1 && currentIndex < ministerCompanionData.length - 1 ? ministerCompanionData[currentIndex + 1] : null;

  const renderContent = (contentItem, index) => {
    const commonStyle = {
      fontSize: '11px',
      lineHeight: '1.5',
      fontFamily: "'Merriweather', serif",
      textAlign: 'justify',
      marginBottom: '10px'
    };

    switch (contentItem.type) {
      case 'section':
        return (
          <div key={index} className="content-section" style={{ marginTop: '20px', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '14px', color: 'orange', margin: '0 0 10px 0', textTransform: 'uppercase', textAlign: 'center', fontWeight: 'bold', fontFamily: "'Merriweather', serif" }}>
              {contentItem.title}
            </h2>
            {contentItem.subtitle && (
              <h3 style={{ fontSize: '12px', color: 'inherit', margin: '0 0 10px 0', fontStyle: 'italic', textAlign: 'center', fontFamily: "'Merriweather', serif" }}>
                {contentItem.subtitle}
              </h3>
            )}
            {contentItem.text && (
              <p style={commonStyle}>
                {contentItem.text}
              </p>
            )}
            {contentItem.items && (
              contentItem.listType === 'ordered' ? (
                <ol style={{ paddingLeft: '20px', margin: '0 0 10px 0', ...commonStyle }}>
                  {contentItem.items.map((li, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}>{li}</li>
                  ))}
                </ol>
              ) : (
                <ul style={{ paddingLeft: '20px', margin: '0 0 10px 0', ...commonStyle }}>
                  {contentItem.items.map((li, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}>{li}</li>
                  ))}
                </ul>
              )
            )}
          </div>
        );
      case 'text':
        return (
          <div key={index} style={{ marginBottom: '10px' }}>
            {contentItem.title && (
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 5px 0', fontFamily: "'Merriweather', serif" }}>
                {contentItem.title}
              </h3>
            )}
            <p style={commonStyle}>
              {contentItem.text}
            </p>
          </div>
        );
      case 'quote':
        return (
          <blockquote key={index} style={{ 
            margin: '10px 0', 
            padding: '10px 15px', 
            borderLeft: '3px solid orange',
            backgroundColor: 'rgba(0,0,0,0.05)',
            fontStyle: 'italic',
            ...commonStyle
          }}>
            {contentItem.text}
          </blockquote>
        );
      case 'list':
        return (
          <ul key={index} style={{ paddingLeft: '20px', margin: '10px 0', ...commonStyle }}>
            {contentItem.items.map((li, i) => (
              <li key={i} style={{ marginBottom: '5px' }}>{li}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`edition-page theme-${theme}`} style={{ paddingBottom: '100px' }}>
      <div className="header-top-row">
        <Link to="/ministers-companion" className="back-button icon-only">
          <span className="icon">←</span>
        </Link>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ color: 'orange', margin: 0, fontSize: '18px' }}>{currentIndex + 1}. {item.title}</h1>
        </div>
        <div style={{ width: '40px' }}></div>
      </div>
      
      <div className="hymn-list-section" style={{ height: 'auto', background: 'transparent', padding: '0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {item.content.map((contentItem, index) => renderContent(contentItem, index))}
        </div>
      </div>

      <div className="navigation-arrows">
        {prevItem ? (
          <Link to={`/ministers-companion/${prevItem.id}`} className="nav-arrow prev-arrow">
            <span className="icon">←</span>
          </Link>
        ) : (
          <button className="nav-arrow prev-arrow" disabled>
            <span className="icon">←</span>
          </button>
        )}
        
        {nextItem ? (
          <Link to={`/ministers-companion/${nextItem.id}`} className="nav-arrow next-arrow">
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

export default MinisterCompanionDetail;

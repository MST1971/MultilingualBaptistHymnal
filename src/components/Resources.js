import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Edition.css';

function Resources({ theme }) {
  const navigate = useNavigate();

  const resources = [
    { id: 'responsive', title: "Responsive Reading", link: "/responsive-reading", icon: "📖", description: "Congregational readings" },
    { id: 'choruses', title: "Choruses", link: "/choruses", icon: "🎶", description: "Short worship songs" },
    { id: 'covenant', title: "The Church Covenant", link: "/church-covenant", icon: "📜", description: "Our commitment to God and one another" }
  ];

  return (
    <div className={`edition-page theme-${theme}`} style={{ paddingBottom: '100px' }}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '18px', margin: 0 }}>Other Resources</h1>
        <div style={{ width: '40px' }}></div>
      </div>
      
      <div className="resources-list" style={{ padding: '20px' }}>
        {resources.map(resource => (
          <div 
            key={resource.id} 
            className="resource-item" 
            onClick={() => navigate(resource.link)}
            style={{
              backgroundColor: 'var(--card-bg, #fff)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              border: '1px solid var(--border-color, #eee)'
            }}
          >
            <div className="resource-icon" style={{ 
              fontSize: '24px', 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              backgroundColor: '#f0f2f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '15px' 
            }}>
              {resource.icon}
            </div>
            <div className="resource-info">
              <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{resource.title}</h3>
              <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>{resource.description}</p>
            </div>
            <div className="arrow" style={{ marginLeft: 'auto', color: '#ccc' }}>
              ❯
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Resources;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHymnOfTheDay } from '../utils/hymnUtils';
import './Home.css';

function Home({ theme }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  // State to check if running on native device
  const isNative = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();

  // Get the hymn of the day
  const hymnOfTheDay = getHymnOfTheDay();



  // Show native AdMob banner on Home (native only)
  useEffect(() => {
    if (!isNative) return;
    
    const showAd = async () => {
      try {
        const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
        await AdMob.showBanner({
          adId: 'ca-app-pub-6283300909154451/6104372050',
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: false
        });
      } catch (e) {
        console.error("AdMob Banner Error on Home:", e);
      }
    };
    
    showAd();
    
    return () => {
      import('@capacitor-community/admob').then(({ AdMob }) => {
        AdMob.hideBanner().catch(e => console.error(e));
      });
    };
  }, [isNative]);

  const editions = [
    { id: '1956', title: "1956 Edition", link: "/edition/1956", color: "#3498db" },
    { id: '1975', title: "1975 Edition", link: "/edition/1975", color: "#2980b9" },
    { id: '1991', title: "1991 Edition", link: "/edition/1991", color: "#1abc9c" },
    { id: '2008', title: "2008 Edition", link: "/edition/2008", color: "#16a085" },
    { id: 'yoruba', title: "Yoruba", link: "/edition/yoruba", color: "#e67e22" },
    { id: 'igbo', title: "Igbo", link: "/edition/igbo", color: "#d35400" },
    { id: 'hausa', title: "Hausa", link: "/edition/hausa", color: "#e74c3c" },
    { id: 'minister', title: "Minister's Resources", link: "/ministers-companion", color: "#8e44ad" }
  ];

  const quickActions = [
    { id: 'browse', title: "Browse Hymns", subtitle: "Explore our collection", color: "#4facfe", link: "/hymns" },
    { id: 'favorites', title: "My Favorites", subtitle: "Your saved hymns", color: "#ff758c", link: "/favorites" },
    { id: 'resources', title: "Other Resources", subtitle: "Responsive Reading, Choruses, The Church Covenant", color: "#20bf6b", link: "/resources" },
    { id: 'settings', title: "Settings", subtitle: "Customize your experience", color: "#a18cd1", link: "/settings" }
  ];

  // Format current date
  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Get first name
  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  return (
    <div className={`welcome-page-redesign theme-${theme}`}>
      <div className="welcome-header">
        <h1>Welcome back! {getFirstName(user?.name)}</h1>
        <p>Let's worship together</p>
      </div>

      <div className="hymn-day-card-large">
        <div className="card-content">
          <div className="card-sublabel">Daily Hymn</div>
          <div className="card-label">{formatDate()}</div>
          <h2 className="card-title">"{hymnOfTheDay.title}"</h2>
          <button className="sing-now-btn" onClick={() => navigate(`/hymn/${hymnOfTheDay.id}?edition=1956`)}>
            Sing Now
          </button>
        </div>
      </div>

      <div className="section-container">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map(action => (
            <div 
              key={action.id} 
              className="quick-action-card" 
              style={{ background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)` }}
              onClick={() => navigate(action.link)}
            >
              <h4>{action.title}</h4>
              <p>{action.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-container">
        <h3>Hymn Editions</h3>
        <div className="editions-grid">
          {editions.map(edition => (
            <div 
              key={edition.id} 
              className="edition-card" 
              onClick={() => navigate(edition.link)}
            >
              <div className="edition-icon" style={{ backgroundColor: edition.color }}>
                <i className="fas fa-book"></i>
              </div>
              <div className="edition-info">
                <h4>{edition.title}</h4>
                <p>Tap to open</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}

export default Home;

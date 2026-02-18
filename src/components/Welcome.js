import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Welcome.css';
import appLogo from '../assets/app-logo.png';

function Welcome({ theme }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const firstName = user?.name ? user.name.split(' ')[0] : null;

  // Check if user has seen the landing page or is logged in
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hymnAppIntroSeen');
    if (user || hasSeenWelcome === 'true') {
      setShowLanding(false);
    }
  }, [user]);

  const handleSkip = () => {
    localStorage.setItem('hymnAppIntroSeen', 'true');
    setShowLanding(false);
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  // State to track the current slide
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Array of advertisement images
  const adImages = [
    'https://picsum.photos/600/125?random=1',
    'https://picsum.photos/600/125?random=2',
    'https://picsum.photos/600/125?random=3',
    'https://picsum.photos/600/125?random=4',
    'https://picsum.photos/600/125?random=5'
  ];

  // Sample hymn data for demonstration with categories
  const hymns = {
    newYear: [
      { id: 4, title: "Mighty God, While Angels Bless Thee" },
      { id: 5, title: "God, Our Father, We Adore Thee!" }
    ],
    crucifixion: [
      { id: 147, title: "When I Survey the Wondrous Cross" },
      { id: 144, title: "Alas! and Did My Savior Bleed?" },
      { id: 149, title: "'Tis Midnight; and on Olive's Brow" }
    ],
    easter: [
      { id: 159, title: "Christ the Lord Is Risen Today" },
      { id: 160, title: "Low in the Grave He Lay" },
      { id: 161, title: "Crown Him with Many Crowns" }
    ],
    christmas: [
      { id: 85, title: "O Come, All Ye Faithful" },
      { id: 86, title: "Joy to the World" },
      { id: 87, title: "Hark! The Herald Angels Sing" }
    ],
    general: [
      { id: 1, title: "Holy, Holy, Holy" },
      { id: 2, title: "Love Divine, All Loves Excelling" },
      { id: 3, title: "All Creatures of Our God and King" },
      { id: 4, title: "Mighty God, While Angels Bless Thee" },
      { id: 5, title: "God, Our Father, We Adore Thee!" },
      { id: 6, title: "Praise to the Lord, the Almighty" },
      { id: 7, title: "Let All on Earth Their Voices Raise" },
      { id: 8, title: "All Things Bright and Beautiful" }
    ]
  };

  // Function to check if it's currently a special season
  const getCurrentSeason = () => {
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();

    // Check for Christmas season (December)
    if (month === 11) {
      return 'christmas';
    }

    // Check for New Year (January 1st - 7th)
    if (month === 0 && date <= 7) {
      return 'newYear';
    }

    // Check for Easter and Crucifixion
    // Easter calculation
    const year = today.getFullYear();
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const easterMonth = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const easterDay = ((h + l - 7 * m + 114) % 31) + 1;

    const easter = new Date(year, easterMonth, easterDay);
    
    // Good Friday is 2 days before Easter
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);

    // Calculate diffs
    const timeDiffEaster = today.getTime() - easter.getTime();
    const daysDiffEaster = Math.floor(timeDiffEaster / (1000 * 60 * 60 * 24));

    const timeDiffGoodFriday = today.getTime() - goodFriday.getTime();
    const daysDiffGoodFriday = Math.floor(timeDiffGoodFriday / (1000 * 60 * 60 * 24));

    // Check for Crucifixion (Good Friday +/- 1 day)
    if (daysDiffGoodFriday >= -1 && daysDiffGoodFriday <= 1) {
      return 'crucifixion';
    }
    
    // Check if current date is within Easter season (Easter Sunday + 50 days)
    if (daysDiffEaster >= 0 && daysDiffEaster <= 50) {
      return 'easter';
    }

    return 'general';
  };

  // Function to get the hymn of the day based on season and date
  const getHymnOfTheDay = () => {
    const season = getCurrentSeason();
    const seasonalHymns = hymns[season];
    
    // For general season, pick randomly based on date seed to ensure daily consistency but "random" feel
    // Or just purely random on each load if requested "display randomly when no festive time"
    // "Display randomly" usually implies variation. 
    // Let's use a seeded random for stability throughout the day, but ensuring it jumps around the list.
    const today = new Date();
    const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Simple pseudo-random function
    const pseudoRandom = (input) => {
      const x = Math.sin(input) * 10000;
      return x - Math.floor(x);
    };

    const randomIndex = Math.floor(pseudoRandom(seed) * seasonalHymns.length);
    
    return seasonalHymns[randomIndex];
  };

  // Get the hymn of the day and current season
  const hymnOfTheDay = getHymnOfTheDay();

  // Set up automatic rotation for advertisement images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % adImages.length);
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval); // Clean up on unmount
  }, [adImages.length]); // Add adImages.length as dependency

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
    { id: 'browse', title: "Browse Hymns", subtitle: "Explore our collection", color: "#4facfe", link: "/browse" },
    { id: 'favorites', title: "My Favorites", subtitle: "Your saved hymns", color: "#ff758c", link: "/favorites" },
    { id: 'resources', title: "Other Resources", subtitle: "Responsive Reading, Choruses, The Church Covenant", color: "#20bf6b", link: "/resources" },
    { id: 'settings', title: "Settings", subtitle: "Customize your experience", color: "#a18cd1", link: "/settings" }
  ];

  // Format current date
  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  if (showLanding) {
    return (
      <div className={`landing-page theme-${theme}`} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/welcome-bg.jpg')` }}>
        <div className="landing-content">
          <div className="landing-logo-container">
            <img src={appLogo} alt="App Logo" className="landing-logo" />
          </div>
          
          <div className="landing-text-group">
            <p className="welcome-to-text">Welcome to</p>
            <h1 className="app-name-text">Multilingual Baptist Hymnal</h1>
            <h2 className="app-subtitle-text">My Worship Companion</h2>
          </div>

          <div className="landing-actions">
            <button className="landing-action-btn" onClick={handleSignIn}>Sign In</button>
            <span className="action-divider">|</span>
            <button className="landing-action-btn" onClick={handleSignUp}>Sign Up</button>
            <span className="action-divider">|</span>
            <button className="landing-action-btn" onClick={handleSkip}>Skip</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`welcome-page-redesign theme-${theme}`}>
      <div className="welcome-header">
        <h1>{firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}</h1>
        <p>Let's worship together</p>
      </div>

      <div className="hymn-day-card-large">
        <div className="card-content">
          <div className="card-sublabel">Daily Hymn</div>
          <div className="card-label">{formatDate()}</div>
          <h2 className="card-title">"{hymnOfTheDay.title}"</h2>
          <button className="sing-now-btn" onClick={() => navigate(`/hymn/${hymnOfTheDay.id}`)}>
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
      
      <div className="advertisement-box-redesign">
        <div className="ad-slider">
          {adImages.map((image, index) => (
            <div 
              key={index} 
              className={`ad-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="ad-fallback">Advertisement {index + 1}</div>
            </div>
          ))}
          
          <div className="ad-indicators">
            {adImages.map((_, index) => (
              <button 
                key={index} 
                className={`ad-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome; 

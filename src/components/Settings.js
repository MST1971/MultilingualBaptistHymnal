import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHymnOfTheDay } from '../utils/hymnUtils';
import { Share } from '@capacitor/share';
import './Settings.css';

function Settings({ theme }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleShareApp = async () => {
    try {
      await Share.share({
        title: 'Multilingual Baptist Hymnal',
        text: 'Check out the Multilingual Baptist Hymnal app! Access hymns in English, Yoruba, Igbo, and Hausa.',
        url: 'https://play.google.com/store/apps/details?id=com.mstraybiz.multilingualbaptisthymnal',
        dialogTitle: 'Share with friends',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleFeedback = () => {
    const email = 'support@mstraybiz.com';
    const subject = 'App Feedback: Multilingual Baptist Hymnal';
    const body = 'Hello, I have some feedback regarding the app...';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleRateApp = () => {
    const appId = 'com.mstraybiz.multilingualbaptisthymnal';
    window.open(`https://play.google.com/store/apps/details?id=${appId}`, '_blank');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem('hymnAppIntroSeen'); // Clear intro seen flag to show landing page
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Use the common hymn of the day logic
  const hymnOfTheDay = getHymnOfTheDay();

  const [activity, setActivity] = React.useState([]);

  React.useEffect(() => {
    // Demo data for non-logged in users or initial state
    const demoActivity = [
      { id: 1, name: "Sarah Johnson", action: 'Added "Amazing Grace" to favorites', time: "2 hours ago", avatarColor: "#f0f0f0" },
      { id: 2, name: "Michael Brown", action: 'Shared "How Great Thou Art"', time: "1 day ago", avatarColor: "#f0f0f0" },
      { id: 3, name: "Emily Davis", action: 'Added a note to "Holy, Holy, Holy"', time: "2 days ago", avatarColor: "#f0f0f0" }
    ];

    if (!user) {
      setActivity(demoActivity);
      return;
    }

    // In a real app, you would fetch this from Firestore
    // For now, we simulate real activity based on the logged-in user
    setActivity([
      { id: 1, name: "Sarah Johnson", action: 'Added "Amazing Grace" to favorites', time: "2 hours ago", avatarColor: "#e74c3c" },
      { id: 2, name: "Michael Brown", action: 'Shared "How Great Thou Art"', time: "1 day ago", avatarColor: "#3498db" },
      { id: 3, name: "Emily Davis", action: 'Added a note to "Holy, Holy, Holy"', time: "2 days ago", avatarColor: "#2ecc71" },
      { id: 4, name: user.name, action: 'Signed in to Multilingual Baptist Hymnal', time: "Just now", avatarColor: "#f1c40f", isUser: true }
    ]);
  }, [user]);

  const memberResources = [
    { id: 'responsive', title: "Responsive Reading", subtitle: "Follow along with responsive readings", icon: "fas fa-book-open", color: "#3498db", link: "/responsive-reading" },
    { id: 'choruses', title: "Choruses", subtitle: "Access chorus collection", icon: "fas fa-music", color: "#e67e22", link: "/choruses" },
    { id: 'covenant', title: "Church Covenant", subtitle: "View church covenant", icon: "fas fa-handshake", color: "#2ecc71", link: "/church-covenant" },
    { id: 'ministers', title: "Ministers Companion", subtitle: "Resources for ministers", icon: "fas fa-user-tie", color: "#9b59b6", link: "/ministers-companion" }
  ];

  const moreOptions = [
    { id: 'about', title: "About", subtitle: "Learn about our mission and vision", icon: "fas fa-info-circle", color: "#4a90e2", link: "/about" },
    { id: 'giving', title: "Giving", subtitle: "Support our ministry", icon: "fas fa-heart", color: "#e74c3c", link: "/settings/donation" },
    { id: 'help', title: "Help & Support", subtitle: "Get help and contact us", icon: "fas fa-question-circle", color: "#f39c12", link: "/help" },
    { id: 'settings', title: "Settings", subtitle: "Customize your experience", icon: "fas fa-cog", color: "#8e44ad", link: "/settings/app" }
  ];

  const quickActions = [
    { id: 'share', label: "Share App", icon: "fas fa-share-alt", color: "#27ae60", action: handleShareApp },
    { id: 'feedback', label: "Feedback", icon: "fas fa-comment-alt", color: "#3498db", action: handleFeedback },
    { id: 'rate', label: "Rate App", icon: "fas fa-star", color: "#f1c40f", action: handleRateApp }
  ];

  return (
    <div className={`settings-page-redesign theme-${theme}`}>
      {/* 1. Header Section */}
      <div className={`settings-header ${!user ? 'guest-header' : ''}`}>
        <div className="user-profile-section">
          <div className="avatar-large">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" />
            ) : (
              <div className="avatar-placeholder"></div>
            )}
          </div>
          <div className="user-info">
            <h2>{user?.name || "Guest User"}</h2>
            {user ? (
              <>
                <p className="email">{user.email}</p>
                <p className="member-since">Member since 2026</p>
              </>
            ) : (
              <p className="guest-subtitle">Sign in to access all features</p>
            )}
          </div>
          {!user && (
            <button className="header-signin-btn" onClick={() => navigate('/signin')}>
              Sign In
            </button>
          )}
        </div>

        {user ? (
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Favorites</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Notes</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">1</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>
        ) : (
          <div className="guest-actions-box">
            <button className="guest-action-btn" onClick={() => navigate('/signin')}>Sign In</button>
            <div className="guest-action-divider"></div>
            <button className="guest-action-btn" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        )}
      </div>

      <div className="settings-content">
        {/* 2. Hymn of the Day Section */}
        <div className="content-section">
          <div className="section-header">
            <h3>Hymn of the Day</h3>
            <button className="view-all-link" onClick={() => navigate('/browse')}>View</button>
          </div>
          <div className="hymn-day-card-mini" onClick={() => navigate(`/hymn/${hymnOfTheDay.id}`)}>
            <div className="hymn-number-circle">{hymnOfTheDay.id}</div>
            <div className="hymn-info-mini">
              <h4>{hymnOfTheDay.title}</h4>
              <p>Unknown</p>
              <p className="hymn-category">Unknown</p>
            </div>
          </div>
        </div>

        {/* 3. Friends Activity Section */}
        <div className="content-section">
          <div className="section-header">
            <h3>Friends Activity</h3>
            <button className="view-link" onClick={() => navigate('/settings/community')}>View All</button>
          </div>
          <div className="activity-list">
            {activity.map(item => (
              <div key={item.id} className="activity-item">
                <div className="activity-avatar" style={{ backgroundColor: item.avatarColor }}>
                  {item.isUser && user?.photoURL ? (
                    <img src={user.photoURL} alt={item.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    <span style={{ color: '#fff', fontSize: '12px' }}>{item.name.charAt(0)}</span>
                  )}
                </div>
                <div className="activity-content">
                  <div className="activity-name">{item.name} {item.isUser && <span className="user-tag">(You)</span>}</div>
                  <div className="activity-action">{item.action}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Member Resources */}
        <div className="content-section">
          <div className="section-header">
            <h3>Member Resources</h3>
          </div>
          <div className="resource-list">
            {memberResources.map(resource => (
              <div key={resource.id} className="resource-item" onClick={() => navigate(resource.link)}>
                <div className="icon-circle" style={{ backgroundColor: resource.color }}>
                  <i className={resource.icon}></i>
                </div>
                <div className="item-text">
                  <div className="item-title">{resource.title}</div>
                  <div className="item-subtitle">{resource.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. More Options */}
        <div className="content-section">
          <div className="section-header">
            <h3>More Options</h3>
          </div>
          <div className="options-list">
            {moreOptions.map(option => (
              <div key={option.id} className="resource-item" onClick={() => navigate(option.link)}>
                <div className="icon-circle" style={{ backgroundColor: option.color }}>
                  <i className={option.icon}></i>
                </div>
                <div className="item-text">
                  <div className="item-title">{option.title}</div>
                  <div className="item-subtitle">{option.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Quick Actions */}
        <div className="content-section">
          <div className="section-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-row">
            {quickActions.map(action => (
              <div key={action.id} className="quick-action-item" onClick={action.action}>
                <div className="action-circle" style={{ backgroundColor: action.color }}>
                  <i className={action.icon}></i>
                </div>
                <div className="action-label">{action.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Sign Out */}
        <div className="sign-out-section">
          <button className="sign-out-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>

        {/* 8. Footer */}
        <div className="settings-footer">
          <p className="app-name">Multilingual Baptist Hymnal</p>
          <p className="app-version">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;

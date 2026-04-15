import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './About.css';

function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    churchName: '',
    churchLocation: '',
    phone: user?.phoneNumber || '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    twitter: '',
    otherSocial: ''
  });
  const [sensitiveVisible, setSensitiveVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const key = `user-profile-${user.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile({
          churchName: parsed.churchName || '',
          churchLocation: parsed.churchLocation || '',
          phone: parsed.phone || user.phoneNumber || '',
          whatsapp: parsed.whatsapp || '',
          facebook: parsed.facebook || '',
          instagram: parsed.instagram || '',
          twitter: parsed.twitter || '',
          otherSocial: parsed.otherSocial || ''
        });
      } catch {
        setProfile({
          churchName: '',
          churchLocation: '',
          phone: user.phoneNumber || '',
          whatsapp: '',
          facebook: '',
          instagram: '',
          twitter: '',
          otherSocial: ''
        });
      }
    } else {
      setProfile(prev => ({ ...prev, phone: user.phoneNumber || '' }));
    }
    const privacy = localStorage.getItem(`user-profile-privacy-${user.id}`);
    if (privacy === 'hidden') {
      setSensitiveVisible(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setSavedMessage('');
  };

  const handleToggleSensitive = () => {
    if (!user) return;
    const next = !sensitiveVisible;
    setSensitiveVisible(next);
    localStorage.setItem(`user-profile-privacy-${user.id}`, next ? 'visible' : 'hidden');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSavedMessage('');
    const key = `user-profile-${user.id}`;
    localStorage.setItem(key, JSON.stringify(profile));
    await new Promise(resolve => setTimeout(resolve, 400));
    setSaving(false);
    setSavedMessage('Profile updated');
  };

  return (
    <div className="about-page">
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <h1>User Profile</h1>
      </div>

      {user ? (
        <div className="about-content" style={{ textAlign: 'left' }}>
          <h2 style={{ marginTop: 0 }}>{user.name}</h2>
          <p style={{ margin: '4px 0' }}>{user.email?.endsWith('@hymnal.phone') ? 'Phone: ' + user.phoneNumber : user.email}</p>
          <p style={{ margin: '4px 0 16px 0', fontSize: '0.9rem' }}>Provider: {user.provider}</p>

          <form onSubmit={handleSave}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 8px 0', color: '#3498db' }}>Church information</h3>
            <div className="profile-field-group">
              <label className="profile-label">Church name</label>
              <input
                type="text"
                name="churchName"
                value={profile.churchName}
                onChange={handleChange}
                className="profile-input"
                placeholder="e.g. First Baptist Church"
              />
            </div>
            <div className="profile-field-group">
              <label className="profile-label">Church location</label>
              <input
                type="text"
                name="churchLocation"
                value={profile.churchLocation}
                onChange={handleChange}
                className="profile-input"
                placeholder="City / Country"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <h3 style={{ fontSize: '1rem', margin: 0, color: '#3498db' }}>Contact and social (sensitive)</h3>
              <button
                type="button"
                className="pagination-btn"
                onClick={handleToggleSensitive}
              >
                {sensitiveVisible ? 'Hide values' : 'Show values'}
              </button>
            </div>

            <div className="profile-field-group">
              <label className="profile-label">Phone number</label>
              <input
                type={sensitiveVisible ? 'tel' : 'password'}
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="profile-input"
                placeholder={sensitiveVisible ? 'e.g. +234 801 234 5678' : 'Hidden'}
              />
            </div>
            <div className="profile-field-group">
              <label className="profile-label">WhatsApp</label>
              <input
                type={sensitiveVisible ? 'text' : 'password'}
                name="whatsapp"
                value={profile.whatsapp}
                onChange={handleChange}
                className="profile-input"
                placeholder={sensitiveVisible ? 'Phone or link' : 'Hidden'}
              />
            </div>
            <div className="profile-field-group">
              <label className="profile-label">Facebook</label>
              <input
                type={sensitiveVisible ? 'text' : 'password'}
                name="facebook"
                value={profile.facebook}
                onChange={handleChange}
                className="profile-input"
                placeholder={sensitiveVisible ? 'Profile or page link' : 'Hidden'}
              />
            </div>
            <div className="profile-field-group">
              <label className="profile-label">Instagram</label>
              <input
                type={sensitiveVisible ? 'text' : 'password'}
                name="instagram"
                value={profile.instagram}
                onChange={handleChange}
                className="profile-input"
                placeholder={sensitiveVisible ? '@username' : 'Hidden'}
              />
            </div>
            <div className="profile-field-group">
              <label className="profile-label">Twitter / X</label>
              <input
                type={sensitiveVisible ? 'text' : 'password'}
                name="twitter"
                value={profile.twitter}
                onChange={handleChange}
                className="profile-input"
                placeholder={sensitiveVisible ? '@username' : 'Hidden'}
              />
            </div>
            <div className="profile-field-group">
              <label className="profile-label">Other social</label>
              <input
                type={sensitiveVisible ? 'text' : 'password'}
                name="otherSocial"
                value={profile.otherSocial}
                onChange={handleChange}
                className="profile-input"
                placeholder={sensitiveVisible ? 'Any other platform' : 'Hidden'}
              />
            </div>

            <button type="submit" className="pagination-btn" style={{ marginTop: '16px' }} disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </button>
            {savedMessage && (
              <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#2ecc71' }}>{savedMessage}</p>
            )}
          </form>
        </div>
      ) : (
        <div className="about-content">
          <p>No user signed in.</p>
        </div>
      )}
    </div>
  );
}

export default UserProfile;

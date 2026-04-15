import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './About.css';
import './CommunityMemberDetail.css';

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

function CommunityMemberDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { memberId } = useParams();
  const { user } = useAuth();
  const [member, setMember] = useState(state?.member || null);
  const [sensitiveVisible, setSensitiveVisible] = useState(true);

  useEffect(() => {
    if (!member && memberId) {
      const fallback = {
        id: memberId,
        name: memberId.startsWith('member-') ? `Member ${memberId.split('-')[1]}` : 'Community Member',
        latestHymn: { id: 1, title: 'Holy, Holy, Holy' },
        joinedAt: new Date().toISOString(),
        email: '',
        location: ''
      };
      setMember(fallback);
    }
  }, [member, memberId]);

  useEffect(() => {
    if (!user || !memberId) return;
    if (memberId !== user.id) return;
    const key = `user-profile-${user.id}`;
    const stored = localStorage.getItem(key);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setMember(prev => {
        const base = prev || {
          id: memberId,
          name: user.name,
          latestHymn: { id: 1, title: 'Holy, Holy, Holy' },
          joinedAt: new Date().toISOString()
        };
        return {
          ...base,
          email: (user.email && !user.email.endsWith('@hymnal.phone')) ? user.email : (base.email || ''),
          churchName: parsed.churchName || '',
          churchLocation: parsed.churchLocation || '',
          phone: parsed.phone || user.phoneNumber || '',
          whatsapp: parsed.whatsapp || '',
          facebook: parsed.facebook || '',
          instagram: parsed.instagram || '',
          twitter: parsed.twitter || '',
          otherSocial: parsed.otherSocial || ''
        };
      });
    } catch {
    }
  }, [user, memberId]);

  useEffect(() => {
    if (!memberId) return;
    const stored = localStorage.getItem(`community-privacy-${memberId}`);
    if (stored === 'hidden') {
      setSensitiveVisible(false);
    }
  }, [memberId]);

  const handleToggleSensitive = () => {
    const next = !sensitiveVisible;
    setSensitiveVisible(next);
    if (memberId) {
      localStorage.setItem(`community-privacy-${memberId}`, next ? 'visible' : 'hidden');
    }
  };

  if (!member) {
    return (
      <div className="about-page">
        <div className="header-top-row">
          <button className="back-button icon-only" onClick={() => navigate(-1)}>
            <span className="icon">←</span>
          </button>
          <h1>User Profile</h1>
        </div>
        <div className="about-content">
          <p>Member information is not available.</p>
        </div>
      </div>
    );
  }

  const joined = formatDateTime(member.joinedAt);
  const email = member.email || `${member.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
  const location = member.location || 'Not provided';
  const isOwnProfile = !!(user && memberId === user.id);

  return (
    <div className="about-page">
      <div className="header-top-row" style={{ position: 'relative', zIndex: 10, background: 'transparent' }}>
        <button className="back-button icon-only" onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', color: 'white' }}>
          <span className="icon" style={{color: 'white'}}>←</span>
        </button>
        <div style={{ flex: 1, textAlign: 'right' }}>
          {isOwnProfile && (
            <button className="pagination-btn" style={{ padding: '6px 12px', fontSize: '13px', background: 'rgba(255,255,255,0.9)', color: '#3498db' }} onClick={() => navigate('/settings/profile')}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="about-content" style={{ textAlign: 'left', position: 'relative', paddingTop: 0, paddingBottom: '80px' }}>
        
        <div className="profile-cover">
          <div className="profile-avatar-large">
            {member.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="profile-header-text">
          <h2>{member.name}</h2>
          <p>Member since {joined.split(',')[0]}</p>
        </div>

        <div className="profile-card">
          <h3><i className="fas fa-music"></i> Worship Activity</h3>
          <div className="profile-info-row">
            <div className="profile-info-icon"><i className="fas fa-book-open"></i></div>
            <div className="profile-info-content">
              <p className="profile-info-label">Latest Hymn</p>
              <p className="profile-info-value" style={{ color: '#e67e22' }}>{member.latestHymn.title} (#{member.latestHymn.id})</p>
            </div>
          </div>
        </div>

        {(member.churchName || member.churchLocation) && (
          <div className="profile-card">
            <h3><i className="fas fa-church"></i> Church Details</h3>
            {member.churchName && (
              <div className="profile-info-row">
                <div className="profile-info-icon"><i className="fas fa-place-of-worship"></i></div>
                <div className="profile-info-content">
                  <p className="profile-info-label">Church Name</p>
                  <p className="profile-info-value">{member.churchName}</p>
                </div>
              </div>
            )}
            {member.churchLocation && (
              <div className="profile-info-row">
                <div className="profile-info-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div className="profile-info-content">
                  <p className="profile-info-label">Location</p>
                  <p className="profile-info-value">{member.churchLocation}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="profile-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}><i className="fas fa-id-card"></i> Contact & Social</h3>
            <button type="button" className="pagination-btn" style={{ padding: '6px 12px', fontSize: '11px', margin: 0 }} onClick={handleToggleSensitive}>
              {sensitiveVisible ? <><i className="fas fa-eye-slash"></i> Hide</> : <><i className="fas fa-eye"></i> Show</>}
            </button>
          </div>
          
          <div className="profile-info-row">
            <div className="profile-info-icon"><i className="fas fa-envelope"></i></div>
            <div className="profile-info-content">
              <p className="profile-info-label">Email / Contact</p>
              <p className="profile-info-value">{sensitiveVisible ? email : '••••••••••'}</p>
            </div>
          </div>

          <div className="profile-info-row">
            <div className="profile-info-icon"><i className="fas fa-map-pin"></i></div>
            <div className="profile-info-content">
              <p className="profile-info-label">General Location</p>
              <p className="profile-info-value">{sensitiveVisible ? location : '••••••••••'}</p>
            </div>
          </div>

          {member.phone && (
            <div className="profile-info-row">
              <div className="profile-info-icon"><i className="fas fa-phone-alt"></i></div>
              <div className="profile-info-content">
                <p className="profile-info-label">Phone</p>
                <p className="profile-info-value">{sensitiveVisible ? member.phone : '••••••••••'}</p>
              </div>
            </div>
          )}

          {member.whatsapp && (
            <div className="profile-info-row">
              <div className="profile-info-icon"><i className="fab fa-whatsapp"></i></div>
              <div className="profile-info-content">
                <p className="profile-info-label">WhatsApp</p>
                <p className="profile-info-value">{sensitiveVisible ? member.whatsapp : '••••••••••'}</p>
              </div>
            </div>
          )}

          {member.facebook && (
            <div className="profile-info-row">
              <div className="profile-info-icon"><i className="fab fa-facebook-f"></i></div>
              <div className="profile-info-content">
                <p className="profile-info-label">Facebook</p>
                <p className="profile-info-value">{sensitiveVisible ? member.facebook : '••••••••••'}</p>
              </div>
            </div>
          )}

          {member.instagram && (
            <div className="profile-info-row">
              <div className="profile-info-icon"><i className="fab fa-instagram"></i></div>
              <div className="profile-info-content">
                <p className="profile-info-label">Instagram</p>
                <p className="profile-info-value">{sensitiveVisible ? member.instagram : '••••••••••'}</p>
              </div>
            </div>
          )}

          {member.twitter && (
            <div className="profile-info-row">
              <div className="profile-info-icon"><i className="fab fa-twitter"></i></div>
              <div className="profile-info-content">
                <p className="profile-info-label">Twitter / X</p>
                <p className="profile-info-value">{sensitiveVisible ? member.twitter : '••••••••••'}</p>
              </div>
            </div>
          )}

          {member.otherSocial && (
            <div className="profile-info-row">
              <div className="profile-info-icon"><i className="fas fa-link"></i></div>
              <div className="profile-info-content">
                <p className="profile-info-label">Other Social</p>
                <p className="profile-info-value">{sensitiveVisible ? member.otherSocial : '••••••••••'}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CommunityMemberDetail;

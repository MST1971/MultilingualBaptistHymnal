import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './About.css';
import './Community.css';

const MEMBERS_PER_PAGE = 50;

const sampleHymns = [
  { id: 1, title: 'Holy, Holy, Holy' },
  { id: 2, title: 'Amazing Grace' },
  { id: 3, title: 'How Great Thou Art' },
  { id: 4, title: 'Great Is Thy Faithfulness' },
  { id: 5, title: 'Blessed Assurance' },
  { id: 6, title: 'To God Be the Glory' }
];

const generateMembers = (count) => {
  const members = [];
  const now = new Date();
  for (let i = 0; i < count; i += 1) {
    const joinDate = new Date(now);
    joinDate.setDate(now.getDate() - i);
    const hymn = sampleHymns[i % sampleHymns.length];
    members.push({
      id: `member-${i + 1}`,
      name: `Member ${i + 1}`,
      latestHymn: hymn,
      joinedAt: joinDate.toISOString()
    });
  }
  return members;
};

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

function Community() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const baseMembers = useMemo(() => generateMembers(150), []);
  const members = useMemo(() => {
    if (!user) return baseMembers;
    const latestHymn = sampleHymns[0];
    const joinDate = new Date().toISOString();
    const userMember = {
      id: user.id,
      name: user.name,
      latestHymn,
      joinedAt: joinDate
    };
    const exists = baseMembers.find(m => m.id === user.id);
    if (exists) {
      return baseMembers.map(m => (m.id === user.id ? { ...m, ...userMember } : m));
    }
    return [userMember, ...baseMembers];
  }, [baseMembers, user]);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const lowerQuery = searchQuery.toLowerCase();
    return members.filter(m => m.name.toLowerCase().includes(lowerQuery));
  }, [members, searchQuery]);

  const totalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE);
  const startIndex = (page - 1) * MEMBERS_PER_PAGE;
  const visibleMembers = filteredMembers.slice(startIndex, startIndex + MEMBERS_PER_PAGE);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleMemberClick = (member) => {
    navigate(`/settings/community/${member.id}`, { state: { member } });
  };

  return (
    <div className="about-page community-container">
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <h1>Users Community</h1>
      </div>

      <div className="community-content">
        <div className="community-header">
          <div>
            <h2>Members</h2>
            <p className="community-subtitle">
              Discover what other members are singing. {filteredMembers.length} members total.
            </p>
          </div>
          <div className="community-stats">
            <div className="stat">
              <span className="stat-label">Total Members</span>
              <span className="stat-value">{filteredMembers.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Current Page</span>
              <span className="stat-value">
                {page} / {totalPages || 1}
              </span>
            </div>
          </div>
        </div>

        <input 
          type="text" 
          className="community-search-bar" 
          placeholder="Search for a member..." 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }} 
        />

        <div className="community-grid">
          {visibleMembers.map((member) => (
            <button
              key={member.id}
              type="button"
              className="member-card-modern"
              onClick={() => handleMemberClick(member)}
            >
              <div className="avatar-modern">
                <span>{member.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="member-info-modern">
                <div className="member-name-modern">{member.name}</div>
                <p className="member-detail-modern">Joined {formatDateTime(member.joinedAt).split(',')[0]}</p>
                <p className="member-detail-modern">
                  Latest: <span className="highlight-hymn">{member.latestHymn.title}</span> #{member.latestHymn.id}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="community-pagination">
          <button
            type="button"
            className="pagination-btn"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="pagination-btn"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Community;

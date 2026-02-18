import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { churchesData } from '../data/churches';
import './FindChurch.css';

function FindChurch({ theme }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    pastor: '',
    name: '',
    association: '',
    conference: '',
    state: '',
    address: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [allChurches, setAllChurches] = useState([]);

  useEffect(() => {
    // Combine static data with local storage data
    const registeredChurches = JSON.parse(localStorage.getItem('registeredChurches') || '[]');
    setAllChurches([...churchesData, ...registeredChurches]);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Check if any search parameter is provided
    const hasParams = Object.values(searchParams).some(val => val.trim() !== '');
    
    if (!hasParams) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const filtered = allChurches.filter(church => {
      return (
        (searchParams.name === '' || church.name.toLowerCase().includes(searchParams.name.toLowerCase())) &&
        (searchParams.pastor === '' || church.pastor.toLowerCase().includes(searchParams.pastor.toLowerCase())) &&
        (searchParams.association === '' || church.association.toLowerCase().includes(searchParams.association.toLowerCase())) &&
        (searchParams.conference === '' || church.conference.toLowerCase().includes(searchParams.conference.toLowerCase())) &&
        (searchParams.state === '' || church.state.toLowerCase().includes(searchParams.state.toLowerCase())) &&
        (searchParams.address === '' || church.address.toLowerCase().includes(searchParams.address.toLowerCase()))
      );
    });

    setSearchResults(filtered);
    setHasSearched(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`find-church-container ${theme}`}>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Find a Church</h1>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Church Name</label>
              <input
                type="text"
                name="name"
                placeholder="Search by name..."
                value={searchParams.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Pastor</label>
              <input
                type="text"
                name="pastor"
                placeholder="Search by pastor..."
                value={searchParams.pastor}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Association</label>
              <input
                type="text"
                name="association"
                placeholder="Search by association..."
                value={searchParams.association}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Conference</label>
              <input
                type="text"
                name="conference"
                placeholder="Search by conference..."
                value={searchParams.conference}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="Search by state..."
                value={searchParams.state}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Search by address..."
                value={searchParams.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i> Search Church
          </button>
        </form>
      </div>

      <div className="register-link-section">
        <p>Can't find your church?</p>
        <Link to="/register-church" className="register-btn">
          Register Your Church
        </Link>
      </div>

      <div className="results-section">
        {!hasSearched ? (
          <p className="no-results">Use the filters above to find a Baptist church.</p>
        ) : searchResults.length === 0 ? (
          <p className="no-results">No churches found matching your criteria.</p>
        ) : (
          <div className="church-results-grid">
            {searchResults.map(church => (
              <div key={church.id} className="church-card">
                <div className="church-info">
                  {church.id.toString().startsWith('reg-') && (
                    <div className="registered-badge-container">
                      <span className="registered-badge">Registered</span>
                    </div>
                  )}
                  <h3 className="church-name">{church.name}</h3>
                  <p className="church-pastor"><i className="fas fa-user-tie"></i> {church.pastor}</p>
                  <p className="church-meta">
                    <span><i className="fas fa-layer-group"></i> {church.association}</span>
                    <span><i className="fas fa-globe"></i> {church.conference}</span>
                  </p>
                  <p className="church-address"><i className="fas fa-map-marker-alt"></i> {church.address}, {church.state}</p>
                </div>
                <div className="church-actions">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.name + ' ' + church.address)}`} target="_blank" rel="noopener noreferrer" className="map-btn">
                    <i className="fas fa-directions"></i> View Map
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindChurch;

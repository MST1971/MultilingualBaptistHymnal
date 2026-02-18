import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <h1>About Us</h1>
      </div>
      
      <div className="about-content">
        <h2>Multilingual Baptist Hymnal</h2>
        <p>A digital collection of hymns from various Baptist Hymnals, designed to bring worship closer to you wherever you are.</p>
        
        <h3>Our Mission</h3>
        <p>To provide a comprehensive, accessible, and user-friendly digital platform for Baptist hymns, fostering spiritual growth and worship in the digital age.</p>
        
        <h3>Our Vision</h3>
        <p>To be the leading digital resource for Baptist worship music worldwide, preserving our rich musical heritage while embracing modern technology.</p>
        
        <p className="version-info">Version 1.0.0</p>
      </div>
    </div>
  );
}

export default About; 
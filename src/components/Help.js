import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css'; // Reusing About.css for consistent layout

function Help() {
  const navigate = useNavigate();

  const faqs = [
    { q: "How do I save a hymn to favorites?", a: "Tap the heart icon on any hymn detail page to save it to your favorites." },
    { q: "Can I use the app offline?", a: "Yes, once you've opened a hymn while online, it will be cached for offline use." },
    { q: "How do I change the theme?", a: "Go to Settings > App Settings to switch between Light, Dark, and Blue themes." },
    { q: "I found a mistake in a hymn. What should I do?", a: "Please use the Feedback button in the Settings page to let us know." }
  ];

  return (
    <div className="about-page">
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <h1>Help & Support</h1>
      </div>

      <div className="about-content">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h4 className="faq-question">{faq.q}</h4>
              <p className="faq-answer">{faq.a}</p>
            </div>
          ))}
        </div>

        <h2>Contact Us</h2>
        <p>If you need further assistance, please reach out to us:</p>
        <p><i className="fas fa-envelope"></i> Email: mstraybiz@gmail.com</p>
        <p><i className="fas fa-phone"></i> Phone: +234 (0) 8100425687</p>
      </div>
    </div>
  );
}

export default Help;

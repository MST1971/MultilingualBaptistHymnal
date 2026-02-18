import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

function Donation() {
  const navigate = useNavigate();
  return (
    <div className="about-page">
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={() => navigate(-1)}>
          <span className="icon">←</span>
        </button>
        <h1>Donation</h1>
      </div>

      <div className="about-content">
        <h2>Support Our Ministry</h2>
        <p>Your generous contributions help us maintain the app, license new hymns, and keep this resource free for everyone.</p>
        
        <div className="donation-options">
          <p>Choose a platform to donate:</p>
          <ul className="donation-links">
            <li>
              <a href="https://paystack.com/pay/" target="_blank" rel="noreferrer" className="donation-link">
                <i className="fas fa-credit-card"></i> Donate via Paystack
              </a>
            </li>
            <li>
              <a href="https://flutterwave.com/donate/" target="_blank" rel="noreferrer" className="donation-link">
                <i className="fas fa-money-bill-wave"></i> Donate via Flutterwave
              </a>
            </li>
            <li>
              <a href="https://donate.stripe.com/" target="_blank" rel="noreferrer" className="donation-link">
                <i className="fab fa-stripe"></i> Donate via Stripe
              </a>
            </li>
          </ul>
        </div>
        
        <p className="thank-you-msg">Thank you for your support and may God bless you!</p>
      </div>
    </div>
  );
}

export default Donation;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RecaptchaVerifier, auth } from '../firebase';
import './AuthForm.css';

function AuthForm({ mode = 'signin', theme = 'light' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithPhoneAndPin, signUpWithPhoneAndPin, signInAnonymously, resetPassword, resetPin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [errorCode, setErrorCode] = useState('');

  useEffect(() => {
    // No more reCAPTCHA cleanup needed for PIN flow
  }, []);

  const normalizeError = (err) => {
    const code = err?.code || '';
    setErrorCode(code);
    switch (code) {
      case 'auth/operation-not-allowed':
        return 'This sign-in method is disabled. Please enable it in Firebase Console.';
      case 'auth/email-already-in-use':
        return 'Email already registered. Please Sign In instead.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection.';
      case 'auth/invalid-verification-code':
        return 'Invalid verification code. Please check and try again.';
      default:
        return (err?.message || 'Authentication error').replace('Firebase: ', '');
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
          'expired-callback': () => {
             // Response expired. Ask user to solve reCAPTCHA again.
             // window.recaptchaVerifier.clear();
             // window.recaptchaVerifier = null;
          }
        });
      } catch (err) {
        console.error("Recaptcha setup error:", err);
      }
    }
  };

  const handlePhoneSignIn = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (!phone) {
        setError('Please enter a phone number');
        setLoading(false);
        return;
      }
      if (!pin) {
        setError('Please enter your 6-digit PIN');
        setLoading(false);
        return;
      }
      
      // Clean phone number: remove +, spaces, dashes
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setError('Please enter a valid phone number');
        setLoading(false);
        return;
      }

      if (mode === 'signin') {
        await signInWithPhoneAndPin(cleanPhone, pin);
      } else {
        await signUpWithPhoneAndPin(cleanPhone, pin);
      }
      navigate(location.state?.redirectTo || '/');
    } catch (err) {
      console.error(err);
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showPhoneInput) {
      handlePhoneSignIn(e);
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      navigate(location.state?.redirectTo || '/');
    } catch (err) {
      console.error(err);
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setInfo('');
      setLoading(true);
      await signInWithGoogle();
      navigate(location.state?.redirectTo || '/');
    } catch (err) {
      console.error(err);
      setError(normalizeError(err));
      setLoading(false);
    }
  };



  const handleAnonymousSignIn = async () => {
    try {
      setError('');
      setInfo('');
      setLoading(true);
      await signInAnonymously();
      navigate(location.state?.redirectTo || '/');
    } catch (err) {
      console.error(err);
      setError(normalizeError(err));
      setLoading(false);
    }
  };

  const togglePhoneInput = () => {
    setShowPhoneInput(!showPhoneInput);
    // setConfirmationResult(null); // Removed as it's no longer used
    setError('');
    setInfo('');
  };

  const toggleMode = () => {
    navigate(mode === 'signin' ? '/signup' : '/signin');
  };

  const handleForgot = async () => {
    setError('');
    setInfo('');
    
    if (showPhoneInput) {
      if (!phone) {
        setError('Enter your phone number to reset PIN');
        return;
      }
      try {
        setLoading(true);
        // Clean phone number
        const cleanPhone = phone.replace(/\D/g, '');
        await resetPin(cleanPhone);
        setInfo('PIN reset instructions sent via SMS (Mock)');
      } catch (err) {
        console.error(err);
        setError(err.message.replace('Firebase: ', ''));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email) {
      setError('Enter your email to reset password');
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      setInfo('Password reset link sent to your email');
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page theme-${theme}`}>
      <div className="auth-card">
        <button className="back-btn-auth" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        
        <div className="auth-header">
          <h2>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {showPhoneInput 
              ? (mode === 'signin' ? 'Sign in with Phone & PIN' : 'Create Account with Phone & PIN') 
              : (mode === 'signin' ? 'Sign in to continue' : 'Sign up to get started')}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {info && <div className="auth-info">{info}</div>}

        <div id="recaptcha-container"></div>

        <form onSubmit={handleSubmit} className="auth-form">
          {showPhoneInput ? (
            <>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  placeholder="08012345678"
                />
              </div>
              <div className="form-group">
                <label>PIN (6+ digits)</label>
                <input 
                  type="password" 
                  value={pin} 
                  onChange={(e) => setPin(e.target.value)} 
                  required 
                  placeholder="Enter your secret PIN"
                  minLength={6}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Enter your password"
                  minLength={6}
                />
              </div>
              {mode === 'signin' && (
            <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '10px' }}>
              <button type="button" className="auth-link-btn" onClick={handleForgot} disabled={loading}>
                {showPhoneInput ? 'Forgot PIN?' : 'Forgot Password?'}
              </button>
            </div>
          )}
            </>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (
              showPhoneInput 
                ? (mode === 'signin' ? 'Sign In with Phone' : 'Sign Up with Phone') 
                : (mode === 'signin' ? 'Sign In' : 'Sign Up')
            )}
          </button>

          {showPhoneInput && (
            <button type="button" className="auth-link-btn" onClick={togglePhoneInput} style={{ width: '100%', marginTop: '10px' }}>
              Back to Email Sign In
            </button>
          )}
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="social-login-row">
          <button type="button" className="social-icon-btn google-icon" onClick={handleGoogleSignIn} disabled={loading} title="Sign in with Google">
            <i className="fab fa-google"></i>
          </button>
          <button type="button" className="social-icon-btn phone-icon" onClick={togglePhoneInput} disabled={loading} title="Sign in with Phone">
            <i className="fas fa-phone"></i>
          </button>

          <button type="button" className="social-icon-btn mail-icon" onClick={() => setShowPhoneInput(false)} disabled={loading} title="Sign in with Email">
            <i className="fas fa-envelope"></i>
          </button>
          <button type="button" className="social-icon-btn anon-icon" onClick={handleAnonymousSignIn} disabled={loading} title="Sign in Anonymously">
            <i className="fas fa-user-secret"></i>
          </button>
        </div>

        <div className="auth-footer">
          <p>
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button className="auth-link-btn" onClick={toggleMode}>
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
          {mode === 'signup' && errorCode === 'auth/email-already-in-use' && (
            <p>
              You can Sign In with this email or use Google if you created it with Google.
            </p>
          )}
          {(errorCode === 'auth/operation-not-allowed') && (
            <p style={{ color: 'red', fontSize: '0.85rem' }}>
              This method is not enabled in Firebase. Please enable it in the Firebase Console.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthForm;

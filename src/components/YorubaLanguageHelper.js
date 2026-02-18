import React, { useState, useEffect } from 'react';
import { applyYorubaTonations, validateYorubaText, getYorubaHymnTitle, YORUBA_SINGING_GUIDELINES } from '../utils/YorubaTonations';
import './YorubaLanguageHelper.css';

const YorubaLanguageHelper = ({ isOpen, onClose, currentHymn }) => {
  const [activeTab, setActiveTab] = useState('pronunciation');
  const [textToValidate, setTextToValidate] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  // Yoruba virtual keyboard layout
  const yorubaKeys = [
    ['á', 'à', 'a', 'é', 'è', 'e', 'ẹ́', 'ẹ̀', 'ẹ'],
    ['í', 'ì', 'i', 'ó', 'ò', 'o', 'ọ́', 'ọ̀', 'ọ'],
    ['ú', 'ù', 'u', 'ń', 'ṣ', 'gb', 'kp']
  ];

  useEffect(() => {
    if (textToValidate) {
      const result = validateYorubaText(textToValidate);
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  }, [textToValidate]);

  const handleKeyboardInput = (char) => {
    setTextToValidate(prev => prev + char);
  };

  const handleTextCorrection = (suggestion) => {
    const correctedText = textToValidate.replace(
      new RegExp(suggestion.original, 'gi'),
      suggestion.suggested
    );
    setTextToValidate(correctedText);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="yoruba-helper-overlay">
      <div className="yoruba-helper-modal">
        <div className="yoruba-helper-header">
          <h2>Yoruba Language Helper</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="yoruba-helper-tabs">
          <button 
            className={`tab ${activeTab === 'pronunciation' ? 'active' : ''}`}
            onClick={() => setActiveTab('pronunciation')}
          >
            Pronunciation Guide
          </button>
          <button 
            className={`tab ${activeTab === 'keyboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('keyboard')}
          >
            Virtual Keyboard
          </button>
          <button 
            className={`tab ${activeTab === 'validator' ? 'active' : ''}`}
            onClick={() => setActiveTab('validator')}
          >
            Text Validator
          </button>
          <button 
            className={`tab ${activeTab === 'singing' ? 'active' : ''}`}
            onClick={() => setActiveTab('singing')}
          >
            Singing Guide
          </button>
        </div>

        <div className="yoruba-helper-content">
          {activeTab === 'pronunciation' && (
            <div className="pronunciation-guide">
              <h3>Yoruba Pronunciation Guide</h3>
              
              <div className="tone-marks-section">
                <h4>Tone Marks</h4>
                <div className="tone-examples">
                  <div className="tone-group">
                    <h5>High Tone (´)</h5>
                    <p>á é í ó ú - Pronounced with rising pitch</p>
                    <div className="examples">
                      <span>bá (to meet)</span>
                      <span>ré (to go)</span>
                      <span>kí (to greet)</span>
                    </div>
                  </div>
                  
                  <div className="tone-group">
                    <h5>Low Tone (`)</h5>
                    <p>à è ì ò ù - Pronounced with falling pitch</p>
                    <div className="examples">
                      <span>bà (to perch)</span>
                      <span>rè (to be soft)</span>
                      <span>kì (to not)</span>
                    </div>
                  </div>
                  
                  <div className="tone-group">
                    <h5>Mid Tone (no mark)</h5>
                    <p>a e i o u - Pronounced with level pitch</p>
                    <div className="examples">
                      <span>ba (to come)</span>
                      <span>re (to be)</span>
                      <span>ki (what)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="special-chars-section">
                <h4>Special Characters</h4>
                <div className="char-examples">
                  <div className="char-item">
                    <span className="char">ẹ</span>
                    <span className="pronunciation">[ɛ] - like 'e' in 'bet'</span>
                  </div>
                  <div className="char-item">
                    <span className="char">ọ</span>
                    <span className="pronunciation">[ɔ] - like 'o' in 'law'</span>
                  </div>
                  <div className="char-item">
                    <span className="char">ṣ</span>
                    <span className="pronunciation">[ʃ] - like 'sh' in 'shoe'</span>
                  </div>
                  <div className="char-item">
                    <span className="char">gb</span>
                    <span className="pronunciation">[ɡ͡b] - simultaneous g and b</span>
                  </div>
                  <div className="char-item">
                    <span className="char">kp</span>
                    <span className="pronunciation">[k͡p] - simultaneous k and p</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keyboard' && (
            <div className="virtual-keyboard">
              <h3>Yoruba Virtual Keyboard</h3>
              <p>Click on the characters below to type Yoruba text with proper diacritics:</p>
              
              <div className="keyboard-layout">
                {yorubaKeys.map((row, rowIndex) => (
                  <div key={rowIndex} className="keyboard-row">
                    {row.map((key, keyIndex) => (
                      <button
                        key={keyIndex}
                        className="keyboard-key"
                        onClick={() => handleKeyboardInput(key)}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <div className="text-input-area">
                <textarea
                  value={textToValidate}
                  onChange={(e) => setTextToValidate(e.target.value)}
                  placeholder="Type or click keys above to input Yoruba text..."
                  rows="4"
                  className="yoruba-textarea"
                />
                <div className="input-actions">
                  <button onClick={() => setTextToValidate('')}>Clear</button>
                  <button onClick={() => copyToClipboard(textToValidate)}>Copy</button>
                  <button onClick={() => setTextToValidate(applyYorubaTonations(textToValidate))}>
                    Auto-correct Tonations
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validator' && (
            <div className="text-validator">
              <h3>Yoruba Text Validator</h3>
              <p>Paste Yoruba text below to check for proper tonations and spelling:</p>
              
              <textarea
                value={textToValidate}
                onChange={(e) => setTextToValidate(e.target.value)}
                placeholder="Paste Yoruba text here for validation..."
                rows="6"
                className="validation-textarea"
              />

              {validationResult && (
                <div className="validation-results">
                  <div className={`validation-status ${validationResult.isValid ? 'valid' : 'invalid'}`}>
                    {validationResult.isValid ? (
                      <span className="status-icon">✓</span>
                    ) : (
                      <span className="status-icon">⚠</span>
                    )}
                    <span className="status-text">
                      {validationResult.isValid 
                        ? 'Text appears to have correct Yoruba tonations' 
                        : `Found ${validationResult.suggestions.length} potential issues`
                      }
                    </span>
                  </div>

                  {validationResult.suggestions.length > 0 && (
                    <div className="suggestions">
                      <h4>Suggestions:</h4>
                      {validationResult.suggestions.map((suggestion, index) => (
                        <div key={index} className="suggestion-item">
                          <div className="suggestion-text">
                            <span className="original">{suggestion.original}</span>
                            <span className="arrow">→</span>
                            <span className="suggested">{suggestion.suggested}</span>
                          </div>
                          <div className="suggestion-reason">{suggestion.reason}</div>
                          <button 
                            className="apply-suggestion"
                            onClick={() => handleTextCorrection(suggestion)}
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'singing' && (
            <div className="singing-guide">
              <h3>Yoruba Hymn Singing Guide</h3>
              
              <div className="guide-section">
                <h4>Tonal Considerations</h4>
                <ul>
                  {YORUBA_SINGING_GUIDELINES.tonalConsiderations.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="guide-section">
                <h4>Pronunciation Tips</h4>
                <ul>
                  {YORUBA_SINGING_GUIDELINES.pronunciationTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="guide-section">
                <h4>Rhythmic Patterns</h4>
                <ul>
                  {YORUBA_SINGING_GUIDELINES.rhythmicPatterns.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              {currentHymn && (
                <div className="current-hymn-guide">
                  <h4>Current Hymn: {currentHymn.title}</h4>
                  <p><strong>Yoruba Title:</strong> {getYorubaHymnTitle(currentHymn.title)}</p>
                  {currentHymn.key && <p><strong>Key:</strong> {currentHymn.key}</p>}
                  {currentHymn.meter && <p><strong>Meter:</strong> {currentHymn.meter}</p>}
                  <div className="hymn-specific-tips">
                    <p><em>Remember to maintain the tonal patterns while following the melody. 
                    Practice speaking the words first to get the natural rhythm before singing.</em></p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YorubaLanguageHelper;
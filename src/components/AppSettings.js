import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

function AppSettings() {
  const navigate = useNavigate();
  const { 
    theme, setTheme, 
    fontSize, setFontSize, 
    language, setLanguage,
    keepScreenOn, setKeepScreenOn,
    showVerseNumbers, setShowVerseNumbers,
    autoPlayAudio, setAutoPlayAudio,
    downloadWifiOnly, setDownloadWifiOnly,
    pushNotifications, setPushNotifications,
    enableSharing, setEnableSharing,
    autoSync, setAutoSync
  } = useSettings();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const Toggle = ({ checked, onChange }) => (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider round"></span>
    </label>
  );

  return (
    <div className={`app-settings-page theme-${theme}`}>
      <div className="settings-header-top">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-container">
        {/* Account Section */}
        <div className="settings-section">
          <div className="section-title">Account</div>
          <div className="settings-item-detailed" onClick={() => navigate('/settings/profile')}>
            <div className="item-info">
              <div className="item-title">Account Information</div>
              <div className="item-subtitle">Update your personal details and preferences</div>
            </div>
            <i className="fas fa-chevron-right arrow-icon"></i>
          </div>
        </div>

        {/* Display Section */}
        <div className="settings-section">
          <div className="section-title">Display</div>
          
          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Font Size</div>
              <div className="item-subtitle">Current: {fontSize === 'sm' ? 'small' : fontSize === 'md' ? 'medium' : fontSize === 'lg' ? 'large' : 'extra-large'}</div>
            </div>
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="settings-select">
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra-large</option>
            </select>
          </div>

          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Default Language</div>
              <div className="item-subtitle">Current: {language}</div>
            </div>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="settings-select">
              <option value="Both Languages">Both Languages</option>
              <option value="English">English</option>
              <option value="Yoruba">Yoruba</option>
              <option value="Igbo">Igbo</option>
              <option value="Hausa">Hausa</option>
            </select>
          </div>

          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Dark Mode</div>
              <div className="item-subtitle">Use dark theme</div>
            </div>
            <Toggle checked={theme === 'dark'} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} />
          </div>

          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Keep Screen On</div>
              <div className="item-subtitle">Prevent screen from turning off</div>
            </div>
            <Toggle checked={keepScreenOn} onChange={(e) => setKeepScreenOn(e.target.checked)} />
          </div>

          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Show Verse Numbers</div>
              <div className="item-subtitle">Display verse numbers in hymns</div>
            </div>
            <Toggle checked={showVerseNumbers} onChange={(e) => setShowVerseNumbers(e.target.checked)} />
          </div>
        </div>

        {/* Audio & Media Section */}
        <div className="settings-section">
          <div className="section-title">Audio & Media</div>
          
          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Auto-play Audio</div>
              <div className="item-subtitle">Automatically play hymn audio</div>
            </div>
            <Toggle checked={autoPlayAudio} onChange={(e) => setAutoPlayAudio(e.target.checked)} />
          </div>

          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Download on Wi-Fi Only</div>
              <div className="item-subtitle">Save mobile data</div>
            </div>
            <Toggle checked={downloadWifiOnly} onChange={(e) => setDownloadWifiOnly(e.target.checked)} />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-section">
          <div className="section-title">Notifications</div>
          
          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Push Notifications</div>
              <div className="item-subtitle">Receive hymn of the day and updates</div>
            </div>
            <Toggle checked={pushNotifications} onChange={(e) => setPushNotifications(e.target.checked)} />
          </div>
        </div>

        {/* Privacy & Sharing Section */}
        <div className="settings-section">
          <div className="section-title">Privacy & Sharing</div>
          
          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Enable Sharing</div>
              <div className="item-subtitle">Allow sharing hymns with others</div>
            </div>
            <Toggle checked={enableSharing} onChange={(e) => setEnableSharing(e.target.checked)} />
          </div>

          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Auto Sync</div>
              <div className="item-subtitle">Sync favorites and notes across devices</div>
            </div>
            <Toggle checked={autoSync} onChange={(e) => setAutoSync(e.target.checked)} />
          </div>
        </div>

        {/* Storage & Data Section */}
        <div className="settings-section">
          <div className="section-title">Storage & Data</div>
          
          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Download All Hymns</div>
              <div className="item-subtitle">Make all hymns available offline</div>
            </div>
          </div>

          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Clear Cache</div>
              <div className="item-subtitle">Free up storage space</div>
            </div>
          </div>

          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Export My Data</div>
              <div className="item-subtitle">Download your favorites and notes</div>
            </div>
          </div>

          <div className="settings-item-detailed">
            <div className="item-info">
              <div className="item-title">Reset All Settings</div>
              <div className="item-subtitle">Restore default settings</div>
            </div>
          </div>
        </div>

        {/* Sign Out Section */}
        <div className="sign-out-container">
          <button className="sign-out-text-btn" onClick={handleSignOut}>Sign Out</button>
        </div>

        {/* Footer Section */}
        <div className="settings-app-footer">
          <h3>Multilingual Baptist Hymnal</h3>
          <p className="version">Version 1.0.0</p>
          <p className="footer-note">Settings are automatically saved and synced across your devices.</p>
        </div>
      </div>
    </div>
  );
}

export default AppSettings;

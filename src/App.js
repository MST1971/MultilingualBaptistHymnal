import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Welcome from './components/Welcome';
import HymnList from './components/HymnList';
import HymnDetail from './components/HymnDetail';
import Edition1956 from './components/Edition1956';
import Edition1975 from './components/Edition1975';
import Edition1991 from './components/Edition1991';
import Edition2008 from './components/Edition2008';
import EditionYoruba from './components/EditionYoruba';
import YorubaHymnDetail from './components/YorubaHymnDetail';
import EditionIgbo from './components/EditionIgbo';
import IgboHymnDetail from './components/IgboHymnDetail';
import EditionHausa from './components/EditionHausa';
import HausaHymnDetail from './components/HausaHymnDetail';
import MinistersCompanion from './components/MinistersCompanion';
import Resources from './components/Resources';
import ChurchCovenant from './components/ChurchCovenant';
import ResponsiveReading from './components/ResponsiveReading';
import ReadingDetail from './components/ReadingDetail';
import ChorusesList from './components/ChorusesList';
import ChorusDetail from './components/ChorusDetail';
import FavoritesPage from './components/FavoritesPage';
import About from './components/About';
import Help from './components/Help';
import DocView from './components/DocView';
import Settings from './components/Settings';
import UserProfile from './components/UserProfile';
import Community from './components/Community';
import BrowseHymns from './components/BrowseHymns';
import FeelingList from './components/FeelingList';
import FeelingDetail from './components/FeelingDetail';
import FindChurch from './components/FindChurch';
import RegisterChurch from './components/RegisterChurch';
import ReadingPlans from './components/ReadingPlans';
import CreatePlan from './components/CreatePlan';
import AppSettings from './components/AppSettings';
import Donation from './components/Donation';
import Membership from './components/Membership';
import AuthScreen from './components/AuthScreen';
import AuthForm from './components/AuthForm';
import ProtectedRoute from './components/ProtectedRoute';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('md'); // sm | md | lg
  const [enableCache, setEnableCache] = useState(false);
  const [language, setLanguage] = useState('Both Languages');
  const [keepScreenOn, setKeepScreenOn] = useState(false);
  const [showVerseNumbers, setShowVerseNumbers] = useState(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [downloadWifiOnly, setDownloadWifiOnly] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [enableSharing, setEnableSharing] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('hymnTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const savedFont = localStorage.getItem('hymnFontSize');
    if (savedFont) setFontSize(savedFont);
    const savedCache = localStorage.getItem('hymnEnableCache');
    if (savedCache) setEnableCache(savedCache === 'true');
    
    const savedLang = localStorage.getItem('hymnLanguage');
    if (savedLang) setLanguage(savedLang);
    
    const savedKeepScreen = localStorage.getItem('hymnKeepScreenOn');
    if (savedKeepScreen) setKeepScreenOn(savedKeepScreen === 'true');
    
    const savedVerseNum = localStorage.getItem('hymnShowVerseNumbers');
    if (savedVerseNum) setShowVerseNumbers(savedVerseNum === 'true');
    
    const savedAutoPlay = localStorage.getItem('hymnAutoPlayAudio');
    if (savedAutoPlay) setAutoPlayAudio(savedAutoPlay === 'true');
    
    const savedWifiOnly = localStorage.getItem('hymnDownloadWifiOnly');
    if (savedWifiOnly) setDownloadWifiOnly(savedWifiOnly === 'true');
    
    const savedPush = localStorage.getItem('hymnPushNotifications');
    if (savedPush) setPushNotifications(savedPush === 'true');
    
    const savedSharing = localStorage.getItem('hymnEnableSharing');
    if (savedSharing) setEnableSharing(savedSharing === 'true');
    
    const savedSync = localStorage.getItem('hymnAutoSync');
    if (savedSync) setAutoSync(savedSync === 'true');
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('hymnTheme', newTheme);
  };

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-blue');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    document.body.classList.remove('font-sm', 'font-md', 'font-lg', 'font-xl');
    document.body.classList.add(`font-${fontSize}`);
    localStorage.setItem('hymnFontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('hymnEnableCache', String(enableCache));
  }, [enableCache]);

  useEffect(() => {
    localStorage.setItem('hymnLanguage', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('hymnKeepScreenOn', String(keepScreenOn));
  }, [keepScreenOn]);

  useEffect(() => {
    localStorage.setItem('hymnShowVerseNumbers', String(showVerseNumbers));
  }, [showVerseNumbers]);

  useEffect(() => {
    localStorage.setItem('hymnAutoPlayAudio', String(autoPlayAudio));
  }, [autoPlayAudio]);

  useEffect(() => {
    localStorage.setItem('hymnDownloadWifiOnly', String(downloadWifiOnly));
  }, [downloadWifiOnly]);

  useEffect(() => {
    localStorage.setItem('hymnPushNotifications', String(pushNotifications));
  }, [pushNotifications]);

  useEffect(() => {
    localStorage.setItem('hymnEnableSharing', String(enableSharing));
  }, [enableSharing]);

  useEffect(() => {
    localStorage.setItem('hymnAutoSync', String(autoSync));
  }, [autoSync]);

  return (
    <Router>
      <AuthProvider>
        <SettingsProvider value={{ 
          theme, setTheme: handleThemeChange, 
          fontSize, setFontSize, 
          enableCache, setEnableCache,
          language, setLanguage,
          keepScreenOn, setKeepScreenOn,
          showVerseNumbers, setShowVerseNumbers,
          autoPlayAudio, setAutoPlayAudio,
          downloadWifiOnly, setDownloadWifiOnly,
          pushNotifications, setPushNotifications,
          enableSharing, setEnableSharing,
          autoSync, setAutoSync
        }}>
          <div className="App">
            <Navbar theme={theme} onThemeChange={handleThemeChange} />
            <main>
              <Routes>
                <Route path="/" element={<Welcome theme={theme} />} />
                <Route path="/signin" element={<AuthForm mode="signin" theme={theme} />} />
                <Route path="/signup" element={<AuthForm mode="signup" theme={theme} />} />
                <Route path="/hymns" element={<HymnList theme={theme} />} />
                <Route path="/hymn/:slug" element={<HymnDetail theme={theme} />} />
                <Route path="/edition/1956" element={<Edition1956 theme={theme} />} />
                <Route path="/edition/1975" element={<Edition1975 theme={theme} />} />
                <Route path="/edition/1991" element={<Edition1991 theme={theme} />} />
                <Route path="/edition/2008" element={<Edition2008 theme={theme} />} />
                <Route path="/edition/yoruba" element={<EditionYoruba theme={theme} />} />
                <Route path="/yoruba-hymn/:id" element={<YorubaHymnDetail theme={theme} />} />
                <Route path="/edition/igbo" element={<EditionIgbo theme={theme} />} />
                <Route path="/igbo-hymn/:id" element={<IgboHymnDetail theme={theme} />} />
                <Route path="/edition/hausa" element={<EditionHausa theme={theme} />} />
                <Route path="/hausa-hymn/:id" element={<HausaHymnDetail theme={theme} />} />
                <Route path="/ministers-companion" element={<ProtectedRoute><MinistersCompanion theme={theme} /></ProtectedRoute>} />
                <Route path="/browse" element={<ProtectedRoute><BrowseHymns theme={theme} /></ProtectedRoute>} />
                <Route path="/feelings" element={<FeelingList theme={theme} />} />
                <Route path="/feelings/:id" element={<ProtectedRoute><FeelingDetail theme={theme} /></ProtectedRoute>} />
                <Route path="/find-church" element={<ProtectedRoute><FindChurch theme={theme} /></ProtectedRoute>} />
                <Route path="/register-church" element={<ProtectedRoute><RegisterChurch theme={theme} /></ProtectedRoute>} />
                <Route path="/reading-plans" element={<ProtectedRoute><ReadingPlans theme={theme} /></ProtectedRoute>} />
                <Route path="/create-plan/:type" element={<ProtectedRoute><CreatePlan theme={theme} /></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute><Resources theme={theme} /></ProtectedRoute>} />
                <Route path="/church-covenant" element={<ProtectedRoute><ChurchCovenant theme={theme} /></ProtectedRoute>} />
                <Route path="/responsive-reading" element={<ProtectedRoute><ResponsiveReading theme={theme} /></ProtectedRoute>} />
                <Route path="/reading/:id" element={<ReadingDetail theme={theme} />} />
                <Route path="/choruses" element={<ProtectedRoute><ChorusesList theme={theme} /></ProtectedRoute>} />
                <Route path="/chorus/:id" element={<ChorusDetail theme={theme} />} />
                <Route path="/favorites" element={<ProtectedRoute><FavoritesPage theme={theme} /></ProtectedRoute>} />
                <Route path="/about" element={<About theme={theme} />} />
                <Route path="/help" element={<Help theme={theme} />} />
                <Route path="/docs" element={<DocView theme={theme} />} />
                <Route path="/settings" element={<Settings theme={theme} />} />
                <Route path="/membership" element={<Membership theme={theme} />} />
                <Route path="/settings/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/settings/community" element={<Community />} />
                <Route path="/settings/app" element={<AppSettings />} />
                <Route path="/settings/donation" element={<Donation />} />
                <Route path="/settings/auth" element={<AuthScreen />} />
              </Routes>
            </main>
            <MobileNav />
          </div>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

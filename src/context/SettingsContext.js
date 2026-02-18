import React, { createContext, useContext } from 'react';

const SettingsContext = createContext({
  theme: 'light',
  setTheme: () => {},
  fontSize: 'md',
  setFontSize: () => {},
  enableCache: false,
  setEnableCache: () => {},
  language: 'Both Languages',
  setLanguage: () => {},
  keepScreenOn: false,
  setKeepScreenOn: () => {},
  showVerseNumbers: true,
  setShowVerseNumbers: () => {},
  autoPlayAudio: false,
  setAutoPlayAudio: () => {},
  downloadWifiOnly: true,
  setDownloadWifiOnly: () => {},
  pushNotifications: true,
  setPushNotifications: () => {},
  enableSharing: true,
  setEnableSharing: () => {},
  autoSync: false,
  setAutoSync: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ value, children }) {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsContext;

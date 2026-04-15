import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let app;
let auth;
let googleProvider;


if (config.apiKey && config.authDomain) {
  try {
    app = initializeApp(config);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();

    
    // Check if appId looks like an Android ID but running in web
    if (config.appId && config.appId.includes(':android:') && typeof window !== 'undefined') {
      console.warn("Firebase Warning: You are using an Android App ID in a web environment. This may cause 'auth/internal-error' during sign-in. Please ensure you use a Web App ID for web development.");
    }
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
} else {
  console.warn("Firebase configuration is incomplete. Check your .env file.");
}

export { app, auth, googleProvider, RecaptchaVerifier };

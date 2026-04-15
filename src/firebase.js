import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

let app;
let auth;
let googleProvider;


if (firebaseConfig.apiKey && firebaseConfig.authDomain) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();

    
    // Check if appId looks like an Android ID but running in web
    if (firebaseConfig.appId && firebaseConfig.appId.includes(':android:') && typeof window !== 'undefined') {
      console.warn("Firebase Warning: You are using an Android App ID in a web environment. This may cause 'auth/internal-error' during sign-in. Please ensure you use a Web App ID for web development.");
    }
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
} else {
  console.warn("Firebase configuration is incomplete. Check your .env file.");
}

export { app, auth, googleProvider, RecaptchaVerifier };

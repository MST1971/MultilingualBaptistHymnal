import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  signInAnonymously
} from 'firebase/auth';

const AuthContext = createContext({
  user: null,
  signInWithGoogle: async () => {},

  signInWithPhone: async (phoneNumber, appVerifier) => {},
  signInWithPhoneAndPin: async (phoneNumber, pin) => {},
  signUpWithPhoneAndPin: async (phoneNumber, pin) => {},
  signInWithEmail: async (email, password) => {},
  signUpWithEmail: async (email, password) => {},
  signInAnonymously: async () => {},
  signOut: async () => {},
  resetPassword: async (email) => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const enableMockAuth = process.env.REACT_APP_ENABLE_MOCK_AUTH === 'true';

  useEffect(() => {
    if (!auth) {
      setReady(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        let phoneNumber = u.phoneNumber || '';
        let email = u.email || '';
        
        // Handle pseudo-email for phone auth
        if (email.endsWith('@hymnal.phone')) {
          phoneNumber = email.split('@')[0];
          // Restore + if it was replaced or stripped, though we usually store as is.
          // Assuming we store as [number]@hymnal.phone
        }

        setUser({
          id: u.uid,
          name: u.displayName || u.email?.split('@')[0] || phoneNumber || (u.isAnonymous ? 'Guest' : 'User'),
          email: email,
          phoneNumber: phoneNumber,
          provider: u.isAnonymous ? 'anonymous' : (u.providerData[0]?.providerId || 'unknown'),
          photoURL: u.photoURL || '',
          isAnonymous: u.isAnonymous,
        });
      } else {
        setUser(null);
      }
      setReady(true);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (!auth || !googleProvider) {
        if (enableMockAuth) {
          console.warn("Firebase is not configured. Using Mock Sign In.");
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockUser = {
            id: 'mock-user-google',
            name: 'Mock User',
            email: 'mockuser@example.com',
            provider: 'google',
            photoURL: 'https://via.placeholder.com/150'
          };
          setUser(mockUser);
          return mockUser;
        }
        throw new Error('Firebase is not configured. Set REACT_APP_FIREBASE_* values (or firebaseConfig.js) to enable Google sign-in.');
      }
      const isNative = typeof window !== 'undefined' && window.Capacitor && typeof window.Capacitor.getPlatform === 'function' && (window.Capacitor.getPlatform() === 'android' || window.Capacitor.getPlatform() === 'ios');
      if (isNative) {
        await signInWithRedirect(auth, googleProvider);
        return;
      } else {
        const res = await signInWithPopup(auth, googleProvider);
        return res.user;
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
      throw error;
    }
  };



  const signInWithPhoneAndPin = async (phoneNumber, pin) => {
    const email = `${phoneNumber}@hymnal.phone`;
    if (!auth) {
      if (enableMockAuth) {
        console.warn("Firebase is not configured. Using Mock Sign In.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = {
          id: 'mock-user-phone-pin',
          name: phoneNumber,
          email: email,
          phoneNumber: phoneNumber,
          provider: 'password', // acts as password provider
          photoURL: ''
        };
        setUser(mockUser);
        return mockUser;
      }
      throw new Error('Firebase is not configured. Cannot sign in.');
    }
    const res = await signInWithEmailAndPassword(auth, email, pin);
    return res.user;
  };

  const signUpWithPhoneAndPin = async (phoneNumber, pin) => {
    const email = `${phoneNumber}@hymnal.phone`;
    if (!auth) {
      if (enableMockAuth) {
        console.warn("Firebase is not configured. Using Mock Sign Up.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = {
          id: 'mock-user-phone-pin-new',
          name: phoneNumber,
          email: email,
          phoneNumber: phoneNumber,
          provider: 'password',
          photoURL: ''
        };
        setUser(mockUser);
        return mockUser;
      }
      throw new Error('Firebase is not configured. Cannot sign up.');
    }
    const res = await createUserWithEmailAndPassword(auth, email, pin);
    return res.user;
  };

  const signInWithPhone = async (phoneNumber, appVerifier) => {
    if (!auth) {
      if (enableMockAuth) {
        console.warn("Firebase is not configured. Using Mock Sign In.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = {
          id: 'mock-user-phone',
          name: phoneNumber,
          email: '',
          phoneNumber: phoneNumber,
          provider: 'phone',
          photoURL: ''
        };
        setUser(mockUser);
        return { confirm: async () => mockUser };
      }
      throw new Error('Firebase is not configured. Cannot sign in.');
    }
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  const signInWithEmail = async (email, password) => {
    if (!auth) {
      if (enableMockAuth) {
        console.warn("Firebase is not configured. Using Mock Sign In.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          provider: 'password',
          photoURL: ''
        };
        setUser(mockUser);
        return mockUser;
      }
      throw new Error('Firebase is not configured. Cannot sign in.');
    }
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  const signUpWithEmail = async (email, password) => {
    if (!auth) {
      if (enableMockAuth) {
        console.warn("Firebase is not configured. Using Mock Sign Up.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          provider: 'password',
          photoURL: ''
        };
        setUser(mockUser);
        return mockUser;
      }
      throw new Error('Firebase is not configured. Cannot sign up.');
    }
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  const signInAnonymous = async () => {
    if (!auth) {
      if (enableMockAuth) {
        console.warn("Firebase is not configured. Using Mock Anonymous Sign In.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = {
          id: 'mock-user-anon-' + Date.now(),
          name: 'Guest',
          email: '',
          provider: 'anonymous',
          photoURL: '',
          isAnonymous: true
        };
        setUser(mockUser);
        return mockUser;
      }
      throw new Error('Firebase is not configured. Cannot sign in anonymously.');
    }
    const res = await signInAnonymously(auth);
    return res.user;
  };

  const signOut = async () => {
    if (!auth) {
      setUser(null);
      return;
    }
    await fbSignOut(auth);
  };

  const resetPassword = async (email) => {
    if (!auth) return;
    
    // Check if it's a pseudo-email (phone account)
    if (email.endsWith('@hymnal.phone')) {
      throw new Error("Cannot reset PIN via email. Please contact support.");
    }
    
    await sendPasswordResetEmail(auth, email);
  };

  const resetPin = async (phoneNumber) => {
    const email = `${phoneNumber}@hymnal.phone`;
    if (!auth) return;
    // For pseudo-email phone auth, we can't really send a reset email.
    // The user would need to contact support or we need a real SMS reset flow.
    // However, since we are using Email/Password backend, the only way is 
    // to send a reset link to the "email", but @hymnal.phone is fake.
    
    // SOLUTION: We cannot reset a PIN for a fake email without a real verified email attached.
    // We will throw an error explaining this limitation for this specific implementation,
    // or we could implement a more complex flow if we had a backend.
    
    throw new Error("Cannot reset PIN for phone-only accounts. Please contact support.");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithGoogle, 

      signInWithPhone, 
      signInWithPhoneAndPin,
      signUpWithPhoneAndPin,
      signInWithEmail, 
      signUpWithEmail, 
      signInAnonymously: signInAnonymous,
      signOut, 
      resetPassword,
      resetPin,
      ready 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

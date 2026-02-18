import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

const AuthContext = createContext({
  user: null,
  signInWithGoogle: async () => {},
  signInWithEmail: async (email, password) => {},
  signUpWithEmail: async (email, password) => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      setReady(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({
          id: u.uid,
          name: u.displayName || u.email?.split('@')[0] || 'User',
          email: u.email || '',
          provider: u.providerData[0]?.providerId || 'unknown',
          photoURL: u.photoURL || '',
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
      if (!auth || !provider) {
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
      const res = await signInWithPopup(auth, provider);
      return res.user;
    } catch (error) {
      console.error("Google Sign In Error:", error);
      if (error.code === 'auth/internal-error') {
        console.error("Internal Error Details:", error.customData);
        const customMessage = "Authentication failed (internal-error). This is often caused by an incorrect App ID (e.g., using an Android ID for Web), a missing authorized domain in Firebase Console, or blocked popups/cookies. Please check your browser console for more details.";
        const enhancedError = new Error(customMessage);
        enhancedError.code = error.code;
        throw enhancedError;
      }
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    if (!auth) {
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
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  const signUpWithEmail = async (email, password) => {
    if (!auth) {
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
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  const signOut = async () => {
    if (!auth) {
      setUser(null);
      return;
    }
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

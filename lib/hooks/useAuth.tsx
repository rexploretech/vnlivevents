'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

const ALLOWED_EMAILS = [
  'rsmk@rexplore.tech',
  'vnphotography777@gmail.com',
  'ramunarlapati27@gmail.com'
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase Auth is not initialized. Check your environment variables.');
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (usr && usr.email && ALLOWED_EMAILS.includes(usr.email.toLowerCase())) {
        setUser(usr);
      } else {
        if (usr) {
          await signOut(auth);
        }
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      throw new Error('Access denied: Unauthorized email address.');
    }
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (!cred.user?.email || !ALLOWED_EMAILS.includes(cred.user.email.toLowerCase())) {
      await signOut(auth);
      throw new Error('Access denied: Unauthorized email address.');
    }
  };

  const signUp = async (email: string, pass: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      throw new Error('Access denied: Unauthorized email address.');
    }
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (!cred.user?.email || !ALLOWED_EMAILS.includes(cred.user.email.toLowerCase())) {
      await signOut(auth);
      throw new Error('Access denied: Unauthorized email address.');
    }
  };

  const logOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

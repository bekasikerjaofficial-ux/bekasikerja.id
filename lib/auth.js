'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bridge Supabase session -> localStorage for existing member UI patterns.
  const syncSession = useCallback(async () => {
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      setUser(s?.user ?? null);
      if (typeof window !== 'undefined') {
        if (s?.user) {
          localStorage.setItem('isMemberLoggedIn', 'true');
          localStorage.setItem('memberUser', JSON.stringify({
            id: s.user.id,
            email: s.user.email,
            full_name: s.user.user_metadata?.full_name,
          }));
        } else {
          localStorage.removeItem('isMemberLoggedIn');
          localStorage.removeItem('memberUser');
        }
      }
    } catch (e) {
      console.warn('[AuthProvider] getSession error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncSession();

    // Listen for auth state changes (login, logout, token refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (typeof window !== 'undefined') {
        if (session?.user) {
          localStorage.setItem('isMemberLoggedIn', 'true');
          localStorage.setItem('memberUser', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name,
          }));
        } else {
          localStorage.removeItem('isMemberLoggedIn');
          localStorage.removeItem('memberUser');
        }
      }
    });

    return () => { subscription.unsubscribe(); };
  }, [syncSession]);

  return (
    <AuthContext.Provider value={{ session, user, loading, refresh: syncSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

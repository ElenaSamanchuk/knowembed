import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { ensureDemoBot, fetchProfile, type Profile } from '../lib/data';
import { supabase } from '../lib/supabase';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const refreshProfile = async (currentSession = session) => {
    if (!currentSession?.user) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    try {
      const next = await fetchProfile(
        currentSession.user.id,
        currentSession.user.email ?? undefined,
      );
      setProfile(next);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    let active = true;

    void (async () => {
      setProfileLoading(true);
      try {
        const next = await fetchProfile(
          session.user.id,
          session.user.email ?? undefined,
        );
        if (!active) return;
        setProfile(next);

        if (next) {
          await ensureDemoBot(session.user.id);
        }
      } finally {
        if (active) setProfileLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      profileLoading,
      refreshProfile: () => refreshProfile(session),
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, profile, loading, profileLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

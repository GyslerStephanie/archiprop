import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

/**
 * Restores any persisted Supabase session on app start and keeps the auth
 * store in sync with sign-in / sign-out events. When Supabase isn't
 * configured it simply marks auth as initialized (demo mode).
 */
export function useAuthSession() {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setInitialized(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      }
      setInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user
          ? { id: session.user.id, email: session.user.email ?? '' }
          : null
      );
    });

    return () => subscription.unsubscribe();
  }, [setUser, setInitialized]);
}

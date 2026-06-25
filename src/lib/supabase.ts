import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True only when both env vars are present. When false, the app runs in
 * "demo mode": mock login + bundled demo projects, so it still works on a
 * simulator without a backend. Add the keys to `.env` to switch to the real
 * Supabase backend — no code changes needed.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        // No URL-based session detection on native (that's a web-only concept).
        detectSessionInUrl: false,
      },
    })
  : null;

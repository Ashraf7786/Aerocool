import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (process.env.NODE_ENV === 'production') {
    console.error('CRITICAL: Supabase credentials missing in production environment!');
  } else {
    console.warn('Supabase credentials missing. Database operations will fail.');
  }
}

// Client for public/client-side use (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for server-side/admin use (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey // Fallback to anon if service key is missing
);

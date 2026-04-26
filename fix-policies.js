import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPolicies() {
  const sql = `
    -- Drop all existing policies on profiles
    DROP POLICY IF EXISTS "Public read for profiles" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
    DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
    DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
    DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
    
    -- Try to just drop anything with common names
    DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
    DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
    DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
    
    -- Create fresh, simple, NON-recursive policies
    CREATE POLICY "Public read for profiles" ON profiles FOR SELECT USING (true);
    CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
  `;
  
  // Actually, we can't reliably run raw SQL without an RPC function.
  // Let's create an RPC function if it doesn't exist.
  // Wait, the user might not have `exec_sql`.
  // Let me just tell the user to run it in their Supabase SQL editor!
}

fixPolicies();

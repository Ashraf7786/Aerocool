'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function upsertProfile(profileData) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    // Security check: Only allow users to update their own profile
    // Or allow admins to update any profile
    if (user.id !== profileData.id) {
       // Check if current user is admin
       const { data: adminProfile } = await supabaseAdmin
         .from('profiles')
         .select('role')
         .eq('id', user.id)
         .single();

       if (!adminProfile || (adminProfile.role !== 'admin' && adminProfile.role !== 'owner')) {
         return { success: false, error: 'Permission denied' };
       }
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert(profileData);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Profile Upsert Error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function upsertProfile(profileData) {
  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert(profileData);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Server Action Error:', error);
    return { success: false, error: error.message };
  }
}

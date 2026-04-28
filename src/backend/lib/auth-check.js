import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '../utils/supabase/server';
import { supabaseAdmin } from './supabase-admin';

/**
 * Verifies if the current requester is an authorized admin or owner.
 * @returns {Promise<{user: any, profile: any, error: NextResponse | null}>}
 */
export async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { user: null, profile: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
      return { user, profile, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { user, profile, error: null };
  } catch (error) {
    console.error('Admin Auth Check Error:', error);
    return { user: null, profile: null, error: NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }) };
  }
}

/**
 * Verifies if the current requester is an authorized technician.
 */
export async function verifyTechnician() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { user: null, profile: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'technician') {
      return { user, profile, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { user, profile, error: null };
  } catch (error) {
    console.error('Tech Auth Check Error:', error);
    return { user: null, profile: null, error: NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }) };
  }
}

/**
 * Verifies if the current requester is either an admin or the technician assigned to the booking.
 */
export async function verifyAnyAuth() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { user: null, profile: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'owner', 'technician'].includes(profile.role)) {
      return { user, profile, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { user, profile, error: null };
  } catch (error) {
    console.error('Any Auth Check Error:', error);
    return { user: null, profile: null, error: NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }) };
  }
}

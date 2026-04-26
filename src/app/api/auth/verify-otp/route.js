import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('Verifying OTP for:', normalizedEmail);

    // 1. Fetch profile with this email and OTP
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, otp_code')
      .ilike('email', normalizedEmail)
      .single();

    if (fetchError || !profile) {
      console.error('Fetch profile error:', fetchError);
      return NextResponse.json({ error: 'User profile not found. Please register again.' }, { status: 404 });
    }

    // 2. Compare OTP
    if (profile.otp_code !== otp) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }

    // 3. Clear OTP and mark as verified (optional: set a verified flag)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ otp_code: null })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully' 
    });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

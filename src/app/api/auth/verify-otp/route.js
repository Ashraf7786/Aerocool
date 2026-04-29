import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/backend/lib/supabase-admin';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('Verifying OTP for:', normalizedEmail);

    // Basic brute-force protection: small delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // 1. Fetch profile with this email and OTP
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, otp_code')
      .ilike('email', normalizedEmail)
      .single();

    if (fetchError || !profile) {
      console.error('Fetch profile error:', fetchError);
      return NextResponse.json({ error: 'Invalid verification code or email' }, { status: 401 });
    }

    // 2. Compare OTP
    if (!profile.otp_code || profile.otp_code !== otp) {
      return NextResponse.json({ error: 'Invalid verification code or email' }, { status: 401 });
    }

    // 3. Clear OTP and mark as verified
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        otp_code: null,
        is_verified: true 
      })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully' 
    });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

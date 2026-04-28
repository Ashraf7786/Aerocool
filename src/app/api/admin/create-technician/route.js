import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/auth-check';

export async function POST(request) {
  const { error: authError } = await verifyAdmin();
  if (authError) return authError;

  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create User in Auth (Auto-confirmed)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // 2. Generate Unique Technician ID
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const technicianId = `AC-TECH-${year}-${random}`;

    // 3. Create Profile Entry
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: email.toLowerCase().trim(),
          full_name: name,
          role: 'technician',
          status: 'pending', // Requires admin approval to login
          technician_id: technicianId,
          phone,
          is_verified: false, // Default not verified
          created_at: new Date().toISOString()
        }
      ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // We might want to cleanup the auth user here if profile fails
      return NextResponse.json({ error: 'User created but profile failed: ' + profileError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Technician account created successfully.',
      technician_id: technicianId
    });

  } catch (error) {
    console.error('Admin Create Tech Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

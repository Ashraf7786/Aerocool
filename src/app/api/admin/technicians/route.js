import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/auth-check';

export async function GET() {
  const { error: authError } = await verifyAdmin();
  if (authError) return authError;

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', 'technician')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { error: authError } = await verifyAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const updates = {};
    if (body.status) updates.status = body.status;
    if (body.is_verified !== undefined) updates.is_verified = body.is_verified;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

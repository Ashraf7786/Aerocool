import { NextResponse } from 'next/server';
import { sendAdminEmail } from '@/lib/mail';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Inquiry POST received:', data);
    
    // 1. Save to Supabase (using Admin client to bypass RLS)
    const { error: dbError } = await supabaseAdmin
      .from('contact_inquiries')
      .insert([
        {
          name: data.name,
          phone: data.phone, // Added phone field
          email: data.email,
          message: data.message,
          status: 'New'
        }
      ]);

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      // If DB fails, we should probably stop and return error
      return NextResponse.json({ error: 'Database saving failed', details: dbError.message }, { status: 500 });
    }

    // 2. Send email to admin
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #254EDB;">New Inquiry Received</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">${data.message}</div>
      </div>
    `;

    await sendAdminEmail(`New Message from ${data.name}`, emailHtml);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry saved successfully!' 
    }, { status: 200 });

  } catch (error) {
    console.error('Inquiry API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Use Admin client to ensure we see all inquiries even if RLS is enabled
    const { data, error } = await supabaseAdmin
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

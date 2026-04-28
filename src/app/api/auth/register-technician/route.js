import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendAdminEmail, sendEmail } from '@/lib/mail';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2).max(50).regex(/^[a-zA-Z\s]*$/, "Name can only contain letters"),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  experience: z.string().optional()
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate Input
    const validatedData = registerSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validatedData.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { name, email, password, phone } = validatedData.data;

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });

    if (authError) throw authError;

    // 3. Generate Unique Technician ID
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const technicianId = `AC-TECH-${year}-${random}`;

    // 4. Create/Update profile entry with OTP (using upsert)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([
        {
          id: authData.user.id,
          email: normalizedEmail,
          full_name: name,
          role: 'technician',
          status: 'pending',
          technician_id: technicianId,
          phone,
          otp_code: otp, 
          created_at: new Date().toISOString()
        }
      ], { onConflict: 'id' });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json({ 
        error: `Database Error: ${profileError.message}. Details: ${profileError.details || 'Check if profiles table exists in Supabase.'}` 
      }, { status: 500 });
    }

    // 5. Send OTP to Technician via Nodemailer
    await sendEmail(
      normalizedEmail,
      'Your Aerocool Verification Code',
      `
      <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb;">Verify Your Account</h2>
        <p>Hello ${name},</p>
        <p>Your 6-digit verification code for Aerocool Jaipur is:</p>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #1e293b; padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 0.9rem;">This code will expire in 10 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.8rem; color: #94a3b8;">If you didn't request this, please ignore this email.</p>
      </div>
      `
    );

    // 6. Notify Ashraf (Admin)
    await sendAdminEmail(
      `New Technician Registration: ${name}`,
      `<h1>New Technician Registration</h1><p>Name: ${name}</p><p>ID: ${technicianId}</p><p>Email: ${normalizedEmail}</p>`
    );

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent to your email.'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

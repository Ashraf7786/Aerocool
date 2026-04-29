import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'
import { supabaseAdmin } from '@/backend/lib/supabase-admin'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Edge-compatible nonce generation (Buffer is not available in Edge)
  const nonce = btoa(Array.from(crypto.getRandomValues(new Uint8Array(16)), b => String.fromCharCode(b)).join(''));
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
    style-src 'self' 'unsafe-inline' https:;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https:;
    connect-src 'self' https: wss:;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // Apply CSP Headers
  response.headers.set('x-nonce', nonce);
  response.headers.set('Content-Security-Policy', cspHeader);

  // Apply CORS for API routes
  if (url.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && !origin.includes(host)) {
      // response.headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
    } else {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-info');
  }

  // --- UNIFIED AUTH LOGIC ---
  const isAdminPath = url.pathname.startsWith('/admin');
  const isTechPath = url.pathname.startsWith('/technician');
  const isLoginPath = url.pathname === '/admin/login';
  const isTechRegisterPath = url.pathname === '/technician/register';

  // 1. If user is NOT logged in
  if (!user) {
    // Protect all Admin and Tech routes (except registration)
    if ((isAdminPath || isTechPath) && !isLoginPath && !isTechRegisterPath) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return response;
  }

  // 2. If user IS logged in, fetch their role securely
  let role = null;
  try {
    if (supabaseAdmin) {
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      
      if (!error && profile) {
        role = profile.role;
      }
    }
  } catch (err) {
    console.error('Middleware Auth Error:', err);
  }

  // 3. Logic for Login Page (Redirect logged-in users to their respective hubs)
  if (isLoginPath) {
    if (role === 'admin' || role === 'owner') {
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    if (role === 'technician') {
      url.pathname = '/technician/dashboard';
      return NextResponse.redirect(url);
    }
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // 4. Protect Admin Routes
  if (isAdminPath && !isLoginPath) {
    if (role !== 'admin' && role !== 'owner') {
      url.pathname = '/'; // Redirect unauthorized users to home
      return NextResponse.redirect(url);
    }
  }

  // 5. Protect Technician Routes
  if (isTechPath && !isTechRegisterPath) {
    if (role !== 'technician') {
      url.pathname = '/'; // Redirect unauthorized users to home
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

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

  // 1. If user is NOT logged in
  if (!user) {
    const isProtected = url.pathname.startsWith('/admin') || url.pathname.startsWith('/technician');
    const isAuthPage = url.pathname === '/admin/login' || url.pathname === '/technician/register';
    
    if (isProtected && !isAuthPage) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return response;
  }

  // 2. Simple Role Protection (Layouts will handle the strict database check)
  // This prevents the middleware from crashing if the database connection is slow
  if (url.pathname === '/admin/login') {
     // If logged in, send them to a landing page where the layout will sort them out
     url.pathname = '/admin/dashboard';
     return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

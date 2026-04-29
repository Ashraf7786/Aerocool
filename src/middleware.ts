import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // 1. ULTRA-SAFE: Return early if keys are missing to prevent 500 crashes
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  try {
    const { supabase, response } = createClient(request);

    // Edge-compatible nonce generation
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

    const { data: { user } } = await supabase.auth.getUser()

    // 2. If user is NOT logged in
    if (!user) {
      const isProtected = url.pathname.startsWith('/admin') || url.pathname.startsWith('/technician');
      const isAuthPage = url.pathname === '/admin/login' || url.pathname === '/technician/register';
      
      if (isProtected && !isAuthPage) {
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
      return response;
    }

    // 3. Simple Role Protection
    if (url.pathname === '/admin/login') {
       url.pathname = '/admin/dashboard';
       return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error('Middleware Critical Error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

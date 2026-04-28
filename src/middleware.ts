import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
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

  // Apply CORS for API routes - Restrict to self in production
  if (url.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // Simple check: allow if origin matches host or is same-origin
    if (origin && !origin.includes(host)) {
      // If you want to allow specific domains, add them here
      // response.headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
    } else {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-info');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  // 2. Protect Admin & Technician Routes with RBAC
  if (url.pathname.startsWith('/admin')) {
    if (url.pathname === '/admin/login') {
      if (user) {
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      }
      return response
    }

    if (!user) {
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Role check for Admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }
  
  if (url.pathname.startsWith('/technician')) {
    if (!user && url.pathname !== '/technician/register') {
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    if (user && url.pathname !== '/technician/register') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'technician') {
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

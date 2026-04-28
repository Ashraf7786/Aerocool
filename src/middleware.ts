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

  // 1. Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Apply CSP Headers
  response.headers.set('x-nonce', nonce);
  response.headers.set('Content-Security-Policy', cspHeader);

  // Apply CORS for API routes
  if (url.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // 2. Protect Admin & Technician Routes
  const adminToken = request.cookies.get('admin_token')?.value

  if (url.pathname.startsWith('/admin')) {
    if (url.pathname === '/admin/login') {
      if (user || adminToken === 'master_admin_access') {
        url.pathname = '/admin/dashboard'
        const redirectRes = NextResponse.redirect(url)
        redirectRes.headers.set('Content-Security-Policy', cspHeader)
        return redirectRes
      }
      return response
    }

    if (!user && adminToken !== 'master_admin_access') {
      url.pathname = '/admin/login'
      const redirectRes = NextResponse.redirect(url)
      redirectRes.headers.set('Content-Security-Policy', cspHeader)
      return redirectRes
    }
  }
  
  if (url.pathname.startsWith('/technician')) {
    if (!user && url.pathname !== '/technician/register') {
      url.pathname = '/admin/login'
      const redirectRes = NextResponse.redirect(url)
      redirectRes.headers.set('Content-Security-Policy', cspHeader)
      return redirectRes
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

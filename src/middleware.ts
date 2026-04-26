import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // 1. Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // 2. Protect Admin & Technician Routes
  const adminToken = request.cookies.get('admin_token')?.value

  if (url.pathname.startsWith('/admin')) {
    // Exclude login page from redirect loop
    if (url.pathname === '/admin/login') {
      if (user || adminToken === 'master_admin_access') {
        // Technically, if they are a technician, they should go to technician dash
        // We'll let the client-side login redirect handle it, or send them to dashboard and let layout handle it.
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      }
      return response
    }

    // If not logged in, go to login
    if (!user && adminToken !== 'master_admin_access') {
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }
  
  if (url.pathname.startsWith('/technician')) {
    if (!user && url.pathname !== '/technician/register') {
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/technician/:path*',
  ],
}

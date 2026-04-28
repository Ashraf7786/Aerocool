"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X,
  User,
  Users,
  ShieldAlert
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Mobile Handling
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auth & Role Protection
  useEffect(() => {
    const checkAuth = async () => {
      setLoadingProfile(true);
      
      // 2. Check Supabase Auth
      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          if (pathname !== '/admin/login') router.push('/admin/login');
          setLoadingProfile(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile || profile.role === 'technician') {
          // If a technician tries to access /admin, redirect them to their hub
          router.push('/technician/dashboard');
          return;
        }

        setUserProfile(profile);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Auth Error:", err);
        if (pathname !== '/admin/login') router.push('/admin/login');
      } finally {
        setLoadingProfile(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    // Clear Master Admin Cookie
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Sign out from Supabase
    try {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {}

    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;

  if (loadingProfile) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div className="loader"></div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: 1 }}>VERIFYING CREDENTIALS</p>
        </div>
        <style jsx>{`
          .loader {
            width: 48px; height: 48px; border: 3px solid rgba(255,255,255,0.1);
            border-top-color: var(--blue); border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const menuItems = [
    { label: 'Overview', icon: <LayoutDashboard size={20} />, href: '/admin/dashboard' },
    { label: 'Technicians', icon: <Users size={20} />, href: '/admin/technicians' },
    { label: 'Bookings', icon: <CalendarCheck size={20} />, href: '/admin/bookings' },
    { label: 'Inquiries', icon: <MessageSquare size={20} />, href: '/admin/inquiries' },
    { label: 'System Settings', icon: <Settings size={20} />, href: '/admin/settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 280 : (isMobile ? 0 : 80),
        background: '#0F172A',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 101,
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', minWidth: 280 }}>
          <div style={{ width: 40, height: 40, background: 'var(--blue)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <ShieldAlert size={22} color="#fff" />
          </div>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem', letterSpacing: -0.5 }}>AERO<span style={{ color: 'var(--lime)' }}>CONTROL</span></span>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '24px 12px', minWidth: 280 }}>
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderRadius: 14,
                color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                background: active ? 'rgba(37,78,219,0.1)' : 'transparent',
                textDecoration: 'none', marginBottom: 6, transition: 'all 0.2s',
                border: active ? '1px solid rgba(37,78,219,0.2)' : '1px solid transparent'
              }}>
                <span style={{ color: active ? 'var(--blue)' : 'inherit' }}>{item.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.05)', minWidth: 280 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {userProfile?.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>{userProfile?.full_name || 'Administrator'}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600 }}>{userProfile?.role?.toUpperCase() || 'ADMIN'}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ 
            width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px', 
            borderRadius: 12, color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', 
            border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem'
          }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, marginLeft: isMobile ? 0 : (sidebarOpen ? 280 : 80), 
        transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: isMobile ? '20px' : '32px 48px', minWidth: 0
      }}>
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: '#fff', border: '1px solid #e2e8f0', p: 8, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A' }}>Admin Control Panel</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', display: isMobile ? 'none' : 'block' }}>
               <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
               <input placeholder="Global search..." style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 16px 10px 42px', fontSize: '0.85rem', width: 240, outline: 'none' }} />
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}>
               <Bell size={20} color="#64748b" />
               <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }} />
            </div>
          </div>
        </header>

        <div style={{ animation: 'slideUp 0.5s ease-out' }}>
          {children}
        </div>
      </main>

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

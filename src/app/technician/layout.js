"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function TechnicianLayout({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }

        const { profile: prof } = await res.json();

        if (prof) {
          if (prof.role !== 'technician' && prof.role !== 'admin' && prof.role !== 'owner') {
             router.push('/');
             return;
          }
          // Note: If they are admin, we let them view tech hub for testing, 
          // but usually you'd redirect. Here we just set the profile.
          setProfile(prof);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error(err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const toggleAvailability = async () => {
    if (!profile) return;
    setUpdatingAvailability(true);
    try {
      const supabase = createClient();
      const newStatus = !profile.is_available;
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_available: newStatus })
        .eq('id', profile.id);
        
      if (!error) {
        setProfile({ ...profile, is_available: newStatus });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Aggressive DOM clearing for stuck overlays (Next.js dev glitches)
  useEffect(() => {
    const clearOverlays = () => {
      const elements = document.querySelectorAll('div');
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (
          style.position === 'fixed' && 
          style.zIndex >= 100 && 
          el.id !== 'scene-canvas' &&
          !el.innerHTML.includes('AeroTech') // Don't delete our header
        ) {
          // If it's a full screen overlay covering the page
          if (
            (style.top === '0px' || style.inset === '0px') && 
            (style.width === '100vw' || style.width === window.innerWidth + 'px' || style.right === '0px')
          ) {
            console.log('Force removing stuck overlay:', el);
            el.remove();
          }
        }
      });
    };
    
    // Run immediately and after a short delay to catch late-rendering overlays
    clearOverlays();
    setTimeout(clearOverlays, 500);
    setTimeout(clearOverlays, 1500);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid var(--blue-light)', borderTopColor: 'var(--blue)', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top Header */}
      <header style={{ 
        background: '#fff', 
        padding: '16px 32px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: 'var(--blue)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 900, color: '#fff' }}>A</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>
            Aero<span style={{ color: 'var(--lime)' }}>Tech</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Status Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '6px 12px', borderRadius: 50, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Status:</span>
            <button 
              onClick={toggleAvailability}
              disabled={updatingAvailability}
              style={{
                background: profile?.is_available ? '#ecfdf5' : '#fef2f2',
                color: profile?.is_available ? '#10b981' : '#ef4444',
                border: 'none', padding: '4px 10px', borderRadius: 50,
                fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: updatingAvailability ? 0.5 : 1
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: profile?.is_available ? '#10b981' : '#ef4444' }} />
              {profile?.is_available ? 'ONLINE' : 'BUSY'}
            </button>
          </div>

          <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />

          {/* Profile Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>{profile?.full_name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Field Technician</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserIcon size={20} />
            </div>
            <button 
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginLeft: 12, fontWeight: 700, fontSize: '0.85rem' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {children}
      </main>

      <style jsx global>{`
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

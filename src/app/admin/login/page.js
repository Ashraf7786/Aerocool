"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck, ArrowRight, Loader2, Briefcase, Zap } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function UnifiedLogin() {
  const [loginMode, setLoginMode] = useState('admin'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const { data: profile } = await supabase
        .from('profiles')
        .select('status, role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile && profile.role === 'technician' && profile.status !== 'approved') {
        throw new Error('Your technician account is pending admin approval.');
      }

      // Strict Redirection based on actual role
      if (profile?.role === 'technician') {
        router.push('/technician/dashboard');
      } else if (profile?.role === 'admin' || profile?.role === 'owner') {
        router.push('/admin/dashboard');
      } else {
        // Fallback for new accounts or undefined roles
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0F172A',
      backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(37, 78, 219, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(163, 230, 53, 0.1) 0%, transparent 50%)',
      padding: 20
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(30px)',
        borderRadius: 32,
        padding: '48px 40px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        textAlign: 'center'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
           <div style={{ width: 32, height: 32, background: 'var(--blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#fff" fill="#fff" />
           </div>
           <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem', letterSpacing: -1 }}>AERO<span style={{ color: 'var(--lime)' }}>COOL</span></span>
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: 5, borderRadius: 18, marginBottom: 40, border: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            onClick={() => setLoginMode('admin')}
            style={{
              flex: 1, padding: '12px', borderRadius: 14, border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '0.8rem', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              background: loginMode === 'admin' ? '#fff' : 'transparent',
              color: loginMode === 'admin' ? '#0F172A' : 'rgba(255,255,255,0.4)',
              boxShadow: loginMode === 'admin' ? '0 4px 15px rgba(255,255,255,0.1)' : 'none'
            }}
          >
            ADMIN
          </button>
          <button 
            onClick={() => setLoginMode('technician')}
            style={{
              flex: 1, padding: '12px', borderRadius: 14, border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '0.8rem', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              background: loginMode === 'technician' ? '#fff' : 'transparent',
              color: loginMode === 'technician' ? '#0F172A' : 'rgba(255,255,255,0.4)',
              boxShadow: loginMode === 'technician' ? '0 4px 15px rgba(255,255,255,0.1)' : 'none'
            }}
          >
            TECHNICIAN
          </button>
        </div>

        <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>
          {loginMode === 'admin' ? 'Authorized Access' : 'Technician Hub'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: 32, fontWeight: 500 }}>
          Please enter your credentials to continue.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative', textAlign: 'left' }}>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, padding: '16px 16px 16px 48px', color: '#fff', fontSize: '0.95rem',
                  outline: 'none', transition: 'all 0.2s'
                }}
                required
              />
            </div>
          </div>

          <div style={{ position: 'relative', textAlign: 'left' }}>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, padding: '16px 16px 16px 48px', color: '#fff', fontSize: '0.95rem',
                  outline: 'none', transition: 'all 0.2s'
                }}
                required
              />
            </div>
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: 12, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              marginTop: 8, background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 16,
              padding: '16px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.3s', opacity: loading ? 0.7 : 1,
              boxShadow: '0 10px 25px rgba(37, 78, 219, 0.3)'
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                Secure Login <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24 }}>
           {loginMode === 'technician' ? (
             <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontWeight: 500 }}>
               New technician? <button onClick={() => router.push('/technician/register')} style={{ background: 'none', border: 'none', color: 'var(--lime)', fontWeight: 800, cursor: 'pointer' }}>Register here</button>
             </p>
           ) : (
             <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: 1 }}>
               AEROCOOL ADMIN SUITE v2.0
             </p>
           )}
        </div>
      </div>

      <style jsx global>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

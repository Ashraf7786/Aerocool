"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Mail, Lock, Chrome, Send, ArrowRight, ShieldCheck } from 'lucide-react';

const API_URL = '/api';

export default function Login() {
  const [mode, setMode] = useState('manual'); // manual, otp
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      login(res.data.user, res.data.access_token);
      router.push('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/otp/send`, { email });
      setOtpSent(true);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/otp/verify`, { email, otp });
      login(res.data.user, res.data.access_token);
      router.push('/admin');
    } catch (err) {
      setError('Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Demo implementation
    alert('Google Login would redirect to OAuth flow in production.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #F8FAFF 0%, #E2E8F0 100%)',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#fff',
        borderRadius: '32px',
        padding: '48px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255,255,255,0.8)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            width: 64, height: 64, background: 'var(--blue-light)', borderRadius: 20, 
            margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--black)', marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: 'var(--grey)', fontSize: '0.95rem' }}>Access your Aerocool Admin Dashboard</p>
        </div>

        {error && (
          <div style={{ 
            background: '#FEF2F2', color: '#B91C1C', padding: '12px 16px', borderRadius: 12, 
            fontSize: '0.85rem', marginBottom: 24, border: '1px solid #FEE2E2' 
          }}>
            {error}
          </div>
        )}

        {/* Auth Modes */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '6px', borderRadius: 14, marginBottom: 32 }}>
          <button 
            onClick={() => { setMode('manual'); setOtpSent(false); }}
            style={{ 
              flex: 1, padding: '10px', borderRadius: 10, border: 'none', fontSize: '0.88rem', fontWeight: 700,
              background: mode === 'manual' ? '#fff' : 'transparent', color: mode === 'manual' ? 'var(--blue)' : '#64748B',
              boxShadow: mode === 'manual' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >Manual</button>
          <button 
            onClick={() => setMode('otp')}
            style={{ 
              flex: 1, padding: '10px', borderRadius: 10, border: 'none', fontSize: '0.88rem', fontWeight: 700,
              background: mode === 'otp' ? '#fff' : 'transparent', color: mode === 'otp' ? 'var(--blue)' : '#64748B',
              boxShadow: mode === 'otp' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >Magic Link</button>
        </div>

        {/* Manual Form */}
        {mode === 'manual' && (
          <form onSubmit={handleManualLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: '#475569' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="email" required placeholder="name@company.com" 
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: 14, border: '1.5px solid #E2E8F0', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: '#475569' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="password" required placeholder="••••••••" 
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: 14, border: '1.5px solid #E2E8F0', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>
            <button 
              type="submit" disabled={loading}
              className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* OTP Form */}
        {mode === 'otp' && (
          <div>
            {!otpSent ? (
              <>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: '#475569' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type="email" required placeholder="name@company.com" 
                      value={email} onChange={e => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: 14, border: '1.5px solid #E2E8F0', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSendOtp} disabled={loading || !email}
                  className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                >
                  {loading ? 'Sending...' : 'Send Magic Code'} <Send size={18} />
                </button>
              </>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', textAlign: 'center', marginBottom: 20 }}>
                    We've sent a 6-digit code to <br /><strong>{email}</strong>
                  </p>
                  <input 
                    type="text" required placeholder="0 0 0 0 0 0" maxLength={6}
                    value={otp} onChange={e => setOtp(e.target.value)}
                    style={{ 
                      width: '100%', padding: '16px', borderRadius: 14, border: '2px solid var(--blue)', 
                      fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', letterSpacing: '8px', outline: 'none' 
                    }}
                  />
                </div>
                <button 
                  type="submit" disabled={loading || otp.length < 6}
                  className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                >
                  {loading ? 'Verifying...' : 'Verify & Login'} <ShieldCheck size={18} />
                </button>
                <button 
                  type="button" onClick={() => setOtpSent(false)}
                  style={{ width: '100%', marginTop: 16, background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Use a different email
                </button>
              </form>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>

        {/* Google Login */}
        <button 
          onClick={handleGoogleLogin}
          style={{ 
            width: '100%', padding: '14px', borderRadius: 14, border: '1.5px solid #E2E8F0', 
            background: '#fff', color: '#475569', fontWeight: 700, fontSize: '0.95rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <Chrome size={20} color="#4285F4" />
          Google Account
        </button>
      </div>
    </div>
  );
}

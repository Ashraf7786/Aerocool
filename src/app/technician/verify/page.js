"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  Mail,
  RefreshCw
} from 'lucide-react';

export default function VerifyEmail() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(59);
  const [resendCount, setResendCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  // Load resend count from localStorage
  useEffect(() => {
    const dailyData = JSON.parse(localStorage.getItem(`otp_limit_${email}`) || '{}');
    const today = new Date().toDateString();
    
    if (dailyData.date === today) {
      setResendCount(dailyData.count || 0);
    } else {
      localStorage.setItem(`otp_limit_${email}`, JSON.stringify({ date: today, count: 0 }));
    }
  }, [email]);

  // Countdown timer logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    if (resendCount >= 4) {
      setError('Daily limit reached. You can only request 4 OTPs per day.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate API call to resend OTP
      setTimeout(() => {
        const newCount = resendCount + 1;
        setResendCount(newCount);
        setTimer(59);
        const today = new Date().toDateString();
        localStorage.setItem(`otp_limit_${email}`, JSON.stringify({ date: today, count: newCount }));
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to resend. Try again.');
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (timer === 0 && otp.join('').length === 6) {
      setError('OTP has expired. Please resend a new one.');
      return;
    }
    setLoading(true);
    setError('');
    const token = otp.join('');
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      router.push('/admin/login?verified=true');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 20 }}>
      <div style={{ maxWidth: 440, width: '100%', background: '#fff', borderRadius: 32, padding: 48, boxShadow: '0 20px 40px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: '#f0f9ff', color: 'var(--blue)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Mail size={32} />
        </div>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', marginBottom: 12 }}>Verify your email</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 32 }}>
          We've sent a 6-digit verification code to <br />
          <strong style={{ color: '#0F172A' }}>{email || 'your email'}</strong>
        </p>

        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !otp[index] && index > 0) {
                    document.getElementById(`otp-${index - 1}`).focus();
                  }
                }}
                style={{
                  width: 50, height: 60, borderRadius: 12, border: '2px solid #e2e8f0', 
                  textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#0F172A',
                  outline: 'none', transition: 'all 0.2s',
                  borderColor: digit ? 'var(--blue)' : '#e2e8f0',
                  background: digit ? '#f0f7ff' : '#fff'
                }}
              />
            ))}
          </div>

          <div style={{ marginBottom: 32, fontSize: '0.9rem', fontWeight: 700, color: timer > 0 ? 'var(--blue)' : '#ef4444' }}>
            {timer > 0 ? (
              <span>Code expires in: 00:{timer < 10 ? `0${timer}` : timer}</span>
            ) : (
              <span>OTP Expired</span>
            )}
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, marginBottom: 24, padding: 12, background: '#fef2f2', borderRadius: 12 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading || timer === 0} className="verify-btn" style={{ opacity: timer === 0 ? 0.6 : 1 }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Verify & Continue <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.9rem' }}>
            <span>Didn't receive the code?</span>
            <button 
              onClick={handleResend}
              disabled={timer > 0 || resendCount >= 4}
              style={{ 
                background: 'none', border: 'none', 
                color: timer > 0 || resendCount >= 4 ? '#cbd5e1' : 'var(--blue)', 
                fontWeight: 700, cursor: timer > 0 ? 'not-allowed' : 'pointer', 
                display: 'flex', alignItems: 'center', gap: 4 
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Resend
            </button>
          </div>
          {resendCount > 0 && (
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Used {resendCount}/4 attempts today
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        .verify-btn {
          width: 100%;
          background: var(--blue);
          color: #fff;
          border: none;
          padding: 16px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 20px rgba(37, 78, 219, 0.2);
        }
        .verify-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(37, 78, 219, 0.3);
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

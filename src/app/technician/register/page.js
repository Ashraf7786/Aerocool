"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function TechnicianRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    experience: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register-technician', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setSuccess(true);
      setTimeout(() => {
        router.push('/technician/verify?email=' + encodeURIComponent(formData.email));
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 20 }}>
        <div style={{ maxWidth: 400, width: '100%', textAlign: 'center', background: '#fff', padding: 40, borderRadius: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ width: 80, height: 80, background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={48} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Registration Successful!</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>Your account has been created. Redirecting to email verification...</p>
          <Loader2 className="animate-spin" style={{ margin: '0 auto', color: 'var(--blue)' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '40px 20px' }}>
      <div style={{ maxWidth: 500, width: '100%', background: '#fff', borderRadius: 32, padding: 48, boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, background: 'var(--blue)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 30px rgba(37, 78, 219, 0.2)' }}>
            <Briefcase size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>Technician Onboarding</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Join the Aerocool Jaipur expert team.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} />
              <input name="name" placeholder="Enter your full name" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Work Email</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input type="email" name="email" placeholder="email@example.com" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <div className="input-wrapper">
              <Phone size={18} />
              <input name="phone" placeholder="+91 XXXXX XXXXX" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input type="password" name="password" placeholder="••••••••" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Experience (Years)</label>
            <div className="input-wrapper">
              <ShieldCheck size={18} />
              <input type="number" name="experience" placeholder="e.g. 5" required onChange={handleChange} />
            </div>
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, background: '#fef2f2', padding: 12, borderRadius: 12, border: '1px solid #fee2e2' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Register as Technician <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 32, color: '#64748b', fontSize: '0.9rem' }}>
          Already have an account? <Link href="/admin/login" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>

      <style jsx>{`
        .input-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-wrapper :global(svg) {
          position: absolute;
          left: 16px;
          color: #94a3b8;
        }
        .input-wrapper input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border-radius: 14px;
          border: 1.5px solid #e2e8f0;
          outline: none;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .input-wrapper input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 4px rgba(37, 78, 219, 0.08);
        }
        .submit-btn {
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
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(37, 78, 219, 0.3);
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

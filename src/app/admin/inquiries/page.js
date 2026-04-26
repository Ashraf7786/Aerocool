"use client";

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  User, 
  Mail, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Search,
  RefreshCcw,
  Phone
} from 'lucide-react';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [error, setError] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const axios = (await import('axios')).default;
      const res = await axios.get('/api/inquiries');
      setInquiries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch error details:', err);
      setError(err.response?.data?.error || err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter(i => 
    i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        flexDirection: typeof window !== 'undefined' && window.innerWidth < 640 ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: typeof window !== 'undefined' && window.innerWidth < 640 ? 'flex-start' : 'center', 
        marginBottom: 32,
        gap: 16
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Customer Inquiries</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Review messages from your contact form.</p>
        </div>
        <button 
          onClick={fetchInquiries}
          style={{ 
            width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 'auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', 
            borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', 
            color: '#64748b', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' 
          }}
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 48px', borderRadius: 14, 
              border: '1px solid #e2e8f0', outline: 'none', background: '#fff'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
          <Loader2 size={40} className="animate-spin" color="var(--blue)" />
        </div>
      ) : error ? (
        <div style={{ padding: 60, textAlign: 'center', background: '#fef2f2', borderRadius: 24, border: '1px solid #fee2e2' }}>
          <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: 16 }} />
          <h3 style={{ color: '#b91c1c', marginBottom: 8 }}>Unable to load inquiries</h3>
          <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</p>
          <button 
            onClick={fetchInquiries}
            style={{ marginTop: 20, padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div style={{ padding: 80, textAlign: 'center', background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9' }}>
          <MessageSquare size={48} style={{ color: '#cbd5e1', marginBottom: 16 }} />
          <h3 style={{ color: '#64748b' }}>No messages found</h3>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: 24 
        }}>
          {filteredInquiries.map((msg) => (
            <div key={msg.id} style={{
              background: '#fff', padding: 24, borderRadius: 24, border: '1px solid #f1f5f9',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)', position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {msg.name?.[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{msg.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(msg.created_at).toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ 
                  padding: '4px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 700, 
                  background: msg.status === 'New' ? '#eff6ff' : '#ecfdf5',
                  color: msg.status === 'New' ? '#3b82f6' : '#10b981'
                }}>
                  {msg.status}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={14} /> {msg.email}
                </div>
                {msg.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Phone size={14} /> {msg.phone}
                  </div>
                )}
              </div>

              <div style={{ 
                background: '#f8fafc', padding: 16, borderRadius: 16, fontSize: '0.9rem', color: '#334155', 
                lineHeight: 1.6, marginBottom: 20, minHeight: 80 
              }}>
                {msg.message}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <a href={`mailto:${msg.email}`} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'var(--blue)', color: '#fff', padding: '10px', borderRadius: 12,
                  fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none'
                }}>
                  Reply via Email
                </a>
                <button style={{
                  padding: '10px', borderRadius: 12, border: '1px solid #fee2e2', color: '#ef4444', background: '#fff', cursor: 'pointer'
                }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone,
  ShieldCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function TechnicianManagement() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTech, setNewTech] = useState({ name: '', email: '', password: '', phone: '' });
  const [formLoading, setFormLoading] = useState(false);

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/technicians');
      const data = await res.json();
      setTechnicians(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/technicians', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setTechnicians(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleToggleVerify = async (id, currentStatus) => {
    try {
      // Re-using the same PATCH API or a similar one for is_verified
      const res = await fetch('/api/admin/technicians', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_verified: !currentStatus }),
      });
      if (res.ok) {
        setTechnicians(prev => prev.map(t => t.id === id ? { ...t, is_verified: !currentStatus } : t));
      }
    } catch (err) {
      console.error('Verify error:', err);
    }
  };

  const handleAddTechnician = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch('/api/admin/create-technician', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTech),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setShowAddModal(false);
      setNewTech({ name: '', email: '', password: '', phone: '' });
      fetchTechnicians(); // Refresh list
    } catch (err) {
      alert(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredTechs = technicians.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.technician_id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>Staff Management</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Create accounts and manage technician verifications.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 24px', borderRadius: 14, background: 'var(--blue)', color: '#fff',
              border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 20px rgba(37, 78, 219, 0.2)'
            }}
          >
            Add New Technician
          </button>
          <div style={{ display: 'flex', background: '#fff', padding: 6, borderRadius: 14, border: '1px solid #e2e8f0' }}>
            {['pending', 'approved', 'all'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 20px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                  background: filter === f ? 'var(--blue)' : 'transparent',
                  color: filter === f ? '#fff' : '#64748b',
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ 
        background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9', 
        overflow: 'hidden', minHeight: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' 
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: 14, border: '1px solid #e2e8f0', outline: 'none' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 100, textAlign: 'center' }}>
            <Loader2 size={48} className="animate-spin" style={{ color: 'var(--blue)', margin: '0 auto' }} />
          </div>
        ) : filteredTechs.length === 0 ? (
          <div style={{ padding: 80, textAlign: 'center', color: '#94a3b8' }}>
            <Users size={64} style={{ marginBottom: 20, opacity: 0.2 }} />
            <h3>No technicians found</h3>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Technician</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Contact Info</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Verified</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTechs.map((tech) => (
                <tr key={tech.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                        {tech.full_name?.[0]}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{tech.full_name}</div>
                          {tech.is_verified && <ShieldCheck size={16} color="var(--blue)" fill="var(--blue-light)" />}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 700 }}>{tech.technician_id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#64748b', marginBottom: 4 }}>
                      <Mail size={14} /> {tech.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#64748b' }}>
                      <Phone size={14} /> {tech.phone}
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <button 
                      onClick={() => handleToggleVerify(tech.id, tech.is_verified)}
                      style={{
                        padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
                        background: tech.is_verified ? 'var(--blue-light)' : '#fff',
                        color: tech.is_verified ? 'var(--blue)' : '#64748b',
                        fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer'
                      }}
                    >
                      {tech.is_verified ? 'VERIFIED' : 'NOT VERIFIED'}
                    </button>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <span style={{
                      padding: '6px 14px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 800,
                      background: tech.status === 'approved' ? '#ecfdf5' : tech.status === 'pending' ? '#fff7ed' : '#fef2f2',
                      color: tech.status === 'approved' ? '#10b981' : tech.status === 'pending' ? '#f59e0b' : '#ef4444',
                    }}>
                      {tech.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button 
                        onClick={() => handleStatusUpdate(tech.id, tech.status === 'approved' ? 'pending' : 'approved')}
                        style={{ padding: '8px 16px', borderRadius: 10, background: tech.status === 'approved' ? '#fef2f2' : '#10b981', color: tech.status === 'approved' ? '#ef4444' : '#fff', border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {tech.status === 'approved' ? 'Revoke' : 'Approve'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Technician Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 480, borderRadius: 32, padding: 40, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>Add Technician</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><XCircle size={24} /></button>
            </div>
            
            <form onSubmit={handleAddTechnician} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8, display: 'block' }}>FULL NAME</label>
                <input required value={newTech.name} onChange={(e) => setNewTech({...newTech, name: e.target.value})} placeholder="e.g. Aasif Siddiqui" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #f1f5f9', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8, display: 'block' }}>WORK EMAIL</label>
                <input required type="email" value={newTech.email} onChange={(e) => setNewTech({...newTech, email: e.target.value})} placeholder="tech@aerocool.com" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #f1f5f9', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8, display: 'block' }}>TEMPORARY PASSWORD</label>
                <input required type="password" value={newTech.password} onChange={(e) => setNewTech({...newTech, password: e.target.value})} placeholder="Minimum 6 characters" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #f1f5f9', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8, display: 'block' }}>PHONE NUMBER</label>
                <input value={newTech.phone} onChange={(e) => setNewTech({...newTech, phone: e.target.value})} placeholder="+91 00000 00000" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #f1f5f9', outline: 'none' }} />
              </div>

              <button disabled={formLoading} type="submit" style={{ marginTop: 10, padding: '16px', borderRadius: 14, background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {formLoading ? <Loader2 className="animate-spin" /> : 'Create Account & Notify'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

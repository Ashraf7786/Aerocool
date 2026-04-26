"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Plus, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCcw,
  FileText,
  FileSpreadsheet,
  FileJson,
  Printer
} from 'lucide-react';
import * as exportUtils from '@/backend/utils/exportUtils';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'All' || b.status === filter;
    const matchesSearch = b.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.id?.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Bookings Management</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>{bookings.length} total bookings synced with Supabase</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12, width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 'auto', position: 'relative' }}>
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', 
              borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', 
              color: '#0F172A', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' 
            }}
          >
            <Download size={18} /> Export Data
          </button>

          {showExportMenu && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8, background: '#fff',
              borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              padding: 8, zIndex: 100, minWidth: 200, animation: 'fadeIn 0.2s'
            }}>
              <button onClick={() => { exportUtils.exportToExcel(filteredBookings); setShowExportMenu(false); }} className="menu-item"><FileSpreadsheet size={16} /> Excel Spreadsheet</button>
              <button onClick={() => { exportUtils.exportToPDF(filteredBookings); setShowExportMenu(false); }} className="menu-item"><FileText size={16} /> PDF Document</button>
              <button onClick={() => { exportUtils.exportToDocx(filteredBookings); setShowExportMenu(false); }} className="menu-item"><Printer size={16} /> Word (.docx)</button>
            </div>
          )}

          <button 
            onClick={fetchBookings}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px', 
              borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', 
              color: '#64748b', cursor: 'pointer' 
            }}
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', 
            borderRadius: 12, background: 'var(--blue)', border: 'none', 
            color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(37, 78, 219, 0.2)'
          }}>
            <Plus size={18} /> New Booking
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ 
        background: '#fff', padding: '16px 24px', borderRadius: 24, 
        border: '1px solid #f1f5f9', marginBottom: 32,
        display: 'flex', flexDirection: 'column', gap: 16,
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, whiteSpace: 'nowrap' }}>
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 20px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
                background: filter === f ? 'var(--blue)' : 'rgba(15, 23, 42, 0.03)',
                color: filter === f ? '#fff' : '#64748b',
                border: 'none'
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              placeholder="Search by customer name, ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '12px 16px 12px 48px', borderRadius: 14, border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', width: '100%', background: '#F8FAFC' }}
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 30px rgba(0,0,0,0.03)' }}>
        {loading ? (
          <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={40} className="animate-spin" color="var(--blue)" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={{ padding: 100, textAlign: 'center', color: '#94a3b8' }}>
            <AlertCircle size={64} style={{ marginBottom: 20, opacity: 0.2 }} />
            <h3 style={{ color: '#0F172A', fontWeight: 800 }}>No matching bookings</h3>
            <p style={{ fontSize: '0.95rem' }}>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
              <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #f1f5f9' }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>Booking ID</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>Customer</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>Service</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>Status</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((bk) => (
                  <tr key={bk.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }} className="table-row">
                    <td style={{ padding: '24px' }}>
                      <div style={{ fontWeight: 900, color: '#0F172A', fontSize: '1rem', marginBottom: 4 }}>#BK-{bk.id}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#94a3b8' }}>
                        <Clock size={12} /> {formatDate(bk.created_at)}
                      </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem', marginBottom: 6 }}>{bk.name}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#64748b' }}>
                          <Phone size={12} color="var(--blue)" /> +91 {bk.phone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#64748b', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <MapPin size={12} color="#EF4444" /> {bk.address}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                      <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.85rem', marginBottom: 4 }}>{bk.service_types?.[0] || 'AC Service'}</div>
                      <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 8, fontSize: '0.7rem', background: '#F1F5F9', color: '#475569', fontWeight: 800 }}>{bk.ac_type}</div>
                    </td>
                    <td style={{ padding: '24px' }}>
                      <div style={{ position: 'relative', width: 'fit-content' }}>
                        <select 
                          value={bk.status}
                          onChange={(e) => handleStatusUpdate(bk.id, e.target.value)}
                          style={{
                            appearance: 'none', padding: '8px 32px 8px 16px', borderRadius: 50,
                            fontSize: '0.75rem', fontWeight: 800, border: 'none', cursor: 'pointer',
                            background: 
                              bk.status === 'Completed' ? '#ecfdf5' : 
                              bk.status === 'Pending' ? '#fff7ed' : 
                              bk.status === 'Confirmed' ? '#eff6ff' : '#fef2f2',
                            color: 
                              bk.status === 'Completed' ? '#10b981' : 
                              bk.status === 'Pending' ? '#f59e0b' : 
                              bk.status === 'Confirmed' ? '#3b82f6' : '#ef4444',
                            outline: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.6rem' }}>▼</div>
                      </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          onClick={() => exportUtils.generateInvoice(bk)}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', 
                            borderRadius: 12, background: 'rgba(37,78,219,0.05)', border: '1px solid rgba(37,78,219,0.1)',
                            color: 'var(--blue)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(37,78,219,0.1)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(37,78,219,0.05)'}
                        >
                          <FileText size={16} /> Invoice
                        </button>
                        
                        <button 
                          onClick={() => exportUtils.generateJobCard(bk)}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', 
                            borderRadius: 12, background: 'rgba(15, 23, 42, 0.05)', border: '1px solid rgba(15, 23, 42, 0.1)',
                            color: 'var(--black)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          <Printer size={16} /> Service PDF
                        </button>
                        <button style={{ 
                          padding: '10px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer'
                        }}>
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .table-row:hover { background: #fcfdfe; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .menu-item {
          width: 100%; text-align: left; padding: 12px 16px; border: none; background: none;
          display: flex; alignItems: center; gap: 12; cursor: pointer; border-radius: 10px;
          color: #334155; font-weight: 600; font-size: 0.85rem; transition: all 0.2s;
        }
        .menu-item:hover { background: #F1F5F9; color: var(--blue); }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Activity, ArrowUpRight, ArrowDownRight, Clock, Loader2 } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, inquiryRes] = await Promise.all([
          fetch('/api/bookings'),
          fetch('/api/inquiries')
        ]);
        
        const bookings = await bookRes.json();
        const inquiries = await inquiryRes.json();
        
        const bookingList = Array.isArray(bookings) ? bookings : [];
        const inquiryList = Array.isArray(inquiries) ? inquiries : [];

        const totalBookings = bookingList.length;
        const newInquiries = inquiryList.length;
        const completedBookings = bookingList.filter(b => b.status === 'Completed').length;
        const completionRate = totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0;

        setStats([
          { label: 'Total Bookings', value: totalBookings.toLocaleString(), change: '+100%', isUp: true, icon: <Calendar size={20} />, color: '#3B82F6' },
          { label: 'New Inquiries', value: newInquiries.toLocaleString(), change: 'Live', isUp: true, icon: <TrendingUp size={20} />, color: '#10B981' },
          { label: 'Technicians', value: '10', change: 'Fixed', isUp: true, icon: <Users size={20} />, color: '#F59E0B' },
          { label: 'Completion Rate', value: `${completionRate}%`, change: 'Live', isUp: true, icon: <Activity size={20} />, color: '#8B5CF6' },
        ]);

        setRecentBookings(bookingList.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '0 0' }}>
        <div style={{ marginBottom: 32 }}>
          <Skeleton className="skeleton-title" style={{ height: '2.5rem', width: '300px' }} />
          <Skeleton className="skeleton-text" style={{ width: '450px' }} />
        </div>

        {/* Stats Grid Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: '#fff', padding: 24, borderRadius: 24, border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <Skeleton circle width={48} height={48} />
                <Skeleton width={60} height={24} borderRadius={50} />
              </div>
              <Skeleton width={100} height={14} style={{ marginBottom: 8 }} />
              <Skeleton width={140} height={32} />
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <Skeleton width={200} height={24} />
              <Skeleton width={80} height={18} />
            </div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: '1px solid #f8fafc' }}>
                <Skeleton width="40%" height={20} />
                <Skeleton width="20%" height={20} />
                <Skeleton width="20%" height={20} />
                <Skeleton width="20%" height={20} />
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #f1f5f9' }}>
            <Skeleton width={150} height={24} style={{ marginBottom: 24 }} />
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                <Skeleton circle width={32} height={32} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="80%" height={14} style={{ marginBottom: 6 }} />
                  <Skeleton width="40%" height={10} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Dashboard Overview</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Welcome back! Here is your live business data from Supabase.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: '#fff',
            padding: 24,
            borderRadius: 24,
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 14, 
                background: `${stat.color}15`, color: stat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: 4, 
                padding: '4px 10px', borderRadius: 50,
                fontSize: '0.75rem', fontWeight: 700,
                background: stat.isUp ? '#ecfdf5' : '#fef2f2',
                color: stat.isUp ? '#10b981' : '#ef4444'
              }}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth < 1024 ? '1fr' : '2fr 1fr', 
        gap: 24 
      }}>
        {/* Recent Bookings Table */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          padding: 24,
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontWeight: 800, color: '#0F172A' }}>Recent Live Bookings</h3>
            <button style={{ 
              background: 'none', border: 'none', color: 'var(--blue)', 
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' 
            }}>View All</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Customer</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Service</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No bookings found.</td></tr>
                ) : recentBookings.map((bk) => (
                  <tr key={bk.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>{bk.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>#BK-{bk.id}</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>{bk.service_types?.[0] || 'AC Service'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '6px 12px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700,
                        background: bk.status === 'Completed' ? '#ecfdf5' : bk.status === 'Pending' ? '#fff7ed' : '#eff6ff',
                        color: bk.status === 'Completed' ? '#10b981' : bk.status === 'Pending' ? '#f59e0b' : '#3b82f6',
                      }}>
                        {bk.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
                      {new Date(bk.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          padding: 24,
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        }}>
          <h3 style={{ fontWeight: 800, color: '#0F172A', marginBottom: 24 }}>System Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
            {[
              { text: 'Email notification sent to Customer', time: 'Just now', icon: <Clock size={14} /> },
              { text: 'Supabase Data Sync Active', time: 'Connected', icon: <Activity size={14} /> },
              { text: 'Weekly SEO report generated', time: '3 hours ago', icon: <TrendingUp size={14} /> },
              { text: 'System Update Completed', time: 'Yesterday', icon: <Activity size={14} /> },
            ].map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: 14 }}>
                <div style={{ 
                  minWidth: 32, height: 32, borderRadius: '50%', 
                  background: '#f8fafc', color: '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {act.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{act.text}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontWeight: 800, color: '#0F172A', marginBottom: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>Ownership & Support</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 16, background: '#f0f9ff' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#bae6fd', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>AS</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Aasif Siddiqui</div>
                <div style={{ fontSize: '0.7rem', color: '#0369a1', fontWeight: 600 }}>Owner & Head Technician</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 16, background: '#f0fdf4' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#bbf7d0', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>AS</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Ashraf Siddiqui</div>
                <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>Website Support & Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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


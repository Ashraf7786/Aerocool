import { useEffect, useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/admin/stats`)
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>Loading Stats...</div>;

  const statCards = [
    { label: 'Total Bookings', value: stats?.total_bookings || 0, icon: <CalendarCheck size={24} />, color: '#254EDB', trend: '+12%' },
    { label: 'Pending Requests', value: stats?.pending_bookings || 0, icon: <Clock size={24} />, color: '#F59E0B', trend: '-2%' },
    { label: 'Completed Jobs', value: stats?.completed_bookings || 0, icon: <TrendingUp size={24} />, color: '#10B981', trend: '+8%' },
    { label: 'Estimated Revenue', value: `₹${stats?.total_revenue || 0}`, icon: <Users size={24} />, color: '#8B5CF6', trend: '+15%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--black)', marginBottom: 8 }}>Dashboard Overview</h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Welcome back! Here's what's happening with Aerocool today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {statCards.map((card) => (
          <div key={card.label} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>{card.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--black)', marginBottom: 12 }}>{card.value}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 700, color: card.trend.startsWith('+') ? '#10B981' : '#EF4444' }}>
                {card.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.trend} <span style={{ color: '#94A3B8', fontWeight: 500 }}>vs last month</span>
              </div>
            </div>
            <div style={{ 
              width: 54, height: 54, borderRadius: 16, background: `${card.color}10`, color: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
        {/* Recent Bookings */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Recent Bookings</h3>
            <button style={{ color: 'var(--blue)', background: 'transparent', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>View All</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_bookings?.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{b.phone}</div>
                  </td>
                  <td>{b.ac_type}</td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!stats?.recent_bookings || stats.recent_bookings.length === 0) && (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Inquiries */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Latest Inquiries</h3>
            <button style={{ color: 'var(--blue)', background: 'transparent', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {stats?.recent_contacts?.map((c) => (
              <div key={c.id} style={{ padding: '16px', borderRadius: 12, background: '#F8FAFF', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.name}</span>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                  {c.message?.length > 80 ? c.message.substring(0, 80) + '...' : c.message}
                </p>
              </div>
            ))}
            {(!stats?.recent_contacts || stats.recent_contacts.length === 0) && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No messages yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

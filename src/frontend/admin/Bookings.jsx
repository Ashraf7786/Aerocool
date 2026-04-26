import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, MoreVertical, Trash2, CheckCircle, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    axios.get(`${API_URL}/admin/bookings`)
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(fetchBookings, []);

  const handleStatusUpdate = (id, status) => {
    axios.patch(`${API_URL}/admin/bookings/${id}/status`, { status })
      .then(() => fetchBookings())
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      axios.delete(`${API_URL}/admin/bookings/${id}`)
        .then(() => fetchBookings())
        .catch(err => console.error(err));
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm) ||
    b.ac_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--black)', marginBottom: 8 }}>Manage Bookings</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>View, track, and update all service requests.</p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Filters bar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text" 
              placeholder="Search by name, phone, or AC type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 40px', borderRadius: 10, border: '1px solid #E2E8F0',
                fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, 
            border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer'
          }}>
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>AC Details</th>
                <th>Location</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 700, color: '#94A3B8' }}>#AC-{b.id}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{b.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{b.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.ac_type}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{b.num_units} Unit(s)</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.address}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>PIN: {b.pincode}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{b.preferred_date}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{b.preferred_time}</div>
                  </td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      {b.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusUpdate(b.id, 'completed')}
                          title="Mark as Completed"
                          style={{ border: 'none', background: '#F0FDF4', color: '#15803D', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {b.status === 'completed' && (
                        <button 
                          onClick={() => handleStatusUpdate(b.id, 'pending')}
                          title="Revert to Pending"
                          style={{ border: 'none', background: '#FFF7ED', color: '#C2410C', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Clock size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(b.id)}
                        title="Delete Booking"
                        style={{ border: 'none', background: '#FEF2F2', color: '#EF4444', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && !loading && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>No bookings found matching your search</td></tr>
              )}
              {loading && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--blue)' }}>Updating list...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

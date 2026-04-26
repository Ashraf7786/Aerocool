"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { assignTechnician } from '@/app/actions/dispatch';
import { createClient } from '@/utils/supabase/client';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Zap,
  HardDrive,
  CheckCircle,
  AlertCircle,
  Map,
  MessageSquare,
  Package,
  Printer,
  ChevronRight,
  Loader2
} from 'lucide-react';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      if (!res.ok) throw new Error('Failed to fetch booking details');
      const data = await res.json();
      setBooking(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchRequests = async () => {
    try {
      const supabase = createClient();
      const { data, error: reqError } = await supabase
        .from('work_requests')
        .select(`
          *,
          profiles (
            id,
            full_name,
            phone,
            experience_years,
            skills
          )
        `)
        .eq('booking_id', id);
      
      if (!reqError) setRequests(data || []);
    } catch (err) {
      console.error('Fetch requests error:', err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchBooking(), fetchRequests()]);
      setLoading(false);
    };

    if (id) loadAll();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: booking.id, status: newStatus }),
      });
      if (res.ok) {
        setBooking(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleAssign = async (technicianId, requestId) => {
    setAssigningId(requestId);
    try {
      const result = await assignTechnician(booking.id, technicianId, requestId);
      if (result.success) {
        // Refresh local data
        await Promise.all([fetchBooking(), fetchRequests()]);
        alert('Technician assigned successfully!');
      } else {
        alert('Assignment failed: ' + result.error);
      }
    } catch (err) {
      console.error('Assign error:', err);
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <Loader2 className="animate-spin" size={48} color="var(--blue)" />
        <p style={{ color: '#64748b', fontWeight: 600 }}>Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <AlertCircle size={64} color="#ef4444" style={{ marginBottom: 20, opacity: 0.5 }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Booking Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>The booking you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => router.push('/admin/bookings')}
          style={{ padding: '12px 24px', background: 'var(--blue)', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer' }}
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header / Breadcrumbs */}
      <div style={{ 
        display: 'flex', 
        flexDirection: typeof window !== 'undefined' && window.innerWidth < 640 ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: typeof window !== 'undefined' && window.innerWidth < 640 ? 'flex-start' : 'center', 
        marginBottom: 32,
        gap: 16
      }}>
        <div>
          <button 
            onClick={() => router.push('/admin/bookings')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', 
              color: '#64748b', fontWeight: 600, cursor: 'pointer', marginBottom: 12, padding: 0 
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '1.5rem' : '2rem', fontWeight: 900, color: '#0F172A' }}>Booking #BK-{booking.id}</h1>
            <span style={{
              padding: '6px 16px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 800,
              background: 
                booking.status === 'Completed' ? '#ecfdf5' : 
                booking.status === 'Pending' ? '#fff7ed' : 
                booking.status === 'Confirmed' ? '#eff6ff' : '#fef2f2',
              color: 
                booking.status === 'Completed' ? '#10b981' : 
                booking.status === 'Pending' ? '#f59e0b' : 
                booking.status === 'Confirmed' ? '#3b82f6' : '#ef4444',
            }}>
              {booking.status}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 'auto' }}>
          <button style={{ 
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', 
            borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', 
            color: '#0F172A', fontWeight: 700, cursor: 'pointer' 
          }}>
            <Printer size={18} /> <span className="mobile-hide">Print</span>
          </button>
          <select 
            value={booking.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            style={{ 
              flex: 2, padding: '12px 20px', borderRadius: 12, background: 'var(--blue)', border: 'none', 
              color: '#fff', fontWeight: 700, cursor: 'pointer', outline: 'none'
            }}
          >
            <option value="Pending">Mark Pending</option>
            <option value="Confirmed">Mark Confirmed</option>
            <option value="Completed">Mark Completed</option>
            <option value="Cancelled">Mark Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth < 1024 ? '1fr' : '1fr 350px', 
        gap: 24 
      }}>
        {/* Main Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Section: Customer */}
          <div className="detail-card">
            <div className="card-header">
              <User size={20} />
              <h3>Customer Information</h3>
            </div>
            <div className="card-body grid-2">
              <div className="info-item">
                <label>Full Name</label>
                <p>{booking.name}</p>
              </div>
              <div className="info-item">
                <label>Phone Number</label>
                <p style={{ color: 'var(--blue)', fontWeight: 800 }}>+91 {booking.phone}</p>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <p>{booking.email || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Alternate Phone</label>
                <p>{booking.alternate_phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Section: Service Details */}
          <div className="detail-card">
            <div className="card-header">
              <Package size={20} />
              <h3>Service & Equipment Details</h3>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 12 }}>Requested Services</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {booking.service_types?.map((svc, i) => (
                    <span key={i} className="service-tag">{svc}</span>
                  ))}
                </div>
              </div>
              <div className="grid-3" style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
                <div className="info-item">
                  <label>AC Type</label>
                  <p>{booking.ac_type}</p>
                </div>
                <div className="info-item">
                  <label>Brand</label>
                  <p>{booking.brand}</p>
                </div>
                <div className="info-item">
                  <label>No. of Units</label>
                  <p>{booking.units} Unit(s)</p>
                </div>
                <div className="info-item">
                  <label>AC Age</label>
                  <p>{booking.ac_age}</p>
                </div>
                <div className="info-item">
                  <label>Urgent Visit</label>
                  <p style={{ color: booking.is_urgent ? '#ef4444' : '#10b981', fontWeight: 800 }}>
                    {booking.is_urgent ? 'YES (⚡ Urgent)' : 'No'}
                  </p>
                </div>
              </div>
              {booking.problem_description && (
                <div className="info-item" style={{ marginTop: 20 }}>
                  <label>Problem Description</label>
                  <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, border: '1px solid #e2e8f0' }}>
                    {booking.problem_description}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Location */}
          <div className="detail-card">
            <div className="card-header">
              <MapPin size={20} />
              <h3>Service Location</h3>
            </div>
            <div className="card-body">
              <div className="info-item" style={{ marginBottom: 20 }}>
                <label>Complete Address</label>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{booking.address}</p>
                {booking.landmark && <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Landmark: {booking.landmark}</span>}
              </div>
              <div className="grid-3" style={{ marginBottom: 20 }}>
                <div className="info-item">
                  <label>City</label>
                  <p>{booking.city}</p>
                </div>
                <div className="info-item">
                  <label>Pincode</label>
                  <p>{booking.pincode}</p>
                </div>
              </div>
              {booking.google_location && (
                <a 
                  href={booking.google_location} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-button"
                >
                  <Map size={18} /> Open in Google Maps
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Schedule Card */}
          <div className="detail-card" style={{ border: '2px solid var(--blue)', background: '#f0f7ff' }}>
            <div className="card-header" style={{ borderBottom: '1px solid rgba(37,78,219,0.1)' }}>
              <Calendar size={20} color="var(--blue)" />
              <h3 style={{ color: 'var(--blue)' }}>Appointment</h3>
            </div>
            <div className="card-body">
              <div className="info-item" style={{ marginBottom: 20 }}>
                <label>Scheduled Date</label>
                <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--blue)' }}>{formatDate(booking.preferred_date)}</p>
              </div>
              <div className="info-item">
                <label>Time Slot</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                  <Clock size={18} color="#64748b" /> {booking.time_slot}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="detail-card">
            <div className="card-header">
              <ShieldCheck size={20} />
              <h3>On-site Logistics</h3>
            </div>
            <div className="card-body">
              <div className="info-item" style={{ marginBottom: 16 }}>
                <label>Parking Available</label>
                <p>{booking.parking_available || 'N/A'}</p>
              </div>
              <div className="info-item" style={{ marginBottom: 16 }}>
                <label>Floor Number</label>
                <p>{booking.floor_number || 'Ground'}</p>
              </div>
              <div className="info-item" style={{ marginBottom: 16 }}>
                <label>Lift Available</label>
                <p>{booking.lift_available || 'No'}</p>
              </div>
              <div className="info-item">
                <label>Comm. Preference</label>
                <p>{booking.communication_preference || 'Call'}</p>
              </div>
            </div>
          </div>

          {/* Technician Dispatch Section */}
          <div className="detail-card" style={{ border: '1px solid #e2e8f0', marginBottom: 24 }}>
            <div className="card-header" style={{ background: '#f8fafc' }}>
              <ShieldCheck size={20} color="var(--blue)" />
              <h3>Technician Dispatch</h3>
            </div>
            <div className="card-body">
              {booking.assigned_technician_id ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ 
                    width: 48, height: 48, background: '#ecfdf5', color: '#10b981', 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', margin: '0 auto 12px' 
                  }}>
                    <CheckCircle size={24} />
                  </div>
                  <p style={{ fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Job Assigned</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Status: {booking.tech_status || 'Accepted'}</p>
                </div>
              ) : requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>
                  <p style={{ fontSize: '0.85rem' }}>No technicians have requested this job yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    {requests.length} Request(s) Received
                  </p>
                  {requests.map((req) => (
                    <div key={req.id} style={{ 
                      padding: 16, borderRadius: 16, border: '1px solid #f1f5f9', 
                      background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' 
                    }}>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem', marginBottom: 4 }}>
                        {req.profiles.full_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 12 }}>
                        Exp: {req.profiles.experience_years} Years
                      </div>
                      <button 
                        onClick={() => handleAssign(req.profiles.id, req.id)}
                        disabled={assigningId === req.id}
                        style={{ 
                          width: '100%', padding: '8px', borderRadius: 10, 
                          background: 'var(--blue)', color: '#fff', border: 'none', 
                          fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                        }}
                      >
                        {assigningId === req.id ? <Loader2 size={14} className="animate-spin" /> : 'Assign Job'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="detail-card">
            <div className="card-header">
              <MessageSquare size={20} />
              <h3>Internal Notes</h3>
            </div>
            <div className="card-body">
              <textarea 
                placeholder="Add private notes for technicians..."
                style={{
                  width: '100%', height: 100, border: '1px solid #e2e8f0', borderRadius: 12,
                  padding: 12, fontSize: '0.9rem', outline: 'none', resize: 'none'
                }}
              />
              <button style={{
                width: '100%', marginTop: 12, padding: '10px', borderRadius: 8,
                background: '#f1f5f9', border: 'none', fontWeight: 700, color: '#475569', cursor: 'pointer'
              }}>
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f8fafc;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .card-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 800;
          color: #0F172A;
        }
        .card-body {
          padding: 24px;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .info-item label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }
        .info-item p {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 600;
          color: #1E293B;
        }
        .service-tag {
          background: #eef2ff;
          color: var(--blue);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .map-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px;
          background: #0F172A;
          color: #fff;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
          transition: transform 0.2s;
        }
        .map-button:hover {
          transform: translateY(-2px);
        }
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

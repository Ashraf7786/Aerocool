"use client";

import { useState, useEffect } from 'react';
import { CalendarCheck, Clock, MapPin, Phone, CheckCircle, Loader2, Edit3, Save, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

import { upsertProfile } from '@/app/actions/profile';
import { updateTechStatus } from '@/app/actions/tech_status';

export default function TechnicianMyWork() {
  const [bookings, setBookings] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    phone: '',
    address: '',
    experience_years: '',
    skills: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Get technician profile using our secure route
        const profileRes = await fetch('/api/auth/me');
        if (!profileRes.ok) return;
        const { profile: prof } = await profileRes.json();

        // Check if forced edit is needed (from URL or missing data)
        const urlParams = new URLSearchParams(window.location.search);
        const isForcedByUrl = urlParams.get('edit') === 'true';
        
        // If prof doesn't exist, build a dummy one to allow editing
        const actualProf = prof || { id: user.id, email: user.email, full_name: user.email.split('@')[0], role: 'technician' };
        
        setProfile(actualProf);
        setEditForm({
          phone: actualProf.phone || '',
          address: actualProf.address || '',
          experience_years: actualProf.experience_years != null ? actualProf.experience_years.toString() : '',
          skills: actualProf.skills ? actualProf.skills.join(', ') : ''
        });
        
        // ONLY force edit if data is actually missing and we aren't already editing
        // We check for address and experience specifically
        const hasCompletedProfile = actualProf.address && actualProf.experience_years != null;
        
        if (isForcedByUrl || !hasCompletedProfile) {
          setIsEditing(true);
        }

        // Fetch assigned bookings
        const { data: assignedBks } = await supabase
          .from('bookings')
          .select('*')
          .eq('assigned_technician_id', actualProf.id)
          .order('created_at', { ascending: false });

        setBookings(assignedBks || []);

        // Fetch available open jobs
        const { data: openBks } = await supabase
          .from('bookings')
          .select('*')
          .is('assigned_technician_id', null)
          .in('status', ['Confirmed', 'Pending'])
          .order('created_at', { ascending: false })
          .limit(10);
          
        // Fetch user's existing work requests
        const { data: myReqs } = await supabase
          .from('work_requests')
          .select('booking_id, status')
          .eq('technician_id', actualProf.id);

        setAvailableJobs(openBks || []);
        setMyRequests(myReqs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWork();
  }, []);

  const handleRequestJob = async (bookingId) => {
    if (!profile) return;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('work_requests')
        .insert({
          booking_id: bookingId,
          technician_id: profile.id,
          status: 'pending'
        });
        
      if (error) throw error;
      
      // Update local state to reflect requested status
      setMyRequests([...myRequests, { booking_id: bookingId, status: 'pending' }]);
      alert("Job requested successfully! Waiting for Admin approval.");
    } catch (err) {
      alert("Error requesting job: " + err.message);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const result = await updateTechStatus(bookingId, newStatus);
      if (result.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, tech_status: newStatus } : b));
      } else {
        alert('Update failed: ' + result.error);
      }
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const skillsArray = editForm.skills.split(',').map(s => s.trim()).filter(s => s);
      
      const updates = {
        phone: editForm.phone,
        address: editForm.address,
        experience_years: parseInt(editForm.experience_years) || 0,
        skills: skillsArray
      };

      const { success, error: upsertError } = await upsertProfile({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        ...updates
      });

      if (!success) throw new Error(upsertError);

      setProfile({ ...profile, ...updates });
      setIsEditing(false);
      
      // Clean up URL if we came from a forced edit redirect
      window.history.replaceState({}, '', '/technician/dashboard');
      
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error saving profile: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>Technician Hub</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>View your profile details and manage your assigned service calls.</p>
      </div>

      {profile && !isEditing && (
        <div style={{ marginBottom: 32, background: '#fff', padding: '24px 32px', borderRadius: 24, border: '1px solid #f1f5f9', display: 'flex', gap: 24, alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', position: 'relative' }}>
          
          <button 
            onClick={() => setIsEditing(true)}
            style={{ position: 'absolute', top: 24, right: 32, padding: '8px 16px', borderRadius: 12, background: 'var(--blue-light)', color: 'var(--blue)', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Edit3 size={16} /> Edit Profile
          </button>

          <div style={{ width: 80, height: 80, borderRadius: 20, background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900 }}>
            {profile.full_name?.[0] || 'T'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>{profile.full_name}</h2>
              {profile.is_verified && <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={14} /> VERIFIED</span>}
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#94a3b8' }}>ID:</span> {profile.technician_id}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#94a3b8' }}>Email:</span> {profile.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#94a3b8' }}>Phone:</span> {profile.phone || 'Not added'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#94a3b8' }}>Exp:</span> {profile.experience_years ? `${profile.experience_years} years` : 'Not added'}</div>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSaveProfile} style={{ position: 'relative', zIndex: 9999, marginBottom: 32, background: '#fff', padding: '32px', borderRadius: 24, border: '1px solid var(--blue)', boxShadow: '0 10px 40px rgba(37,78,219,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>Complete Your Profile</h2>
            {profile.address && profile.experience_years && (
              <button type="button" onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={24} /></button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8, display: 'block' }}>PHONE NUMBER</label>
              <input required value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} placeholder="+91 00000 00000" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #f1f5f9', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8, display: 'block' }}>EXPERIENCE (YEARS)</label>
              <input required type="number" min="0" value={editForm.experience_years} onChange={(e) => setEditForm({...editForm, experience_years: e.target.value})} placeholder="e.g. 5" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #f1f5f9', outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8, display: 'block' }}>FULL ADDRESS (For tracking & dispatch)</label>
            <input required value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} placeholder="Full residential address" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #f1f5f9', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8, display: 'block' }}>SKILLS (Comma separated)</label>
            <input required value={editForm.skills} onChange={(e) => setEditForm({...editForm, skills: e.target.value})} placeholder="AC Repair, Installation, Gas Filling" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #f1f5f9', outline: 'none' }} />
          </div>

          <button disabled={savingProfile} type="submit" style={{ width: '100%', padding: '16px', borderRadius: 14, background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            {savingProfile ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Profile to Continue</>}
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ padding: 100, textAlign: 'center' }}>
          <Loader2 size={48} className="animate-spin" style={{ color: 'var(--blue)', margin: '0 auto' }} />
        </div>
      ) : (
        <>
          {/* Available Jobs Board */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: 20 }}>Available Jobs Nearby</h2>
            
            {availableJobs.length === 0 ? (
              <div style={{ background: '#f8fafc', borderRadius: 20, padding: 40, textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b', fontWeight: 600 }}>No open jobs available at the moment.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {availableJobs.map((job) => {
                  const reqStatus = myRequests.find(r => r.booking_id === job.id)?.status;
                  
                  return (
                    <div key={job.id} style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--blue)', background: 'var(--blue-light)', padding: '6px 12px', borderRadius: 50 }}>
                          {job.service_type || 'AC Repair'}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: '0.9rem' }}>
                          <MapPin size={16} /> {job.postcode || 'No Pincode'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: '0.9rem' }}>
                          <Clock size={16} /> Urgent Service
                        </div>
                      </div>

                      {reqStatus === 'pending' ? (
                        <button disabled style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#f1f5f9', color: '#64748b', border: 'none', fontWeight: 800 }}>
                          Request Sent
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleRequestJob(job.id)}
                          style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                          Request to Bid
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Assigned Work */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>My Assigned Work</h2>
          </div>

          {bookings.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 24, padding: 60, textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <CheckCircle size={64} style={{ color: '#10b981', margin: '0 auto 20px', opacity: 0.2 }} />
              <h3 style={{ color: '#0F172A', fontSize: '1.25rem', fontWeight: 800 }}>You're all caught up!</h3>
              <p style={{ color: '#64748b', marginTop: 8 }}>You have no assigned jobs at the moment.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {bookings.map((booking) => (
                <div key={booking.id} style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid var(--lime)', boxShadow: '0 4px 20px rgba(215,255,64,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--blue)', background: 'var(--blue-light)', padding: '6px 12px', borderRadius: 50 }}>
                      {booking.service_type || 'AC Repair'}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>
                      ASSIGNED
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>{booking.name}</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: '0.9rem' }}>
                      <MapPin size={16} /> {booking.address || booking.postcode || 'No Address'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: '0.9rem' }}>
                      <Phone size={16} /> {booking.phone}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <select 
                      value={booking.tech_status || 'accepted'}
                      onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                      disabled={updatingId === booking.id}
                      style={{ 
                        flex: 1, padding: '10px', borderRadius: 10, 
                        border: '1px solid #e2e8f0', background: '#fff', 
                        fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="accepted">Accepted</option>
                      <option value="on_the_way">On the way</option>
                      <option value="in_progress">In progress</option>
                      <option value="completed">Mark Completed</option>
                    </select>
                    {updatingId === booking.id && <div style={{ display: 'flex', alignItems: 'center' }}><Loader2 size={20} className="animate-spin" color="var(--blue)" /></div>}
                  </div>

                  <button style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'var(--lime)', color: '#000', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                    View Job Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <style jsx global>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

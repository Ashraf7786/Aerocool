"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, User, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ full_name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (data) setProfile({ full_name: data.full_name || '', email: data.email || '' });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: profile.full_name })
        .eq('id', user.id);

      if (error) throw error;
      
      setMessage('Profile updated successfully! Refresh to see changes in the header.');
    } catch (err) {
      setMessage('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading settings...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 40, borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={30} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>Admin Settings</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Update your personal profile details</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: 8, display: 'block' }}>FULL NAME</label>
          <input 
            value={profile.full_name} 
            onChange={e => setProfile({...profile, full_name: e.target.value})}
            placeholder="e.g. John Doe"
            style={{ width: '100%', padding: '16px', borderRadius: 12, border: '2px solid #f1f5f9', outline: 'none', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: 8, display: 'block' }}>EMAIL ADDRESS (Read Only)</label>
          <input 
            value={profile.email} 
            disabled
            style={{ width: '100%', padding: '16px', borderRadius: 12, border: '2px solid #f1f5f9', outline: 'none', fontSize: '1rem', background: '#f8fafc', color: '#94a3b8' }}
          />
        </div>

        {message && (
          <div style={{ padding: 16, borderRadius: 12, background: message.includes('Error') ? '#fef2f2' : '#ecfdf5', color: message.includes('Error') ? '#ef4444' : '#10b981', fontWeight: 700 }}>
            {message}
          </div>
        )}

        <button 
          disabled={saving}
          type="submit" 
          style={{ padding: '16px', borderRadius: 12, background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 }}
        >
          {saving ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Save Profile Settings</>}
        </button>
      </form>
    </div>
  );
}

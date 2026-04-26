"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { createBooking } from "@/services/api";
import { 
  User, MapPin, Wind, Wrench, 
  Calendar, Info, ShieldCheck, 
  Star, Clock, Zap, CheckCircle,
  Upload, Navigation, Camera, Video,
  IndianRupee, AlertTriangle
} from "lucide-react";

const STEPS = [
  { id: 'customer', label: 'Customer', icon: <User size={18} /> },
  { id: 'ac',       label: 'AC Specs', icon: <Wind size={18} /> },
  { id: 'service',  label: 'Service',  icon: <Wrench size={18} /> },
  { id: 'schedule', label: 'Schedule', icon: <Calendar size={18} /> },
  { id: 'review',   label: 'Review',   icon: <Info size={18} /> }
];

const AC_TYPES = ['Split AC', 'Window AC', 'Cassette AC', 'Tower AC', 'Central AC'];
const BRANDS = ['Voltas', 'LG', 'Samsung', 'Daikin', 'Hitachi', 'Blue Star', 'Haier', 'Whirlpool', 'Lloyd', 'Other'];
const AC_AGES = ['Less than 1 year', '1–3 years', '3–5 years', '5+ years'];

const SERVICE_PRICES = {
  'Basic AC Service (Split)': 500,
  'Basic AC Service (Window)': 599,
  'Jet Pump Deep Cleaning': 599,
  'Gas Checkup / Visit Charge': 399,
  'Gas Refill Top-up': 1699,
  'Full Gas Charging': 3499,
  'Capacitor Change': 899,
  'Fan Motor Repair': 1500,
  'PCB Repair': 1499,
  'Compressor Replace': 999,
  'Water Leakage Repair': 499,
  'Installation Split AC': 1199,
  'Uninstallation': 499,
  'AC Pipe Fitting & Copper Work': 799,
  'AC Stand Installation': 499,
  'Emergency AC Repair Service': 399
};

const SERVICE_OPTIONS = Object.keys(SERVICE_PRICES);

const TIME_SLOTS = ['Morning (9AM–12PM)', 'Afternoon (12PM–4PM)', 'Evening (4PM–8PM)'];
const CITIES = ['Jaipur', 'Ajmer', 'Sikar', 'Dausa', 'Other'];

export default function BookingForm({ onSuccess }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const containerRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    alternate_phone: '',
    email: '',
    address: '',
    landmark: '',
    city: 'Jaipur',
    pincode: '',
    google_location: '',
    ac_type: 'Split AC',
    units: 1,
    brand: 'Voltas',
    ac_age: '1–3 years',
    service_types: [],
    problem_description: '',
    image: null,
    video: null,
    preferred_date: '',
    time_slot: 'Morning (9AM–12PM)',
    is_urgent: false,
    parking_available: 'No',
    floor_number: '',
    lift_available: 'No',
    communication_preference: 'Both',
    agreed_to_terms: false
  });

  const estimatedTotal = useMemo(() => {
    const base = formData.service_types.reduce((acc, curr) => acc + (SERVICE_PRICES[curr] || 0), 0);
    const multiplier = typeof formData.units === 'number' ? formData.units : 4;
    return base * multiplier;
  }, [formData.service_types, formData.units]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone' || name === 'alternate_phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const toggleService = (type) => {
    setFormData(prev => {
      const services = prev.service_types.includes(type)
        ? prev.service_types.filter(s => s !== type)
        : [...prev.service_types, type];
      return { ...prev, service_types: services };
    });
    if (errors.service_types) setErrors(prev => ({ ...prev, service_types: null }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, [type]: file }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Full Name is required";
      if (!formData.phone || formData.phone.length !== 10) newErrors.phone = "Valid 10-digit phone required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.pincode || !/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = "Valid 6-digit pincode required";
    } else if (step === 2) {
      if (formData.service_types.length === 0) newErrors.service_types = "Select at least one service";
    } else if (step === 3) {
      if (!formData.preferred_date) newErrors.preferred_date = "Select a date";
    } else if (step === 4) {
      if (!formData.agreed_to_terms) newErrors.agreed_to_terms = "You must agree to terms";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e?.preventDefault();
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      gsap.to('.form-step-content', { opacity: 0, x: -30, duration: 0.3, onComplete: () => {
        setStep(step + 1);
        gsap.fromTo('.form-step-content', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3 });
      }});
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    gsap.to('.form-step-content', { opacity: 0, x: 30, duration: 0.3, onComplete: () => {
      setStep(step - 1);
      gsap.fromTo('.form-step-content', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.3 });
    }});
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createBooking({ ...formData, estimated_price: estimatedTotal });
      onSuccess?.(formData);
    } catch (err) {
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData(prev => ({ 
          ...prev, 
          google_location: `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}` 
        }));
        alert("Location captured! 📍");
      });
    }
  };

  return (
    <div className="professional-booking-form" style={{ width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '10px 14px', background: 'var(--blue-light)', borderRadius: 12, border: '1px solid rgba(37,78,219,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue)' }}>
          <Star size={14} fill="var(--blue)" /> 4.8 Rated Experts
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Zap size={12} fill="#ef4444" /> Lowest Price Guaranteed
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 18, left: 0, right: 0, height: 2, background: 'var(--border)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 18, left: 0, width: `${(step / (STEPS.length - 1)) * 100}%`, height: 2, background: 'var(--blue)', zIndex: 0, transition: 'width 0.4s ease' }} />
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: i <= step ? 'var(--blue)' : '#fff', color: i <= step ? '#fff' : 'var(--grey)', border: '2px solid', borderColor: i <= step ? 'var(--blue)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', transition: 'all 0.3s' }}>
              {i < step ? <CheckCircle size={18} /> : s.icon}
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: i <= step ? 'var(--black)' : 'var(--grey)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleNext} className="form-step-content" style={{ opacity: 1 }}>
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label>Full Name <span className="req">*</span></label>
              <input name="name" className={`form-input ${errors.name ? 'error' : ''}`} value={formData.name} onChange={handleChange} placeholder="Enter name" />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="grid-mobile-1">
              <div className="form-group">
                <label>Phone Number <span className="req">*</span></label>
                <input name="phone" className={`form-input ${errors.phone ? 'error' : ''}`} value={formData.phone} onChange={handleChange} placeholder="10-digit number" />
              </div>
              <div className="form-group">
                <label>Alt. Phone (Opt)</label>
                <input name="alternate_phone" className="form-input" value={formData.alternate_phone} onChange={handleChange} placeholder="Optional" />
              </div>
            </div>
            <div className="form-group">
              <label>Service Address <span className="req">*</span></label>
              <textarea name="address" className={`form-input ${errors.address ? 'error' : ''}`} value={formData.address} onChange={handleChange} placeholder="House No, Street, Area..." style={{ minHeight: 60 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }} className="grid-mobile-1">
              <div className="form-group"><label>Landmark</label><input name="landmark" className="form-input" value={formData.landmark} onChange={handleChange} /></div>
              <div className="form-group"><label>City</label><select name="city" className="form-input" value={formData.city} onChange={handleChange}>{CITIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="form-group"><label>Pincode *</label><input name="pincode" className="form-input" value={formData.pincode} onChange={handleChange} /></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label>Select AC Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {AC_TYPES.map(t => (
                  <label key={t} style={{ padding: '12px', borderRadius: 14, border: '1.5px solid', borderColor: formData.ac_type === t ? 'var(--blue)' : 'var(--border)', background: formData.ac_type === t ? 'var(--blue-light)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="radio" name="ac_type" value={t} checked={formData.ac_type === t} onChange={handleChange} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Number of Units *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, '4+'].map(u => (
                  <button key={u} type="button" onClick={() => setFormData(p => ({ ...p, units: u }))} style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: formData.units === u ? 'var(--blue)' : '#fff', color: formData.units === u ? '#fff' : 'var(--black)', border: '1px solid var(--border)', fontWeight: 700, cursor: 'pointer' }}>{u}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label>Select Services & View Charges *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                {SERVICE_OPTIONS.map(s => (
                  <button key={s} type="button" onClick={() => toggleService(s)} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 18px', borderRadius: 16,
                    border: '1.5px solid',
                    borderColor: formData.service_types.includes(s) ? 'var(--blue)' : 'var(--border)',
                    background: formData.service_types.includes(s) ? 'var(--blue-light)' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, border: '2px solid var(--blue)', background: formData.service_types.includes(s) ? 'var(--blue)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {formData.service_types.includes(s) && <CheckCircle size={14} color="white" />}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: formData.service_types.includes(s) ? 'var(--blue)' : 'var(--black)' }}>{s}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--blue)' }}>₹{SERVICE_PRICES[s]}</span>
                  </button>
                ))}
              </div>
              {errors.service_types && <span className="error-text">{errors.service_types}</span>}
            </div>
            <div style={{ background: '#fffbeb', padding: '12px 16px', borderRadius: 14, border: '1px solid #fef3c7', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600, margin: 0 }}>
                Note: Prices shown are starting estimates. Final charges may vary based on on-site inspection, material usage, or additional repair requirements.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-mobile-1">
              <div className="form-group"><label>Date *</label><input name="preferred_date" type="date" className="form-input" value={formData.preferred_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} /></div>
              <div className="form-group"><label>Slot *</label><select name="time_slot" className="form-input" value={formData.time_slot} onChange={handleChange}>{TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', background: '#fef2f2', border: '1.5px solid #fee2e2', borderRadius: 16, cursor: 'pointer', color: '#991b1b', fontSize: '0.9rem', fontWeight: 700 }}>
              <input type="checkbox" name="is_urgent" checked={formData.is_urgent} onChange={handleChange} />
              Urgent Service (2–4 hours) ⚡
            </label>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ padding: '24px', background: 'var(--blue-light)', borderRadius: 24, border: '2px solid var(--blue)', position: 'relative' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--blue)', fontWeight: 700, marginBottom: 4 }}>Estimated Service Total</div>
                <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--blue)', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <IndianRupee size={28} strokeWidth={3} /> {estimatedTotal}
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--blue)', fontWeight: 600, marginTop: 10, opacity: 0.8 }}>
                  *Excluding additional parts or on-site labor
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
              {formData.service_types.map(s => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--grey)', fontWeight: 600 }}>{s}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--black)', fontWeight: 800 }}>₹{SERVICE_PRICES[s]}</span>
                </div>
              ))}
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
              <input type="checkbox" name="agreed_to_terms" checked={formData.agreed_to_terms} onChange={handleChange} style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--grey)', fontWeight: 600 }}>I agree to terms & conditions.</span>
            </label>
          </div>
        )}

        <div style={{ marginTop: 32, display: 'flex', gap: 12, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          {step > 0 && <button type="button" onClick={handleBack} className="form-input" style={{ flex: 1, fontWeight: 800 }}>Back</button>}
          <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: 16, background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 16px rgba(37,78,219,0.2)', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Processing...' : step === STEPS.length - 1 ? 'Confirm Booking' : 'Continue'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.75rem; font-weight: 800; color: var(--black); text-transform: uppercase; letter-spacing: 0.04em; }
        .form-input { background: var(--grey-light); border: 1.8px solid transparent; border-radius: 14px; padding: 13px 15px; color: var(--black); font-size: 0.95rem; font-weight: 500; outline: none; transition: all 0.2s; width: 100%; }
        .form-input:focus { border-color: var(--blue); background: #fff; box-shadow: 0 0 0 4px rgba(37,78,219,0.08); }
        .error-text { color: #ef4444; font-size: 0.7rem; font-weight: 700; margin-top: 4px; }
        @media (max-width: 600px) { .grid-mobile-1 { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

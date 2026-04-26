"use client";

import React, { useState } from 'react';
import { Phone, Mail, Clock, Send, Sparkles } from 'lucide-react';

export default function Contact({ onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target));
    try {
      await onSubmit(data);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    { 
      icon: <Phone size={20} />, 
      label: 'Call Us', 
      val: '+91 80580 28536',
      glow: 'rgba(37, 78, 219, 0.4)' 
    },
    { 
      icon: <Mail size={20} />, 
      label: 'Email', 
      val: 'aero.cool.jaipur2023@gmail.com',
      glow: 'rgba(99, 102, 241, 0.4)'
    },
    { 
      icon: <Clock size={20} />, 
      label: 'Hours', 
      val: 'Mon–Sun: 8:00 AM – 8:00 PM',
      glow: 'rgba(245, 158, 11, 0.4)'
    },
  ];

  return (
    <section className="section-padding" id="contact"
      style={{ background: 'linear-gradient(135deg, var(--blue) 0%, #1a3bb5 100%)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(238,255,65,0.08)' }} />

      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 56, alignItems: 'start',
        }}>
          {/* Left info */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--lime)',
              background: 'rgba(238,255,65,0.12)', padding: '7px 18px',
              borderRadius: 50, marginBottom: 18,
            }}>
              <Sparkles size={14} /> Get In Touch
            </div>
            <h2 style={{
              fontFamily: "var(--font-plus-jakarta), sans-serif",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 900, lineHeight: 1.1,
              color: '#fff', marginBottom: 18,
            }}>
              Ready to Breathe<br />
              <span style={{ color: 'var(--lime)', textShadow: '0 0 20px rgba(238,255,65,0.3)' }}>Cleaner Air?</span>
            </h2>
            <div style={{ width: 56, height: 4, background: 'var(--lime)', borderRadius: 8, margin: '12px 0 24px' }} />
            <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 40, fontSize: '0.97rem' }}>
              Book your AC services now or reach out with any questions. Our friendly team is
              available 7 days a week to help you stay cool and comfortable.
            </p>

            {contactDetails.map((c) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0,
                  boxShadow: `0 0 20px ${c.glow}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Subtle inner glow */}
                  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${c.glow}, transparent)` }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>{c.icon}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginBottom: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>{c.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right form */}
          <div style={{
            background: 'var(--white)', borderRadius: 28, padding: '40px 36px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
            position: 'relative',
            minHeight: 480,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {isSuccess ? (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                animation: 'successPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both'
              }}>
                <div style={{ 
                  width: 180, 
                  height: 180, 
                  borderRadius: 24, 
                  overflow: 'hidden', 
                  marginBottom: 24,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '4px solid var(--lime)'
                }}>
                  <img src="/ac-meme.png" alt="Success Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ 
                  fontFamily: "'Plus Jakarta Sans',sans-serif", 
                  fontWeight: 900, 
                  fontSize: '1.8rem', 
                  color: 'var(--blue)',
                  marginBottom: 12
                }}>
                  COOL!
                </h3>
                <p style={{ 
                  color: 'var(--black)', 
                  fontWeight: 700, 
                  fontSize: '1.1rem',
                  lineHeight: 1.4
                }}>
                  Enquire sent successfully!<br />
                  <span style={{ fontSize: '0.9rem', color: 'var(--grey)', fontWeight: 600 }}>We'll reach out to you within 2 hours.</span>
                </p>
                
                <button 
                  onClick={() => setIsSuccess(false)}
                  style={{ 
                    marginTop: 32, 
                    padding: '12px 24px', 
                    borderRadius: 12, 
                    background: 'var(--blue)', 
                    color: '#fff', 
                    border: 'none', 
                    fontWeight: 700, 
                    cursor: 'pointer' 
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                  fontSize: '1.35rem', marginBottom: 8, color: 'var(--black)',
                }}>
                  Send Us a Message
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--grey)', marginBottom: 28 }}>
                  We'll respond within 2 hours.
                </p>
                <form id="contact-form" onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group">
                      <label htmlFor="cf-name">Name</label>
                      <input id="cf-name" name="name" className="form-input" type="text" placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cf-phone">Phone</label>
                      <input id="cf-phone" name="phone" className="form-input" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cf-email">Email</label>
                    <input id="cf-email" name="email" className="form-input" type="email" placeholder="you@example.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cf-msg">Message</label>
                    <textarea
                      id="cf-msg" name="message" className="form-input" rows={4}
                      placeholder="Tell us about your AC issue or any questions…"
                      required style={{ resize: 'vertical', minHeight: 100 }}
                    />
                  </div>
                  <button
                    id="contact-submit-btn" type="submit" className="btn-arrow"
                    disabled={loading}
                    style={{ width: '100%', marginTop: 4, justifyContent: 'space-between' }}
                  >
                    {loading ? '⏳ Sending…' : 'Send Message'}
                    <span className="arrow-circle">→</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes successPop {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
}

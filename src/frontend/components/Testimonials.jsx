"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TESTIMONIALS = [
  {
    id: 1, name: 'Sarah Johnson', role: 'Homeowner', rating: 5, initials: 'SJ',
    text: 'Absolutely incredible service! The technician arrived on time, was very professional, and left our AC running like new. The air quality in our home has noticeably improved.',
    service: 'Split AC Cleaning',
  },
  {
    id: 2, name: 'Michael Chen', role: 'Office Manager', rating: 5, initials: 'MC',
    text: 'High-quality service at a very competitive price. The team cleaned all 6 units in our office efficiently and professionally. Highly recommend to any business owner!',
    service: 'Gas Check & Maintenance',
  },
  {
    id: 3, name: 'Emma Rodriguez', role: 'Property Manager', rating: 5, initials: 'ER',
    text: 'The entire process was hassle-free from booking to completion. Amazing attention to detail and wonderful customer service. Will definitely be using Aerocool for all our properties.',
    service: 'Window AC Cleaning',
  },
];

export default function Testimonials() {
  const sectionRef = useRef();
  const [active, setActive] = useState(0);
  const trackRef = useRef();
  const autoRef = useRef();

  useEffect(() => {
    autoRef.current = setInterval(() => setActive((p) => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(autoRef.current);
  }, []);

  useEffect(() => {
    if (trackRef.current) {
      gsap.to(trackRef.current, { x: `-${active * 100}%`, duration: 0.6, ease: 'power3.inOut' });
    }
  }, [active]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      const ctx = gsap.context(() => {
        gsap.fromTo(sectionRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
        );
      });
      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={sectionRef} className="section-padding" id="testimonials"
      style={{ background: 'var(--grey-light)', opacity: 1 }}
    >
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label">⭐ Reviews</div>
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="divider" style={{ margin: '12px auto 16px' }} />
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Hear from satisfied customers who trust us for fast, reliable, and professional AC care.
          </p>
        </div>

        {/* Slider */}
        <div style={{ overflow: 'hidden', borderRadius: 24 }}>
          <div ref={trackRef} style={{ display: 'flex', willChange: 'transform' }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.id} id={`testimonial-${t.id}`} style={{ flex: '0 0 100%', padding: '0 4px' }}>
                <div className="testimonial-card">
                  {/* Quote mark */}
                  <div style={{ fontSize: '3rem', color: 'var(--blue)', lineHeight: 1, marginBottom: 8, opacity: 0.2, fontFamily: 'Georgia,serif' }}>"</div>
                  <div className="stars">{'★'.repeat(t.rating)}</div>

                  <p style={{
                    fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--black)',
                    margin: '18px 0 28px', fontStyle: 'italic',
                  }}>
                    "{t.text}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className="avatar">{t.initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--black)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--grey)' }}>{t.role}</div>
                    </div>
                    <div style={{
                      marginLeft: 'auto', fontSize: '0.73rem', fontWeight: 700,
                      padding: '5px 14px', borderRadius: 50,
                      background: 'var(--blue-light)', color: 'var(--blue)',
                      border: '1px solid rgba(37,78,219,0.15)',
                    }}>
                      {t.service}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots + arrows */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 28 }}>
          <button id="testimonial-prev" onClick={() => { clearInterval(autoRef.current); setActive((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); }}
            style={{
              width: 40, height: 40, borderRadius: '50%', background: 'var(--white)',
              border: '1.5px solid var(--border)', cursor: 'pointer', fontSize: '1rem',
              color: 'var(--black)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--blue)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--black)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >←</button>

          {TESTIMONIALS.map((_, i) => (
            <button key={i} id={`testimonial-dot-${i}`}
              className={`slider-dot ${active === i ? 'active' : ''}`}
              onClick={() => { clearInterval(autoRef.current); setActive(i); }}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}

          <button id="testimonial-next" onClick={() => { clearInterval(autoRef.current); setActive((p) => (p + 1) % TESTIMONIALS.length); }}
            style={{
              width: 40, height: 40, borderRadius: '50%', background: 'var(--white)',
              border: '1.5px solid var(--border)', cursor: 'pointer', fontSize: '1rem',
              color: 'var(--black)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--blue)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--black)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >→</button>
        </div>
      </div>
    </section>
  );
}

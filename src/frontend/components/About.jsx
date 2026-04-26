"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, ShieldCheck, Award, Timer, Leaf, HardHat } from 'lucide-react';

const CERTS = [
  { label: 'ISO Certified', icon: <Award size={14} /> },
  { label: 'Fully Insured', icon: <ShieldCheck size={14} /> },
  { label: 'Eco-Friendly',  icon: <Leaf size={14} /> },
  { label: 'On-Time',      icon: <Timer size={14} /> },
];

export default function About() {
  const sectionRef = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      const ctx = gsap.context(() => {
        gsap.fromTo('.about-left',
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.9, scrollTrigger: { trigger: '.about-left', start: 'top 85%' } }
        );
        gsap.fromTo('.about-right',
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.9, scrollTrigger: { trigger: '.about-right', start: 'top 85%' } }
        );
        gsap.fromTo('.about-stat',
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6,
            scrollTrigger: { trigger: '.about-stat', start: 'top 90%' },
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={sectionRef} className="section-padding" id="about"
      style={{ background: 'var(--white)' }}
    >
      <div className="section-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 72, alignItems: 'center',
        }}>
          {/* Left: Visual */}
          <div className="about-left" style={{ opacity: 1 }}>
            <div style={{ position: 'relative' }}>
              {/* Main visual card */}
              <div style={{
                background: 'linear-gradient(135deg, var(--blue) 0%, #7B8FF7 100%)',
                borderRadius: 28,
                minHeight: 420,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 20, padding: 40, position: 'relative', overflow: 'hidden',
              }}>
                {/* Decorative circles */}
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 180, height: 180, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                }} />
                <div style={{
                  position: 'absolute', bottom: -30, left: -30,
                  width: 120, height: 120, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                }} />

                <div style={{
                  width: 96, height: 96, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff'
                }}>
                  <HardHat size={48} />
                </div>
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff', marginBottom: 4 }}>
                    Certified Technicians
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                    Background checked &amp; fully insured
                  </div>
                </div>

                {/* Certification chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', zIndex: 1 }}>
                  {CERTS.map((c) => (
                    <span key={c.label} style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 50, padding: '5px 14px',
                      fontSize: '0.75rem', fontWeight: 600, color: '#fff',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}>
                      {c.icon} {c.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating stat badge */}
              <div style={{
                position: 'absolute', bottom: -20, right: -20,
                background: 'var(--white)', borderRadius: 16, padding: '16px 22px',
                boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
                animation: 'float 3.5s ease-in-out infinite',
              }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.6rem', color: 'var(--blue)' }}>
                  10+
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--grey)', fontWeight: 600 }}>Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="about-right" style={{ opacity: 1 }}>
            <div className="section-label">🏢 About Us</div>
            <h2 className="section-title">
              Your Trusted AC<br />
              <span className="gradient-text">Service Experts</span>
            </h2>
            <div className="divider" />

            <p style={{ color: 'var(--grey)', lineHeight: 1.85, marginBottom: 16, fontSize: '0.97rem' }}>
              At <strong style={{ color: 'var(--black)' }}>Aerocool</strong>, we specialize in professional AC cleaning,
              maintenance, and repair for homes and businesses. With over a decade of hands-on experience,
              our certified team has serviced more than 5,000 units across the region.
            </p>
            <p style={{ color: 'var(--grey)', lineHeight: 1.85, marginBottom: 32, fontSize: '0.97rem' }}>
              We use eco-friendly, anti-bacterial cleaning solutions and the latest equipment to ensure your
              AC runs efficiently, safely, and cleanly — delivered right to your door.
            </p>

            {/* Stats */}
            <div className="grid-3" style={{ gap: 14, marginBottom: 36 }}>
              {[
                { n: '5,000+', l: 'ACs Serviced' },
                { n: '98%', l: 'Happy Clients' },
                { n: '24/7', l: 'Support' },
              ].map((s) => (
                <div key={s.l} className="about-stat stat-card" style={{ 
                  opacity: 1, 
                  background: '#fff', 
                  borderRadius: 20, 
                  padding: '24px 16px',
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontFamily: "var(--font-plus-jakarta), sans-serif",
                    fontSize: '1.6rem', fontWeight: 900,
                    color: 'var(--blue)', marginBottom: 4,
                    letterSpacing: '-0.02em'
                  }}>
                    {s.n}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--grey)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</div>
                </div>
              ))}
            </div>

            <button
              id="about-learn-more"
              className="btn-arrow"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Our Services
              <span className="arrow-circle">→</span>
            </button>
          </div>
        </div>

        {/* Locations */}
        <div id="locations" style={{ marginTop: 100 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label">📍 Our Locations</div>
            <h2 className="section-title">We Serve Your Area</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Providing expert AC services across Jaipur and surrounding zones (up to 30km radius).
            </p>
          </div>
          <div className="grid-3">
            {[
              'Vaishali Nagar & Gandhi Path',
              'Malviya Nagar & Raja Park',
              'Mansarovar & Gopalpura',
              'C-Scheme & Civil Lines',
              'Bani Park & Vidhyadhar Nagar',
              'Jagatpura & Pratap Nagar',
              'Jhotwara & Sikar Road',
              'Tonk Road & Sitapura',
              'Sanganer & Bagru Zone'
            ].map((loc) => (
              <div key={loc} style={{
                padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
                background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
              }}
                onMouseEnter={e => { 
                  e.currentTarget.style.borderColor = 'var(--blue)'; 
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(37,78,219,0.1)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'; 
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(37,78,219,0.05)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', flexShrink: 0,
                  border: '1px solid rgba(37,78,219,0.1)'
                }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--black)', fontFamily: "var(--font-plus-jakarta), sans-serif", letterSpacing: '-0.01em' }}>{loc}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--grey)', fontWeight: 600, textTransform: 'uppercase', opacity: 0.7 }}>Same-day service</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--grey)', fontStyle: 'italic' }}>
              * We also cover surrounding towns including Kanota, Chomu Road, and Bassi within 30km.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

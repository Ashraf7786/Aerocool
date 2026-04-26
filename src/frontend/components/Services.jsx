"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Wind, Settings, Zap, CheckCircle2, Sparkles } from 'lucide-react';
import React from 'react';

const SERVICES = [
  {
    id: 'deep-clean',
    icon: <Wind size={32} />,
    title: 'AC Deep Cleaning Jaipur',
    desc: 'Professional deep jet pump cleaning for your Split and Window AC. We use eco-friendly chemicals to remove dust and improve cooling across Jaipur.',
    features: ['Coil Jet Wash', 'Drain Line Flush', 'Filter Cleaning', 'Blower Sanitization'],
    accent: '#254EDB',
    badge: 'Best Value',
  },
  {
    id: 'install-shifting',
    icon: <Zap size={32} />,
    title: 'AC Installation Jaipur',
    desc: 'Precision AC installation and uninstallation service in Vaishali Nagar, Mansarovar, and all of Jaipur. Expert pipe fitting and gas leak testing included.',
    features: ['Expert Setup', 'Pipe Fitting', 'Gas Leak Check', 'Stand Install'],
    accent: '#7B8FF7',
    badge: null,
  },
  {
    id: 'gas-filling',
    icon: <Zap size={32} />,
    title: 'AC Gas Filling Jaipur',
    desc: 'Restore your cooling with high-quality AC gas filling (R32, R410, R22). We conduct pressure tests and leak detection for long-lasting results.',
    features: ['Leak Detection', 'Pressure Test', 'Quality Gas', 'Full Top-up'],
    accent: '#EEFF41',
    badge: 'Fast Service',
  },
  {
    id: 'repair-service',
    icon: <Settings size={32} />,
    title: 'AC Repair Service Jaipur',
    desc: 'Expert AC technician in Jaipur for all major brands. We fix cooling issues, PCB failures, fan motor problems, and compressor noise on the same day.',
    features: ['PCB Repair', 'Motor Service', 'Noise Fix', 'Sensor Check'],
    accent: '#22c55e',
    badge: 'Expert Tech',
  },
  {
    id: 'amc-service',
    icon: <CheckCircle2 size={32} />,
    title: 'AC AMC Jaipur',
    desc: 'Professional Annual Maintenance Contracts (AMC) for Jaipur offices and homes. Enjoy priority service and regular checkups throughout the year.',
    features: ['Priority Service', 'Cost Saving', 'Regular Checkups', 'Parts Coverage'],
    accent: '#F59E0B',
    badge: 'Popular',
  },
  {
    id: 'emergency-repair',
    icon: <Zap size={32} />,
    title: 'Emergency Repair Jaipur',
    desc: 'Fastest 2-4 hour turnaround for critical AC failures in Malviya Nagar, Jagatpura, and all Jaipur areas. Certified technicians at affordable prices.',
    features: ['Quick Visit', 'Genuine Parts', 'Affordable Price', 'Jaipur-wide'],
    accent: '#ef4444',
    badge: 'Emergency',
  },
];


export default function Services({ servicesFromAPI }) {
  const sectionRef = useRef();
  const cardsRef = useRef([]);
  const displayServices = servicesFromAPI?.length ? servicesFromAPI : SERVICES;

  useEffect(() => {
    // Only register and animate on client
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      const ctx = gsap.context(() => {
        gsap.fromTo('.services-heading',
          { opacity: 0, y: 36 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            scrollTrigger: { 
              trigger: '.services-heading', 
              start: 'top 85%',
              toggleActions: 'play none none none' 
            } 
          }
        );
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          gsap.fromTo(card,
            { opacity: 0, y: 50, scale: 0.94 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.65,
              delay: i * 0.1, ease: 'power3.out',
              scrollTrigger: { 
                trigger: card, 
                start: 'top 90%',
                toggleActions: 'play none none none'
              },
            }
          );
        });
      }, sectionRef);
      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={sectionRef} className="section-padding" id="services"
      style={{ background: 'var(--grey-light)' }}
    >
      <div className="section-container">
        <div className="services-heading" style={{ textAlign: 'center', marginBottom: 60, opacity: 1 }}>
          <div className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} /> Best AC Service in Jaipur
          </div>
          <h2 className="section-title" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 900 }}>Professional AC Services</h2>
          <div className="divider" style={{ margin: '12px auto 16px' }} />
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Looking for expert AC repair, installation, or gas filling in Jaipur? 
            Our certified technicians provide same-day service across all Jaipur major areas.
          </p>
        </div>


        <div className="grid-3">
          {displayServices.map((svc, i) => (
            <div
              key={svc.id || i}
              id={`service-card-${svc.id || i}`}
              ref={(el) => (cardsRef.current[i] = el)}
              className="service-card"
              style={{ 
                position: 'relative', 
                opacity: 1, 
                background: '#fff', 
                borderRadius: 24, 
                padding: '32px',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.02)';
              }}
            >
              {/* Badge */}
              {svc.badge && (
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  background: svc.accent === '#EEFF41' ? 'var(--lime)' : 'var(--blue)',
                  color: svc.accent === '#EEFF41' ? 'var(--black)' : '#fff',
                  fontSize: '0.65rem', fontWeight: 800,
                  padding: '5px 14px', borderRadius: 50,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  boxShadow: `0 8px 20px ${svc.accent}40`,
                  zIndex: 2
                }}>
                  {svc.badge}
                </div>
              )}

              <div className="service-icon" style={{ 
                width: 60, height: 60, borderRadius: 18, 
                background: `${svc.accent}10`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: svc.accent,
                marginBottom: 24,
                position: 'relative',
                boxShadow: `0 10px 25px ${svc.accent}20`,
                border: `1px solid ${svc.accent}30`
              }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: `radial-gradient(circle at center, ${svc.accent}20, transparent)` }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {svc.icon ? React.cloneElement(svc.icon, { size: 28 }) : <Wind size={28} />}
                </div>
              </div>

              <h3 style={{
                fontFamily: "var(--font-plus-jakarta), sans-serif",
                fontSize: '1.25rem', fontWeight: 800, marginBottom: 12, color: 'var(--black)',
                letterSpacing: '-0.02em'
              }}>
                {svc.title}
              </h3>

              <p style={{ color: 'var(--grey)', fontSize: '0.9rem', lineHeight: 1.72, marginBottom: 22 }}>
                {svc.desc || svc.description}
              </p>

              {/* Feature chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {(svc.features || []).map((f) => (
                  <span key={f} style={{
                    fontSize: '0.73rem', fontWeight: 600, padding: '4px 12px',
                    borderRadius: 50, background: 'var(--blue-light)',
                    border: '1px solid rgba(37,78,219,0.15)', color: 'var(--blue)',
                  }}>
                    ✓ {f}
                  </span>
                ))}
              </div>

              <a href="#home" onClick={(e) => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: '0.88rem', fontWeight: 700, color: 'var(--blue)',
                  textDecoration: 'none', transition: 'gap 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                onMouseLeave={e => e.currentTarget.style.gap = '6px'}
              >
                Book this service <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

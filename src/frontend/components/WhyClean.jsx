"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeartPulse, Activity, Zap, ShieldCheck, Thermometer, Sparkles, CheckCircle2 } from 'lucide-react';

const BENEFITS = [
  { icon: <Zap size={22} />, title: "Fast Service", desc: 'Same-day visits and emergency support available across all areas of Jaipur within 2-4 hours.' },
  { icon: <ShieldCheck size={22} />, title: 'Genuine Parts', desc: 'We only use 100% original spare parts and high-quality refrigerants for all repairs and gas filling.' },
  { icon: <Thermometer size={22} />, title: 'Affordable Price', desc: 'Transparent pricing with no hidden charges. High-quality service at the most competitive rates in Jaipur.' },
  { icon: <Activity size={22} />, title: 'Expert Technicians', desc: 'Our team consists of background-verified and certified experts with over 10 years of experience.' },
  { icon: <HeartPulse size={22} />, title: 'Jaipur All Area Service', desc: 'From Vaishali Nagar to Malviya Nagar, we cover the entire Jaipur region with our mobile service units.' },
];


export default function WhyClean() {
  const sectionRef = useRef();
  const imageRef = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      const ctx = gsap.context(() => {
        gsap.fromTo('.why-heading',
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: '.why-heading', start: 'top 85%' } }
        );
        gsap.fromTo('.benefit-animate',
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.benefit-animate', start: 'top 85%' } }
        );
        gsap.fromTo(imageRef.current,
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, scrollTrigger: { trigger: imageRef.current, start: 'top 80%' } }
        );
        gsap.to(imageRef.current, {
          y: -50, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        });
      }, sectionRef);
      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={sectionRef} className="section-padding sticky-section" id="why-clean"
      style={{ background: 'var(--white)' }}
    >
      <div className="section-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 72, alignItems: 'start',
        }}>
          {/* Left: Benefits */}
          <div>
            <div className="why-heading" style={{ opacity: 1 }}>
              <div className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} /> Benefits
              </div>
              <h2 className="section-title" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 900 }}>
                Why Regular AC<br />
                <span className="gradient-text" style={{ textShadow: '0 0 30px rgba(37,78,219,0.2)' }}>Cleaning Matters</span>
              </h2>
              <div className="divider" />
              <p className="section-subtitle" style={{ marginBottom: 36 }}>
                Don't wait for your AC to fail. Regular professional cleaning is the smartest
                investment for your comfort, health, and wallet.
              </p>
            </div>

            <div>
              {BENEFITS.map((b, i) => (
                <div key={i} className="benefit-item benefit-animate" style={{ opacity: 1, marginBottom: 28, display: 'flex', gap: 20 }}>
                  <div className="benefit-dot" style={{ 
                    width: 44, height: 44, borderRadius: 14, 
                    background: 'var(--blue-light)', color: 'var(--blue)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 8px 16px rgba(37,78,219,0.12)',
                    border: '1px solid rgba(37,78,219,0.1)'
                  }}>
                    {React.cloneElement(b.icon, { size: 20 })}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 800, fontSize: '1.05rem', marginBottom: 6, color: 'var(--black)', letterSpacing: '-0.01em' }}>
                      {b.title}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--grey)', lineHeight: 1.7 }}>
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="sticky-content">
            <div ref={imageRef} style={{ position: 'relative', opacity: 1 }}>
              {/* Main visual */}
              <div style={{
                background: 'linear-gradient(135deg, var(--blue-light) 0%, #E0E7FF 100%)',
                borderRadius: 28,
                minHeight: 440,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9rem',
                border: '1.5px solid rgba(37,78,219,0.1)',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Circle decoration */}
                <div style={{
                  position: 'absolute', top: -60, right: -60,
                  width: 220, height: 220, borderRadius: '50%',
                  background: 'rgba(37,78,219,0.06)',
                }} />
                <div style={{
                  position: 'absolute', bottom: -40, left: -40,
                  width: 160, height: 160, borderRadius: '50%',
                  background: 'rgba(238,255,65,0.15)',
                }} />
                🧹
              </div>

              {/* Floating badge — energy savings */}
              <div className="floating-badge" style={{ bottom: -18, left: -22, zIndex: 2 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--grey)', marginBottom: 2 }}>Energy Savings</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--blue)' }}>
                  Up to 25%
                </div>
              </div>

              {/* Rating badge */}
              <div style={{
                position: 'absolute', top: -18, right: -18,
                background: 'var(--white)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '12px 18px',
                boxShadow: 'var(--shadow-md)', zIndex: 2,
                animation: 'float 3.5s ease-in-out infinite 1s',
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--grey)' }}>Certified</div>
                <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: '1rem', letterSpacing: 1 }}>★★★★★</div>
              </div>

              {/* Blue glow */}
              <div className="glow-blue" style={{ width: 300, height: 300, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.3 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

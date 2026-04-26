"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import BookingForm from './BookingForm';
import { CheckCircle, ShieldCheck, Leaf, Users, Star, Clock } from 'lucide-react';

export default function Hero({ onBookNow }) {
  const sectionRef = useRef();
  const glowRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-badge',    { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .fromTo('.hero-tagline',  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .fromTo('.hero-line-1',   { opacity: 0, y: 48, skewX: -2 }, { opacity: 1, y: 0, skewX: 0, duration: 0.85 }, '-=0.35')
        .fromTo('.hero-line-2',   { opacity: 0, y: 48, skewX: -2 }, { opacity: 1, y: 0, skewX: 0, duration: 0.85 }, '-=0.65')
        .fromTo('.hero-sub',      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.hero-ctas',     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('.hero-stats',    { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .fromTo('.hero-visual-col', { opacity: 0, x: 48, scale: 0.92 }, { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'back.out(1.2)' }, '-=0.8')
        .fromTo('.hero-scroll',   { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');

      // Floating animations
      gsap.to('.tech-image-wrapper', {
        y: -15, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
      gsap.to('.floating-ac', {
        y: 20, x: 10, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5
      });
      
      // Floating glow pulse
      gsap.to(glowRef.current, {
        scale: 1.25, opacity: 0.7, duration: 3,
        yoyo: true, repeat: -1, ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '5,000+', label: 'ACs Cleaned', icon: <CheckCircle size={20} /> },
    { value: '98%', label: 'Satisfaction', icon: <Star size={20} /> },
    { value: '10+ Yrs', label: 'Experience', icon: <Clock size={20} /> },
  ];

  return (
    <section ref={sectionRef} className="hero-section" id="home">
      {/* Background glows */}
      <div
        ref={glowRef}
        className="glow-blue"
        style={{ width: 700, height: 700, top: -180, right: -180, opacity: 0.5 }}
      />
      <div className="glow-lime" style={{ width: 400, height: 400, bottom: 80, left: -100, opacity: 0.35 }} />

      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: '12%', left: '5%',
        width: 18, height: 18, borderRadius: '50%',
        background: 'var(--blue)', opacity: 0.3,
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '8%',
        width: 12, height: 12, borderRadius: '50%',
        background: 'var(--lime)', opacity: 0.5,
      }} />

      <div className="section-container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 56,
          alignItems: 'center',
          padding: '40px 0 60px',
        }}>
          {/* ── Left: Content ── */}
          <div className="hero-content-col">
            {/* Badge */}
            <div className="hero-badge" style={{ opacity: 0, gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} color="#22C55E" />
                <span>Certified Technicians</span>
              </div>
              <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} color="var(--blue)" />
                <span>24/7 Support</span>
              </div>
              <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Leaf size={14} color="#10B981" />
                <span>Eco-Friendly</span>
              </div>
            </div>

            {/* Tagline */}
            <p className="hero-tagline section-label" style={{ opacity: 0 }}>
              ❄️ AC Services &amp; Maintenance
            </p>

            {/* Title */}
            <h1 className="hero-title">
              <span className="hero-line-1" style={{ display: 'block', opacity: 0 }}>
                Best AC Service
              </span>
              <span className="hero-line-2" style={{ display: 'block', opacity: 0 }}>
                In{' '}
                <span style={{
                  position: 'relative',
                  display: 'inline-block',
                }}>
                  Jaipur!
                  <svg
                    style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 12 }}
                    viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 9 Q100 2 198 9" stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-sub hero-subtitle" style={{ opacity: 0 }}>
              Professional AC repair, installation, and maintenance for homes &amp; offices in Jaipur. 
              Get same-day service from certified technicians in Vaishali Nagar, Mansarovar, Malviya Nagar &amp; beyond.
            </p>

            {/* CTAs */}
            <div className="hero-ctas" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: 0 }}>
              <button
                id="hero-book-btn"
                className="btn-arrow"
                onClick={onBookNow}
              >
                Book AC Services
                <span className="arrow-circle">→</span>
              </button>
              <button
                id="hero-learn-btn"
                className="btn-primary btn-outline"
                onClick={() => {
                  if (window.lenisInstance && typeof window.lenisInstance.scrollTo === 'function') {
                    window.lenisInstance.scrollTo('#services', { offset: -100 });
                  } else {
                    const el = document.getElementById('services');
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }
                }}

              >
                View Services
              </button>
            </div>

            {/* SEO Paragraph (Hidden for UX, but visible to Google or subtle in design) */}
            <div className="hero-seo-text" style={{ 
              marginTop: 24, fontSize: '0.85rem', color: 'var(--grey)', 
              lineHeight: 1.6, maxWidth: 540, opacity: 0.8 
            }}>
              Searching for the <strong>best AC service in Jaipur</strong>? Aerocool is your trusted partner for 
              high-quality <strong>AC repair Jaipur</strong>, installation, and gas filling. We serve all major areas including 
              <strong> Vaishali Nagar, Mansarovar, Malviya Nagar, and Jagatpura</strong>. Our certified 
              <strong> AC technicians in Jaipur</strong> provide same-day service for all Split and Window AC brands.
            </div>


            {/* Stats */}
            <div className="hero-stats" style={{
              display: 'flex', gap: 28, marginTop: 44, flexWrap: 'wrap', opacity: 0,
            }}>
              {stats.map((s, i) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'var(--blue-light)', color: 'var(--blue)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '1.25rem', fontWeight: 800, color: 'var(--black)',
                      lineHeight: 1, marginBottom: 2,
                    }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--grey)', fontWeight: 600 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Visual Assets ── */}
          <div className="hero-visual-col" style={{ 
            opacity: 0, position: 'relative', height: '100%', minHeight: 450,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Main Technician Image */}
            <div className="tech-image-wrapper" style={{
              position: 'relative', zIndex: 2, borderRadius: 32, overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
              border: '8px solid #fff', transform: 'rotate(2deg)'
            }}>
              <img 
                src="/technician.png" 
                alt="Expert AC Technician" 
                style={{ width: '100%', maxWidth: 400, display: 'block' }} 
              />
              <div style={{
                position: 'absolute', bottom: 20, left: 20, right: 20,
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                padding: '12px 20px', borderRadius: 16, textAlign: 'center'
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--blue)' }}>Expert Solutions</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--grey)' }}>Certified Professionals</div>
              </div>
            </div>

            {/* Floating AC Unit Image */}
            <div className="floating-ac" style={{
              position: 'absolute', top: 0, right: -40, zIndex: 3,
              maxWidth: 220, borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '4px solid #fff', transform: 'rotate(-5deg)'
            }}>
              <img src="/split_ac.png" alt="Modern AC Unit" style={{ width: '100%', display: 'block' }} />
            </div>

            {/* Decorative Background Element */}
            <div style={{
              position: 'absolute', inset: '10%', borderRadius: '40%',
              background: 'linear-gradient(135deg, var(--blue-light) 0%, #E0E7FF 100%)',
              filter: 'blur(40px)', opacity: 0.6, zIndex: 1
            }} />
          </div>
        </div>

        {/* Modern Mouse Scroll Indicator (Desktop Only) */}
        <div className="hero-scroll" style={{ 
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          opacity: 0, zIndex: 10
        }}>
          <div className="mouse-icon" style={{
            width: 28, height: 46,
            border: '2.5px solid var(--black)',
            borderRadius: 18,
            display: 'flex', justifyContent: 'center', paddingTop: 8,
            position: 'relative'
          }}>
            <div className="mouse-wheel" style={{
              width: 4, height: 10,
              background: 'var(--blue)',
              borderRadius: 4,
              animation: 'mouseWheelMove 1.8s ease-in-out infinite',
            }} />
          </div>
          <span style={{ 
            fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', 
            letterSpacing: '0.15em', color: 'var(--black)', opacity: 0.6 
          }}>
            Scroll Down
          </span>
        </div>

        <style jsx>{`
          @keyframes mouseWheelMove {
            0% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(8px); opacity: 0.5; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @media (max-width: 1024px) {
            .hero-scroll { display: none !important; }
          }
        `}</style>
      </div>
    </section>
  );
}


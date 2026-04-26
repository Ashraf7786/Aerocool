"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: 'Home',      href: '#home' },
  { label: 'About',     href: '#about' },
  { label: 'Services',  href: '#services' },
  { label: 'Locations', href: '#locations' },
  { label: 'Contact',   href: '#contact' },
];

export default function Navbar({ onBookNow }) {
  const navRef      = useRef();
  const logoRef     = useRef();
  const linksRef    = useRef([]);
  const btnRef      = useRef();
  const mobileRef   = useRef();
  const overlayRef  = useRef();
  const indicatorRef= useRef();

  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeHref, setActiveHref] = useState('#home');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  /* ─── Scroll + active section ─── */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);

      // Detect active section
      const sections = LINKS.map(l => ({
        href: l.href,
        el: document.querySelector(l.href),
      })).filter(s => s.el);

      for (let i = sections.length - 1; i >= 0; i--) {
        if (window.scrollY >= sections[i].el.offsetTop - 140) {
          setActiveHref(sections[i].href);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ─── GSAP entrance animation ─── */
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.15 });

    // Nav bar slides down
    tl.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    )
    // Logo pops in
    .fromTo(logoRef.current,
      { opacity: 0, x: -24, scale: 0.85 },
      { opacity: 1, x: 0, scale: 1, duration: 0.55, ease: 'back.out(1.6)' },
      '-=0.45'
    )
    // Links stagger up
    .fromTo(linksRef.current,
      { opacity: 0, y: -16, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.45, stagger: 0.07,
        ease: 'power2.out',
      },
      '-=0.3'
    )
    // CTA button
    .fromTo(btnRef.current,
      { opacity: 0, scale: 0.8, x: 20 },
      { opacity: 1, scale: 1, x: 0, duration: 0.5, ease: 'back.out(1.8)' },
      '-=0.3'
    );

    return () => tl.kill();
  }, []);

  /* ─── Scrolled glass animation ─── */
  useEffect(() => {
    if (!navRef.current) return;
    if (scrolled) {
      gsap.to(navRef.current, {
        backdropFilter: 'blur(24px)',
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [scrolled]);

  /* ─── Mobile menu open/close ─── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    if (menuOpen) {
      // Overlay fades in
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      // Drawer slides in from right
      gsap.fromTo(mobileRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
      // Stagger mobile links
      gsap.fromTo('.mobile-nav-link',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out', delay: 0.2 }
      );
    } else {
      gsap.to(mobileRef.current, { x: '100%', opacity: 0, duration: 0.4, ease: 'power3.in' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, delay: 0.1, ease: 'power2.in' });
    }
  }, [menuOpen]);

  /* ─── Hover indicator (floating pill under hovered link) ─── */
  const handleLinkHover = useCallback((e, idx) => {
    setHoveredIdx(idx);
    const el = linksRef.current[idx];
    if (!el || !indicatorRef.current) return;
    const rect = el.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();
    gsap.to(indicatorRef.current, {
      x: rect.left - navRect.left,
      width: rect.width,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const handleLinkLeave = useCallback(() => {
    setHoveredIdx(null);
    gsap.to(indicatorRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.out',
    });
  }, []);

  /* ─── Magnetic CTA hover ─── */
  const handleBtnMove = useCallback((e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.25;
    gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
  }, []);

  const handleBtnLeave = useCallback(() => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    
    if (window.lenisInstance && typeof window.lenisInstance.scrollTo === 'function') {
      window.lenisInstance.scrollTo(href, {
        offset: -100, // Account for navbar height
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const el = document.querySelector(href);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }

  };


  return (
    <>
      {/* ── Main Navbar ── */}
      <nav
        ref={navRef}
        id="navbar"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: scrolled ? '10px 0' : '18px 0',
          transition: 'padding 0.4s cubic-bezier(0.4,0,0.2,1)',
          /* Glass effect */
          background: scrolled
            ? 'rgba(255, 255, 255, 0.72)'
            : 'rgba(255, 255, 255, 0)',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(0px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.45)'
            : '1px solid transparent',
          boxShadow: scrolled
            ? '0 4px 30px rgba(37,78,219,0.08), 0 1px 0 rgba(255,255,255,0.6) inset'
            : 'none',
        }}
      >
        <div
          className="section-container"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}
        >
          {/* ── Logo ── */}
          <a
            ref={logoRef}
            id="navbar-logo"
            href="#home"
            onClick={(e) => handleNav(e, '#home')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            {/* Logo text */}
            <span style={{
              fontFamily: "var(--font-plus-jakarta), sans-serif",
              fontWeight: 900,
              fontSize: scrolled ? '1.4rem' : '1.65rem',
              color: 'var(--black)',
              letterSpacing: '-0.04em',
              transition: 'font-size 0.4s cubic-bezier(0.4,0,0.2,1)',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1
            }}>
              Aero<span style={{
                color: 'var(--blue)',
                position: 'relative',
              }}>cool</span>
            </span>
          </a>

          {/* ── Desktop links ── */}
          <div
            className="desktop-nav-container"
            style={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}
            onMouseLeave={handleLinkLeave}
          >
            {/* Hover background indicator */}
            <div
              ref={indicatorRef}
              style={{
                position: 'absolute',
                bottom: -4, left: 0,
                height: 36,
                background: scrolled
                  ? 'rgba(37,78,219,0.07)'
                  : 'rgba(255,255,255,0.18)',
                borderRadius: 10,
                pointerEvents: 'none',
                opacity: 0,
                zIndex: 0,
              }}
            />

            {LINKS.map((l, i) => {
              const isActive = activeHref === l.href;
              return (
                <a
                  key={l.label}
                  id={`nav-${l.label.toLowerCase()}`}
                  ref={el => (linksRef.current[i] = el)}
                  href={l.href}
                  onClick={(e) => handleNav(e, l.href)}
                  onMouseEnter={(e) => handleLinkHover(e, i)}
                  style={{
                    position: 'relative',
                    color: isActive ? 'var(--blue)' : (scrolled ? 'var(--black)' : '#1A1A2E'),
                    textDecoration: 'none',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.9rem',
                    padding: '8px 14px',
                    borderRadius: 10,
                    transition: 'color 0.25s',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  {/* Active dot */}
                  {isActive && (
                    <span style={{
                      display: 'inline-block',
                      width: 5, height: 5,
                      borderRadius: '50%',
                      background: 'var(--blue)',
                      flexShrink: 0,
                    }} />
                  )}
                  {l.label}

                  {/* Active underline */}
                  <span style={{
                    position: 'absolute',
                    bottom: 2, left: 14, right: 14,
                    height: 2,
                    borderRadius: 2,
                    background: 'var(--blue)',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                    transformOrigin: 'left',
                  }} />
                </a>
              );
            })}

            {/* ── CTA Book Now ── */}
            <button
              ref={btnRef}
              id="navbar-book-btn"
              onClick={onBookNow}
              onMouseMove={handleBtnMove}
              onMouseLeave={handleBtnLeave}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginLeft: 16,
                background: 'var(--blue)',
                color: '#fff',
                border: 'none',
                borderRadius: 50,
                padding: '10px 22px',
                fontSize: '0.88rem',
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(37,78,219,0.35)',
                transition: 'background 0.25s, box-shadow 0.25s',
                willChange: 'transform',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--blue-dark)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(37,78,219,0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--blue)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(37,78,219,0.35)';
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#4ADE80', // Soft green for "Available"
                boxShadow: '0 0 10px rgba(74, 222, 128, 0.8)',
                animation: 'navPulse 2s ease-in-out infinite',
              }} />

              Book Now
            </button>
          </div>

          {/* ── Hamburger (mobile) ── */}
          <button
            id="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: 5,
              cursor: 'pointer',
              padding: '6px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)',
              borderRadius: 10,
            }}
            className="hamburger-btn"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block',
                width: 22,
                height: 2,
                background: scrolled ? 'var(--black)' : 'var(--black)',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                transformOrigin: 'center',
                transform: menuOpen
                  ? i === 0 ? 'translateY(7px) rotate(45deg)'
                  : i === 1 ? 'opacity: 0'
                  : 'translateY(-7px) rotate(-45deg)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Shimmer line at bottom when scrolled */}
        {scrolled && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: '10%', right: '10%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(37,78,219,0.3), transparent)',
            pointerEvents: 'none',
          }} />
        )}
      </nav>

      {/* ── Mobile overlay ── */}
      <div
        ref={overlayRef}
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(10, 15, 40, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1100,
          opacity: 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      />

      {/* ── Mobile drawer ── */}
      <div
        ref={mobileRef}
        id="mobile-menu"
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 'min(320px, 85vw)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(30px) saturate(200%)',
          WebkitBackdropFilter: 'blur(30px) saturate(200%)',
          borderLeft: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '-20px 0 60px rgba(37,78,219,0.12)',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 32px',
          transform: 'translateX(100%)',
          opacity: 0,
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 28, paddingBottom: 32,
          borderBottom: '1px solid rgba(37,78,219,0.08)',
        }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: '1.1rem', color: 'var(--black)',
          }}>
            Aero<span style={{ color: 'var(--blue)' }}>cool</span>
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--grey-light)', border: 'none',
              color: 'var(--black)', cursor: 'pointer',
              fontSize: '1rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--grey-light)'}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Drawer links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 24, gap: 4 }}>
          {LINKS.map((l, i) => {
            const isActive = activeHref === l.href;
            return (
              <a
                key={l.label}
                href={l.href}
                className="mobile-nav-link"
                onClick={(e) => handleNav(e, l.href)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px',
                  borderRadius: 14,
                  textDecoration: 'none',
                  color: isActive ? 'var(--blue)' : 'var(--black)',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '1.05rem',
                  background: isActive ? 'var(--blue-light)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--grey-light)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Number indicator */}
                <span style={{
                  width: 26, height: 26, borderRadius: 8,
                  background: isActive ? 'var(--blue)' : 'var(--grey-light)',
                  color: isActive ? '#fff' : 'var(--grey)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {l.label}
                {isActive && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 700 }}>●</span>}
              </a>
            );
          })}
        </nav>

        {/* Drawer CTA */}
        <div style={{ paddingBottom: 40, paddingTop: 24, borderTop: '1px solid rgba(37,78,219,0.08)' }}>
          <button
            id="mobile-book-btn"
            className="btn-arrow"
            onClick={() => { setMenuOpen(false); onBookNow(); }}
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            📅 Book a Service
            <span className="arrow-circle">→</span>
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 16, marginTop: 16,
          }}>
            {['📞 Call Us', '💬 WhatsApp'].map((t) => (
              <button key={t} style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 12,
                background: 'var(--grey-light)',
                border: '1px solid var(--border)',
                color: 'var(--grey)',
                fontSize: '0.75rem', fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pulse keyframe ── */}
      <style>{`
        @keyframes navPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.6); }
        }
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          #navbar .desktop-nav-container { display: none !important; }
        }
      `}</style>
    </>
  );
}

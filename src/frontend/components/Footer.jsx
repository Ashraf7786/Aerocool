"use client";

import { Phone, Mail, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const year = 2026;

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Locations', href: '#locations' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLink = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="footer">
      <div className="section-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48, marginBottom: 60,
        }}>
          {/* Brand */}
          <div>
            <a href="#home" onClick={(e) => handleLink(e, '#home')}
              style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}
            >
              <span style={{ 
                fontFamily: "var(--font-plus-jakarta), sans-serif", 
                fontWeight: 900, 
                fontSize: '1.5rem', 
                color: '#fff',
                letterSpacing: '-0.04em'
              }}>
                Aero<span style={{ color: 'var(--lime)' }}>cool</span>
              </span>
            </a>
            <p style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 22 }}>
              Your trusted partner for professional AC services, maintenance, and repair.
              Breathing cleaner air starts with us.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { id: 'ig', icon: 'ig' },
                { id: 'fb', icon: 'f' },
                { id: 'tw', icon: '𝕏' },
                { id: 'li', icon: 'in' },
              ].map((s) => (
                <a key={s.id} href="#" id={`social-${s.id}`} className="social-icon"
                  style={{ 
                    width: 34, height: 34, borderRadius: '50%', 
                    background: 'rgba(255,255,255,0.05)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                    fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--lime)';
                    e.currentTarget.style.color = 'var(--black)';
                    e.currentTarget.style.borderColor = 'var(--lime)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                  aria-label={`Follow on ${s.id}`} 
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, marginBottom: 24, fontSize: '0.95rem', color: '#fff' }}>
              Quick Links
            </h4>
            {quickLinks.map((l) => (
              <a key={l.label}
                id={`footer-link-${l.label.toLowerCase().replace(/\s/g, '-')}`}
                href={l.href} className="footer-link"
                onClick={(e) => handleLink(e, l.href)}
                style={{ marginBottom: 14 }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Contact Us */}
          <div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, marginBottom: 24, fontSize: '0.95rem', color: '#fff' }}>
              Contact Us
            </h4>
            {[
              { icon: <Phone size={18} />, val: '+91 80580 28536', href: 'tel:+918058028536' },
              { icon: <Mail size={18} />, val: 'aero.cool.jaipur2023@gmail.com', href: 'mailto:aero.cool.jaipur2023@gmail.com' },

              { icon: <MapPin size={18} />, val: 'Jaipur, Rajasthan, India', href: '#locations' },
            ].map((c) => (
              <a key={c.val} 
                 href={c.href}
                 onClick={(e) => c.href.startsWith('#') && handleLink(e, c.href)}
                 style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center', textDecoration: 'none' }}
              >
                <span style={{ color: 'var(--lime)', display: 'flex' }}>{c.icon}</span>
                <span style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                  {c.val}
                </span>
              </a>
            ))}
          </div>

          {/* Service Hours + Newsletter */}
          <div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, marginBottom: 24, fontSize: '0.95rem', color: '#fff' }}>
              Service Hours
            </h4>
            {[
              { day: 'Mon – Fri', time: '8:00 AM – 8:00 PM' },
              { day: 'Saturday', time: '9:00 AM – 6:00 PM' },
              { day: 'Sunday', time: '10:00 AM – 4:00 PM' },
            ].map((h) => (
              <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.84rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>{h.day}</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{h.time}</span>
              </div>
            ))}

            <div style={{ marginTop: 32 }}>
              <div style={{ fontWeight: 700, marginBottom: 14, fontSize: '0.88rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={16} color="var(--lime)" /> Newsletter
              </div>
              <form id="newsletter-form" style={{ display: 'flex' }} onSubmit={(e) => { e.preventDefault(); e.target.reset(); }}>
                <input id="newsletter-email" type="email" className="newsletter-input" placeholder="Enter your email" required />
                <button id="newsletter-submit" type="submit" className="btn-primary"
                  style={{ padding: '12px 18px', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: '0.85rem', boxShadow: 'none' }}
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.35)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span>© {year} Aerocool. All Rights Reserved.</span>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            <span>Design and Developed by <a href="https://ashraf-siddiqui-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--lime)', textDecoration: 'none', fontWeight: 600 }}>Ashraf Siddiqui</a></span>
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((t) => (
              <a key={t} href="#" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

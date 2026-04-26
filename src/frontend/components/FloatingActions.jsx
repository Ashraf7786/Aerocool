"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Phone } from 'lucide-react';

export default function FloatingActions() {
  const containerRef = useRef();

  useEffect(() => {
    // Subtle float animation for the whole container
    gsap.to(containerRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  const phoneNumber = "8058028536";
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=Hi Aerocool, I'm interested in AC services.`;
  const callUrl = `tel:+91${phoneNumber}`;

  return (
    <div 
      ref={containerRef}
      className="hidden md:flex"
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        zIndex: 9999,
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Call Button */}
      <a 
        href={callUrl}
        aria-label="Call Us"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '20px',
          background: 'var(--blue)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: '0 10px 25px rgba(37,78,219,0.3), 0 0 15px rgba(37,78,219,0.5)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 15px 30px rgba(37,78,219,0.4), 0 0 25px rgba(37,78,219,0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(37,78,219,0.3), 0 0 15px rgba(37,78,219,0.5)';
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(255,255,255,0.2), transparent)' }} />
        <Phone size={26} style={{ position: 'relative', zIndex: 1 }} />
      </a>

      {/* WhatsApp Button */}
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '20px',
          background: '#25D366',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          boxShadow: '0 10px 25px rgba(37,211,102,0.3), 0 0 15px rgba(37,211,102,0.5)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 15px 30px rgba(37,211,102,0.4), 0 0 25px rgba(37,211,102,0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(37,211,102,0.3), 0 0 15px rgba(37,211,102,0.5)';
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(255,255,255,0.2), transparent)' }} />
        <svg 
          viewBox="0 0 24 24" 
          width="32" 
          height="32" 
          fill="currentColor"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.938 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Ripple Animation Style */}
      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import BookingForm from './BookingForm';

export default function BookingModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef();
  const modalRef   = useRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(modalRef.current,
        { y: 60, scale: 0.92, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' }
      );
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      y: 40, scale: 0.94, opacity: 0, duration: 0.3,
      onComplete: () => { setSubmitted(false); onClose(); },
    });
  };

  // Called when BookingForm completes successfully
  const handleSuccess = (data) => {
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(10, 15, 40, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 20000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div
        ref={modalRef}
        id="booking-modal"
        className="modal-container"
        data-lenis-prevent
        style={{
          background: 'var(--white)',
          border: '1px solid var(--border)',
          borderRadius: 28,
          width: '100%',
          maxWidth: 540,
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          position: 'relative',
        }}
      >

        {/* ... existing content ... */}
        
        <style jsx>{`
          .modal-container {
            padding: 44px 40px;
            scrollbar-width: thin;
            scrollbar-color: var(--border) transparent;
          }
          .modal-container::-webkit-scrollbar {
            width: 6px;
          }
          .modal-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .modal-container::-webkit-scrollbar-thumb {
            background-color: var(--border);
            border-radius: 10px;
          }
          @media (max-width: 600px) {
            .modal-container {
              padding: 40px 20px 100px !important;
              border-radius: 20px !important;
            }
          }
        `}</style>


        {/* Close button */}
        <button
          id="modal-close-btn"
          onClick={handleClose}
          style={{
            position: 'absolute', top: 18, right: 18,
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--grey-light)',
            border: '1px solid var(--border)',
            color: 'var(--black)',
            cursor: 'pointer', fontSize: '0.95rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
            zIndex: 20
          }}
          aria-label="Close modal"
          onMouseEnter={e => e.currentTarget.style.background = '#e0e4f0'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--grey-light)'}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--blue) 0%, #7B8FF7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(37,78,219,0.3)',
          }}>
            🔧
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: '1.5rem',
            color: 'var(--black)', marginBottom: 6,
            lineHeight: 1.2
          }}>
            Complete AC Service<br/>Booking Form
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--grey)', fontWeight: 600 }}>
            Professional • Certified • Same-Day Service
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎉</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>Booking Confirmed!</h3>
            <p style={{ color: 'var(--grey)', lineHeight: 1.6 }}>
              Thank you! Your request has been received. Our team will contact you within 2 hours.
            </p>
            <button 
              onClick={handleClose}
              className="btn-primary"
              style={{ marginTop: 28, width: '100%' }}
            >
              Close
            </button>
          </div>
        ) : (
          <BookingForm onSuccess={handleSuccess} />
        )}
      </div>

    </div>
  );
}

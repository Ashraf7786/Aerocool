"use client";

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';

import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import WhyClean from '@/components/WhyClean';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import { sendContact } from '@/services/api';
import { useUI } from '@/context/UIContext';

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });


export default function Home() {
  const { openBooking } = useUI();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight === 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleContactSubmit = async (data) => {
    try {
      await sendContact(data);
      showToast('Message sent successfully! We will contact you soon.');
    } catch (error) {
      showToast('Failed to send message. Please try again.', 'error');
    }
  };

  return (
    <main>
      {/* 3D Background */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {/* Scroll progress bar */}
      <div
        id="scroll-progress"
        className="progress-bar"
        style={{ 
          width: `${scrollProgress}%`,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '4px',
          background: 'var(--blue)',
          zIndex: 1100,
          transition: 'width 0.1s ease-out'
        }}
      />

      {/* Toast Notification */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`} style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 10000,
        background: 'white', padding: '12px 24px', borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        borderLeft: `5px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`,
        transform: toast.show ? 'translateX(0)' : 'translateX(120%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {toast.message}
      </div>

      <Hero onBookNow={openBooking} />
      <About />
      <Services />
      <WhyClean />
      <Testimonials />
      <FAQ />
      <Contact onSubmit={handleContactSubmit} />
    </main>
  );
}

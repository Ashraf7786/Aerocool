"use client";

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    id: 'faq-1',
    q: 'What is the AC service cost in Jaipur?',
    a: 'AC service costs in Jaipur vary based on the type of service. At Aerocool, our general service starts at just ₹499, while deep jet cleaning and gas filling are priced competitively with transparent billing and no hidden charges.',
  },
  {
    id: 'faq-2',
    q: 'Do you provide same-day AC repair in Jaipur?',
    a: 'Yes! We offer same-day AC repair and installation across all Jaipur areas, including Vaishali Nagar, Mansarovar, and Malviya Nagar. Our technicians usually reach you within 2-4 hours of booking.',
  },
  {
    id: 'faq-3',
    q: 'How often should I service my AC in Jaipur’s weather?',
    a: 'Given Jaipur’s dusty environment and intense summers, we recommend a professional AC service at least twice a year—once before the summer peak and once mid-season to maintain optimal cooling and energy efficiency.',
  },
  {
    id: 'faq-4',
    q: 'Are your AC technicians in Jaipur certified?',
    a: 'Absolutely. All our technicians are highly trained, background-verified, and certified to handle top AC brands like Voltas, LG, Daikin, Samsung, and Hitachi with 100% genuine spare parts.',
  },
  {
    id: 'faq-5',
    q: 'Do you provide AC service for offices and businesses?',
    a: 'Yes, we provide specialized commercial AC maintenance and AMC (Annual Maintenance Contracts) for offices, shops, and small businesses throughout Jaipur to ensure uninterrupted cooling.',
  },
  {
    id: 'faq-6',
    q: 'Which areas of Jaipur do you cover?',
    a: 'We serve all of Jaipur, including major hubs like Vaishali Nagar, Mansarovar, Malviya Nagar, Jagatpura, C-Scheme, Bani Park, Jhotwara, and Sanganer. Our mobile units ensure quick reach everywhere.',
  },
];



function FAQItem({ faq, isOpen, onToggle }) {
  const answerRef = useRef();

  return (
    <div id={faq.id} className={`faq-item ${isOpen ? 'open' : ''}`} style={{
      marginBottom: 16,
      border: '1px solid rgba(0,0,0,0.05)',
      borderRadius: 20,
      overflow: 'hidden',
      background: isOpen ? 'rgba(37,78,219,0.02)' : '#fff',
      transition: 'all 0.3s ease'
    }}>
      <div
        className="faq-question"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        aria-expanded={isOpen}
        style={{
          padding: '22px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          gap: 20
        }}
      >
        <span style={{ 
          fontFamily: "var(--font-plus-jakarta), sans-serif", 
          fontWeight: 700, 
          fontSize: '1.05rem',
          color: isOpen ? 'var(--blue)' : 'var(--black)',
          transition: 'color 0.3s'
        }}>{faq.q}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: isOpen ? 'var(--blue)' : 'rgba(0,0,0,0.04)',
          color: isOpen ? '#fff' : 'var(--grey)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          <ChevronDown size={18} />
        </div>
      </div>
      <div ref={answerRef} className="faq-answer" style={{
        padding: isOpen ? '0 28px 24px' : '0 28px 0',
        maxHeight: isOpen ? '500px' : '0',
        opacity: isOpen ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        color: 'var(--grey)',
        fontSize: '0.92rem',
        lineHeight: 1.8
      }}>
        {faq.a}
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const sectionRef = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      const ctx = gsap.context(() => {
        gsap.fromTo('.faq-heading',
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { trigger: '.faq-heading', start: 'top 85%' },
          }
        );
        gsap.fromTo('.faq-item',
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: { trigger: '.faq-item', start: 'top 90%' },
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={sectionRef} className="section-padding" id="faq"
      style={{ background: 'var(--white)' }}
    >
      <div className="section-container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="faq-heading" style={{ textAlign: 'center', marginBottom: 56, opacity: 1 }}>
          <div className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <HelpCircle size={14} /> FAQ
          </div>
          <h2 className="section-title" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 900 }}>Frequently Asked Questions</h2>
          <div className="divider" style={{ margin: '12px auto 16px' }} />
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Answers to common questions from our customers. Can't find your answer?{' '}
            <a
              href="#contact"
              style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 700 }}
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              Contact us directly.
            </a>
          </p>
        </div>

        <div>
          {FAQS.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

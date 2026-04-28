"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Calendar, Info, HelpCircle, ChevronRight, Snowflake, Sparkles } from 'lucide-react';

const PREDEFINED_OPTIONS = [
  { id: 'book', text: 'Book a Service', icon: <Calendar size={16} /> },
  { id: 'pricing', text: 'Check Pricing', icon: <Info size={16} /> },
  { id: 'faq', text: 'Common Questions', icon: <HelpCircle size={16} /> },
  { id: 'talk', text: 'Talk to Agent', icon: <User size={16} /> },
];

const BOT_RESPONSES = {
  initial: "Hi there! 👋 I'm your Aerocool Assistant. How can I help you today?",
  book: "Excellent choice! You can book a professional AC cleaning right here. Would you like to open the booking form?",
  pricing: "Our services start from just ₹499 for basic servicing. We offer Deep Cleaning, Gas Charging, and Installation. Which one are you interested in?",
  faq: "I can help with that! Some common questions: \n1. How long does it take? (approx 45-60 mins)\n2. Is there a warranty? (Yes, 30 days on service)\n3. Do you provide spare parts? (Yes, at extra cost)",
  talk: "I've notified our team! Someone will reach out to you shortly. In the meantime, feel free to leave your contact number.",
  default: "That's interesting! I'm still learning, but I can definitely help with bookings and pricing. Try selecting one of the options below."
};

export default function ChatAssistant({ isOpen, onToggle, onOpenBooking }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ id: 1, text: BOT_RESPONSES.initial, sender: 'bot', timestamp: new Date() }]);
    }
  }, [messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleOptionClick = (option) => {
    const userMsg = { id: Date.now(), text: option.text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    
    setIsTyping(true);
    setTimeout(() => {
      let botText = BOT_RESPONSES[option.id] || BOT_RESPONSES.default;
      const botMsg = { id: Date.now() + 1, text: botText, sender: 'bot', timestamp: new Date(), action: option.id };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setIsTyping(true);
    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, text: BOT_RESPONSES.default, sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <style>{`
        .chat-window {
          width: 380px !important;
        }
        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 30px) !important;
            right: 15px !important;
            bottom: 110px !important;
            height: calc(100vh - 180px) !important;
          }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Floating Button (Desktop Only) */}
      <motion.button
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="chat-button hidden md:flex"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 9998,
          width: '60px',
          height: '60px',
          borderRadius: '20px',
          background: 'var(--black)',
          color: 'var(--lime)',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div 
              key="chat" 
              initial={{ opacity: 0, scale: 0.5 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.5 }}
              style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #254EDB 0%, #1a3bb5 100%)',
                borderRadius: '22px',
                zIndex: -1,
                boxShadow: '0 8px 25px rgba(37, 78, 219, 0.3)',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-20%',
                  width: '60%',
                  height: '60%',
                  background: 'rgba(215, 255, 64, 0.2)',
                  filter: 'blur(20px)',
                  borderRadius: '50%'
                }} />
              </div>
              
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                style={{ position: 'relative', zIndex: 2, color: 'white' }}
              >
                <Bot size={32} strokeWidth={1.5} />
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                style={{ 
                  position: 'absolute', 
                  top: '8px', 
                  right: '8px', 
                  zIndex: 3, 
                  color: 'var(--lime)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Snowflake size={12} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -42, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6, type: 'spring' }}
                style={{
                  position: 'absolute',
                  background: 'var(--lime)',
                  color: 'var(--black)',
                  padding: '5px 12px',
                  borderRadius: '14px 14px 14px 4px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                  zIndex: 5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  border: '2px solid var(--black)'
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue)', animation: 'pulse 2s infinite' }} />
                HI!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex"
            style={{
              position: 'absolute',
              right: '80px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              padding: '10px 20px',
              borderRadius: '16px',
              fontSize: '0.88rem',
              fontWeight: '700',
              color: 'var(--black)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: '1px solid rgba(255,255,255,0.5)',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} className="text-blue-600" />
            <span>How can I help you today?</span>
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="chat-window"
            style={{
              position: 'fixed',
              bottom: '105px',
              right: '30px',
              maxHeight: 'min(600px, calc(100vh - 150px))',
              height: '600px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '32px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 20000,
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.8)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              background: 'var(--black)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'rgba(215, 255, 64, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--lime)'
                }}>
                  <Bot size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>Aerocool AI</h3>
                  <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>Online</span>
                </div>
              </div>
              <button onClick={onToggle} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: 'rgba(255,255,255,0.3)'
              }}
            >
              {messages.map((msg) => (
                <div key={msg.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '5px'
                }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                    background: msg.sender === 'user' ? 'var(--blue)' : 'white',
                    color: msg.sender === 'user' ? 'white' : 'var(--black)',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                  }}>
                    {msg.text}
                    
                    {msg.action === 'book' && (
                      <button 
                        onClick={onOpenBooking}
                        style={{
                          marginTop: '12px',
                          padding: '10px',
                          background: 'var(--lime)',
                          color: 'var(--black)',
                          border: 'none',
                          borderRadius: '10px',
                          fontWeight: '800',
                          fontSize: '0.75rem',
                          width: '100%'
                        }}
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div style={{ display: 'flex', gap: '4px', padding: '10px 15px', background: 'white', borderRadius: '15px', width: 'fit-content' }}>
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '6px', height: '6px', background: 'var(--grey)', borderRadius: '50%' }} />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '6px', height: '6px', background: 'var(--grey)', borderRadius: '50%' }} />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '6px', height: '6px', background: 'var(--grey)', borderRadius: '50%' }} />
                </div>
              )}

              {/* Quick Options */}
              {!isTyping && messages[messages.length - 1]?.sender === 'bot' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {PREDEFINED_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--blue)',
                        background: 'transparent',
                        color: 'var(--blue)',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSendMessage}
              style={{ padding: '20px', background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '10px' }}
            >
              <input 
                type="text"
                placeholder="Type..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1.5px solid var(--border)', outline: 'none' }}
              />
              <button type="submit" style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--blue)', color: 'white', border: 'none' }}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

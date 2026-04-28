"use client";

import { motion } from 'framer-motion';
import { Phone, MessageCircle, Calendar, Snowflake } from 'lucide-react';

export default function MobileBottomBar({ onOpenChat, onOpenBooking }) {
  const phoneNumber = "8058028536";
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=Hi Aerocool, I'm interested in AC services.`;
  const callUrl = `tel:+91${phoneNumber}`;

  return (
    <div className="md:hidden fixed bottom-4 left-0 right-0 z-[15000] px-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="relative mx-auto max-w-[380px]"
      >
        {/* Advanced Glow Background */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-600 via-lime-400 to-blue-500 rounded-[28px] blur-[3px] opacity-20"></div>
        
        {/* Main Bar Container */}
        <div className="relative flex items-end justify-between bg-[#121212]/95 backdrop-blur-2xl border border-white/10 rounded-[26px] px-2 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Call */}
          <a 
            href={callUrl}
            className="flex flex-col items-center justify-center flex-1 h-14 rounded-2xl text-white hover:bg-white/5 transition-colors group"
          >
            <div className="relative mb-1">
              <Phone size={18} className="animate-ring text-white/90" />
              <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-md animate-pulse"></div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Call</span>
          </a>

          {/* WhatsApp */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center flex-1 h-14 rounded-2xl hover:bg-white/5 transition-colors"
          >
            <div className="mb-1">
              <svg 
                viewBox="0 0 24 24" 
                width="20" 
                height="20" 
                fill="#25D366"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.938 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#25D366]">WA</span>
          </a>

          {/* Book Now - Hero Action */}
          <div className="relative px-2">
            <button 
              onClick={onOpenBooking}
              className="flex flex-col items-center justify-center w-[74px] h-[74px] -mt-10 bg-blue-600 text-white rounded-[24px] shadow-[0_15px_35px_rgba(37,78,219,0.5)] border-[3px] border-[#121212] transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute -top-1 -right-1 p-1.5 bg-lime-400 rounded-full text-black z-10 shadow-lg border-2 border-[#121212]">
                <Snowflake size={10} className="animate-spin-slow" />
              </div>
              <Calendar size={22} className="mb-1" />
              <span className="text-[10px] font-black uppercase tracking-wider">Book</span>
            </button>
          </div>

          {/* Chat */}
          <button 
            onClick={onOpenChat}
            className="flex flex-col items-center justify-center flex-1 h-14 rounded-2xl text-lime-400 hover:bg-white/5 transition-colors"
          >
            <div className="mb-1">
              <MessageCircle size={18} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-lime-400/80">Chat</span>
          </button>

          {/* Home / Scroll Top */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center flex-1 h-14 rounded-2xl hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-1 border border-white/10 group-hover:bg-white/20 transition-all">
               <span className="text-[10px] font-black text-white/90">A</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Home</span>
          </button>

        </div>
      </motion.div>
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ring {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(12deg); }
          20% { transform: rotate(-12deg); }
          30% { transform: rotate(12deg); }
          40% { transform: rotate(-12deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-ring {
          animation: ring 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

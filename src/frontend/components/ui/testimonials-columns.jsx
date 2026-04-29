"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export const TestimonialsColumn = ({ className, testimonials, duration = 10 }) => {
  return (
    <div className={className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-8 pb-8"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, name, role, rating }, i) => (
              <div 
                className="group relative p-10 rounded-[32px] border border-white/5 bg-[#0A0A0B]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-sm w-full transition-all duration-500 hover:border-cyan-500/30 hover:bg-[#0F0F11]" 
                key={`${index}-${i}`}
              >
                {/* Subtle Top Glow */}
                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex gap-1.5 mb-6">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star 
                      key={starIndex}
                      size={14} 
                      className={`${starIndex < rating ? 'fill-cyan-400 text-cyan-400' : 'text-zinc-800'}`}
                      strokeWidth={1}
                    />
                  ))}
                </div>

                <div className="text-zinc-300/90 leading-[1.8] text-[15px] font-light tracking-wide">
                  "{text}"
                </div>

                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/5">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center font-bold text-zinc-400 text-sm shadow-xl group-hover:text-cyan-400 transition-colors duration-500">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-medium text-white text-[16px] tracking-tight">{name}</div>
                    <div className="text-cyan-500/70 text-[12px] font-semibold tracking-[0.1em] uppercase mt-1">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

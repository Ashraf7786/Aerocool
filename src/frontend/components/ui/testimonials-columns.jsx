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
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, name, role, rating }, i) => (
              <div 
                className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl max-w-xs w-full group hover:border-blue-500/50 transition-all duration-300" 
                key={`${index}-${i}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star 
                      key={starIndex}
                      size={14} 
                      className={`${starIndex < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                <div className="text-white/80 leading-relaxed text-sm italic">"{text}"</div>
                <div className="flex items-center gap-3 mt-6">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-inner">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-white tracking-tight leading-5 text-sm">{name}</div>
                    <div className="leading-5 text-blue-400/80 text-[11px] font-medium tracking-wider uppercase">{role}</div>
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

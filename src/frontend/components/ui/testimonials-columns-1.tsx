"use client";
import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: {
    text: string;
    name: string;
    role: string;
  }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, name, role }, i) => (
                <div 
                  className="p-8 rounded-3xl border border-zinc-200 bg-white/50 backdrop-blur-sm shadow-xl shadow-primary/5 max-w-xs w-full transition-all duration-300 hover:shadow-2xl hover:border-primary/20" 
                  key={i}
                >
                  <div className="text-zinc-600 leading-relaxed italic">"{text}"</div>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-zinc-100">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-bold tracking-tight leading-5 text-zinc-900">{name}</div>
                      <div className="text-xs leading-5 opacity-60 tracking-tight text-zinc-500 font-medium">{role}</div>
                    </div>
                  </div>
                </div>
              ))}

            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

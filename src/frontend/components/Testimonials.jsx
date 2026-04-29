"use client";
import React from "react";
import { TestimonialsColumn } from "./ui/testimonials-columns";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "The best AC service in Jaipur. Rajesh and his team were very professional and fixed my split AC cooling issue in 30 minutes.",
    name: "Rajesh Kumar",
    role: "Home Owner, Mansarovar",
    rating: 5,
  },
  {
    text: "Very reliable technician. They explained the problem clearly and didn't overcharge. Highly recommended for regular maintenance.",
    name: "Priya Sharma",
    role: "Apartment Resident, Raja Park",
    rating: 5,
  },
  {
    text: "Excellent response time. I called them at 9 PM and they had a technician at my house by 10 AM the next day. Brilliant service!",
    name: "Amit Patel",
    role: "Shop Owner, Johri Bazar",
    rating: 4,
  },
  {
    text: "Their AMC plan is very affordable. Now I don't have to worry about my office ACs breaking down in the summer heat.",
    name: "Sneha Reddy",
    role: "Office Manager, C-Scheme",
    rating: 5,
  },
  {
    text: "Honest and hard-working staff. They cleaned up everything after the installation. 5 stars for the cleanliness!",
    name: "Vikram Singh",
    role: "Business Man, Vaishali Nagar",
    rating: 5,
  },
  {
    text: "Saved me from the 45-degree heat! The technician was very knowledgeable and polite. Will definitely use Aerocool again.",
    name: "Ananya Gupta",
    role: "IT Professional, Malviya Nagar",
    rating: 5,
  },
  {
    text: "Professional installation of our VRV system. The team was well-equipped and finished the job ahead of schedule.",
    name: "Farhan Akhtar",
    role: "Hotel Manager, Bani Park",
    rating: 5,
  },
  {
    text: "I appreciated the transparency in pricing. No hidden costs, and they used genuine spare parts for my LG unit.",
    name: "Kavita Iyer",
    role: "Professor, JLN Marg",
    rating: 4,
  },
  {
    text: "They are the experts for high-end AC brands. They handled my Daikin unit with extreme care. Very satisfied.",
    name: "Sameer Khan",
    role: "Doctor, Tonk Road",
    rating: 5,
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
  return (
    <section className="bg-[#050505] py-32 relative overflow-hidden" id="testimonials">
      {/* Refined Ambient Glows */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[720px] mx-auto text-center mb-24"
        >
          <div className="inline-flex items-center gap-2.5 border border-white/5 bg-white/[0.02] px-5 py-2 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Client Success</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-8">
            Trusted by the <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">Industry Leaders</span>
          </h2>
          <p className="text-[17px] text-zinc-400/80 leading-relaxed font-light max-w-lg">
            Experience the standard of excellence that has made Aerocool the preferred choice for Jaipur's elite properties.
          </p>
        </motion.div>

        <div className="flex justify-center gap-10 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[800px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={35} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={45} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={40} />
        </div>
      </div>
    </section>
  );
}

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
    <section className="bg-black py-24 relative overflow-hidden" id="testimonials">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[640px] mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/5 px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Testimonials</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Thousands</span> in Jaipur
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            See why homeowners and businesses across the Pink City trust Aerocool for their comfort.
          </p>
        </motion.div>

        <div className="flex justify-center gap-8 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[680px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />
        </div>
      </div>
    </section>
  );
}

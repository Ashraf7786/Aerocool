"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import ChatAssistant from "@/components/ChatAssistant";
import MobileBottomBar from "@/components/MobileBottomBar";
import BookingModal from "@/components/BookingModal";
import SmoothScroll from "@/components/SmoothScroll";
import { useUI } from "@/context/UIContext";

export default function MainLayout({ children }) {
  const { 
    isBookingOpen, closeBooking, openBooking,
    isChatOpen, toggleChat, openChat 
  } = useUI();

  return (
    <SmoothScroll>
      <Navbar onBookNow={openBooking} />
      
      {children}
      
      <Footer />
      
      {/* Desktop Floating Actions */}
      <FloatingActions />
      
      {/* Global Chat Assistant */}
      <ChatAssistant 
        isOpen={isChatOpen} 
        onToggle={toggleChat} 
        onOpenBooking={openBooking} 
      />
      
      {/* Global Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={closeBooking} 
      />
      
      {/* Mobile Premium Snackbar */}
      <MobileBottomBar 
        onOpenChat={openChat} 
        onOpenBooking={openBooking} 
      />
    </SmoothScroll>
  );
}

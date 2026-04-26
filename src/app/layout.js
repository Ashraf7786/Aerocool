import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: "Best AC Service in Jaipur | Expert AC Repair & Installation",
  description: "Looking for the best AC service in Jaipur? Aerocool offers fast, affordable AC repair, installation, and gas filling in Vaishali Nagar, Mansarovar, Malviya Nagar & Jagatpura. Same-day service by certified technicians. Book now!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakarta.variable}>
      <body className={inter.className}>
        <AuthProvider>
          <UIProvider>
            {children}
            <Analytics />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}



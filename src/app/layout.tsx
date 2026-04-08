import type { Metadata } from "next";
import { 
  Fraunces, 
  Playfair_Display, 
  Plus_Jakarta_Sans, 
  Monsieur_La_Doulaise 
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Configuration for your high-end typography
const fraunces = Fraunces({ 
  subsets: ["latin"], 
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"], 
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  style: 'italic',
  variable: "--font-playfair",
  display: 'swap',
});

const sans = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: 'swap',
});

const signature = Monsieur_La_Doulaise({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Snigdha Chandra Paik | Creative Developer",
  description: "Interactive Website and 3D Developer Portfolio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`
        ${fraunces.variable} 
        ${playfair.variable} 
        ${sans.variable} 
        ${signature.variable}
        scroll-smooth
      `}
    >
      <body 
        className="
          bg-[#F7F3E9] 
          text-[#141B1A] 
          antialiased 
          font-sans
          selection:bg-[#A64D32] 
          selection:text-[#F7F3E9]
        "
        suppressHydrationWarning={true}
      >
        <SmoothScroll>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
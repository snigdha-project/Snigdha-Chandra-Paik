import type { Metadata } from "next";
import {
  Fraunces,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Monsieur_La_Doulaise,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Configuration for high-end typography
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-playfair",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const signature = Monsieur_La_Doulaise({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

// FIXED METADATA: Changed title back to a string to resolve Type Error
export const metadata: Metadata = {
  metadataBase: new URL("https://snigdhachandrapaik.vercel.app"),
  title: "Snigdha Chandra Paik | Creative Developer",
  description:
    "Interactive Website and 3D Developer Portfolio specializing in Webflow, SEO, and Next.js.",
  keywords: [
    "Webflow Developer",
    "SEO Specialist",
    "Next.js Portfolio",
    "Creative Developer",
  ],
  authors: [{ name: "Snigdha Chandra Paik" }],
  creator: "Snigdha Chandra Paik",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://snigdhachandrapaik.vercel.app",
    siteName: "Snigdha Chandra Paik",
  },
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
      <head>
        {/* 1. GTM SCRIPT MUST BE THE ABSOLUTE FIRST ITEM IN HEAD */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M225DLQQ');`,
          }}
        />
        {/* ---------------------------------------------------- */}
      </head>
      <body
        className="bg-[#F7F3E9] text-[#141B1A] antialiased font-sans"
        suppressHydrationWarning={true}
      >
        {/* 2. NOSCRIPT MUST BE IMMEDIATELY AFTER THE OPENING BODY TAG */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M225DLQQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* ----------------------------------------------------------- */}

        {/* 3. WRAPPERS LIKE SMOOTHSCROLL MUST COME AFTER THE GTM SNIPPETS */}
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
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
import JsonLd from "@/components/JsonLd";
import {
  personSchema,
  professionalServiceSchema,
  websiteSchema,
} from "@/lib/seo";

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

const HOME_TITLE = "Snigdha Chandra Paik | Frontend & SEO Developer";
const HOME_DESCRIPTION =
  "Snigdha Chandra Paik — Frontend Developer & SEO specialist crafting animated Next.js, Three.js & React Native web apps from India.";

export const metadata: Metadata = {
  metadataBase: new URL("https://snigdhachandrapaik.vercel.app"),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  applicationName: "Snigdha Chandra Paik",
  authors: [{ name: "Snigdha Chandra Paik", url: "https://snigdhachandrapaik.vercel.app" }],
  creator: "Snigdha Chandra Paik",
  publisher: "Snigdha Chandra Paik",
  keywords: [
    "Snigdha Chandra Paik",
    "Frontend Developer West Bengal",
    "Frontend SEO Specialist India",
    "Next.js Developer Kolkata",
    "Three.js Developer India",
    "Framer Motion Developer India",
    "Animated Website Developer India",
    "React Native Developer Kolkata",
    "Python Automation Developer India",
    "Webflow SEO Specialist India",
    "Creative Frontend Developer",
  ],
  alternates: {
    canonical: "/",
    languages: { "en-IN": "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Snigdha Chandra Paik",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: "/OG/homeOG.png",
        width: 1200,
        height: 630,
        alt: "Snigdha Chandra Paik — Frontend Developer & SEO Specialist",
      },
      {
        url: "/images/myImage.jpg",
        width: 1200,
        height: 1200,
        alt: "Snigdha Chandra Paik — Frontend Developer & SEO Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/OG/homeOG.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "j5HdTVTmf3ju_RKwdas2ivk-s80JFO7-E_j59titvE0",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`
        ${fraunces.variable}
        ${playfair.variable}
        ${sans.variable}
        ${signature.variable}
        scroll-smooth
      `}
      data-scroll-behavior="smooth"
    >
      <head>
        <Script
          id="gtm-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M225DLQQ');`,
          }}
        />
        <JsonLd data={[personSchema, websiteSchema, professionalServiceSchema]} />
      </head>
      <body
        className="bg-[#F7F3E9] text-[#141B1A] antialiased font-sans"
        suppressHydrationWarning={true}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M225DLQQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}

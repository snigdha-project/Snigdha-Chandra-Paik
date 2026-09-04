"use client";

import { Code2, ShoppingCart, Search, Smartphone, Layers, Rocket } from "lucide-react";
import LocationLandingContent from "@/components/landing/LocationLandingContent";
import type { LandingConfig } from "@/components/landing/types";

const config: LandingConfig = {
  slug: "website-developer-india",
  market: "India",
  eyebrow: "Website Developer in India",
  h1Pre: "A website developer in",
  h1Accent: "India",
  h1Post: "who builds for Google, not just for looks.",
  subhead:
    "Animated, technically sound Next.js and ecommerce websites for businesses across India, from Kolkata to Mumbai, with SEO engineered in from the first commit, not added after launch.",
  heroChips: ["Next.js", "Three.js", "Shopify", "WooCommerce", "Technical SEO"],
  trustLine: "Website Developer & SEO Specialist, Based in India",
  heroImages: [
    { src: "/projects/hamarakhet.png", alt: "Hamara Khet agritech platform for Bharat's farmers, a live Next.js project" },
    { src: "/projects/puribazar.png", alt: "Puribazar ecommerce marketplace, a live Indian web project" },
  ],
  stats: [
    { to: 11, suffix: "+", label: "Projects Shipped" },
    { to: 4, suffix: "", label: "Countries Served" },
    { to: 24, suffix: "h", label: "Reply Time" },
    { to: 100, suffix: "%", label: "Direct Communication" },
  ],
  servicesEyebrow: "Services Across India",
  servicesTitle: "One developer, every platform Indian businesses actually use",
  servicesIntro:
    "From a first Next.js website to a multi-vendor WooCommerce marketplace, every project built and optimised by the person you talk to.",
  services: [
    {
      icon: Code2,
      title: "Custom Next.js Websites",
      desc: "Animated, high-performance websites built with Next.js, React and Framer Motion, faster and more distinctive than the template sites most \"web development company in India\" listings ship.",
    },
    {
      icon: ShoppingCart,
      title: "Ecommerce & Marketplace Development",
      desc: "Shopify, WooCommerce and Dokan multi-vendor builds, including real marketplace platforms, not just single-product storefronts.",
    },
    {
      icon: Search,
      title: "Technical & Local SEO",
      desc: "Schema markup, Core Web Vitals and keyword strategy for Indian search intent, handled by the same developer who builds the site.",
    },
    {
      icon: Smartphone,
      title: "React Native Apps",
      desc: "Extend a web platform into a mobile app with React Native when you're ready to go beyond the browser.",
    },
    {
      icon: Layers,
      title: "WordPress & Webflow",
      desc: "Audits, redesigns and ongoing maintenance for existing WordPress or Webflow sites, no unnecessary rebuilds.",
    },
    {
      icon: Rocket,
      title: "Free Website & SEO Audits",
      desc: "A prioritised, hand-reviewed audit before any commitment, the same one used to scope every India-based project.",
    },
  ],
  whyEyebrow: "Why Work With an Independent Developer",
  whyTitle: "Skip the agency layers",
  whyIntro:
    "Most \"best web development company in India\" lists are agencies, directories or blog roundups, not the people who'll actually write your code. Here, that's not the case.",
  comparisonRows: [
    { label: "Who builds your site", us: "The developer you talk to, directly", typical: "Handed off to a junior team, or outsourced further" },
    { label: "Tech stack", us: "Modern Next.js / React, animated and fast", typical: "Generic WordPress templates" },
    { label: "SEO", us: "Built in from day one", typical: "Sold separately, if offered at all" },
    { label: "Pricing", us: "One fixed quote after a free consultation", typical: "Vague packages, scope creep" },
    { label: "Proof of work", us: "Live, working sites you can visit today", typical: "Screenshot portfolios or stock case studies" },
  ],
  portfolioEyebrow: "Live Projects Across India",
  portfolioTitle: "Real sites for real Indian businesses",
  portfolioIntro: "A sample of live projects across ecommerce, agritech and personal brands. Visit them, they're all real.",
  portfolio: [
    {
      title: "Puribazar",
      category: "E-Commerce / Marketplace",
      description: "A multi-vendor ecommerce marketplace powered by Dokan and WooCommerce, specialising in regional sweets and traditional artifacts.",
      tech: ["WordPress", "WooCommerce", "Dokan"],
      image: "/projects/puribazar.png",
      link: "https://www.puribazar.in/",
    },
    {
      title: "Hamara Khet",
      category: "Agritech / AI Platform",
      description: "An AI Mandi for Bharat's farmers: LLM-driven crop advisory and a real-time marketplace built for Indian growers.",
      tech: ["Next.js", "Framer Motion", "Supabase"],
      image: "/projects/hamarakhet.png",
      link: "https://hamarakhet.vercel.app/",
    },
    {
      title: "Monalisa Mandal",
      category: "Portfolio / Lifestyle",
      description: "An elegant, responsive personal portfolio for a professional makeup artist, with a custom WordPress UI.",
      tech: ["WordPress", "UI/UX Design"],
      image: "/projects/monalisamandal.png",
      link: "https://monalisamandal.com/",
    },
  ],
  regionEyebrow: "Nationwide, India-First",
  regionTitle: "Serving businesses across every major Indian city",
  regionParagraphs: [
    "Being based in India means no time-zone friction and no confusing international contracts. Video calls, WhatsApp or a phone call, whichever works best for your team.",
    "From Kolkata and Delhi to Mumbai, Bangalore, Pune and Hyderabad, the process stays the same: a free audit or consultation, one fixed quote, then a site engineered to rank in Google India.",
  ],
  regionAreas: ["Kolkata", "Delhi NCR", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Ecommerce", "SaaS & Startups", "Agritech", "Manufacturing", "Healthcare", "Education"],
  processEyebrow: "The Process",
  processTitle: "From brief to launch in four steps",
  steps: [
    { n: "01", title: "Free consultation", desc: "Share your goals and current site (if any). Get a free audit or a straight answer within a day." },
    { n: "02", title: "Fixed-scope proposal", desc: "One clear quote covering design, development and SEO. No hourly surprises." },
    { n: "03", title: "Build & review", desc: "Regular preview links as the site is built, with your feedback folded in at every stage." },
    { n: "04", title: "Launch & support", desc: "Go live with analytics, schema and Core Web Vitals in place, plus ongoing support after launch." },
  ],
  ctaTitle: "Ready to build a website that ranks across India?",
  ctaSubtitle: "India, Direct to the Developer",
  faqs: [
    {
      q: "How much does a website developer in India charge?",
      a: "Pricing depends on scope: a brochure site, an ecommerce store and a custom web app all cost differently. You'll get one fixed, transparent quote after a free consultation, with no hourly surprises.",
    },
    {
      q: "Do you work with startups as well as established businesses?",
      a: "Yes, from early-stage Indian startups needing an MVP or landing page, to established manufacturers and retailers needing a full ecommerce rebuild.",
    },
    {
      q: "What makes you different from a typical web development company in India?",
      a: "Direct access to the developer, a modern Next.js/React stack instead of page-builder templates, and technical SEO built in from day one rather than sold as an add-on.",
    },
    {
      q: "Can you help an existing website rank better in India?",
      a: "Yes, start with a free website & SEO audit, which flags exactly what's holding your current site back before any redesign work begins.",
    },
    {
      q: "Which industries have you built websites for?",
      a: "Ecommerce and marketplaces, agritech, SaaS platforms, HVAC and home services, and fashion/retail brands, among others.",
    },
  ],
  formHeading: "Get your free India project quote",
  formSubheading: "Tell me about your business and I'll reply within 24 hours with a clear, no-obligation plan.",
};

export default function IndiaContent() {
  return <LocationLandingContent config={config} />;
}

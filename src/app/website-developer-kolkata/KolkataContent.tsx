"use client";

import { Code2, ShoppingCart, Search, Smartphone, Layers, Rocket } from "lucide-react";
import LocationLandingContent from "@/components/landing/LocationLandingContent";
import type { LandingConfig } from "@/components/landing/types";

const config: LandingConfig = {
  slug: "website-developer-kolkata",
  market: "Kolkata",
  eyebrow: "Website Developer in Kolkata",
  h1Pre: "The website developer in",
  h1Accent: "Kolkata",
  h1Post: "your business actually needs.",
  subhead:
    "Fast, animated, SEO-ready websites built and supported locally in Kolkata and West Bengal: Next.js, Three.js, Shopify and WordPress, with technical SEO built in from day one, not bolted on later.",
  heroChips: ["Next.js", "Three.js", "Shopify", "WordPress", "Technical SEO"],
  trustLine: "Website Developer Based in Kolkata, West Bengal",
  heroImages: [
    { src: "/projects/puribazar.png", alt: "Puribazar ecommerce marketplace, a live Kolkata-area web project" },
    { src: "/projects/hamarakhet.png", alt: "Hamara Khet agritech platform, a live Next.js project" },
  ],
  nicheSpotlight: {
    eyebrow: "SEO Expert in Kolkata",
    title: "Also the SEO expert Kolkata businesses call first",
    paragraph:
      "Most website designer in Kolkata shops treat SEO as an afterthought. Here, every site ships with on-page, technical and local SEO already built in, and the free audit used to scope every project doubles as a standalone service for businesses that just need an SEO expert in Kolkata, not a full rebuild.",
    bullets: [
      "Free technical and local SEO audit before any commitment",
      "Schema markup, Core Web Vitals and Kolkata-specific keyword targeting",
      "Works on existing WordPress, Webflow or Shopify sites, no rebuild required",
    ],
    image: { src: "/projects/monalisamandal.png", alt: "Monalisa Mandal portfolio site, an SEO-optimised WordPress project in Kolkata" },
  },
  stats: [
    { to: 11, suffix: "+", label: "Projects Shipped" },
    { to: 4, suffix: "", label: "Countries Served" },
    { to: 24, suffix: "h", label: "Reply Time" },
    { to: 100, suffix: "%", label: "Direct Communication" },
  ],
  servicesEyebrow: "Services in Kolkata",
  servicesTitle: "Everything a growing Kolkata business needs online",
  servicesIntro:
    "From a first business website to a full ecommerce rebuild, one developer, one point of contact, every project engineered for Google from the first line of code.",
  services: [
    {
      icon: Code2,
      title: "Custom Website Development",
      desc: "Animated, high-performance websites built with Next.js and React, faster and more distinctive than the template-based sites most Kolkata web design shops ship.",
    },
    {
      icon: ShoppingCart,
      title: "Ecommerce Website Development",
      desc: "Shopify and WooCommerce stores built to convert, with the same technical SEO care as everything else. A genuine ecommerce website developer in Kolkata, not a template reseller.",
    },
    {
      icon: Search,
      title: "SEO for Kolkata Businesses",
      desc: "On-page, technical and local SEO handled by the same person who builds the site: schema markup, Core Web Vitals and Kolkata-specific keyword targeting from launch.",
    },
    {
      icon: Smartphone,
      title: "Mobile-First & App-Ready",
      desc: "Every site is built mobile-first and can extend into a React Native app when you're ready to go beyond the browser.",
    },
    {
      icon: Layers,
      title: "WordPress & Webflow",
      desc: "Already on WordPress or Webflow? I audit, redesign and maintain existing sites without an unnecessary rebuild from scratch.",
    },
    {
      icon: Rocket,
      title: "Website Speed & SEO Audits",
      desc: "Free technical audits that flag exactly why a site isn't ranking or converting, the same checklist used before any Kolkata project kicks off.",
    },
  ],
  whyEyebrow: "Why Snigdha, Not a Kolkata Web Design Agency",
  whyTitle: "One developer, zero agency markup",
  whyIntro:
    "Most \"web design company in Kolkata\" listings route your project through account managers and junior coders. Here, the person who quotes the project is the person who builds it.",
  comparisonRows: [
    { label: "Who builds your site", us: "The developer you talk to, directly", typical: "Handed off to a junior team you never meet" },
    { label: "Tech stack", us: "Modern Next.js / React, animated and fast", typical: "Generic drag-and-drop templates" },
    { label: "SEO", us: "Built in from day one, by the same developer", typical: "Sold as a separate add-on service" },
    { label: "Pricing", us: "One fixed quote after a free consultation", typical: "Vague packages with hidden extras" },
    { label: "Turnaround", us: "Direct WhatsApp and email, no ticket queue", typical: "Support tickets routed through account managers" },
  ],
  portfolioEyebrow: "Recent Work",
  portfolioTitle: "Real websites, not a stock template gallery",
  portfolioIntro:
    "A sample of live projects across ecommerce, agritech and personal brands, the kind of build a Kolkata business can expect.",
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
  regionEyebrow: "Local & Remote",
  regionTitle: "Based in Kolkata, serving all of West Bengal",
  regionParagraphs: [
    "Working with a Kolkata-based developer means no time-zone friction, no confusing overseas contracts, and a phone number that's genuinely local. Video calls, WhatsApp or in person, whatever's easiest for you.",
    "Whether you're a Park Street retailer, a Salt Lake IT company, a Howrah manufacturer or a New Town startup, the process is the same: a free audit or consultation first, a fixed quote, then a site built to rank.",
  ],
  regionAreas: ["Salt Lake", "Park Street", "New Town", "Howrah", "Behala", "Garia", "South 24 Parganas", "Ecommerce", "SaaS", "Corporate", "Healthcare", "Real Estate"],
  processEyebrow: "The Process",
  processTitle: "From brief to launch in four steps",
  steps: [
    { n: "01", title: "Free consultation", desc: "Share your goals and current site (if any). Get a free audit or a straight answer within a day." },
    { n: "02", title: "Fixed-scope proposal", desc: "One clear quote covering design, development and SEO. No hourly surprises." },
    { n: "03", title: "Build & review", desc: "Regular preview links as the site is built, with your feedback folded in at every stage." },
    { n: "04", title: "Launch & support", desc: "Go live with analytics, schema and Core Web Vitals in place, plus ongoing support after launch." },
  ],
  ctaTitle: "Ready to build a website that actually ranks?",
  ctaSubtitle: "Kolkata, Direct to the Developer",
  faqs: [
    {
      q: "How much does a website developer in Kolkata charge?",
      a: "Pricing depends on scope: a brochure site, an ecommerce store and a custom web app all cost differently. You'll get one fixed, transparent quote after a free consultation, with no hourly surprises.",
    },
    {
      q: "Do you only build websites for Kolkata businesses?",
      a: "Kolkata and West Bengal are the local base, but most projects are for clients across India, the US and the UK. The same process and communication apply either way.",
    },
    {
      q: "What's the difference between hiring you and a Kolkata web design company?",
      a: "You deal directly with the developer building your site, no account managers, no junior handoffs, and get technical SEO built in from day one instead of sold as an add-on.",
    },
    {
      q: "Can you redesign my existing WordPress or Webflow site?",
      a: "Yes. Many projects start as an audit of an existing site, flagging what's broken or holding back rankings, followed by a redesign or targeted fixes rather than a full rebuild.",
    },
    {
      q: "How long does a typical website project take?",
      a: "A brochure or portfolio site usually launches in 2 to 3 weeks; ecommerce stores and custom web apps take longer depending on scope. You'll get a realistic timeline in the proposal.",
    },
    {
      q: "I just need an SEO expert in Kolkata, not a new website. Do you help with that?",
      a: "Yes. The free technical and local SEO audit is a standalone starting point for businesses that already have a site and just need schema markup, Core Web Vitals and Kolkata-specific keyword work done properly.",
    },
    {
      q: "How is this different from a website designer in Kolkata who only does design?",
      a: "A website designer without a development or SEO background can make a site look good but not necessarily rank or convert. Here, design, development and technical SEO come from the same person, so nothing gets lost between a designer, a developer and an SEO freelancer.",
    },
  ],
  formHeading: "Get your free Kolkata web project quote",
  formSubheading: "Tell me about your business and I'll reply within 24 hours with a clear, no-obligation plan.",
};

export default function KolkataContent() {
  return <LocationLandingContent config={config} />;
}

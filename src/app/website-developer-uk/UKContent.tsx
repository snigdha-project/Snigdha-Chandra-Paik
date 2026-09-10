"use client";

import { Code2, ShoppingCart, Search, Layers, Smartphone, Rocket } from "lucide-react";
import LocationLandingContent from "@/components/landing/LocationLandingContent";
import type { LandingConfig } from "@/components/landing/types";

const config: LandingConfig = {
  slug: "website-developer-uk",
  market: "the UK",
  eyebrow: "Web Development Company for UK Businesses",
  h1Pre: "A web development company for",
  h1Accent: "UK businesses",
  h1Post: "built remotely, delivered on time.",
  subhead:
    "A one-person web development company offering fast, animated Next.js and Shopify websites for UK businesses, built remotely from India on a night-owl schedule that means same-day replies during UK working hours, with technical SEO handled in-house.",
  heroChips: ["Next.js", "Shopify Developer", "WooCommerce", "Technical SEO", "Same-Day UK Replies"],
  trustLine: "Web Development Company Serving UK Businesses, Remotely",
  heroImages: [
    { src: "/projects/HOA.png", alt: "The House of Abigail, a live Shopify store for a UK interior design brand" },
    { src: "/projects/britishco.png", alt: "The British Stripe Co., a live Shopify store for a UK fashion brand" },
  ],
  nicheSpotlight: {
    eyebrow: "Shopify Developer, UK",
    title: "The Shopify developer UK fashion and interiors brands already trust",
    paragraph:
      "Generic Shopify agencies reuse the same three themes. Here, every UK Shopify build is custom-coded with Tailwind CSS, starting from two live stores already trading: The House of Abigail and The British Stripe Co. If you need a Shopify website design that doesn't look like every other store on the platform, this is the specialism.",
    bullets: [
      "Two live UK Shopify stores already trading, not mockups",
      "Tailwind CSS custom builds, not templated themes",
      "Product, collection and checkout structure built for UK ecommerce SEO",
    ],
    image: { src: "/projects/britishco.png", alt: "The British Stripe Co., a custom Tailwind CSS Shopify build for a UK fashion brand" },
  },
  stats: [
    { to: 11, suffix: "+", label: "Projects Shipped" },
    { to: 4, suffix: "", label: "Countries Served" },
    { to: 24, suffix: "h", label: "UK Reply Time" },
    { to: 100, suffix: "%", label: "Direct Communication" },
  ],
  servicesEyebrow: "Services for UK Businesses",
  servicesTitle: "A full web team, without the UK agency day rate",
  servicesIntro:
    "Next.js development, Shopify builds and technical SEO, delivered remotely at a fraction of a typical UK web design agency's day rate, without cutting corners on quality.",
  services: [
    {
      icon: Code2,
      title: "Custom Next.js Websites",
      desc: "Animated, high-performance websites built with Next.js and Framer Motion, a step up from the templated sites most UK web design agencies ship at this price point.",
    },
    {
      icon: ShoppingCart,
      title: "Shopify & Ecommerce Development",
      desc: "Shopify stores built for UK fashion, interiors and retail brands, including the Tailwind CSS-driven builds already live for The House of Abigail and The British Stripe Co.",
    },
    {
      icon: Search,
      title: "Technical SEO for UK Search",
      desc: "Schema markup, Core Web Vitals and UK-specific keyword strategy, handled by the same developer who writes the code, not outsourced to a separate SEO team.",
    },
    {
      icon: Layers,
      title: "WordPress & Webflow",
      desc: "Redesigns, audits and ongoing maintenance for existing WordPress or Webflow sites, no unnecessary full rebuilds.",
    },
    {
      icon: Smartphone,
      title: "React Native Apps",
      desc: "Extend a UK web platform into a mobile app with React Native when you're ready to go beyond the browser.",
    },
    {
      icon: Rocket,
      title: "Free Website & SEO Audit",
      desc: "A prioritised, hand-reviewed audit of your current site before you commit to anything, delivered within 48 hours.",
    },
  ],
  whyEyebrow: "Why UK Businesses Choose to Go Remote",
  whyTitle: "UK-quality delivery, without the UK day rate",
  whyIntro:
    "A London web design agency's overheads get passed on to you. Working directly with an independent developer cuts that out, without cutting corners on the finished site.",
  comparisonRows: [
    { label: "Availability", us: "Night-owl IST schedule, same-day replies in UK hours", typical: "9-to-5 UK office hours only" },
    { label: "Who builds your site", us: "The developer you talk to, directly", typical: "Account manager, then a delivery team" },
    { label: "Tech stack", us: "Modern Next.js / React, animated and fast", typical: "Agency page-builder templates" },
    { label: "Pricing", us: "One fixed quote, no day-rate billing", typical: "Day-rate billing, scope creep" },
    { label: "Proof of work", us: "Live UK client sites: The House of Abigail, The British Stripe Co.", typical: "Case studies behind a 'request access' form" },
  ],
  portfolioEyebrow: "Live UK Client Work",
  portfolioTitle: "Shopify builds already live for UK brands",
  portfolioIntro: "Real, working storefronts for UK fashion and interiors brands, not mockups.",
  portfolio: [
    {
      title: "The House of Abigail",
      category: "E-Commerce / Interior Design",
      description: "A premium Shopify interior design ecosystem specialising in Modern British Heritage, with Tailwind CSS and custom inventory management.",
      tech: ["Shopify", "Tailwind CSS"],
      image: "/projects/HOA.png",
      link: "https://thehouseofabigail.uk/",
    },
    {
      title: "The British Stripe Co.",
      category: "E-Commerce / Fashion",
      description: "A high-conversion clothing brand storefront for UK fashion, blending British heritage style with modern Shopify performance.",
      tech: ["Shopify", "Tailwind CSS"],
      image: "/projects/britishco.png",
      link: "https://thebritishstripeco.com/",
    },
  ],
  regionEyebrow: "Remote-First, UK Hours",
  regionTitle: "Built in India, delivered on UK time",
  regionParagraphs: [
    "Working remotely doesn't mean working out of sync. Development happens on a night-owl IST schedule specifically so UK clients get same-day replies and overlapping working hours for calls.",
    "From London fashion and interiors brands to regional service businesses, the process is identical: a free audit or consultation, one fixed quote in GBP or USD, then a site built to rank on Google.co.uk.",
  ],
  regionAreas: ["London", "Manchester", "Birmingham", "Fashion & Retail", "Interiors", "Ecommerce", "Professional Services", "Startups"],
  processEyebrow: "The Process",
  processTitle: "From brief to launch, on UK time",
  steps: [
    { n: "01", title: "Free consultation", desc: "Share your goals over a call or email, scheduled to overlap with UK working hours." },
    { n: "02", title: "Fixed-scope proposal", desc: "One clear quote in GBP or USD covering design, development and SEO. No day-rate billing." },
    { n: "03", title: "Build & review", desc: "Regular preview links with same-day replies during UK hours as feedback comes in." },
    { n: "04", title: "Launch & support", desc: "Go live with analytics, schema and Core Web Vitals in place, plus ongoing support after launch." },
  ],
  ctaTitle: "Ready to brief a UK web project?",
  ctaSubtitle: "United Kingdom, Remote, On UK Hours",
  faqs: [
    {
      q: "Do you work UK hours if you're based in India?",
      a: "Yes, development runs on a night-owl IST schedule specifically to overlap with UK working hours, so most enquiries get a same-day reply.",
    },
    {
      q: "How much does a website developer cost for a UK business?",
      a: "It depends on scope, but working directly with an independent developer is typically more cost-effective than a UK agency's day rate. You'll get one fixed quote after a free consultation.",
    },
    {
      q: "Can you quote in GBP?",
      a: "Yes, quotes can be given in GBP or USD, whichever is easier for your accounts team.",
    },
    {
      q: "Have you built for UK brands before?",
      a: "Yes, including The House of Abigail and The British Stripe Co., both live Shopify stores for UK fashion and interiors brands.",
    },
    {
      q: "What if I already have a UK web design agency and I'm not happy with them?",
      a: "A free audit is the easiest starting point. It flags exactly what's underperforming, whether that's speed, SEO or conversion, before you decide on a rebuild.",
    },
    {
      q: "Are you a web development company or a freelance developer?",
      a: "Both, in the sense that matters. It's a one-person web development studio, not a large agency: you get the same fixed-quote, professionally managed process, but every line of code and every SEO decision comes from the person you're actually talking to.",
    },
    {
      q: "Do you build Shopify stores specifically for UK fashion and interiors brands?",
      a: "Yes, that's a specific focus. The House of Abigail and The British Stripe Co. are both live, custom-coded Shopify builds for UK fashion and interiors brands, not templated themes.",
    },
  ],
  formHeading: "Get your free UK project quote",
  formSubheading: "Tell me about your business and I'll reply within 24 hours, usually the same UK working day.",
};

export default function UKContent() {
  return <LocationLandingContent config={config} />;
}

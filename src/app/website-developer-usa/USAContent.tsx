"use client";

import { Code2, Rocket, Search, ShoppingCart, Layers, ShieldCheck } from "lucide-react";
import LocationLandingContent from "@/components/landing/LocationLandingContent";
import type { LandingConfig } from "@/components/landing/types";

const config: LandingConfig = {
  slug: "website-developer-usa",
  market: "the USA",
  eyebrow: "Web Development Company for US Businesses",
  h1Pre: "A web development company for",
  h1Accent: "US businesses",
  h1Post: "built remotely, delivered on time.",
  subhead:
    "A one-person web development company offering fast, animated Next.js, Shopify and Webflow websites for US businesses, built remotely from India on a schedule built around US time zones, with technical SEO handled by the same person who writes the code.",
  heroChips: ["Next.js", "HVAC Web Design", "Shopify", "Webflow", "US Time-Zone Overlap"],
  trustLine: "Web Development Company Serving US Businesses, Remotely",
  heroImages: [
    { src: "/projects/daikin.png", alt: "Daikin TMI, a live Webflow website for a US HVAC company" },
    { src: "/projects/countryside.png", alt: "Countryside Sewer & Septic, a live Webflow website for a US plumbing company" },
  ],
  nicheSpotlight: {
    eyebrow: "HVAC Web Design",
    title: "HVAC web design that turns an emergency search into a call",
    paragraph:
      "Generic web design agencies treat an HVAC website like any other brochure site. It isn't: someone searching \"hvac web design\" or \"hvac website design company\" is usually trying to solve their own customer's problem, an emergency call, financing, service area coverage, fast. Four live HVAC and home-service sites are already built and running on that logic, not just design polish.",
    bullets: [
      "Four live HVAC and home-service client sites: Daikin TMI, AMJ Mechanical, Unlimited Heating & Refrigeration, Countryside Sewer & Septic",
      "Built for emergency-call, financing and service-area search intent, not just brand pages",
      "LocalBusiness and service-area schema markup from launch",
    ],
    image: { src: "/projects/daikin.png", alt: "Daikin TMI, a live HVAC web design project with Webflow and custom code" },
  },
  stats: [
    { to: 11, suffix: "+", label: "Projects Shipped" },
    { to: 4, suffix: "", label: "Countries Served" },
    { to: 24, suffix: "h", label: "Reply Time" },
    { to: 100, suffix: "%", label: "Direct Communication" },
  ],
  servicesEyebrow: "Services for US Businesses",
  servicesTitle: "Full-stack web development without the agency overhead",
  servicesIntro:
    "From HVAC and home-service companies to SaaS platforms, websites built to rank and convert, delivered at a fraction of a typical US web development agency's cost.",
  services: [
    {
      icon: Code2,
      title: "Custom Next.js Websites",
      desc: "Animated, high-performance websites built with Next.js and Framer Motion, engineered for Core Web Vitals, not just visual polish.",
    },
    {
      icon: Rocket,
      title: "Home-Service & HVAC Websites",
      desc: "Websites for HVAC, plumbing and mechanical service companies, already live for Daikin TMI, AMJ Mechanical, Unlimited Heating & Refrigeration and Countryside Sewer & Septic.",
    },
    {
      icon: Search,
      title: "Technical & Local SEO",
      desc: "Schema markup, Core Web Vitals and local SEO for US search intent, handled by the same developer who builds the site.",
    },
    {
      icon: ShoppingCart,
      title: "Shopify & WooCommerce",
      desc: "Ecommerce builds for US retail and DTC brands, styled and optimised for conversion, not just checkout functionality.",
    },
    {
      icon: Layers,
      title: "Webflow Development",
      desc: "Custom code inside Webflow for teams that want a marketing-friendly CMS without sacrificing design or performance.",
    },
    {
      icon: ShieldCheck,
      title: "Free Website & SEO Audit",
      desc: "A prioritised, hand-reviewed audit of your current site before you commit to anything, delivered within 48 hours.",
    },
  ],
  whyEyebrow: "Why US Businesses Go Remote",
  whyTitle: "US-quality delivery, without the US agency overhead",
  whyIntro:
    "US web development agencies carry office overhead that gets billed to your project. An independent developer working remotely cuts that cost without cutting the finished quality.",
  comparisonRows: [
    { label: "Availability", us: "Schedule built around US time zones", typical: "Standard 9-to-5 office hours only" },
    { label: "Who builds your site", us: "The developer you talk to, directly", typical: "Account manager, then an offshore team anyway" },
    { label: "Tech stack", us: "Modern Next.js / React, animated and fast", typical: "Templated builder sites" },
    { label: "Pricing", us: "One fixed quote, no hourly billing surprises", typical: "Hourly billing, scope creep" },
    { label: "Proof of work", us: "Live US client sites you can visit today", typical: "Stock case studies or 'coming soon' portfolios" },
  ],
  portfolioEyebrow: "Live US Client Work",
  portfolioTitle: "Real websites for US service businesses",
  portfolioIntro: "HVAC, mechanical and home-service companies already live and generating leads.",
  portfolio: [
    {
      title: "Daikin TMI",
      category: "HVAC / Corporate",
      description: "Professional digital solutions for a global HVAC leader, integrating Splide.js and custom code for a seamless technical experience.",
      tech: ["Webflow", "Splide.js", "SEO Audit"],
      image: "/projects/daikin.png",
      link: "https://www.daikin-tmi.com/",
    },
    {
      title: "AMJ Mechanical",
      category: "SaaS / Automation",
      description: "A high-performance platform built with Webflow, featuring a clean interface and optimised SEO architecture for maximum visibility.",
      tech: ["Webflow", "SEO", "UI/UX"],
      image: "/projects/AMJ.png",
      link: "https://www.amaginationtechnology.ai/",
    },
    {
      title: "Unlimited Heating & Refrigeration",
      category: "HVAC / Service",
      description: "Scalable HVAC website architecture focusing on content auditing and interactive elements for an industry-leading service provider.",
      tech: ["Webflow", "Splide.js", "Content Audit"],
      image: "/projects/unlimitedhp.png",
      link: "https://www.unlimitedhp.com/",
    },
    {
      title: "Countryside Sewer & Septic",
      category: "Plumbing / Service",
      description: "A strategic web presence for plumbing specialists, using Webflow and content audits to drive local lead generation.",
      tech: ["Webflow", "Splide.js", "SEO Audit"],
      image: "/projects/countryside.png",
      link: "https://countrysidesewerandseptic.com/",
    },
  ],
  regionEyebrow: "Remote-First, US Hours",
  regionTitle: "Built in India, delivered on US time",
  regionParagraphs: [
    "Distance doesn't mean delay. Work is scheduled around US time zones so calls and revisions overlap with your working day, not just late-night emails.",
    "From Texas HVAC and mechanical service companies to SaaS platforms, the process is identical: a free audit or consultation, one fixed quote in USD, then a site engineered to rank in Google.",
  ],
  regionAreas: ["HVAC & Mechanical", "Home Services", "SaaS & Automation", "Ecommerce & DTC", "Texas", "Nationwide Remote"],
  processEyebrow: "The Process",
  processTitle: "From brief to launch, on US time",
  steps: [
    { n: "01", title: "Free consultation", desc: "Share your goals over a call or email, scheduled to overlap with US working hours." },
    { n: "02", title: "Fixed-scope proposal", desc: "One clear quote in USD covering design, development and SEO. No hourly billing." },
    { n: "03", title: "Build & review", desc: "Regular preview links as the site is built, with feedback turned around fast." },
    { n: "04", title: "Launch & support", desc: "Go live with analytics, schema and Core Web Vitals in place, plus ongoing support after launch." },
  ],
  ctaTitle: "Ready to brief a US web project?",
  ctaSubtitle: "United States, Remote, On US Hours",
  faqs: [
    {
      q: "Do you work US hours if you're based in India?",
      a: "Yes, the schedule is built around US time zones specifically so calls and revisions overlap with your working day.",
    },
    {
      q: "How much does a website developer cost for a US business?",
      a: "It depends on scope, but working directly with an independent developer is typically more cost-effective than a US agency's overhead. You'll get one fixed quote in USD after a free consultation.",
    },
    {
      q: "Do you have experience with US home-service businesses?",
      a: "Yes, HVAC, mechanical and sewer/septic service companies including Daikin TMI, AMJ Mechanical, Unlimited Heating & Refrigeration and Countryside Sewer & Septic are all live client sites.",
    },
    {
      q: "Can you handle a full ecommerce or SaaS build, not just a brochure site?",
      a: "Yes, recent projects range from Shopify DTC storefronts to a Next.js AI-driven marketplace platform.",
    },
    {
      q: "What if I already have a US web design agency and I'm not happy with them?",
      a: "A free audit is the easiest starting point. It flags exactly what's underperforming, whether that's speed, SEO or conversion, before you decide on a rebuild.",
    },
    {
      q: "Do you specialise in HVAC website design, or just build any kind of site?",
      a: "HVAC and home-service websites are a specific focus, not a one-off. Four live client sites (Daikin TMI, AMJ Mechanical, Unlimited Heating & Refrigeration, Countryside Sewer & Septic) are built around the searches homeowners actually use: emergency service, financing and service-area coverage.",
    },
    {
      q: "How much does HVAC website design cost?",
      a: "It depends on scope, but expect a meaningfully lower cost than an HVAC-specialist marketing agency for a comparable, custom-built (not templated) site. You'll get one fixed quote in USD after a free consultation.",
    },
  ],
  formHeading: "Get your free US project quote",
  formSubheading: "Tell me about your business and I'll reply within 24 hours, scheduled to overlap with US working hours.",
};

export default function USAContent() {
  return <LocationLandingContent config={config} />;
}

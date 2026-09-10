import type { LucideIcon } from "lucide-react";

export type LandingFaq = { q: string; a: string };

export type LandingService = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export type LandingProject = {
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
};

export type ComparisonRow = {
  label: string;
  us: string;
  typical: string;
};

export type LandingConfig = {
  slug: string;
  /** Short market label used in copy, e.g. "Kolkata", "India", "the UK", "the USA" */
  market: string;
  eyebrow: string;
  h1Pre: string;
  h1Accent: string;
  h1Post?: string;
  subhead: string;
  heroChips: string[];
  trustLine: string;
  /** Two real project screenshots that float beside the hero copy on desktop. */
  heroImages: { src: string; alt: string }[];
  /** A focused sub-niche this market can realistically rank for (lower competition, backed by real proof). */
  nicheSpotlight: {
    eyebrow: string;
    title: string;
    paragraph: string;
    bullets: string[];
    image: { src: string; alt: string };
  };
  stats: { to: number; suffix: string; label: string }[];
  servicesEyebrow: string;
  servicesTitle: string;
  servicesIntro: string;
  services: LandingService[];
  whyEyebrow: string;
  whyTitle: string;
  whyIntro: string;
  comparisonRows: ComparisonRow[];
  portfolioEyebrow: string;
  portfolioTitle: string;
  portfolioIntro: string;
  portfolio: LandingProject[];
  regionEyebrow: string;
  regionTitle: string;
  regionParagraphs: string[];
  regionAreas: string[];
  processEyebrow: string;
  processTitle: string;
  steps: { n: string; title: string; desc: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
  faqs: LandingFaq[];
  formHeading: string;
  formSubheading: string;
};

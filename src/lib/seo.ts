import type { Project } from "./projectService";

export const SITE_URL = "https://snigdhachandrapaik.vercel.app";
export const SITE_NAME = "Snigdha Chandra Paik";
export const SITE_LOCALE = "en_IN";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BUSINESS_ID = `${SITE_URL}/#business`;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Snigdha Chandra Paik",
  givenName: "Snigdha",
  familyName: "Paik",
  additionalName: "Chandra",
  description:
    "Snigdha Chandra Paik is a frontend developer and SEO specialist from West Bengal, India, specialising in animated Next.js, Three.js and React Native web applications with strong technical SEO. He builds fast, search-optimised, conversion-focused websites for clients worldwide.",
  url: SITE_URL,
  image: [
    `${SITE_URL}/images/myImage.jpg`,
    `${SITE_URL}/images/MyAboutImage.jpg`,
  ],
  jobTitle: "Frontend Developer · SEO Specialist · Creative Engineer",
  gender: "Male",
  nationality: "Indian",
  email: "mailto:snigdhachandrapaik@gmail.com",
  telephone: "+91-8391879168",
  address: {
    "@type": "PostalAddress",
    addressLocality: "South 24 Parganas",
    addressRegion: "West Bengal",
    postalCode: "743395",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Frontend Development",
    "Next.js",
    "React Native",
    "Three.js",
    "Framer Motion",
    "Animated Websites",
    "Web App Development",
    "Search Engine Optimisation",
    "Technical SEO",
    "Schema Markup",
    "Python",
    "Automation",
    "N8N Workflow Automation",
    "Prompt Engineering",
    "Webflow Development",
    "Shopify Development",
    "WooCommerce",
    "WordPress",
    "Spline 3D",
    "JavaScript",
    "TypeScript",
    "Figma to Code",
  ],
  sameAs: [
    "https://www.facebook.com/snigdha.chandra.paik",
    "https://www.instagram.com/snigdha_chandra_paik/",
    "https://github.com/snigdha-project",
    "https://wa.me/918391879168",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": PERSON_ID },
  inLanguage: "en-IN",
};

export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": BUSINESS_ID,
  name: "Snigdha Chandra Paik — Frontend Developer & SEO Studio",
  description:
    "Frontend development and technical SEO studio led by Snigdha Chandra Paik — animated Next.js and Three.js websites, React Native apps, Python/N8N automation, and search optimisation for clients in India, the US, the UK and worldwide.",
  image: `${SITE_URL}/images/myImage.jpg`,
  url: SITE_URL,
  telephone: "+91-8391879168",
  priceRange: "$$",
  founder: { "@id": PERSON_ID },
  address: {
    "@type": "PostalAddress",
    addressLocality: "South 24 Parganas",
    addressRegion: "West Bengal",
    postalCode: "743395",
    addressCountry: "IN",
  },
  areaServed: ["IN", "US", "GB", "AE", "Worldwide"],
  serviceType: [
    "Frontend Development",
    "Next.js Development",
    "Animated Website Development",
    "Three.js / 3D Web Development",
    "Framer Motion Animation",
    "React Native App Development",
    "Technical SEO",
    "Python Automation & N8N Workflows",
    "Webflow Development",
    "Shopify & WooCommerce Development",
  ],
};

export function breadcrumbSchema(
  trail: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}

export const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE_URL}/about`,
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/MyAboutImage.jpg`,
    caption: "Snigdha Chandra Paik — Frontend Developer & SEO Specialist",
  },
  mainEntity: { "@id": PERSON_ID },
};

export const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${SITE_URL}/contact`,
  name: "Contact Snigdha Chandra Paik",
  mainEntity: { "@id": PERSON_ID },
};

export function projectsCollectionSchema(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/projects#collection`,
    url: `${SITE_URL}/projects`,
    name: "Frontend Projects | Snigdha Chandra Paik",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.title,
          url: project.hasCaseStudy
            ? `${SITE_URL}/projects/${project.slug}`
            : project.link ?? `${SITE_URL}/projects`,
          image: project.image,
          description: project.description,
          keywords: project.tech.join(", "),
          creator: { "@id": PERSON_ID },
        },
      })),
    },
  };
}

export function blogCollectionSchema(
  posts: {
    slug: string;
    title: string;
    metaTitle?: string;
    metaDescription?: string;
    excerpt: string;
    date: string;
    image: string;
  }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blogs#blog`,
    url: `${SITE_URL}/blogs`,
    name: "Frontend & SEO Blog | Snigdha Chandra Paik",
    inLanguage: "en-IN",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      name: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      image: post.image,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@id": PERSON_ID },
      mainEntityOfPage: `${SITE_URL}/blogs/${post.slug}`,
    })),
  };
}

export function blogPostingSchema(post: {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  category?: string;
  excerpt: string;
  date: string;
  image: string;
  content: string;
}) {
  const wordCount = post.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    name: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    wordCount,
    inLanguage: "en-IN",
    // GEO: a free, openly-readable article is a strong "safe to cite" signal for
    // generative engines; articleSection gives them the topic at a glance.
    isAccessibleForFree: true,
    ...(post.category ? { articleSection: post.category } : {}),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    mainEntityOfPage: `${SITE_URL}/blogs/${post.slug}`,
  };
}

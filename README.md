<div align="center">
  <img src="public/OG/homeOG.png" alt="Snigdha Chandra Paik — Frontend Developer & SEO Specialist" width="100%" />

  <h1>Snigdha Chandra Paik</h1>

  <p>
    <strong>Frontend Developer · SEO Specialist · Creative Engineer</strong><br/>
    Animated Next.js, Three.js & React Native portfolio engineered for Core Web Vitals and search visibility.
  </p>

  <p>
    <a href="https://snigdhachandrapaik.vercel.app">Live site</a>
    &nbsp;·&nbsp;
    <a href="https://snigdhachandrapaik.vercel.app/projects">Projects</a>
    &nbsp;·&nbsp;
    <a href="https://snigdhachandrapaik.vercel.app/blogs">Journal</a>
    &nbsp;·&nbsp;
    <a href="https://snigdhachandrapaik.vercel.app/contact">Contact</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 16.2" />
    <img src="https://img.shields.io/badge/React-19.2-149ECA?style=flat-square&logo=react&logoColor=white" alt="React 19.2" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind 4" />
    <img src="https://img.shields.io/badge/Three.js-r183-000000?style=flat-square&logo=three.js&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/Framer%20Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  </p>
</div>

---

## Overview

The personal portfolio of **Snigdha Chandra Paik** — a solo frontend and SEO developer from South 24 Parganas, West Bengal. Built as a flagship of the same craft offered to clients: animated, fast, semantically structured, and built to rank.

Shipped client work includes Daikin TMI, AMJ Mechanical, The House of Abigail, The British Stripe Co. and Puribazar — the projects gallery is the canonical source of truth.

## Preview

<table>
  <tr>
    <td align="center" width="50%">
      <img src="public/OG/homeOG.png" alt="Home page" width="100%" /><br/>
      <sub><b>Home</b> — animated hero, magnetic cursor, gas-glow lighting</sub>
    </td>
    <td align="center" width="50%">
      <img src="public/OG/aboutOG.png" alt="About page" width="100%" /><br/>
      <sub><b>About</b> — fluid particle simulation on canvas</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="public/OG/projectsOG.png" alt="Projects page" width="100%" /><br/>
      <sub><b>Projects</b> — 11 case studies, image-on-top cards</sub>
    </td>
    <td align="center" width="50%">
      <img src="public/OG/blogsOG.png" alt="Blogs page" width="100%" /><br/>
      <sub><b>Journal</b> — newspaper-edition blog layout</sub>
    </td>
  </tr>
</table>

## Features

- **Universal animated loader** — split-curtain reveal on cold load (2.2s) and route transitions (0.9s)
- **Magnetic hero card** with mouse-tracking parallax and gas-glow lighting
- **Fluid particle simulation** on the About page (canvas-based, 60fps)
- **Newspaper-edition** blog index with intersection-observer infinite scroll
- **Magazine-grade project cards** with floating category chips and full tech stack on each card
- **Magnetic contact button** with spring-based pull strength
- **Smooth-scroll** powered by Lenis
- **Type-safe** end-to-end with TypeScript and Next.js 16's typed routes

## SEO architecture

This is the same structural SEO offered to clients, applied to the portfolio itself.

| Layer | What ships |
|---|---|
| **Meta** | Per-page `title` (30–50 chars) + `description` (120–150 chars), `metadataBase`, `alternates.canonical`, `hreflang: en-IN` |
| **Open Graph / Twitter** | 1200×630 OG images per route, `summary_large_image` Twitter cards, fallback to portrait headshots |
| **Robots** | `index, follow` with `max-image-preview: large`, `max-snippet: -1`; Google Search Console verification token preserved |
| **JSON-LD** | `Person`, `WebSite`, `ProfessionalService` (root layout); `BreadcrumbList`, `AboutPage`, `ContactPage`, `CollectionPage → ItemList`, `Blog → BlogPosting`, `FAQPage` (per route) |
| **Sitemap** | `app/sitemap.ts` emits static routes + dynamic blog slugs with `changeFrequency` and `priority` |
| **Robots.txt** | `app/robots.ts` with explicit `disallow: /api/, /admin/` |
| **Headings** | Exactly one `<h1>` per page, semantic `<article>` and `<ul>` markup on project cards |

All schemas validate against [validator.schema.org](https://validator.schema.org/) and Google's [Rich Results Test](https://search.google.com/test/rich-results).

## Tech stack

**Framework** — Next.js 16.2 (App Router, Turbopack, React Compiler), React 19.2, TypeScript 5
**Styling** — Tailwind CSS 4, custom design tokens, Fraunces + Playfair Display + Plus Jakarta Sans + Monsieur La Doulaise via `next/font`
**Animation** — Framer Motion 12, Lenis smooth scroll, custom Canvas2D fluid simulation
**3D** — Three.js (r183), React Three Fiber, Drei
**Content** — Local JSON for projects and blog posts, Sanity client wired for future CMS swap
**Forms** — Zoho Forms public endpoint, AJAX submission with optimistic UI
**Analytics** — Google Tag Manager (GTM-M225DLQQ), deferred via `next/script` with `strategy="afterInteractive"`
**Icons** — Lucide React, FontAwesome Brands & Solid
**Hosting** — Vercel (static prerender for 5 routes, on-demand SSR for `/blogs/[slug]`)

## Project structure

```
Snigdha-Chandra-Paik/
├── public/
│   ├── images/         Headshots + family/influence photography
│   ├── OG/             1200x630 Open Graph cards per route
│   ├── projects/       11 project thumbnails
│   ├── blogs/          Blog hero images
│   ├── hobbies/        About-page imagery
│   └── CV/             Downloadable resume PDF
├── src/
│   ├── app/
│   │   ├── layout.tsx          Root layout + global JSON-LD + universal loader
│   │   ├── page.tsx            Home (server)
│   │   ├── sitemap.ts          Dynamic XML sitemap
│   │   ├── robots.ts           robots.txt
│   │   ├── about/page.tsx      Server wrapper + AboutPage schema
│   │   ├── projects/
│   │   │   ├── page.tsx                Server wrapper + CollectionPage schema
│   │   │   └── ProjectsContent.tsx     Client UI (animated grid)
│   │   ├── blogs/
│   │   │   ├── page.tsx                Server wrapper + Blog schema
│   │   │   ├── BlogsContent.tsx        Client UI (newspaper layout)
│   │   │   └── [slug]/page.tsx         BlogPosting schema, async params
│   │   └── contact/
│   │       ├── page.tsx                Server wrapper + ContactPage schema
│   │       └── ContactContent.tsx      Client UI (magnetic button + form)
│   ├── components/
│   │   ├── home/               Hero, About, Tech, Projects, Hobbies, Blogs
│   │   ├── about/              Hero (fluid sim), Skills, Parents, Gurudev, Favorites
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── SmoothScroll.tsx    Lenis provider
│   │   ├── UniversalLoader.tsx Cold-load + route-change preloader
│   │   └── JsonLd.tsx          XSS-safe structured-data injector
│   ├── lib/
│   │   ├── seo.ts              Schema builders, SITE_URL constant
│   │   └── blogService.ts      Local JSON post fetcher
│   ├── data/
│   │   ├── projects.json       11 case studies
│   │   └── colors.json         Brand palette tokens
│   └── content/
│       └── posts.json          Local CMS content
├── next.config.ts              React Compiler + remote image patterns
├── tsconfig.json
└── package.json
```

## Local development

**Requirements** — Node.js 20.9+, npm 10+ (Next.js 16 minimum).

```bash
# Install
npm install

# Dev server (Turbopack, port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

Open <http://localhost:3000> and edit `src/app/page.tsx` — hot reload covers all routes.

## Adding a project

Append a new entry to [`src/data/projects.json`](src/data/projects.json). The Home `Selected Works` grid auto-shows entries with `featured: true`; the `/projects` page lists every entry.

```json
{
  "id": 12,
  "title": "Your Project",
  "description": "One-sentence pitch focused on the outcome, not the tech.",
  "category": "Category / Subcategory",
  "tech": ["Next.js", "TypeScript", "Tailwind"],
  "image": "/projects/your-image.png",
  "link": "https://your-project.com/",
  "featured": true,
  "colorKey": "ai"
}
```

Drop the thumbnail into `public/projects/`. The sitemap, `CollectionPage → ItemList` JSON-LD, Home grid, and `/projects` page update automatically on the next build.

## Adding a blog post

Append to [`src/content/posts.json`](src/content/posts.json) — slug becomes the URL at `/blogs/<slug>`. The post inherits the `BlogPosting` schema with word count auto-calculated from HTML content.

## Deployment

Pushes to `main` deploy automatically to Vercel. The site uses static prerendering for `/`, `/about`, `/projects`, `/blogs`, `/contact`, plus on-demand server rendering for `/blogs/[slug]`. `sitemap.xml` and `robots.txt` are generated at build time.

After deploy, resubmit `https://snigdhachandrapaik.vercel.app/sitemap.xml` in Google Search Console.

## Author

**Snigdha Chandra Paik**
South 24 Parganas, West Bengal, India — 743395

<p>
  <a href="mailto:snigdhachandrapaik@gmail.com">snigdhachandrapaik@gmail.com</a> &nbsp;·&nbsp;
  <a href="tel:+918391879168">+91 8391879168</a><br/>
  <a href="https://www.facebook.com/snigdha.chandra.paik">Facebook</a> &nbsp;·&nbsp;
  <a href="https://www.instagram.com/snigdha_chandra_paik/">Instagram</a> &nbsp;·&nbsp;
  <a href="https://github.com/snigdha-project">GitHub</a> &nbsp;·&nbsp;
  <a href="https://wa.me/918391879168">WhatsApp</a>
</p>

Available for frontend, Next.js, Three.js, React Native, animation, automation and SEO projects. Replies within 24 hours.

## License

Source is provided for reference. Brand assets, photography, copy and the personal name "Snigdha Chandra Paik" remain the property of the author and may not be reused.

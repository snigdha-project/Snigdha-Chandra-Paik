import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { getAllPostsForSeo } from "@/lib/blogService";
import { getProjects } from "@/lib/projectService";

// GEO (Generative Engine Optimization): an llms.txt is a curated, plain-markdown
// map of the site for AI engines (ChatGPT, Perplexity, Claude, Gemini, etc.) so
// they can understand and cite it accurately. Regenerated hourly so new posts
// and projects appear without a redeploy. Spec: https://llmstxt.org
export const revalidate = 3600;

// Collapse whitespace and strip any stray HTML so each entry is one clean line.
function clean(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function techSuffix(tech: string[]): string {
  return tech.length ? ` — Built with ${tech.slice(0, 6).join(", ")}.` : "";
}

export async function GET() {
  const [posts, projects] = await Promise.all([
    getAllPostsForSeo(),
    getProjects(),
  ]);

  const caseStudies = projects.filter((p) => p.hasCaseStudy);
  const otherProjects = projects.filter((p) => !p.hasCaseStudy && p.link);

  const lines: string[] = [];

  lines.push(`# ${SITE_NAME} — Frontend Developer & SEO Specialist`);
  lines.push("");
  lines.push(
    "> Snigdha Chandra Paik is a frontend developer and SEO specialist based in " +
      "South 24 Parganas, West Bengal, India. He builds animated, high-performance " +
      "Next.js, Three.js, Framer Motion and React Native web experiences with strong " +
      "technical SEO, and works with clients worldwide. Available for freelance and " +
      "contract projects.",
  );
  lines.push("");
  lines.push("- **Name:** Snigdha Chandra Paik");
  lines.push("- **Role:** Frontend Developer · SEO Specialist · Creative Engineer");
  lines.push("- **Based in:** South 24 Parganas, West Bengal, India (PIN 743395)");
  lines.push("- **Serves:** India, United States, United Kingdom, UAE & worldwide");
  lines.push("- **Email:** snigdhachandrapaik@gmail.com");
  lines.push("- **Phone / WhatsApp:** +91 8391879168");
  lines.push(`- **Website:** ${SITE_URL}`);
  lines.push("");

  lines.push("## Services");
  lines.push("");
  [
    "Frontend development — Next.js, React, TypeScript",
    "Animated websites — Framer Motion, GSAP, Lenis smooth scroll",
    "3D web experiences — Three.js, React Three Fiber, Spline",
    "React Native mobile app development",
    "Technical SEO, schema markup & Core Web Vitals optimisation",
    "Python & N8N workflow automation",
    "Webflow, Shopify, WooCommerce & WordPress builds",
  ].forEach((s) => lines.push(`- ${s}`));
  lines.push("");

  lines.push("## Key Pages");
  lines.push("");
  lines.push(
    `- [Home](${SITE_URL}/): Overview of Snigdha Chandra Paik's frontend and SEO work.`,
  );
  lines.push(
    `- [About](${SITE_URL}/about): Background, skills, experience and approach.`,
  );
  lines.push(
    `- [Projects](${SITE_URL}/projects): Selected frontend, 3D and SEO projects.`,
  );
  lines.push(
    `- [Blog](${SITE_URL}/blogs): Articles on frontend development, animation, SEO and automation.`,
  );
  lines.push(
    `- [Contact](${SITE_URL}/contact): Hire Snigdha or start a new project.`,
  );
  lines.push("");

  if (caseStudies.length) {
    lines.push("## Case Studies");
    lines.push("");
    for (const p of caseStudies) {
      lines.push(
        `- [${p.title}](${SITE_URL}/projects/${p.slug}): ${clean(p.description)}${techSuffix(p.tech)}`,
      );
    }
    lines.push("");
  }

  if (otherProjects.length) {
    lines.push("## Other Projects");
    lines.push("");
    for (const p of otherProjects) {
      lines.push(
        `- [${p.title}](${p.link ?? `${SITE_URL}/projects`}): ${clean(p.description)}${techSuffix(p.tech)}`,
      );
    }
    lines.push("");
  }

  if (posts.length) {
    lines.push("## Articles");
    lines.push("");
    for (const post of posts) {
      const summary = clean(post.metaDescription ?? post.excerpt);
      lines.push(`- [${post.title}](${SITE_URL}/blogs/${post.slug}): ${summary}`);
    }
    lines.push("");
  }

  lines.push("## Contact");
  lines.push("");
  lines.push("- Email: snigdhachandrapaik@gmail.com");
  lines.push("- Phone / WhatsApp: +91 8391879168");
  lines.push("- Typical response time: within 24 hours (IST).");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

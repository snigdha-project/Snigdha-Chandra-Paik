import { wpQuery, wpQueryAll } from "./wordpress";
import { stripTags } from "./wpText";

export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  image: string; // full public URL
  link: string | null;
  featured: boolean;
  colorKey: string | null;
  hasCaseStudy: boolean;
};

export type ProjectWithCaseStudy = Project & {
  caseStudy: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

// Projects are a custom post type provided by the "Portfolio Projects"
// WordPress plugin (wordpress/portfolio-projects in this repo).
type WpProject = {
  databaseId: number;
  slug: string;
  title: string | null;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  tech: string[] | null;
  link: string | null;
  featured: boolean | null;
  colorKey: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  featuredImage: { node: { sourceUrl: string | null } | null } | null;
};

const FALLBACK_IMAGE = "/OG/projectsOG.png";

const PROJECT_FIELDS = `
  databaseId
  slug
  title
  excerpt
  content
  category
  tech
  link
  featured
  colorKey
  metaTitle
  metaDescription
  featuredImage { node { sourceUrl } }
`;

// menuOrder ascending (the "Order" field in WordPress), then newest first.
const ALL_PROJECTS_QUERY = `
  query Projects($after: String) {
    projects(first: 100, after: $after, where: { status: PUBLISH, orderby: [{ field: MENU_ORDER, order: ASC }, { field: DATE, order: DESC }] }) {
      pageInfo { hasNextPage endCursor }
      nodes { ${PROJECT_FIELDS} }
    }
  }
`;

const PROJECT_BY_SLUG_QUERY = `
  query Project($slug: ID!) {
    project(id: $slug, idType: SLUG) { status ${PROJECT_FIELDS} }
  }
`;

function hasContent(html: string | null): boolean {
  return Boolean(html && stripTags(html).length > 0);
}

function toProject(p: WpProject): Project {
  return {
    id: p.databaseId,
    slug: p.slug,
    title: stripTags(p.title ?? ""),
    description: stripTags(p.excerpt ?? ""),
    category: p.category ?? "",
    tech: p.tech ?? [],
    image: p.featuredImage?.node?.sourceUrl || FALLBACK_IMAGE,
    link: p.link,
    featured: Boolean(p.featured),
    colorKey: p.colorKey,
    hasCaseStudy: hasContent(p.content),
  };
}

async function fetchAllProjects(): Promise<WpProject[]> {
  try {
    return await wpQueryAll<WpProject>(ALL_PROJECTS_QUERY, "projects");
  } catch (e) {
    console.error("getProjects failed:", e instanceof Error ? e.message : e);
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  return (await fetchAllProjects()).map(toProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectWithCaseStudy | null> {
  try {
    const data = await wpQuery<{
      project: (WpProject & { status: string }) | null;
    }>(PROJECT_BY_SLUG_QUERY, { slug });
    const p = data.project;
    if (!p || p.status !== "publish" || !hasContent(p.content)) return null;
    return {
      ...toProject(p),
      caseStudy: p.content ?? "",
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
    };
  } catch (e) {
    console.error("getProjectBySlug failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

export async function getProjectSlugsWithCaseStudy(): Promise<string[]> {
  return (await fetchAllProjects())
    .filter((p) => hasContent(p.content))
    .map((p) => p.slug);
}

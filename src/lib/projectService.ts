import {
  supabasePublic,
  publicImageUrl,
  PROJECT_IMAGES_BUCKET,
} from "./supabase/public";

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

type Row = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  tech: string[] | null;
  image_path: string;
  link: string | null;
  featured: boolean;
  color_key: string | null;
  case_study: string | null;
  meta_title: string | null;
  meta_description: string | null;
  order_index: number;
};

const PROJECT_COLUMNS =
  "id, slug, title, description, category, tech, image_path, link, featured, color_key, case_study, meta_title, meta_description, order_index";

function toProject(row: Row): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    tech: row.tech ?? [],
    image: publicImageUrl(PROJECT_IMAGES_BUCKET, row.image_path),
    link: row.link,
    featured: row.featured,
    colorKey: row.color_key,
    hasCaseStudy: row.case_study !== null && row.case_study.trim().length > 0,
  };
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabasePublic
    .from("projects")
    .select(PROJECT_COLUMNS)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProjects failed:", error.message);
    return [];
  }
  return (data as Row[]).map(toProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectWithCaseStudy | null> {
  const { data, error } = await supabasePublic
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as Row;
  if (!row.case_study || row.case_study.trim().length === 0) return null;
  return {
    ...toProject(row),
    caseStudy: row.case_study,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  };
}

export type ProjectEditRow = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  imagePath: string;
  imageUrl: string;
  link: string | null;
  featured: boolean;
  colorKey: string | null;
  caseStudy: string;
  metaTitle: string;
  metaDescription: string;
  orderIndex: number;
};

export async function getProjectForEdit(slug: string): Promise<ProjectEditRow | null> {
  const { data, error } = await supabasePublic
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as Row;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    tech: row.tech ?? [],
    imagePath: row.image_path,
    imageUrl: publicImageUrl(PROJECT_IMAGES_BUCKET, row.image_path),
    link: row.link,
    featured: row.featured,
    colorKey: row.color_key,
    caseStudy: row.case_study ?? "",
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    orderIndex: row.order_index,
  };
}

export async function getProjectSlugsWithCaseStudy(): Promise<string[]> {
  const { data, error } = await supabasePublic
    .from("projects")
    .select("slug, case_study")
    .not("case_study", "is", null);

  if (error || !data) return [];
  return data
    .filter((r: { slug: string; case_study: string | null }) =>
      Boolean(r.case_study && r.case_study.trim().length > 0),
    )
    .map((r: { slug: string }) => r.slug);
}

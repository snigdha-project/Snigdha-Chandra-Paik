import { wpQuery, wpQueryAll } from "./wordpress";
import { stripTags } from "./wpText";
import {
  parseToolConfig,
  parseToolFaq,
  type ToolConfig,
  type ToolFaq,
} from "./toolEngine";
import {
  normalizeToolType,
  parseEmbedConfig,
  parseImageConfig,
  parseSeoAuditConfig,
  type EmbedConfig,
  type ImageCompressorConfig,
  type SeoAuditConfig,
  type ToolType,
} from "./toolTypes";

// Tools are a custom post type provided by the "Portfolio Tools" WordPress
// plugin (wordpress/portfolio-tools). Everything about a tool — name, type,
// settings, article, FAQ, SEO and (for embeds) the code itself — is edited in
// WordPress.

export type Tool = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  type: ToolType;
};

export type ToolRuntime =
  | { type: "calculator"; config: ToolConfig }
  | { type: "image-compressor"; config: ImageCompressorConfig }
  | { type: "embed"; config: EmbedConfig; code: string }
  | { type: "seo-audit"; config: SeoAuditConfig };

export type ToolDetail = Tool & {
  runtime: ToolRuntime;
  faq: ToolFaq[];
  contentHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
  modified: string;
};

type WpTool = {
  databaseId: number;
  slug: string;
  title: string | null;
  excerpt: string | null;
  content: string | null;
  modified: string;
  toolType: string | null;
  category: string | null;
  icon: string | null;
  config: string | null;
  faq: string | null;
  code: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

const TOOL_FIELDS = `
  databaseId
  slug
  title
  excerpt
  content
  modified
  toolType
  category
  icon
  config
  faq
  code
  metaTitle
  metaDescription
`;

const ALL_TOOLS_QUERY = `
  query Tools($after: String) {
    tools(first: 100, after: $after, where: { status: PUBLISH, orderby: [{ field: MENU_ORDER, order: ASC }, { field: DATE, order: DESC }] }) {
      pageInfo { hasNextPage endCursor }
      nodes { ${TOOL_FIELDS} }
    }
  }
`;

const TOOL_BY_SLUG_QUERY = `
  query Tool($slug: ID!) {
    tool(id: $slug, idType: SLUG) { status ${TOOL_FIELDS} }
  }
`;

function toTool(t: WpTool): Tool {
  return {
    id: t.databaseId,
    slug: t.slug,
    title: stripTags(t.title ?? ""),
    description: stripTags(t.excerpt ?? ""),
    category: t.category?.trim() || "Tools",
    icon: t.icon ?? "calculator",
    type: normalizeToolType(t.toolType),
  };
}

// Builds what the page needs to run the tool; null when the tool is not
// usable (bad calculator config, empty embed code). Such a tool is hidden
// instead of breaking the site.
function toRuntime(t: WpTool): ToolRuntime | null {
  const type = normalizeToolType(t.toolType);
  switch (type) {
    case "calculator": {
      const config = parseToolConfig(t.config);
      return config ? { type, config } : null;
    }
    case "image-compressor":
      return { type, config: parseImageConfig(t.config) };
    case "seo-audit":
      return { type, config: parseSeoAuditConfig(t.config) };
    case "embed": {
      const code = t.code?.trim();
      return code ? { type, config: parseEmbedConfig(t.config), code } : null;
    }
  }
}

async function fetchAllTools(): Promise<WpTool[]> {
  try {
    const all = await wpQueryAll<WpTool>(ALL_TOOLS_QUERY, "tools");
    return all.filter((t) => toRuntime(t) !== null);
  } catch (e) {
    console.error("getTools failed:", e instanceof Error ? e.message : e);
    return [];
  }
}

export async function getTools(): Promise<Tool[]> {
  return (await fetchAllTools()).map(toTool);
}

export async function getToolSlugs(): Promise<{ slug: string; modified: string }[]> {
  return (await fetchAllTools()).map((t) => ({ slug: t.slug, modified: t.modified }));
}

export async function getToolBySlug(slug: string): Promise<ToolDetail | null> {
  try {
    const data = await wpQuery<{ tool: (WpTool & { status: string }) | null }>(
      TOOL_BY_SLUG_QUERY,
      { slug },
    );
    const t = data.tool;
    if (!t || t.status !== "publish") return null;
    const runtime = toRuntime(t);
    if (!runtime) return null;
    return {
      ...toTool(t),
      runtime,
      faq: parseToolFaq(t.faq),
      contentHtml: t.content ?? "",
      metaTitle: t.metaTitle?.trim() || null,
      metaDescription: t.metaDescription?.trim() || null,
      modified: t.modified,
    };
  } catch (e) {
    console.error("getToolBySlug failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

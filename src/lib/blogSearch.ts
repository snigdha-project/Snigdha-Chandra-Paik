// Small typo-tolerant, topic-aware blog search (no dependencies).
//  - stemming:  "animated" / "animation" / "animations" all match each other
//  - typos:     "wordpres", "nurssery" still find the right posts
//  - related:   "seo" also surfaces performance / speed / vitals content
//  - body text: article content is searched too, at a lower weight

type Searchable = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
};

export type SearchResult<T> = {
  post: T;
  score: number;
  /** direct (stem-aware) hit in title, category or excerpt */
  exact: boolean;
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/([a-z0-9])\.([a-z0-9])/g, "$1$2") // "Next.js" -> "nextjs"
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SUFFIXES = [
  "ations", "ation", "ators", "ator", "ments", "ment", "ness", "ions", "ion",
  "ing", "ers", "ors", "er", "or", "ed", "es", "ly", "s", "e",
];

function stem(w: string): string {
  if (w.length <= 3) return w;
  for (const suf of SUFFIXES) {
    if (w.endsWith(suf) && w.length - suf.length >= 4) {
      return w.slice(0, w.length - suf.length);
    }
  }
  return w;
}

const sameStem = (a: string, b: string) =>
  a === b ||
  (Math.min(a.length, b.length) >= 4 && (a.startsWith(b) || b.startsWith(a)));

// Topics that "belong together". Keys and values are plain words; lookups
// are stem-based, so "animated" reaches the "animation" entry automatically.
const RELATED: Record<string, string[]> = {
  seo: ["performance", "speed", "vitals", "ranking", "rank", "technical", "google", "search", "schema", "meta", "crawl", "lighthouse", "fast"],
  performance: ["seo", "speed", "vitals", "fast", "lighthouse", "optimization", "animation", "core"],
  speed: ["performance", "seo", "vitals", "fast", "lighthouse"],
  animation: ["motion", "gsap", "lenis", "lottie", "threejs", "transition", "scroll", "performance", "interactive"],
  motion: ["animation", "gsap", "lenis", "transition", "scroll"],
  gsap: ["animation", "motion", "scroll", "threejs", "lenis"],
  transition: ["animation", "motion", "view", "nextjs"],
  nextjs: ["react", "vercel", "seo", "performance", "supabase", "framework"],
  react: ["nextjs", "frontend", "component", "animation"],
  wordpress: ["headless", "cms", "webflow", "woocommerce", "plugin"],
  cms: ["wordpress", "headless", "webflow", "content"],
  webflow: ["wordpress", "cms", "nocode", "design"],
  automation: ["n8n", "zoho", "deluge", "workflow", "python", "integration", "ai"],
  n8n: ["automation", "workflow", "zoho", "deluge"],
  zoho: ["automation", "deluge", "crm", "n8n"],
  ai: ["llm", "automation", "search", "lens", "chatbot"],
  supabase: ["firebase", "database", "postgres", "backend", "auth"],
  firebase: ["supabase", "database", "backend"],
  database: ["supabase", "firebase", "postgres", "sql", "backend"],
  plant: ["nursery", "aquarium", "garden", "lens", "agritech"],
  nursery: ["plant", "aquarium", "garden", "local", "ranking"],
  aquarium: ["plant", "nursery", "garden"],
  ecommerce: ["shopify", "store", "legal", "checkout", "woocommerce"],
  shopify: ["ecommerce", "store", "checkout"],
  legal: ["privacy", "policy", "terms", "ecommerce", "saas", "compliance"],
  saas: ["onboarding", "software", "legal", "automation"],
  onboarding: ["saas", "software", "conversion"],
  conversion: ["seo", "performance", "onboarding", "cro", "rate"],
  website: ["developer", "business", "design", "seo"],
  developer: ["website", "kolkata", "freelance", "hire"],
  hosting: ["vercel", "publish", "free", "deploy"],
  publish: ["hosting", "vercel", "free", "deploy"],
};

type W = { w: string; s: string };

type Entry<T> = {
  post: T;
  title: W[];
  category: W[];
  excerpt: W[];
  /** unique stems from the article body */
  body: Set<string>;
};

const toWords = (s: string): W[] =>
  normalize(s)
    .split(" ")
    .filter(Boolean)
    .map((w) => ({ w, s: stem(w) }));

export function buildSearchIndex<T extends Searchable>(posts: T[]): Entry<T>[] {
  return posts.map((post) => ({
    post,
    title: toWords(post.title),
    category: toWords(post.category),
    excerpt: toWords(post.excerpt),
    body: new Set(
      toWords((post.content ?? "").replace(/<[^>]+>/g, " ")).map((x) => x.s),
    ),
  }));
}

// Optimal-string-alignment distance (a swap like "teh"->"the" counts as 1).
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/** Strength of a query word against one field: 0 (none) .. 1 (literal). */
function matchField(q: string, qs: string, field: W[], fuzzy: boolean) {
  let best = 0;
  let direct = false;
  const tol = q.length >= 8 ? 2 : q.length >= 4 ? 1 : 0;
  for (const { w, s } of field) {
    if (w === q) return { s: 1, direct: true };
    if (sameStem(qs, s) || (q.length >= 3 && (w.startsWith(q) || w.includes(q)))) {
      if (0.9 > best) best = 0.9;
      direct = true;
      continue;
    }
    if (fuzzy && tol > 0) {
      const d = Math.min(
        distance(q, w, tol),
        w.length > q.length ? distance(q, w.slice(0, q.length), tol) : 99,
      );
      if (d <= tol && 0.6 - d * 0.1 > best) best = 0.6 - d * 0.1;
    }
  }
  return { s: best, direct };
}

const FIELD_WEIGHT = { title: 3, category: 2, excerpt: 1 } as const;
const BODY_WEIGHT = 0.4;
const RELATED_FACTOR = 0.35;
const MIN_SCORE = 1.0;

export function searchIndex<T extends Searchable>(
  index: Entry<T>[],
  query: string,
): SearchResult<T>[] {
  const qWords = toWords(query);
  if (qWords.length === 0) return [];

  const out: SearchResult<T>[] = [];
  for (const e of index) {
    let score = 0;
    let matched = 0;
    let allDirect = true;

    for (const { w: q, s: qs } of qWords) {
      let best = 0;
      let direct = false;

      // 1) the word itself (title/category/excerpt, typo-tolerant) + body
      for (const key of Object.keys(FIELD_WEIGHT) as (keyof typeof FIELD_WEIGHT)[]) {
        const m = matchField(q, qs, e[key], true);
        if (m.s * FIELD_WEIGHT[key] > best) best = m.s * FIELD_WEIGHT[key];
        if (m.direct) direct = true;
      }
      if (e.body.has(qs) && BODY_WEIGHT > best) best = BODY_WEIGHT;

      // 2) related topics (always lower weight, never counts as "direct")
      const rel = RELATED[q] ?? RELATED[qs] ?? [];
      for (const term of rel) {
        const ts = stem(term);
        for (const key of Object.keys(FIELD_WEIGHT) as (keyof typeof FIELD_WEIGHT)[]) {
          const m = matchField(term, ts, e[key], false);
          const v = m.s * FIELD_WEIGHT[key] * RELATED_FACTOR;
          if (v > best) best = v;
        }
        if (e.body.has(ts) && BODY_WEIGHT * RELATED_FACTOR > best) {
          best = BODY_WEIGHT * RELATED_FACTOR;
        }
      }

      if (best > 0) matched++;
      if (!direct) allDirect = false;
      score += best;
    }

    if (matched === 0) continue;
    score *= 1 + matched / qWords.length;
    // drop faint hits (e.g. a related word mentioned once in the body)
    if (score < MIN_SCORE) continue;
    out.push({ post: e.post, score, exact: allDirect });
  }
  return out.sort((a, b) => b.score - a.score);
}

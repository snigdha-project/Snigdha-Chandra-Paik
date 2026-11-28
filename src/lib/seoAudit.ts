// On-page SEO checks for one HTML page. Pure functions (no network), so they
// can be tested with plain strings. The client imports only the types.
import { decodeEntities } from "./wpText";

export type CheckStatus = "pass" | "warn" | "fail";

export type Check = {
  id: string;
  category: Category;
  label: string;
  status: CheckStatus;
  detail: string;
  fix?: string;
  weight: number;
};

export const CATEGORIES = [
  "Search basics",
  "Content",
  "Crawling",
  "Social & rich results",
  "Speed & security",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type SeoReport = {
  url: string;
  score: number; // 0-100
  categoryScores: { name: Category; score: number }[];
  checks: Check[];
  preview: { title: string; description: string; url: string };
  checkedAt: string;
};

export type PageInput = {
  url: string;
  status: number;
  headers: Record<string, string | string[] | undefined>;
  html: string;
  bytes: number;
  truncated: boolean;
  redirects: number;
  ms: number;
  /** null when the file could not be fetched */
  robotsTxt: string | null;
  sitemapUrl: string | null;
};

type Tag = { name: string; attrs: Record<string, string>; text: string };

const RAW_TEXT = new Set(["script", "style", "title", "textarea"]);
const HEADINGS = new Set(["h1", "h2"]);

// A small linear-time HTML scanner. Regexes over a stranger's markup can
// backtrack badly, so this walks the string once instead.
export function scanHtml(html: string): { tags: Tag[]; text: string } {
  const tags: Tag[] = [];
  const text: string[] = [];
  const lower = html.toLowerCase();
  const n = html.length;
  let i = 0;
  let hidden = 0; // inside <noscript>, <template> or <svg>
  let heading: Tag | null = null;

  const addText = (s: string) => {
    if (hidden || !s.trim()) return;
    text.push(s);
    if (heading) heading.text += s;
  };

  while (i < n) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      addText(html.slice(i));
      break;
    }
    addText(html.slice(i, lt));

    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      i = end === -1 ? n : end + 3;
      continue;
    }

    let j = lt + 1;
    const closing = html[j] === "/";
    if (closing) j++;
    if (!/[a-zA-Z]/.test(html[j] ?? "")) {
      if (html[j] === "!" || html[j] === "?" || closing) {
        const end = html.indexOf(">", j);
        i = end === -1 ? n : end + 1;
      } else {
        addText("<");
        i = lt + 1;
      }
      continue;
    }

    const nameStart = j;
    while (j < n && !/[\s/>]/.test(html[j])) j++;
    const name = lower.slice(nameStart, j);

    const attrs: Record<string, string> = {};
    while (j < n && html[j] !== ">") {
      if (/[\s/]/.test(html[j])) {
        j++;
        continue;
      }
      const keyStart = j;
      j++;
      while (j < n && !/[\s/>=]/.test(html[j])) j++;
      const key = lower.slice(keyStart, j);
      while (j < n && /\s/.test(html[j])) j++;
      let value = "";
      if (html[j] === "=") {
        j++;
        while (j < n && /\s/.test(html[j])) j++;
        const quote = html[j];
        if (quote === '"' || quote === "'") {
          const end = html.indexOf(quote, j + 1);
          value = html.slice(j + 1, end === -1 ? n : end);
          j = end === -1 ? n : end + 1;
        } else {
          const start = j;
          while (j < n && !/[\s>]/.test(html[j])) j++;
          value = html.slice(start, j);
        }
      }
      if (!(key in attrs)) attrs[key] = decodeEntities(value);
    }
    i = j + 1;

    if (closing) {
      if (name === "noscript" || name === "template" || name === "svg") hidden = Math.max(0, hidden - 1);
      if (heading && heading.name === name) heading = null;
      continue;
    }

    const tag: Tag = { name, attrs, text: "" };
    // <title> inside an inline <svg> is an icon label, not the page title.
    if (!(name === "title" && hidden)) tags.push(tag);

    if (RAW_TEXT.has(name)) {
      const end = lower.indexOf(`</${name}`, i);
      tag.text = html.slice(i, end === -1 ? n : end);
      if (end === -1) break;
      const gt = html.indexOf(">", end);
      i = gt === -1 ? n : gt + 1;
      continue;
    }
    const selfClosed = html[j - 1] === "/";
    if ((name === "noscript" || name === "template" || name === "svg") && !selfClosed) hidden++;
    if (HEADINGS.has(name) && !hidden) heading = tag;
  }

  return { tags, text: text.join(" ") };
}

const clean = (s: string) => decodeEntities(s).replace(/\s+/g, " ").trim();
const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** True when robots.txt tells every crawler to stay away from the whole site. */
export function robotsBlocksAll(robots: string): boolean {
  let agents: string[] = [];
  let lastWasAgent = false;
  let disallow = false;
  let allow = false;
  for (const line of robots.split(/\r?\n/)) {
    const m = /^\s*([a-z-]+)\s*:\s*([^#]*)/i.exec(line);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === "user-agent") {
      agents = lastWasAgent ? [...agents, value] : [value];
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!agents.includes("*")) continue;
    if (key === "disallow" && value === "/") disallow = true;
    if (key === "allow" && value === "/") allow = true;
  }
  return disallow && !allow;
}

export function analyzePage(page: PageInput): SeoReport {
  const url = new URL(page.url);
  const { tags, text } = scanHtml(page.html);
  const all = (name: string) => tags.filter((t) => t.name === name);
  const meta = (key: string) =>
    clean(
      tags.find(
        (t) =>
          t.name === "meta" &&
          (t.attrs.name?.toLowerCase() === key || t.attrs.property?.toLowerCase() === key),
      )?.attrs.content ?? "",
    );
  const linkRel = (rel: string) =>
    all("link").find((t) => (t.attrs.rel ?? "").toLowerCase().split(/\s+/).includes(rel));
  const header = (key: string) => {
    const v = page.headers[key];
    return Array.isArray(v) ? v.join(", ") : (v ?? "");
  };

  const checks: Check[] = [];
  const add = (
    category: Category,
    id: string,
    label: string,
    weight: number,
    status: CheckStatus,
    detail: string,
    fix?: string,
  ) => checks.push({ category, id, label, weight, status, detail, fix: status === "pass" ? undefined : fix });

  // ---- Search basics
  const title = clean(all("title")[0]?.text ?? "");
  add(
    "Search basics", "title", "Page title", 10,
    !title ? "fail" : title.length < 30 || title.length > 60 ? "warn" : "pass",
    title ? `"${clip(title, 120)}" (${title.length} characters)` : "The page has no title.",
    "Write a unique title of 30 to 60 characters with the main keyword near the start.",
  );

  const description = meta("description");
  add(
    "Search basics", "description", "Meta description", 8,
    !description ? "fail" : description.length < 70 || description.length > 160 ? "warn" : "pass",
    description ? `${description.length} characters` : "The page has no meta description.",
    "Write a 70 to 160 character summary that gives searchers a reason to click.",
  );

  const robotsDirectives = `${meta("robots")} ${meta("googlebot")} ${header("x-robots-tag")}`.toLowerCase();
  const noindex = /\b(noindex|none)\b/.test(robotsDirectives);
  add(
    "Search basics", "indexable", "Allowed in search results", 15,
    noindex ? "fail" : "pass",
    noindex ? "The page is marked noindex, so Google will not show it." : "No noindex directive found.",
    "Remove the noindex robots tag or header if this page should appear in Google.",
  );

  const canonical = linkRel("canonical")?.attrs.href?.trim() ?? "";
  add(
    "Search basics", "canonical", "Canonical link", 5,
    canonical ? "pass" : "warn",
    canonical ? clip(canonical, 120) : "No canonical link found.",
    "Add a canonical link so duplicate addresses are counted as one page.",
  );

  const lang = clean(all("html")[0]?.attrs.lang ?? "");
  add(
    "Search basics", "lang", "Page language", 2,
    lang ? "pass" : "warn",
    lang ? `Declared as "${clip(lang, 20)}".` : "No lang attribute on the page.",
    'Add a language to the html tag, for example <html lang="en">.',
  );

  const viewport = meta("viewport");
  add(
    "Search basics", "viewport", "Mobile friendly setup", 8,
    viewport.includes("width=device-width") ? "pass" : viewport ? "warn" : "fail",
    viewport ? clip(viewport, 100) : "No viewport tag, so phones show a shrunken desktop page.",
    'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
  );

  // ---- Content
  const h1 = all("h1");
  add(
    "Content", "h1", "Main heading (H1)", 7,
    h1.length === 1 ? "pass" : h1.length === 0 ? "fail" : "warn",
    h1.length === 0
      ? "No H1 heading found."
      : h1.length === 1
        ? `"${clip(clean(h1[0].text), 120) || "(no text)"}"`
        : `${h1.length} H1 headings found.`,
    "Use exactly one H1 that says what the page is about.",
  );

  const h2 = all("h2").length;
  add(
    "Content", "h2", "Subheadings", 3,
    h2 > 0 ? "pass" : "warn",
    h2 > 0 ? plural(h2, "H2 subheading") : "No H2 subheadings.",
    "Break the content into sections with descriptive subheadings.",
  );

  const words = (text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []).length;
  add(
    "Content", "words", "Amount of text", 6,
    words >= 300 ? "pass" : words >= 100 ? "warn" : "fail",
    `About ${plural(words, "word")} in the page's HTML.`,
    "Add useful text about your services. If the page is built entirely with JavaScript, render the content on the server.",
  );

  const images = all("img");
  const noAlt = images.filter((t) => !("alt" in t.attrs)).length;
  add(
    "Content", "alt", "Image descriptions (alt text)", 5,
    noAlt === 0 ? "pass" : noAlt / images.length > 0.3 ? "fail" : "warn",
    images.length === 0
      ? "No images found."
      : noAlt === 0
        ? `All ${plural(images.length, "image")} have an alt attribute.`
        : `${noAlt} of ${plural(images.length, "image")} have no alt attribute.`,
    "Describe each meaningful image in its alt attribute. Decorative images can use an empty alt.",
  );

  const bare = (h: string) => h.replace(/^www\./, "");
  let internal = 0;
  let external = 0;
  for (const a of all("a")) {
    const href = a.attrs.href?.trim();
    if (!href || href.startsWith("#")) continue;
    try {
      const u = new URL(href, url);
      if (u.protocol !== "http:" && u.protocol !== "https:") continue;
      if (bare(u.hostname) === bare(url.hostname)) internal++;
      else external++;
    } catch {
      /* ignore broken hrefs */
    }
  }
  add(
    "Content", "links", "Internal links", 4,
    internal >= 3 ? "pass" : "warn",
    `${plural(internal, "internal link")}, ${plural(external, "external link")}.`,
    "Link to your other important pages so visitors and Google can find them.",
  );

  // ---- Crawling
  add(
    "Crawling", "status", "Page loads", 8, "pass",
    page.redirects
      ? `Loaded after ${plural(page.redirects, "redirect")}.`
      : "The page answered normally.",
  );

  const blocked = page.robotsTxt !== null && robotsBlocksAll(page.robotsTxt);
  add(
    "Crawling", "robots", "robots.txt", 7,
    blocked ? "fail" : page.robotsTxt === null ? "warn" : "pass",
    blocked
      ? "robots.txt blocks all crawlers from the whole site."
      : page.robotsTxt === null
        ? "No robots.txt file found."
        : "Found, and it does not block the whole site.",
    blocked ? "Remove 'Disallow: /' for all user agents." : "Add a robots.txt file that points to your sitemap.",
  );

  add(
    "Crawling", "sitemap", "XML sitemap", 5,
    page.sitemapUrl ? "pass" : "warn",
    page.sitemapUrl ? clip(page.sitemapUrl, 120) : "No sitemap found.",
    "Publish a sitemap.xml and submit it in Google Search Console.",
  );

  // ---- Social & rich results
  const og = ["og:title", "og:description", "og:image"];
  const missingOg = og.filter((k) => !meta(k));
  add(
    "Social & rich results", "og", "Social sharing preview", 5,
    missingOg.length === 0 ? "pass" : missingOg.length === og.length ? "fail" : "warn",
    missingOg.length === 0 ? "Title, description and image are set." : `Missing: ${missingOg.join(", ")}.`,
    "Add Open Graph tags so links look good on WhatsApp, Facebook and LinkedIn.",
  );

  const ld = all("script").filter((t) => t.attrs.type?.toLowerCase() === "application/ld+json");
  const invalid = ld.filter((t) => {
    try {
      JSON.parse(t.text);
      return false;
    } catch {
      return true;
    }
  }).length;
  add(
    "Social & rich results", "schema", "Structured data", 5,
    ld.length === 0 ? "warn" : invalid ? "fail" : "pass",
    ld.length === 0
      ? "No JSON-LD structured data found."
      : invalid
        ? `${plural(invalid, "block")} of structured data has invalid JSON.`
        : `${plural(ld.length, "valid block")} found.`,
    "Add schema.org markup (business, product, FAQ) to qualify for rich results.",
  );

  add(
    "Social & rich results", "favicon", "Favicon", 2,
    linkRel("icon") || linkRel("apple-touch-icon") ? "pass" : "warn",
    linkRel("icon") || linkRel("apple-touch-icon") ? "Declared on the page." : "No icon link on the page.",
    "Add a favicon link. Google shows it next to your result on phones.",
  );

  // ---- Speed & security
  add(
    "Speed & security", "https", "Secure connection (HTTPS)", 10,
    url.protocol === "https:" ? "pass" : "fail",
    url.protocol === "https:" ? "The page is served over HTTPS." : "The page is not served over HTTPS.",
    "Install an SSL certificate and redirect all http addresses to https.",
  );

  const seconds = (page.ms / 1000).toFixed(1);
  add(
    "Speed & security", "time", "Server response time", 6,
    page.ms < 1000 ? "pass" : page.ms < 3000 ? "warn" : "fail",
    `The HTML arrived in ${seconds}s, measured from our server.`,
    "Use caching, a CDN or faster hosting.",
  );

  const kb = Math.round(page.bytes / 1024);
  add(
    "Speed & security", "size", "HTML size", 3,
    page.truncated || kb > 500 ? "fail" : kb > 200 ? "warn" : "pass",
    page.truncated ? `Over ${kb} KB (only this much was checked).` : `${kb} KB of HTML.`,
    "Remove unused inline code and split very long pages.",
  );

  const encoding = header("content-encoding");
  add(
    "Speed & security", "compression", "Text compression", 4,
    encoding ? "pass" : "warn",
    encoding ? `Sent with ${clip(encoding, 20)} compression.` : "The HTML is sent uncompressed.",
    "Turn on Brotli or gzip compression on the server.",
  );

  if (url.protocol === "https:") {
    const hsts = header("strict-transport-security");
    add(
      "Speed & security", "hsts", "HTTPS enforcement header", 2,
      hsts ? "pass" : "warn",
      hsts ? "Strict-Transport-Security is set." : "No Strict-Transport-Security header.",
      "Add the Strict-Transport-Security header.",
    );
  }

  const scoreOf = (list: Check[]) => {
    const total = list.reduce((s, c) => s + c.weight, 0);
    const got = list.reduce((s, c) => s + c.weight * (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0), 0);
    return total ? Math.round((got / total) * 100) : 0;
  };
  // A page hidden from Google cannot be healthy however good the rest is.
  const score = noindex || blocked ? Math.min(scoreOf(checks), 40) : scoreOf(checks);

  return {
    url: page.url,
    score,
    categoryScores: CATEGORIES.map((name) => ({ name, score: scoreOf(checks.filter((c) => c.category === name)) })),
    checks,
    preview: {
      title: clip(title || url.hostname, 60),
      description: clip(description || "Google would pick some text from the page.", 160),
      url: page.url,
    },
    checkedAt: new Date().toISOString(),
  };
}

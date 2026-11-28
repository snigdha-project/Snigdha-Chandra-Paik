import { NextResponse, type NextRequest } from "next/server";
import { FetchError, safeFetch } from "@/lib/safeFetch";
import { analyzePage } from "@/lib/seoAudit";

// Used by the "SEO audit" tool type. Fetches one page the visitor names (plus
// its robots.txt and sitemap) and returns an on-page SEO report. Nothing is stored.
export const maxDuration = 30;

// Best-effort limit per server instance, to stop casual abuse of the fetcher.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 10;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return true;
  if (hits.size > 5000) hits.clear();
  hits.set(ip, [...recent, now]);
  return false;
}

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

function parseUrl(input: unknown): URL | null {
  if (typeof input !== "string") return null;
  const raw = input.trim();
  if (!raw || raw.length > 2000 || /\s/.test(raw)) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

async function optional(url: URL) {
  try {
    const r = await safeFetch(url, { maxBytes: 200_000, timeoutMs: 5000 });
    return r.status === 200 ? r : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  // Requiring JSON stops other websites from posting here with a plain form.
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail("Send the link as JSON.", 415);
  }
  const body = (await request.json().catch(() => null)) as { url?: unknown } | null;
  const url = parseUrl(body?.url);
  if (!url) return fail("Enter a website address, like example.com.", 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return fail("Too many checks in a short time. Try again in a few minutes.", 429);

  try {
    const page = await safeFetch(url);
    if (page.status >= 400) {
      return fail(
        `The website answered with error ${page.status}. It may be down, or it may block automated checks.`,
        422,
      );
    }
    if (!/html/i.test(String(page.headers["content-type"] ?? ""))) {
      return fail("That link is not a web page. Enter a page address, not a file.", 422);
    }

    const origin = new URL(page.url).origin;
    const robots = await optional(new URL("/robots.txt", origin));
    // An HTML "page not found" served with status 200 is not a robots file.
    const robotsTxt = robots && !/html/i.test(String(robots.headers["content-type"] ?? "")) ? robots.body : null;

    let sitemapUrl: string | null = null;
    const listed = robotsTxt ? /^\s*sitemap\s*:\s*(\S+)/im.exec(robotsTxt)?.[1] : undefined;
    if (listed) {
      sitemapUrl = listed;
    } else {
      const sitemap = await optional(new URL("/sitemap.xml", origin));
      if (sitemap && /<(urlset|sitemapindex)[\s>]/i.test(sitemap.body)) sitemapUrl = sitemap.url;
    }

    return NextResponse.json(
      analyzePage({
        url: page.url,
        status: page.status,
        headers: page.headers,
        html: page.body,
        bytes: page.bytes,
        truncated: page.truncated,
        redirects: page.redirects,
        ms: page.ms,
        robotsTxt,
        sitemapUrl,
      }),
      { headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    if (e instanceof FetchError) return fail(e.message, 422);
    console.error("seo-audit failed:", e instanceof Error ? e.message : e);
    return fail("Something went wrong while checking that page. Please try again.", 500);
  }
}

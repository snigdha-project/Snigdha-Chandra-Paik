/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Publishes the starter tools (scripts/tools-data.ts) to WordPress.
 *
 *   npm run seed:tools            # create / update
 *   npm run seed:tools -- --dry   # validate only
 *   npm run seed:tools -- --only=slug-a,slug-b   # just these tools
 *
 * Needs the "Portfolio Tools" plugin (wordpress/portfolio-tools.zip) installed on the
 * WordPress site, and WP_URL / WP_USER / WP_APP_PASSWORD in .env.local.
 * Idempotent: tools are matched by slug.
 */

import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { SEED_TOOLS } from "./tools-data";
import { parseToolConfig, calculate } from "../src/lib/toolEngine";

loadEnv({ path: resolve(process.cwd(), ".env.local") });

const DRY = process.argv.includes("--dry");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",").filter(Boolean);
const TOOLS = ONLY ? SEED_TOOLS.filter((t) => ONLY.includes(t.slug)) : SEED_TOOLS;
if (ONLY && TOOLS.length !== ONLY.length) {
  console.error(`Unknown slug in --only. Known: ${SEED_TOOLS.map((t) => t.slug).join(", ")}`);
  process.exit(1);
}
const WP_URL = (process.env.WP_URL ?? "https://portfolio-cms.wasmer.app").replace(/\/$/, "");
const USER = process.env.WP_USER;
const PASS = process.env.WP_APP_PASSWORD;
if (!USER || !PASS) {
  console.error("Missing WP_USER or WP_APP_PASSWORD in .env.local");
  process.exit(1);
}
const AUTH = "Basic " + Buffer.from(`${USER}:${PASS}`).toString("base64");

async function wp(path: string, init: RequestInit = {}) {
  const res = await fetch(`${WP_URL}/wp-json${path}`, {
    ...init,
    headers: { Authorization: AUTH, "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const text = await res.text();
  let body: any = text;
  try {
    body = JSON.parse(text);
  } catch {
    /* non-JSON */
  }
  return { status: res.status, body };
}

const htmlBlock = (html: string) => `<!-- wp:html -->\n${html}\n<!-- /wp:html -->`;

async function main() {
  console.log(`Target: ${WP_URL}${DRY ? " (dry run)" : ""}`);

  // 1. Every tool must be valid for its type, using the site's own parsers.
  for (const t of TOOLS) {
    if (t.type === "calculator") {
      const cfg = parseToolConfig(JSON.stringify(t.config));
      if (!cfg) throw new Error(`${t.slug}: config is invalid`);
      const inputs = Object.fromEntries(cfg.inputs.map((i) => [i.key, i.default]));
      const r = calculate(cfg, inputs);
      const bad = Object.entries(r.values).filter(([, v]) => Number.isNaN(v)).map(([k]) => k);
      if (bad.length) throw new Error(`${t.slug}: outputs not computable with defaults: ${bad.join(", ")}`);
      console.log(`  ✓ ${t.slug} validates (${cfg.inputs.length} inputs, ${cfg.outputs.length} outputs)`);
    } else if (t.type === "embed") {
      if (!t.code?.trim()) throw new Error(`${t.slug}: embed tool has no code`);
      console.log(`  ✓ ${t.slug} validates (embed, ${t.code.length} chars)`);
    } else {
      console.log(`  ✓ ${t.slug} validates (${t.type})`);
    }
  }
  if (DRY) return;

  const probe = await wp("/wp/v2/tools?per_page=1");
  if (probe.status === 404) {
    console.error("\nThe 'tool' post type is not on the WordPress site.\nInstall + activate wordpress/portfolio-tools.zip (Plugins → Add New → Upload) and run again.");
    process.exit(1);
  }

  // 2. Upsert by slug.
  for (const t of TOOLS) {
    const found = await wp(`/wp/v2/tools?slug=${t.slug}&status=any&per_page=1`);
    const payload = {
      title: t.title,
      status: "publish",
      excerpt: t.excerpt,
      content: htmlBlock(t.content),
      menu_order: t.order,
      meta: {
        pp_tool_type: t.type,
        pp_tool_category: t.category,
        pp_tool_icon: t.icon,
        pp_tool_config: JSON.stringify(t.config),
        pp_tool_faq: JSON.stringify(t.faq),
        ...(t.code ? { pp_tool_code: t.code } : {}),
        _yoast_wpseo_title: t.metaTitle,
        _yoast_wpseo_metadesc: t.metaDescription,
      },
    };
    const existing = found.body?.[0];
    const r = existing
      ? await wp(`/wp/v2/tools/${existing.id}`, { method: "POST", body: JSON.stringify(payload) })
      : await wp("/wp/v2/tools", { method: "POST", body: JSON.stringify({ ...payload, slug: t.slug }) });
    if (r.status >= 300) {
      console.error(`  ✗ ${t.slug}: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
      process.exitCode = 1;
    } else {
      console.log(`  ✓ ${existing ? "updated" : "created"} ${t.slug} #${r.body.id}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

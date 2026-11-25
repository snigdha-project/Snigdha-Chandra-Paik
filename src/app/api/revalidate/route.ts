import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { WP_CACHE_TAG } from "@/lib/wordpress";

// Called by the "Portfolio Projects" WordPress plugin whenever a post or
// project is published/updated. Requires REVALIDATE_SECRET to match.
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    type?: string;
    slug?: string;
  };

  revalidateTag(WP_CACHE_TAG, "max");
  revalidatePath("/");
  if (body.type === "project") {
    revalidatePath("/projects");
    if (body.slug) revalidatePath(`/projects/${body.slug}`);
  } else {
    revalidatePath("/blogs");
    if (body.slug) revalidatePath(`/blogs/${body.slug}`);
  }
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true });
}

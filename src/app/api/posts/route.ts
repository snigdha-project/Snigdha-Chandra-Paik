import { NextResponse, type NextRequest } from "next/server";
import { getLocalPosts } from "@/lib/blogService";

// Paginated post list for the /blogs infinite scroll + search (client side).
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const limit = Math.min(Math.max(Number(params.get("limit")) || 3, 1), 200);
  const offset = Math.max(Number(params.get("offset")) || 0, 0);
  const posts = await getLocalPosts(limit, offset);
  return NextResponse.json(posts, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}

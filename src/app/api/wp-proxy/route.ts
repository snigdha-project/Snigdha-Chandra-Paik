// src/app/api/wp-proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const slug = searchParams.get("slug");
  const per_page = searchParams.get("per_page") || "10";
  const offset = searchParams.get("offset") || "0";

  // Base URL with _embed to ensure we get images/categories
  let wpUrl = `https://blogsforme.wasmer.app/wp-json/wp/v2/posts?_embed`;

  // CRITICAL: If a slug exists, we must tell WordPress to filter by it
  if (slug) {
    wpUrl += `&slug=${slug}`;
  } else {
    wpUrl += `&per_page=${per_page}&offset=${offset}`;
  }

  try {
    const res = await fetch(wpUrl);
    const data = await res.json();

    // Return the data as JSON
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Fetch failed" }, { status: 500 });
  }
}

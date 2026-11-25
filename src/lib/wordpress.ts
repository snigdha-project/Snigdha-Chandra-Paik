// Minimal WPGraphQL client. Server-only: public content is read without
// credentials (only published content is exposed by WPGraphQL).

const ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_URL ?? "https://portfolio-cms.wasmer.app/graphql";

// Cache tag shared by every WordPress request; /api/revalidate expires it.
export const WP_CACHE_TAG = "wordpress";
const REVALIDATE_SECONDS = 300;

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function wpQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE_SECONDS, tags: [WP_CACHE_TAG] },
  });
  if (!res.ok) {
    throw new Error(`WordPress GraphQL HTTP ${res.status}`);
  }
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length || !json.data) {
    throw new Error(
      `WordPress GraphQL error: ${json.errors?.map((e) => e.message).join("; ") ?? "no data"}`,
    );
  }
  return json.data;
}

type Page<N> = {
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  nodes: N[];
};

/**
 * Walks every page of a connection (WPGraphQL caps `first` at 100).
 * `query` must accept `$after: String` and return the connection at
 * `data[rootField]` with `pageInfo { hasNextPage endCursor }` and `nodes`.
 */
export async function wpQueryAll<N>(
  query: string,
  rootField: string,
): Promise<N[]> {
  const out: N[] = [];
  let after: string | null = null;
  for (let guard = 0; guard < 50; guard++) {
    const data: Record<string, Page<N>> = await wpQuery(query, { after });
    const page: Page<N> = data[rootField];
    out.push(...page.nodes);
    if (!page.pageInfo.hasNextPage || !page.pageInfo.endCursor) break;
    after = page.pageInfo.endCursor;
  }
  return out;
}

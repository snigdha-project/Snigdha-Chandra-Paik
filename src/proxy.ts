import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  isSessionValueValid,
} from "@/lib/admin-session";

// Note: In Next.js 16, "Middleware" was renamed to "Proxy". The file
// must be named `proxy.ts` and the export must be `proxy` (or default).

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always set noindex on /admin/* responses, even successful ones, as belt-
  // and-suspenders alongside the per-page robots metadata.
  const noindexHeaders = (res: NextResponse) => {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  };

  // /admin/login is the only public admin route.
  if (pathname === "/admin/login") {
    return noindexHeaders(NextResponse.next());
  }

  // Everything else under /admin requires a valid session cookie.
  const sessionValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const ok = await isSessionValueValid(sessionValue);
  if (!ok) {
    const loginUrl = new URL("/admin/login", request.url);
    return noindexHeaders(NextResponse.redirect(loginUrl));
  }

  return noindexHeaders(NextResponse.next());
}

export const config = {
  matcher: "/admin/:path*",
};

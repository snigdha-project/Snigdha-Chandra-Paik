import "server-only";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  SESSION_TTL_MS,
  createSessionCookieValue,
  isSessionValueValid,
  safeEqual,
} from "./admin-session";

function getPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD is missing.");
  return pw;
}

export async function verifyPassword(submitted: string): Promise<boolean> {
  const expected = getPassword();
  if (submitted.length !== expected.length) {
    // Dummy compare to keep timing roughly constant.
    safeEqual(submitted.padEnd(expected.length, "x"), expected);
    return false;
  }
  return safeEqual(submitted, expected);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const value = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return isSessionValueValid(value);
}

export async function setAdminSessionCookie(): Promise<void> {
  const value = await createSessionCookieValue();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

// ---------- naive in-memory login rate limiter ----------
const ATTEMPT_WINDOW_MS = 1000 * 60 * 15; // 15 min
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; firstAt: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; retryInSec: number } {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.firstAt > ATTEMPT_WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
    return { allowed: true, retryInSec: 0 };
  }
  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryInSec: Math.ceil((ATTEMPT_WINDOW_MS - (now - entry.firstAt)) / 1000),
    };
  }
  return { allowed: true, retryInSec: 0 };
}

export function clearRateLimit(ip: string): void {
  attempts.delete(ip);
}

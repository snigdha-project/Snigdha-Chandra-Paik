// Pure crypto helpers for the admin session cookie.
// Safe to import from anywhere (Server Components, Server Actions, and proxy.ts).
// Must NOT import next/headers or server-only — proxy.ts needs to use this.

export const ADMIN_COOKIE_NAME = "admin_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short (must be 32+ chars).",
    );
  }
  return secret;
}

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(payload: string): Promise<string> {
  const key = await importKey(getSecret());
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(sig);
}

// Timing-safe string compare (works in Edge runtime — no Buffer needed).
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionCookieValue(): Promise<string> {
  const expiry = String(Date.now() + SESSION_TTL_MS);
  const sig = await sign(expiry);
  return `${expiry}.${sig}`;
}

export async function isSessionValueValid(
  value: string | undefined | null,
): Promise<boolean> {
  if (!value) return false;
  const [expiryStr, sig] = value.split(".");
  if (!expiryStr || !sig) return false;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  const expectedSig = await sign(expiryStr);
  return safeEqual(sig, expectedSig);
}

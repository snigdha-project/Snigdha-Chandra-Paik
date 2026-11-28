// Server-only fetch for URLs typed in by visitors (the SEO audit tool).
// It must never reach anything that is not on the public internet, so:
// - only http/https on the default ports, no credentials in the URL
// - every resolved address is checked at connect time (also on each redirect),
//   which also covers DNS names that point at private ranges
// - response size and total time are capped
import http, { type IncomingMessage, type IncomingHttpHeaders } from "node:http";
import https from "node:https";
import dns from "node:dns";
import net from "node:net";
import zlib from "node:zlib";
import type { Readable } from "node:stream";

export class FetchError extends Error {}

const blockedV4 = new net.BlockList();
for (const [ip, bits] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  blockedV4.addSubnet(ip, bits, "ipv4");
}

// IPv6: allow only global unicast, minus ranges that can tunnel to IPv4.
const globalV6 = new net.BlockList();
globalV6.addSubnet("2000::", 3, "ipv6");
const blockedV6 = new net.BlockList();
blockedV6.addSubnet("2001::", 32, "ipv6"); // Teredo
blockedV6.addSubnet("2001:db8::", 32, "ipv6"); // documentation
blockedV6.addSubnet("2002::", 16, "ipv6"); // 6to4

export function isPublicAddress(ip: string): boolean {
  const family = net.isIP(ip);
  if (family === 4) return !blockedV4.check(ip, "ipv4");
  if (family === 6) return globalV6.check(ip, "ipv6") && !blockedV6.check(ip, "ipv6");
  return false;
}

const NOT_PUBLIC = "That address is not a public website.";

export function assertSafeUrl(url: URL): void {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new FetchError("Only http and https links can be checked.");
  }
  if (url.username || url.password || url.port) throw new FetchError(NOT_PUBLIC);
  const host = url.hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "");
  // IP literals skip DNS lookup entirely, so they are checked here.
  if (net.isIP(host)) {
    if (!isPublicAddress(host)) throw new FetchError(NOT_PUBLIC);
    return;
  }
  if (!host.includes(".") || /\.(localhost|local|internal|lan|home\.arpa)$/i.test(host)) {
    throw new FetchError(NOT_PUBLIC);
  }
}

const safeLookup: net.LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { all: true, family: options.family }, (err, addresses) => {
    if (err) return callback(err, "", 4);
    if (!addresses.length || !addresses.every((a) => isPublicAddress(a.address))) {
      return callback(new FetchError(NOT_PUBLIC), "", 4);
    }
    if (options.all) return callback(null, addresses);
    callback(null, addresses[0].address, addresses[0].family);
  });
};

export type FetchResult = {
  url: string;
  status: number;
  headers: IncomingHttpHeaders;
  body: string;
  bytes: number;
  truncated: boolean;
  redirects: number;
  ms: number;
};

type Single = { status: number; headers: IncomingHttpHeaders; body: Buffer; truncated: boolean };

function requestOnce(url: URL, signal: AbortSignal, maxBytes: number): Promise<Single> {
  return new Promise((resolve, reject) => {
    const lib = url.protocol === "https:" ? https : http;
    const req = lib.request(
      url,
      {
        agent: false,
        lookup: safeLookup,
        signal,
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; SEOHealthCheck/1.0)",
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "accept-encoding": "gzip, deflate, br",
        },
      },
      (res: IncomingMessage) => {
        const status = res.statusCode ?? 0;
        const headers = res.headers;
        if (status >= 300 && status < 400 && headers.location) {
          res.destroy();
          return resolve({ status, headers, body: Buffer.alloc(0), truncated: false });
        }
        const encoding = String(headers["content-encoding"] ?? "").toLowerCase();
        let stream: Readable = res;
        if (encoding === "gzip") stream = res.pipe(zlib.createGunzip());
        else if (encoding === "deflate") stream = res.pipe(zlib.createInflate());
        else if (encoding === "br") stream = res.pipe(zlib.createBrotliDecompress());

        const chunks: Buffer[] = [];
        let size = 0;
        let done = false;
        const finish = (truncated: boolean) => {
          if (done) return;
          done = true;
          resolve({ status, headers, body: Buffer.concat(chunks), truncated });
          res.destroy();
        };
        const fail = (e: Error) => {
          if (done) return;
          done = true;
          reject(e);
          res.destroy();
        };
        stream.on("data", (chunk: Buffer) => {
          if (done) return;
          const room = maxBytes - size;
          chunks.push(chunk.subarray(0, room));
          size += Math.min(chunk.length, room);
          if (chunk.length >= room) finish(true);
        });
        stream.on("end", () => finish(false));
        stream.on("error", fail);
        res.on("error", fail);
        res.on("aborted", () => fail(new FetchError("The website closed the connection.")));
      },
    );
    req.on("error", reject);
    req.end();
  });
}

function decode(body: Buffer, contentType: string): string {
  const charset = /charset=["']?([\w-]+)/i.exec(contentType)?.[1] ?? "utf-8";
  try {
    return new TextDecoder(charset).decode(body);
  } catch {
    return new TextDecoder("utf-8").decode(body);
  }
}

export async function safeFetch(
  input: URL,
  { maxBytes = 2_000_000, timeoutMs = 10_000, maxRedirects = 5 } = {},
): Promise<FetchResult> {
  const started = Date.now();
  const signal = AbortSignal.timeout(timeoutMs);
  let url = input;

  for (let redirects = 0; redirects <= maxRedirects; redirects++) {
    assertSafeUrl(url);
    let res: Single;
    try {
      res = await requestOnce(url, signal, maxBytes);
    } catch (e) {
      if (e instanceof FetchError) throw e;
      if (signal.aborted) throw new FetchError("The website took too long to respond.");
      const code = (e as NodeJS.ErrnoException).code ?? "";
      if (code === "ENOTFOUND") throw new FetchError("That domain could not be found. Check the spelling.");
      if (/CERT|SSL|TLS|SELF_SIGNED/i.test(code)) {
        throw new FetchError("The website's SSL certificate is invalid, so browsers will warn visitors.");
      }
      throw new FetchError("Could not connect to that website.");
    }

    if (res.status >= 300 && res.status < 400 && res.headers.location) {
      try {
        url = new URL(res.headers.location, url);
      } catch {
        throw new FetchError("The website sent a broken redirect.");
      }
      continue;
    }

    return {
      url: url.href,
      status: res.status,
      headers: res.headers,
      body: decode(res.body, String(res.headers["content-type"] ?? "")),
      bytes: res.body.length,
      truncated: res.truncated,
      redirects,
      ms: Date.now() - started,
    };
  }
  throw new FetchError("Too many redirects.");
}

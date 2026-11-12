// PostHog is ~100KB (gzipped) of JavaScript, so it is loaded on demand instead
// of being bundled into every page. getPostHog() initialises it once and
// returns the instance (or null when no token is configured).
type PostHog = typeof import("posthog-js").default;

let instance: Promise<PostHog | null> | null = null;

export function getPostHog(): Promise<PostHog | null> {
  if (!instance) {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    if (!token) {
      instance = Promise.resolve(null);
    } else {
      instance = import("posthog-js").then(({ default: posthog }) => {
        posthog.init(token, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
          defaults: "2026-01-30",
          capture_exceptions: true,
          disable_surveys: true, // surveys bundle is unused on this site
        });
        return posthog;
      });
    }
  }
  return instance;
}

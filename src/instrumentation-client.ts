import posthog from "posthog-js";
import { runWhenIdleOrInteracted } from "./lib/defer";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

// Analytics must never compete with rendering/hydration, so it starts after
// load on first interaction (or after a short delay), not during startup.
runWhenIdleOrInteracted(() => {
  if (!token) return;
  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2026-01-30",
    capture_exceptions: true,
    disable_surveys: true, // surveys bundle is unused on this site
  });
});

import { runWhenIdleOrInteracted } from "./lib/defer";
import { getPostHog } from "./lib/posthog";

// Analytics must never compete with rendering/hydration: the PostHog bundle is
// not even downloaded until after load + first interaction (or a short delay).
runWhenIdleOrInteracted(() => {
  void getPostHog();
});

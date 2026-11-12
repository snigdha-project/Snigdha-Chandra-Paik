"use client";

import { useEffect } from "react";
import { getPostHog } from "@/lib/posthog";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // loads PostHog on demand (and initialises it if it hasn't started yet)
    void getPostHog().then((posthog) => posthog?.captureException(error));
  }, [error]);

  return (
    <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
      <h2>Something went wrong</h2>
      <button onClick={() => unstable_retry()}>Try again</button>
    </div>
  );
}

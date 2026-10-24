"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
      <h2>Something went wrong</h2>
      <button onClick={() => unstable_retry()}>Try again</button>
    </div>
  );
}

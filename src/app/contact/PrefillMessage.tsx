"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Fills the "Project Details" box from /contact?message=... (used by the CTA on
// the tool pages). It lives in its own small client component so reading the URL
// does not make the whole contact page client-rendered. The value is set as
// plain text on an uncontrolled textarea, so it cannot inject markup, and the
// visitor can edit it before sending.
export default function PrefillMessage() {
  const params = useSearchParams();
  const message = params.get("message");

  useEffect(() => {
    if (!message) return;
    const field = document.querySelector<HTMLTextAreaElement>(
      'textarea[name="MultiLine"]',
    );
    if (!field || field.value) return; // never overwrite what the visitor typed

    const text = message.slice(0, 2000);
    field.value = text;
    field.rows = Math.min(Math.max(text.split("\n").length, 3), 12);
    field.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [message]);

  return null;
}

"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteButton({
  action,
  slug,
  label,
}: {
  action: (formData: FormData) => Promise<void>;
  slug: string;
  label: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${label}"?\nThis cannot be undone.`)) {
          e.preventDefault();
        }
      }}
      action={(formData) => startTransition(() => action(formData))}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] font-black px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/40 disabled:opacity-40 transition-colors"
      >
        <Trash2 size={11} />
        {pending ? "Deleting…" : "Delete"}
      </button>
    </form>
  );
}

"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

// Static class strings — kept as literals so Tailwind's JIT picks the utilities up.
const COPY_BTN_CLASS =
  "absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-[0.25em] font-black text-white/55 border border-white/15 bg-white/5 backdrop-blur-md hover:text-white hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer";

const COPIED_FLASH_CLASS = "text-[#C56E3D]";

const LANG_LABEL_CLASS =
  "absolute top-3 left-5 z-10 inline-flex items-center px-2 py-[3px] rounded-md text-[9px] uppercase tracking-[0.3em] font-black text-[#C56E3D] border border-[#C56E3D]/30 bg-[#C56E3D]/5 backdrop-blur-md pointer-events-none";

function extractLanguage(code: HTMLElement): string | null {
  const cls = code.className || "";
  const match = cls.match(/language-([\w-]+)/i);
  if (match) return match[1];
  return null;
}

export default function CodeBlockEnhancer({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const pres = Array.from(root.querySelectorAll("pre"));
    const createdEls: HTMLElement[] = [];

    pres.forEach((pre) => {
      // Safety net — Tailwind's [&_pre]:relative already sets position.
      if (getComputedStyle(pre).position === "static") {
        pre.style.position = "relative";
      }

      const code = pre.querySelector("code");

      // 1. SYNTAX HIGHLIGHT — only the inner <code>, only once.
      if (code && !code.dataset.highlighted) {
        try {
          hljs.highlightElement(code as HTMLElement);
        } catch {
          // hljs silently fails for unknown languages — leave the plain text.
        }
        code.dataset.highlighted = "yes";
      }

      // 2. LANGUAGE LABEL (top-left) — if class declares one.
      if (code && !pre.querySelector("[data-lang-label]")) {
        const lang = extractLanguage(code as HTMLElement);
        if (lang) {
          const label = document.createElement("span");
          label.setAttribute("data-lang-label", "");
          label.className = LANG_LABEL_CLASS;
          label.textContent = lang;
          pre.appendChild(label);
          createdEls.push(label);
        }
      }

      // 3. COPY BUTTON (top-right) — once per pre.
      if (!pre.querySelector("[data-copy-btn]")) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-copy-btn", "");
        btn.setAttribute("aria-label", "Copy code to clipboard");
        btn.className = COPY_BTN_CLASS;
        btn.textContent = "Copy";

        let resetTimer: ReturnType<typeof setTimeout> | undefined;
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          const text =
            pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
          try {
            await navigator.clipboard.writeText(text);
            btn.textContent = "Copied";
            btn.classList.add(COPIED_FLASH_CLASS);
          } catch {
            btn.textContent = "Failed";
          }
          if (resetTimer) clearTimeout(resetTimer);
          resetTimer = setTimeout(() => {
            btn.textContent = "Copy";
            btn.classList.remove(COPIED_FLASH_CLASS);
          }, 1800);
        });

        pre.appendChild(btn);
        createdEls.push(btn);
      }
    });

    return () => {
      createdEls.forEach((el) => el.remove());
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}

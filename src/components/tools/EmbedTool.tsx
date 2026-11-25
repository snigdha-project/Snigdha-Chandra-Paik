"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EmbedConfig } from "@/lib/toolTypes";

// Tool authors paste their own HTML/CSS/JS in WordPress. It runs in a sandboxed
// iframe WITHOUT allow-same-origin, so it gets a unique opaque origin: it cannot
// read this page, its cookies or storage, or call our APIs as the visitor.
const SANDBOX = "allow-scripts allow-forms allow-popups allow-downloads allow-modals";

const BASE_CSS =
  "html,body{margin:0;padding:0}" +
  "body{font:16px/1.6 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#fff;background:transparent}" +
  "*,*::before,*::after{box-sizing:border-box}" +
  "input,select,textarea,button{font:inherit}" +
  "#ptl-root{display:flow-root}";

// Reports the content height to the parent so the frame can grow with it.
const HEIGHT_SCRIPT =
  "<script>(function(){var r=document.getElementById('ptl-root');" +
  "function s(){parent.postMessage({type:'ptl-height',height:r.getBoundingClientRect().height},'*')}" +
  "if(window.ResizeObserver){new ResizeObserver(s).observe(r)}" +
  "window.addEventListener('load',s);s()})()</script>";

function buildDoc(code: string, autoHeight: boolean): string {
  return (
    `<!doctype html><html><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<style>${BASE_CSS}</style></head><body><div id="ptl-root">${code}</div>` +
    `${autoHeight ? HEIGHT_SCRIPT : ""}</body></html>`
  );
}

export default function EmbedTool({
  code,
  config,
  title,
}: {
  code: string;
  config: EmbedConfig;
  title: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(config.height);
  const doc = useMemo(() => buildDoc(code, config.autoHeight), [code, config.autoHeight]);

  useEffect(() => {
    if (!config.autoHeight) return;
    const onMessage = (e: MessageEvent) => {
      // Only trust messages from our own frame.
      if (e.source !== frame.current?.contentWindow) return;
      const d = e.data as { type?: string; height?: unknown } | null;
      if (d?.type === "ptl-height" && typeof d.height === "number") {
        setHeight(Math.min(Math.max(Math.ceil(d.height) + 2, 120), 4000));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [config.autoHeight]);

  return (
    <div className="rounded-[2rem] bg-[#0F0F0F] border border-white/5 p-4 md:p-8">
      <iframe
        ref={frame}
        title={title}
        srcDoc={doc}
        sandbox={SANDBOX}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="block w-full border-0 bg-transparent"
        style={{ height }}
      />
    </div>
  );
}

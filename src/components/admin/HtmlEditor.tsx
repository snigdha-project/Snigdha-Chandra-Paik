"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { html } from "@codemirror/lang-html";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Sparkles, Code2 } from "lucide-react";

// Editor touches the DOM — render it only on the client.
const CodeMirror = dynamic(
  () => import("@uiw/react-codemirror").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] flex items-center justify-center bg-[#1E1E1E] rounded-xl border border-white/10">
        <div className="w-5 h-5 rounded-full border-2 border-[#C56E3D] border-t-transparent animate-spin" />
      </div>
    ),
  },
);

export default function HtmlEditor({
  name,
  defaultValue = "",
  placeholder,
  minHeight = "320px",
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  minHeight?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [prettierChecked, setPrettierChecked] = useState(false);
  const [formatting, setFormatting] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);

  async function handlePrettierToggle(checked: boolean) {
    if (!checked) {
      setPrettierChecked(false);
      return;
    }
    setPrettierChecked(true);
    setFormatError(null);
    setFormatting(true);
    try {
      // Lazy-load Prettier so it doesn't sit in the admin's initial bundle.
      const [prettier, htmlPlugin] = await Promise.all([
        import("prettier/standalone"),
        import("prettier/plugins/html"),
      ]);
      const formatted = await prettier.format(value, {
        parser: "html",
        plugins: [htmlPlugin],
        printWidth: 100,
        tabWidth: 2,
        htmlWhitespaceSensitivity: "ignore",
      });
      setValue(formatted);
    } catch (err) {
      setFormatError(
        err instanceof Error ? err.message : "Could not format the HTML.",
      );
    } finally {
      setFormatting(false);
      setPrettierChecked(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-white/45 font-black">
          <span className="inline-flex items-center gap-1.5">
            <Code2 size={11} className="text-[#C56E3D]" />
            HTML
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{value.length} chars</span>
        </div>

        <div className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            id={`prettier-${name}`}
            checked={prettierChecked || formatting}
            disabled={formatting || !value.trim()}
            onChange={(e) => handlePrettierToggle(e.target.checked)}
            className="w-4 h-4 accent-[#C56E3D] disabled:opacity-40 cursor-pointer"
          />
          <label
            htmlFor={`prettier-${name}`}
            className={`text-[10px] uppercase tracking-[0.3em] font-black inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              formatting
                ? "text-[#C56E3D]"
                : "text-white/60 hover:text-[#C56E3D]"
            }`}
          >
            <Sparkles size={11} />
            {formatting ? "Formatting…" : "Prettier"}
          </label>
        </div>
      </div>

      {/* Editor */}
      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1E1E1E] focus-within:border-[#C56E3D]/40 transition-colors">
        <CodeMirror
          value={value}
          onChange={(v) => setValue(v)}
          extensions={[html()]}
          theme={vscodeDark}
          placeholder={placeholder}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            foldGutter: true,
            autocompletion: true,
            tabSize: 2,
            bracketMatching: true,
            closeBrackets: true,
          }}
          style={{ fontSize: 13 }}
          minHeight={minHeight}
        />
      </div>

      {formatError && (
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF6B6B] font-black">
          {formatError}
        </p>
      )}

      {/* The actual form field — keeps state and CodeMirror's editor in sync
          so the server action receives the latest value via FormData. */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

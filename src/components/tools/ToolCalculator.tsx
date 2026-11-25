"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Info, RotateCcw, Lightbulb } from "lucide-react";
import {
  calculate,
  formatValue,
  type ToolConfig,
  type ToolInput,
} from "@/lib/toolEngine";

const defaults = (config: ToolConfig) =>
  Object.fromEntries(config.inputs.map((i) => [i.key, String(i.default)]));

function clamp(n: number, i: ToolInput): number {
  if (!Number.isFinite(n)) return 0;
  let v = n;
  if (i.min !== undefined) v = Math.max(v, i.min);
  if (i.max !== undefined) v = Math.min(v, i.max);
  return v;
}

// Builds the text that prefills the contact form's "Project Details" box.
function buildMessage(
  title: string,
  config: ToolConfig,
  raw: Record<string, string>,
  values: Record<string, number>,
): string {
  const inputLines = config.inputs.map((i) => {
    const v = parseFloat(raw[i.key] ?? "");
    const shown =
      i.type === "select"
        ? (i.options?.find((o) => o.value === v)?.label ?? raw[i.key])
        : `${i.prefix ?? ""}${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(Number.isNaN(v) ? 0 : v)}${i.suffix ?? ""}`;
    return `- ${i.label}: ${shown}`;
  });
  const resultLines = config.outputs
    .filter((o) => o.highlight)
    .map((o) => `- ${o.label}: ${formatValue(values[o.key], o)}`);
  return [
    `Hi Snigdha, I just used your "${title}" tool.`,
    "",
    config.cta.message.replace(/\{tool\}/g, title),
    "",
    "My numbers:",
    ...inputLines,
    ...(resultLines.length ? ["", "Estimated results:", ...resultLines] : []),
  ].join("\n");
}

export default function ToolCalculator({
  config,
  title,
}: {
  config: ToolConfig;
  title: string;
}) {
  // Raw strings so the user can clear a field while typing.
  const [raw, setRaw] = useState<Record<string, string>>(() => defaults(config));

  const result = useMemo(() => {
    const values: Record<string, number> = {};
    for (const i of config.inputs) {
      const parsed = parseFloat(raw[i.key] ?? "");
      values[i.key] = clamp(Number.isNaN(parsed) ? 0 : parsed, i);
    }
    return calculate(config, values);
  }, [config, raw]);

  const contactHref = useMemo(() => {
    const values: Record<string, number> = {};
    for (const i of config.inputs) {
      const parsed = parseFloat(raw[i.key] ?? "");
      values[i.key] = clamp(Number.isNaN(parsed) ? 0 : parsed, i);
    }
    const msg = buildMessage(title, config, raw, { ...values, ...result.values });
    return `/contact?message=${encodeURIComponent(msg)}`;
  }, [title, config, raw, result]);

  const highlighted = config.outputs.filter((o) => o.highlight);
  const regular = config.outputs.filter((o) => !o.highlight);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
      {/* INPUTS */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="lg:col-span-2 rounded-[2rem] bg-[#0F0F0F] border border-white/5 p-6 md:p-8 flex flex-col gap-6"
        aria-label="Calculator inputs"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#C56E3D] font-black">
            Your numbers
          </span>
          <button
            type="button"
            onClick={() => setRaw(defaults(config))}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-black text-white/50 hover:text-[#C56E3D] transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        {config.inputs.map((i) => {
          const id = `tool-${i.key}`;
          return (
            <div key={i.key} className="flex flex-col gap-2">
              <label
                htmlFor={id}
                className="text-sm font-bold text-white/85 leading-snug"
              >
                {i.label}
              </label>

              {i.type === "select" ? (
                <select
                  id={id}
                  value={raw[i.key]}
                  onChange={(e) => setRaw((r) => ({ ...r, [i.key]: e.target.value }))}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-[#C56E3D] transition-colors"
                >
                  {i.options?.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[#0F0F0F]">
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-stretch rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#C56E3D] transition-colors overflow-hidden">
                  {i.prefix && (
                    <span className="px-4 flex items-center text-white/45 font-bold border-r border-white/10">
                      {i.prefix}
                    </span>
                  )}
                  <input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    min={i.min}
                    max={i.max}
                    step={i.step ?? "any"}
                    value={raw[i.key]}
                    onChange={(e) => setRaw((r) => ({ ...r, [i.key]: e.target.value }))}
                    aria-describedby={i.help ? `${id}-help` : undefined}
                    className="w-full min-w-0 bg-transparent px-4 py-3.5 text-white font-semibold focus:outline-none"
                  />
                  {i.suffix && (
                    <span className="px-4 flex items-center text-white/45 font-bold border-l border-white/10">
                      {i.suffix}
                    </span>
                  )}
                </div>
              )}

              {i.help && (
                <p id={`${id}-help`} className="text-xs text-white/40 leading-relaxed">
                  {i.help}
                </p>
              )}
            </div>
          );
        })}
      </form>

      {/* RESULTS */}
      <div
        className="lg:col-span-3 flex flex-col gap-6"
        role="region"
        aria-live="polite"
        aria-label="Results"
      >
        {highlighted.length > 0 && (
          <div
            className={`grid gap-4 ${
              highlighted.length === 1
                ? "grid-cols-1"
                : highlighted.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            {highlighted.map((o) => (
              <div
                key={o.key}
                className="rounded-[2rem] bg-gradient-to-br from-[#C56E3D]/20 to-[#C56E3D]/5 border border-[#C56E3D]/30 p-6 md:p-7"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C56E3D] block">
                  {o.label}
                </span>
                <span className="mt-3 block font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-black text-white tracking-tighter break-words">
                  {formatValue(result.values[o.key], o)}
                </span>
                {o.help && (
                  <span className="mt-3 block text-xs text-white/50 leading-relaxed">
                    {o.help}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {regular.length > 0 && (
          <dl className="rounded-[2rem] bg-[#0F0F0F] border border-white/5 divide-y divide-white/5 overflow-hidden">
            {regular.map((o) => (
              <div
                key={o.key}
                className="flex items-baseline justify-between gap-6 px-6 md:px-8 py-4"
              >
                <dt className="text-sm text-white/65 font-medium">
                  {o.label}
                  {o.help && (
                    <span className="block text-xs text-white/35 font-normal mt-0.5">
                      {o.help}
                    </span>
                  )}
                </dt>
                <dd className="text-lg md:text-xl font-black text-white tabular-nums text-right shrink-0">
                  {formatValue(result.values[o.key], o)}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {result.insights.length > 0 && (
          <ul className="flex flex-col gap-3">
            {result.insights.map((text) => (
              <li
                key={text}
                className="flex gap-3 rounded-2xl border border-[#C56E3D]/25 bg-[#C56E3D]/[0.06] px-5 py-4 text-sm text-white/80 leading-relaxed"
              >
                <Lightbulb size={18} className="text-[#C56E3D] shrink-0 mt-0.5" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-[2rem] bg-gradient-to-br from-[#C56E3D]/20 to-[#C56E3D]/5 border border-[#C56E3D]/30 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl text-white font-black tracking-tighter leading-[1.05]">
              {config.cta.title}
            </h2>
            <p className="mt-2 text-white/60 leading-relaxed max-w-xl">{config.cta.text}</p>
          </div>
          <Link
            href={contactHref}
            className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#C56E3D] hover:bg-[#A64D32] text-white text-[10px] uppercase tracking-[0.35em] font-black transition-colors shrink-0"
          >
            {config.cta.button}
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {config.disclaimer && (
          <p className="flex gap-2 text-xs text-white/35 leading-relaxed">
            <Info size={14} className="shrink-0 mt-0.5" aria-hidden />
            {config.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}

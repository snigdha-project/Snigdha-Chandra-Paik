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
import {
  CURRENCIES,
  convertAmount,
  withSymbol,
  type CurrencyCode,
} from "@/lib/currencies";

const defaults = (config: ToolConfig) =>
  Object.fromEntries(config.inputs.map((i) => [i.key, String(i.default)]));

function clamp(n: number, i: ToolInput): number {
  if (!Number.isFinite(n)) return 0;
  let v = n;
  if (i.min !== undefined) v = Math.max(v, i.min);
  if (i.max !== undefined) v = Math.min(v, i.max);
  return v;
}

// An input is a money amount when its prefix or suffix uses the {cur} token.
const isMoney = (i: ToolInput) =>
  `${i.prefix ?? ""}${i.suffix ?? ""}`.includes("{cur}");

// Builds the text that prefills the contact form's "Project Details" box.
function buildMessage(
  title: string,
  config: ToolConfig,
  raw: Record<string, string>,
  values: Record<string, number>,
  symbol: string,
  locale: string,
): string {
  const inputLines = config.inputs.map((i) => {
    const v = parseFloat(raw[i.key] ?? "");
    const shown =
      i.type === "select"
        ? (i.options?.find((o) => o.value === v)?.label ?? raw[i.key])
        : `${withSymbol(i.prefix, symbol) ?? ""}${new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(Number.isNaN(v) ? 0 : v)}${withSymbol(i.suffix, symbol) ?? ""}`;
    return `- ${withSymbol(i.label, symbol)}: ${shown}`;
  });
  const resultLines = config.outputs
    .filter((o) => o.highlight)
    .map(
      (o) =>
        `- ${withSymbol(o.label, symbol)}: ${formatValue(
          values[o.key],
          { decimals: o.decimals, prefix: withSymbol(o.prefix, symbol), suffix: withSymbol(o.suffix, symbol) },
          locale,
        )}`,
    );
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
  const [currency, setCurrency] = useState<CurrencyCode>(
    config.currency?.default ?? "INR",
  );

  const cur = CURRENCIES[currency];
  // Config amounts are written in the config's default currency.
  const baseCurrency = config.currency?.default ?? "INR";
  const sym = (s: string | undefined) => withSymbol(s, cur.symbol);

  const changeCurrency = (next: CurrencyCode) => {
    if (next === currency) return;
    setRaw((prev) => {
      const out = { ...prev };
      for (const i of config.inputs) {
        if (i.type !== "number" || !isMoney(i)) continue;
        const n = parseFloat(prev[i.key] ?? "");
        if (!Number.isNaN(n)) out[i.key] = String(convertAmount(n, currency, next));
      }
      return out;
    });
    setCurrency(next);
  };

  const reset = () => {
    setCurrency(baseCurrency);
    setRaw(defaults(config));
  };

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
    const msg = buildMessage(
      title,
      config,
      raw,
      { ...values, ...result.values },
      cur.symbol,
      cur.locale,
    );
    return `/contact?message=${encodeURIComponent(msg)}`;
  }, [title, config, raw, result, cur]);

  const fmt = (v: number, o: { decimals: number; prefix?: string; suffix?: string }) =>
    formatValue(v, { decimals: o.decimals, prefix: sym(o.prefix), suffix: sym(o.suffix) }, cur.locale);

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
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-black text-white/50 hover:text-[#C56E3D] transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        {config.currency && config.currency.options.length > 1 && (
          <div className="flex flex-col gap-2">
            <label htmlFor="tool-currency" className="text-sm font-bold text-white/85">
              Currency
            </label>
            <select
              id="tool-currency"
              value={currency}
              onChange={(e) => changeCurrency(e.target.value as CurrencyCode)}
              className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-[#C56E3D] transition-colors"
            >
              {config.currency.options.map((code) => (
                <option key={code} value={code} className="bg-[#0F0F0F]">
                  {code} ({CURRENCIES[code].symbol.trim()})
                </option>
              ))}
            </select>
            <p className="text-xs text-white/40 leading-relaxed">
              Switching converts your amounts at approximate rates.
            </p>
          </div>
        )}

        {config.inputs.map((i) => {
          const id = `tool-${i.key}`;
          const prefix = sym(i.prefix);
          const suffix = sym(i.suffix);
          const help = sym(i.help);
          return (
            <div key={i.key} className="flex flex-col gap-2">
              <label
                htmlFor={id}
                className="text-sm font-bold text-white/85 leading-snug"
              >
                {sym(i.label)}
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
                  {prefix && (
                    <span className="px-4 flex items-center whitespace-nowrap text-white/45 font-bold border-r border-white/10">
                      {prefix}
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
                    aria-describedby={help ? `${id}-help` : undefined}
                    className="w-full min-w-0 bg-transparent px-4 py-3.5 text-white font-semibold focus:outline-none"
                  />
                  {suffix && (
                    <span className="px-4 flex items-center whitespace-nowrap text-white/45 font-bold border-l border-white/10">
                      {suffix}
                    </span>
                  )}
                </div>
              )}

              {help && (
                <p id={`${id}-help`} className="text-xs text-white/40 leading-relaxed">
                  {help}
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
                  {sym(o.label)}
                </span>
                <span className="mt-3 block font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-black text-white tracking-tighter break-words">
                  {fmt(result.values[o.key], o)}
                </span>
                {o.help && (
                  <span className="mt-3 block text-xs text-white/50 leading-relaxed">
                    {sym(o.help)}
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
                  {sym(o.label)}
                  {o.help && (
                    <span className="block text-xs text-white/35 font-normal mt-0.5">
                      {sym(o.help)}
                    </span>
                  )}
                </dt>
                <dd className="text-lg md:text-xl font-black text-white tabular-nums text-right shrink-0">
                  {fmt(result.values[o.key], o)}
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
                {sym(text)}
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
            {sym(config.disclaimer)}
          </p>
        )}
      </div>
    </div>
  );
}

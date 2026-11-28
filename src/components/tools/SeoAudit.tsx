"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Info,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import type { Check, CheckStatus, SeoReport } from "@/lib/seoAudit";
import type { SeoAuditConfig } from "@/lib/toolTypes";

const STATUS: Record<CheckStatus, { label: string; color: string; Icon: typeof CheckCircle2 }> = {
  fail: { label: "Fix", color: "text-red-400", Icon: XCircle },
  warn: { label: "Improve", color: "text-amber-300", Icon: AlertTriangle },
  pass: { label: "Good", color: "text-emerald-400", Icon: CheckCircle2 },
};

const scoreColor = (n: number) =>
  n >= 85 ? "text-emerald-400" : n >= 60 ? "text-amber-300" : "text-red-400";

const verdict = (n: number) =>
  n >= 85 ? "Healthy" : n >= 60 ? "Needs work" : "Serious problems";

// Most important problems first: failures, then warnings, by weight.
const problems = (report: SeoReport) =>
  report.checks
    .filter((c) => c.status !== "pass")
    .sort((a, b) => Number(b.status === "fail") - Number(a.status === "fail") || b.weight - a.weight);

function asText(report: SeoReport): string {
  const lines = report.checks.map(
    (c) => `[${STATUS[c.status].label}] ${c.label}: ${c.detail}${c.fix ? `\n    How to fix: ${c.fix}` : ""}`,
  );
  return [
    `SEO health report for ${report.url}`,
    `Score: ${report.score}/100 (${verdict(report.score)})`,
    `Checked: ${new Date(report.checkedAt).toLocaleString()}`,
    "",
    ...lines,
  ].join("\n");
}

function contactHref(report: SeoReport, config: SeoAuditConfig, title: string): string {
  const top = problems(report).slice(0, 8);
  const message = [
    `Hi Snigdha, I just used your "${title}" tool.`,
    "",
    config.cta.message.replace(/\{tool\}/g, title),
    "",
    `Website: ${report.url.slice(0, 200)}`,
    `SEO score: ${report.score}/100`,
    ...(top.length ? ["", "Problems found:", ...top.map((c) => `- ${c.label}`)] : []),
  ].join("\n");
  return `/contact?message=${encodeURIComponent(message)}`;
}

function CheckRow({ check }: { check: Check }) {
  const { Icon, color, label } = STATUS[check.status];
  return (
    <li className="flex gap-4 px-6 md:px-8 py-5">
      <Icon size={20} className={`${color} shrink-0 mt-0.5`} aria-hidden />
      <div className="min-w-0">
        <p className="text-white font-bold">
          {check.label} <span className="sr-only">: {label}</span>
        </p>
        <p className="text-sm text-white/55 leading-relaxed break-words">{check.detail}</p>
        {check.fix && (
          <p className="mt-1.5 text-sm text-white/80 leading-relaxed">
            <span className="text-[#C56E3D] font-bold">How to fix: </span>
            {check.fix}
          </p>
        )}
      </div>
    </li>
  );
}

export default function SeoAudit({ config, title }: { config: SeoAuditConfig; title: string }) {
  const [input, setInput] = useState("");
  const [report, setReport] = useState<SeoReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || !input.trim()) return;
    setLoading(true);
    setError("");
    setReport(null);
    setCopied(false);
    try {
      const res = await fetch("/api/seo-audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: input }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.checks) setReport(data as SeoReport);
      else setError(data?.error ?? "The check failed. Please try again.");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    }
    setLoading(false);
  };

  const copy = async () => {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(asText(report));
      setCopied(true);
    } catch {
      setError("Your browser did not allow copying.");
    }
  };

  const count = (s: CheckStatus) => report?.checks.filter((c) => c.status === s).length ?? 0;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <form
        onSubmit={run}
        className="rounded-[2rem] bg-[#0F0F0F] border border-white/5 p-6 md:p-8 flex flex-col gap-3"
      >
        <label htmlFor="seo-url" className="text-sm font-bold text-white/85">
          Website address
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="seo-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={2000}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="w-full min-w-0 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-4 text-white font-semibold focus:outline-none focus:border-[#C56E3D] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#C56E3D] hover:bg-[#A64D32] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] uppercase tracking-[0.35em] font-black transition-colors shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {loading ? "Checking" : "Check SEO"}
          </button>
        </div>
        <p className="text-xs text-white/40">Checks one page at a time. Nothing is saved.</p>
      </form>

      <div aria-live="polite" className="flex flex-col gap-6 md:gap-8">
        {error && (
          <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-200">
            {error}
          </p>
        )}
        {loading && <p className="text-white/50">Reading the page. This takes a few seconds.</p>}

        {report && (
          <>
            <div className="rounded-[2rem] bg-gradient-to-br from-[#C56E3D]/20 to-[#C56E3D]/5 border border-[#C56E3D]/30 p-6 md:p-8 flex flex-col md:flex-row gap-8 md:items-center">
              <div className="shrink-0">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C56E3D] block">
                  SEO health score
                </span>
                <span className={`mt-2 block font-[family-name:var(--font-fraunces)] text-7xl font-black tracking-tighter ${scoreColor(report.score)}`}>
                  {report.score}
                  <span className="text-2xl text-white/35">/100</span>
                </span>
                <span className="block text-white font-bold">{verdict(report.score)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/60 break-all">{report.url}</p>
                <p className="mt-2 text-sm font-bold">
                  <span className={STATUS.fail.color}>{count("fail")} to fix</span>
                  <span className="text-white/30"> · </span>
                  <span className={STATUS.warn.color}>{count("warn")} to improve</span>
                  <span className="text-white/30"> · </span>
                  <span className={STATUS.pass.color}>{count("pass")} good</span>
                </p>
                <dl className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {report.categoryScores.map((c) => (
                    <div key={c.name} className="rounded-xl bg-black/30 px-4 py-3">
                      <dt className="text-xs text-white/50">{c.name}</dt>
                      <dd className={`text-2xl font-black tabular-nums ${scoreColor(c.score)}`}>{c.score}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  type="button"
                  onClick={copy}
                  className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-white/60 hover:text-[#C56E3D] transition-colors"
                >
                  <Copy size={12} /> {copied ? "Report copied" : "Copy full report"}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 mb-3">
                Approximate Google preview
              </p>
              <p className="text-sm text-[#202124] break-all">{report.preview.url}</p>
              <p className="text-xl text-[#1a0dab] break-words">{report.preview.title}</p>
              <p className="text-sm text-[#4d5156] leading-relaxed break-words">{report.preview.description}</p>
            </div>

            {report.categoryScores.map((cat) => (
              <section key={cat.name}>
                <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#C56E3D] font-black mb-3">
                  {cat.name}
                </h2>
                <ul className="rounded-[2rem] bg-[#0F0F0F] border border-white/5 divide-y divide-white/5 overflow-hidden">
                  {report.checks
                    .filter((c) => c.category === cat.name)
                    .map((c) => (
                      <CheckRow key={c.id} check={c} />
                    ))}
                </ul>
              </section>
            ))}

            <div className="rounded-[2rem] bg-gradient-to-br from-[#C56E3D]/20 to-[#C56E3D]/5 border border-[#C56E3D]/30 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl text-white font-black tracking-tighter leading-[1.05]">
                  {config.cta.title}
                </h2>
                <p className="mt-2 text-white/60 leading-relaxed max-w-xl">{config.cta.text}</p>
              </div>
              <Link
                href={contactHref(report, config, title)}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#C56E3D] hover:bg-[#A64D32] text-white text-[10px] uppercase tracking-[0.35em] font-black transition-colors shrink-0"
              >
                {config.cta.button}
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </>
        )}
      </div>

      <p className="flex gap-2 text-xs text-white/35 leading-relaxed">
        <Info size={14} className="shrink-0 mt-0.5" aria-hidden />
        {config.disclaimer}
      </p>
    </div>
  );
}

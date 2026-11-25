"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Loader2, ShieldCheck, Trash2, TriangleAlert } from "lucide-react";
import type { ImageCompressorConfig } from "@/lib/toolTypes";

type Item = {
  id: string;
  file: File;
  status: "queued" | "working" | "done" | "error";
  blob?: Blob;
  url?: string;
  width?: number;
  height?: number;
  error?: string;
};

type Settings = { quality: number; format: "webp" | "jpeg"; maxWidth: number };

const MIME = { webp: "image/webp", jpeg: "image/jpeg" } as const;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function outputName(file: File, format: "webp" | "jpeg"): string {
  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  return `${base}-compressed.${format === "jpeg" ? "jpg" : "webp"}`;
}

async function compress(
  file: File,
  s: Settings,
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;
  if (s.maxWidth > 0 && width > s.maxWidth) {
    height = Math.round((height * s.maxWidth) / width);
    width = s.maxWidth;
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  if (s.format === "jpeg") {
    // JPEG has no transparency: paint white instead of black.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const mime = MIME[s.format];
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, mime, s.quality / 100),
  );
  if (!blob || blob.type !== mime) {
    throw new Error(`This browser cannot export ${s.format.toUpperCase()}. Try JPEG.`);
  }
  return { blob, width, height };
}

export default function ImageCompressor({ config }: { config: ImageCompressorConfig }) {
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(config.quality);
  const [format, setFormat] = useState<"webp" | "jpeg">(config.format);
  const [maxWidth, setMaxWidth] = useState(config.maxWidth);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // The ref is the source of truth for the async worker; state mirrors it for rendering.
  const itemsRef = useRef<Item[]>([]);
  const urls = useRef(new Map<string, string>());
  const run = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commit = useCallback((next: Item[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const patch = useCallback(
    (id: string, p: Partial<Item>) => {
      commit(itemsRef.current.map((i) => (i.id === id ? { ...i, ...p } : i)));
    },
    [commit],
  );

  const processAll = useCallback(
    async (s: Settings) => {
      const token = ++run.current;
      for (const it of itemsRef.current) {
        if (token !== run.current) return; // superseded by newer settings / files
        patch(it.id, { status: "working", error: undefined });
        try {
          const r = await compress(it.file, s);
          if (token !== run.current) return;
          const old = urls.current.get(it.id);
          if (old) URL.revokeObjectURL(old);
          const url = URL.createObjectURL(r.blob);
          urls.current.set(it.id, url);
          patch(it.id, { status: "done", blob: r.blob, url, width: r.width, height: r.height });
        } catch (e) {
          if (token !== run.current) return;
          patch(it.id, {
            status: "error",
            error: e instanceof Error ? e.message : "Could not read this image.",
          });
        }
      }
    },
    [patch],
  );

  const reprocessSoon = useCallback(
    (s: Settings) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void processAll(s), 250);
    },
    [processAll],
  );

  useEffect(() => {
    const u = urls.current;
    return () => {
      if (timer.current) clearTimeout(timer.current);
      run.current++;
      u.forEach((url) => URL.revokeObjectURL(url));
      u.clear();
    };
  }, []);

  const addFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list);
    const problems: string[] = [];
    const accepted: Item[] = [];
    const room = config.maxFiles - itemsRef.current.length;

    for (const file of incoming) {
      if (!file.type.startsWith("image/")) {
        problems.push(`${file.name}: not an image`);
      } else if (file.size > config.maxFileSizeMB * 1024 * 1024) {
        problems.push(`${file.name}: larger than ${config.maxFileSizeMB} MB`);
      } else if (accepted.length >= room) {
        problems.push(`${file.name}: limit of ${config.maxFiles} images reached`);
      } else {
        accepted.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          status: "queued",
        });
      }
    }
    setNotice(problems.length ? `Skipped: ${problems.join("; ")}` : null);
    if (!accepted.length) return;
    commit([...itemsRef.current, ...accepted]);
    void processAll({ quality, format, maxWidth });
  };

  const remove = (id: string) => {
    const url = urls.current.get(id);
    if (url) URL.revokeObjectURL(url);
    urls.current.delete(id);
    commit(itemsRef.current.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    run.current++;
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    urls.current.clear();
    commit([]);
    setNotice(null);
  };

  const downloadAll = async () => {
    for (const it of itemsRef.current) {
      if (!it.url) continue;
      const a = document.createElement("a");
      a.href = it.url;
      a.download = outputName(it.file, format);
      document.body.appendChild(a);
      a.click();
      a.remove();
      await new Promise((r) => setTimeout(r, 300));
    }
  };

  const done = items.filter((i) => i.status === "done" && i.blob);
  const totalBefore = done.reduce((n, i) => n + i.file.size, 0);
  const totalAfter = done.reduce((n, i) => n + (i.blob?.size ?? 0), 0);
  const saved = totalBefore > 0 ? Math.round((1 - totalAfter / totalBefore) * 100) : 0;

  const settings = (over: Partial<Settings>): Settings => ({ quality, format, maxWidth, ...over });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
      {/* SETTINGS + DROP ZONE */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <label
          htmlFor="image-input"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`cursor-pointer rounded-[2rem] border-2 border-dashed p-8 md:p-10 flex flex-col items-center text-center gap-4 transition-colors ${
            dragging
              ? "border-[#C56E3D] bg-[#C56E3D]/10"
              : "border-white/15 bg-[#0F0F0F] hover:border-[#C56E3D]/60"
          }`}
        >
          <span className="grid place-items-center size-14 rounded-2xl bg-[#C56E3D]/15 text-[#C56E3D]">
            <ImagePlus size={26} aria-hidden />
          </span>
          <span className="text-white font-bold text-lg">Drop images here or click to choose</span>
          <span className="text-xs text-white/40 leading-relaxed">
            JPG, PNG, WebP, up to {config.maxFiles} images, {config.maxFileSizeMB} MB each
          </span>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = ""; // allow choosing the same file again
            }}
          />
        </label>

        <div className="rounded-[2rem] bg-[#0F0F0F] border border-white/5 p-6 md:p-8 flex flex-col gap-6">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#C56E3D] font-black">
            Settings
          </span>

          <div className="flex flex-col gap-2">
            <label htmlFor="img-quality" className="flex justify-between text-sm font-bold text-white/85">
              Quality <span className="text-[#C56E3D] tabular-nums">{quality}%</span>
            </label>
            <input
              id="img-quality"
              type="range"
              min={10}
              max={100}
              step={1}
              value={quality}
              onChange={(e) => {
                const q = Number(e.target.value);
                setQuality(q);
                reprocessSoon(settings({ quality: q }));
              }}
              className="w-full accent-[#C56E3D]"
            />
            <p className="text-xs text-white/40">Lower quality = smaller file. 70-85% is usually unnoticeable.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="img-format" className="text-sm font-bold text-white/85">
              Output format
            </label>
            <select
              id="img-format"
              value={format}
              onChange={(e) => {
                const f = e.target.value === "jpeg" ? "jpeg" : "webp";
                setFormat(f);
                reprocessSoon(settings({ format: f }));
              }}
              className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-[#C56E3D]"
            >
              <option value="webp" className="bg-[#0F0F0F]">WebP (smallest)</option>
              <option value="jpeg" className="bg-[#0F0F0F]">JPEG (works everywhere)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="img-width" className="text-sm font-bold text-white/85">
              Maximum width
            </label>
            <div className="flex items-stretch rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#C56E3D] overflow-hidden">
              <input
                id="img-width"
                type="number"
                inputMode="numeric"
                min={0}
                step={100}
                value={maxWidth}
                onChange={(e) => {
                  const w = Math.max(0, Math.floor(Number(e.target.value) || 0));
                  setMaxWidth(w);
                  reprocessSoon(settings({ maxWidth: w }));
                }}
                className="w-full min-w-0 bg-transparent px-4 py-3.5 text-white font-semibold focus:outline-none"
              />
              <span className="px-4 flex items-center text-white/45 font-bold border-l border-white/10">px</span>
            </div>
            <p className="text-xs text-white/40">0 keeps the original size. 1920 suits most websites.</p>
          </div>
        </div>

        <p className="flex gap-2 text-xs text-white/40 leading-relaxed">
          <ShieldCheck size={16} className="shrink-0 text-[#C56E3D]" aria-hidden />
          Private by design: your images are processed in this browser tab and are never uploaded.
        </p>
      </div>

      {/* RESULTS */}
      <div className="lg:col-span-3 flex flex-col gap-4" role="region" aria-live="polite" aria-label="Results">
        {notice && (
          <p className="flex gap-2 rounded-2xl border border-[#C56E3D]/25 bg-[#C56E3D]/[0.06] px-5 py-4 text-sm text-white/80">
            <TriangleAlert size={18} className="text-[#C56E3D] shrink-0 mt-0.5" aria-hidden />
            {notice}
          </p>
        )}

        {items.length === 0 ? (
          <div className="rounded-[2rem] bg-[#0F0F0F] border border-white/5 p-10 text-center text-white/40">
            Compressed images will appear here.
          </div>
        ) : (
          <>
            <div className="rounded-[2rem] bg-gradient-to-br from-[#C56E3D]/20 to-[#C56E3D]/5 border border-[#C56E3D]/30 p-6 md:p-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C56E3D] block">
                  Total saved
                </span>
                <span className="mt-2 block font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {done.length ? `${Math.max(saved, 0)}%` : "…"}
                </span>
                {done.length > 0 && (
                  <span className="mt-1 block text-xs text-white/55 tabular-nums">
                    {formatBytes(totalBefore)} → {formatBytes(totalAfter)}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={downloadAll}
                  disabled={!done.length}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#C56E3D] hover:bg-[#A64D32] disabled:opacity-40 text-white text-[10px] uppercase tracking-[0.3em] font-black transition-colors"
                >
                  <Download size={14} /> Download all
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 hover:border-white/40 text-white/80 text-[10px] uppercase tracking-[0.3em] font-black transition-colors"
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {items.map((it) => {
                const after = it.blob?.size;
                const pct = after !== undefined ? Math.round((1 - after / it.file.size) * 100) : 0;
                return (
                  <li
                    key={it.id}
                    className="rounded-2xl bg-[#0F0F0F] border border-white/5 p-4 flex items-center gap-4"
                  >
                    <div className="size-16 shrink-0 rounded-xl overflow-hidden bg-white/5 grid place-items-center">
                      {it.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.url} alt="" className="size-full object-cover" />
                      ) : it.status === "error" ? (
                        <TriangleAlert size={20} className="text-[#C56E3D]" aria-hidden />
                      ) : (
                        <Loader2 size={20} className="animate-spin text-white/50" aria-hidden />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-white font-semibold truncate">{it.file.name}</p>
                      {it.status === "error" ? (
                        <p className="text-xs text-[#C56E3D] mt-1">{it.error}</p>
                      ) : it.status === "done" && after !== undefined ? (
                        <p className="text-xs text-white/55 mt-1 tabular-nums">
                          {formatBytes(it.file.size)} → <span className="text-white">{formatBytes(after)}</span>{" "}
                          <span className={pct > 0 ? "text-[#7BD389]" : "text-[#C56E3D]"}>
                            {pct > 0 ? `−${pct}%` : `+${Math.abs(pct)}%`}
                          </span>
                          {it.width && it.height ? ` · ${it.width}×${it.height}` : ""}
                        </p>
                      ) : (
                        <p className="text-xs text-white/40 mt-1">Compressing…</p>
                      )}
                      {it.status === "done" && pct <= 0 && (
                        <p className="text-xs text-white/40 mt-1">
                          Already well optimised. Try a lower quality or a smaller maximum width.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {it.url && (
                        <a
                          href={it.url}
                          download={outputName(it.file, format)}
                          aria-label={`Download compressed ${it.file.name}`}
                          className="grid place-items-center size-10 rounded-full bg-[#C56E3D] hover:bg-[#A64D32] text-white transition-colors"
                        >
                          <Download size={16} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        aria-label={`Remove ${it.file.name}`}
                        className="grid place-items-center size-10 rounded-full border border-white/15 hover:border-white/40 text-white/70 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

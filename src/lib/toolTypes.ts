// Per-type settings for tools that are not calculators. Settings come from the
// WordPress "Settings (JSON)" field; every field is optional and clamped, so a
// missing or sloppy config still yields a working tool.

export type ToolType = "calculator" | "image-compressor" | "embed";

export const TOOL_TYPES: ToolType[] = ["calculator", "image-compressor", "embed"];

export function normalizeToolType(v: string | null | undefined): ToolType {
  return TOOL_TYPES.includes(v as ToolType) ? (v as ToolType) : "calculator";
}

export type ImageCompressorConfig = {
  quality: number; // 10-100
  format: "webp" | "jpeg";
  maxWidth: number; // px, 0 = keep original size
  maxFiles: number;
  maxFileSizeMB: number;
};

export type EmbedConfig = {
  height: number; // px
  autoHeight: boolean;
};

function obj(json: string | null): Record<string, unknown> {
  if (!json) return {};
  try {
    const v = JSON.parse(json);
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

const clampNum = (v: unknown, min: number, max: number, fallback: number): number => {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? Math.min(Math.max(n, min), max) : fallback;
};

export function parseImageConfig(json: string | null): ImageCompressorConfig {
  const o = obj(json);
  return {
    quality: Math.round(clampNum(o.quality, 10, 100, 80)),
    format: o.format === "jpeg" ? "jpeg" : "webp",
    maxWidth: Math.round(clampNum(o.maxWidth, 0, 16000, 0)),
    maxFiles: Math.round(clampNum(o.maxFiles, 1, 100, 20)),
    maxFileSizeMB: clampNum(o.maxFileSizeMB, 0.1, 100, 25),
  };
}

export function parseEmbedConfig(json: string | null): EmbedConfig {
  const o = obj(json);
  return {
    height: Math.round(clampNum(o.height, 120, 3000, 520)),
    autoHeight: o.autoHeight !== false,
  };
}

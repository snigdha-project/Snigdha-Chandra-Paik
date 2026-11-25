// Calculator definition (from WordPress) + a safe formula evaluator.
//
// Formulas come from the CMS, so they are never passed to eval()/Function.
// They are tokenised and evaluated by a small recursive-descent parser that
// only knows numbers, variables, operators and a fixed set of functions.

export type ToolInput = {
  key: string;
  label: string;
  type: "number" | "select";
  default: number;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  help?: string;
  options?: { label: string; value: number }[];
};

export type ToolOutput = {
  key: string;
  label: string;
  formula: string;
  decimals: number;
  prefix?: string;
  suffix?: string;
  highlight: boolean;
  help?: string;
};

export type ToolInsight = { when: string; text: string };

// Call-to-action card under the results. The contact form is prefilled with the
// visitor's numbers plus `message` (an opening line about what they want).
export type ToolCta = {
  title: string;
  text: string;
  button: string;
  message: string;
};

export type ToolConfig = {
  inputs: ToolInput[];
  outputs: ToolOutput[];
  insights: ToolInsight[];
  disclaimer?: string;
  cta: ToolCta;
};

export const DEFAULT_CTA: ToolCta = {
  title: "Want help turning these numbers into results?",
  text: "Tell me about your business and I will show you how to get there.",
  button: "Talk to me",
  message: "I'd like help with this.",
};

export type ToolFaq = { q: string; a: string };

// ---------------------------------------------------------------------------
// Tokeniser + parser
// ---------------------------------------------------------------------------
type Tok =
  | { t: "num"; v: number }
  | { t: "id"; v: string }
  | { t: "op"; v: string }
  | { t: "end" };

const OPS = ["<=", ">=", "==", "!=", "&&", "||", "+", "-", "*", "/", "%", "^", "<", ">", "!", "(", ")", ","];

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    const num = /^(\d+\.?\d*|\.\d+)/.exec(src.slice(i));
    if (num) {
      out.push({ t: "num", v: parseFloat(num[0]) });
      i += num[0].length;
      continue;
    }
    const id = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i));
    if (id) {
      out.push({ t: "id", v: id[0] });
      i += id[0].length;
      continue;
    }
    const op = OPS.find((o) => src.startsWith(o, i));
    if (!op) throw new Error(`Unexpected "${c}"`);
    out.push({ t: "op", v: op });
    i += op.length;
  }
  out.push({ t: "end" });
  return out;
}

type Node =
  | { k: "num"; v: number }
  | { k: "var"; n: string }
  | { k: "un"; op: string; a: Node }
  | { k: "bin"; op: string; a: Node; b: Node }
  | { k: "call"; fn: string; args: Node[] };

const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

const FUNCS: Record<string, (...a: number[]) => number> = {
  min: Math.min,
  max: Math.max,
  round: (x, d = 0) => {
    const f = 10 ** d;
    return Math.round(x * f) / f;
  },
  floor: Math.floor,
  ceil: Math.ceil,
  abs: Math.abs,
  sqrt: Math.sqrt,
  pow: Math.pow,
  log: Math.log,
};

function parse(src: string): Node {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek().t === "op" && (peek() as { v: string }).v === v;
  const eat = (v: string) => {
    if (!isOp(v)) throw new Error(`Expected "${v}"`);
    p++;
  };

  // precedence: || < && < comparison < + - < * / % < unary < ^
  const binary = (next: () => Node, ops: string[]): Node => {
    let left = next();
    while (peek().t === "op" && ops.includes((peek() as { v: string }).v)) {
      const op = (toks[p++] as { v: string }).v;
      left = { k: "bin", op, a: left, b: next() };
    }
    return left;
  };

  const primary = (): Node => {
    const tk = peek();
    if (tk.t === "num") {
      p++;
      return { k: "num", v: tk.v };
    }
    if (tk.t === "id") {
      p++;
      if (isOp("(")) {
        eat("(");
        const args: Node[] = [];
        if (!isOp(")")) {
          do args.push(or());
          while (isOp(",") && (p++, true));
        }
        eat(")");
        if (tk.v !== "if" && !has(FUNCS, tk.v)) throw new Error(`Unknown function "${tk.v}"`);
        return { k: "call", fn: tk.v, args };
      }
      return { k: "var", n: tk.v };
    }
    if (isOp("(")) {
      eat("(");
      const e = or();
      eat(")");
      return e;
    }
    throw new Error("Unexpected end of formula");
  };
  const power = (): Node => {
    const base = primary();
    if (isOp("^")) {
      p++;
      return { k: "bin", op: "^", a: base, b: unary() }; // right-assoc
    }
    return base;
  };
  const unary = (): Node => {
    if (isOp("-") || isOp("+") || isOp("!")) {
      const op = (toks[p++] as { v: string }).v;
      return { k: "un", op, a: unary() };
    }
    return power();
  };
  const mul = () => binary(unary, ["*", "/", "%"]);
  const add = () => binary(mul, ["+", "-"]);
  const cmp = () => binary(add, ["<", ">", "<=", ">=", "==", "!="]);
  const and = () => binary(cmp, ["&&"]);
  const or = (): Node => binary(and, ["||"]);

  const ast = or();
  if (peek().t !== "end") throw new Error("Unexpected token after formula");
  return ast;
}

function run(n: Node, vars: Record<string, number>): number {
  switch (n.k) {
    case "num":
      return n.v;
    case "var":
      if (!has(vars, n.n)) throw new Error(`Unknown name "${n.n}"`);
      return vars[n.n];
    case "un": {
      const a = run(n.a, vars);
      return n.op === "-" ? -a : n.op === "!" ? (a ? 0 : 1) : a;
    }
    case "bin": {
      const a = run(n.a, vars);
      const b = run(n.b, vars);
      switch (n.op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return a / b;
        case "%": return a % b;
        case "^": return a ** b;
        case "<": return +(a < b);
        case ">": return +(a > b);
        case "<=": return +(a <= b);
        case ">=": return +(a >= b);
        case "==": return +(a === b);
        case "!=": return +(a !== b);
        case "&&": return +(!!a && !!b);
        case "||": return +(!!a || !!b);
      }
      throw new Error(`Bad operator ${n.op}`);
    }
    case "call":
      if (n.fn === "if") {
        if (n.args.length !== 3) throw new Error("if() needs 3 arguments");
        return run(n.args[0], vars) ? run(n.args[1], vars) : run(n.args[2], vars);
      }
      return FUNCS[n.fn](...n.args.map((a) => run(a, vars)));
  }
}

const astCache = new Map<string, Node>();
function compile(formula: string): Node {
  let ast = astCache.get(formula);
  if (!ast) {
    ast = parse(formula);
    astCache.set(formula, ast);
  }
  return ast;
}

/** Evaluates one formula. Returns NaN/Infinity as-is; throws on syntax errors. */
export function evaluate(formula: string, vars: Record<string, number>): number {
  return run(compile(formula), vars);
}

// ---------------------------------------------------------------------------
// Config parsing / validation (never throws — a bad tool just returns null)
// ---------------------------------------------------------------------------
const KEY_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const RESERVED = new Set(["if", ...Object.keys(FUNCS)]);

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v : undefined;
const num = (v: unknown): number | undefined => {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
};

export function parseToolConfig(json: string | null): ToolConfig | null {
  if (!json) return null;
  try {
    const raw = JSON.parse(json) as Record<string, unknown>;
    const names = new Set<string>();
    const claim = (k: unknown): k is string => {
      if (typeof k !== "string" || !KEY_RE.test(k) || RESERVED.has(k) || names.has(k)) return false;
      names.add(k);
      return true;
    };

    const inputs: ToolInput[] = [];
    for (const i of (Array.isArray(raw.inputs) ? raw.inputs : []) as Record<string, unknown>[]) {
      if (!claim(i.key)) continue;
      const options =
        i.type === "select" && Array.isArray(i.options)
          ? (i.options as Record<string, unknown>[])
              .map((o) => ({ label: String(o.label ?? o.value ?? ""), value: num(o.value) ?? NaN }))
              .filter((o) => o.label && Number.isFinite(o.value))
          : undefined;
      if (i.type === "select" && !options?.length) continue;
      inputs.push({
        key: i.key as string,
        label: str(i.label) ?? (i.key as string),
        type: i.type === "select" ? "select" : "number",
        default: num(i.default) ?? options?.[0]?.value ?? 0,
        min: num(i.min),
        max: num(i.max),
        step: num(i.step),
        prefix: str(i.prefix),
        suffix: str(i.suffix),
        help: str(i.help),
        options,
      });
    }

    const outputs: ToolOutput[] = [];
    for (const o of (Array.isArray(raw.outputs) ? raw.outputs : []) as Record<string, unknown>[]) {
      const formula = str(o.formula);
      if (!formula || !claim(o.key)) continue;
      try {
        compile(formula); // syntax check up-front
      } catch {
        continue;
      }
      outputs.push({
        key: o.key as string,
        label: str(o.label) ?? (o.key as string),
        formula,
        decimals: Math.min(Math.max(num(o.decimals) ?? 0, 0), 6),
        prefix: str(o.prefix),
        suffix: str(o.suffix),
        highlight: o.highlight === true,
        help: str(o.help),
      });
    }

    const insights: ToolInsight[] = [];
    for (const n of (Array.isArray(raw.insights) ? raw.insights : []) as Record<string, unknown>[]) {
      const when = str(n.when);
      const text = str(n.text);
      if (!when || !text) continue;
      try {
        compile(when);
        insights.push({ when, text });
      } catch {
        /* skip malformed insight */
      }
    }

    if (!inputs.length || !outputs.length) return null;
    const c = (raw.cta && typeof raw.cta === "object" ? raw.cta : {}) as Record<string, unknown>;
    const cta: ToolCta = {
      title: str(c.title) ?? DEFAULT_CTA.title,
      text: str(c.text) ?? DEFAULT_CTA.text,
      button: str(c.button) ?? DEFAULT_CTA.button,
      message: str(c.message) ?? DEFAULT_CTA.message,
    };
    return { inputs, outputs, insights, disclaimer: str(raw.disclaimer), cta };
  } catch {
    return null;
  }
}

export function parseToolFaq(json: string | null): ToolFaq[] {
  if (!json) return [];
  try {
    const raw = JSON.parse(json);
    if (!Array.isArray(raw)) return [];
    return raw
      .map((x: Record<string, unknown>) => ({ q: str(x.q) ?? "", a: str(x.a) ?? "" }))
      .filter((x) => x.q && x.a);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Whole-calculator evaluation
// ---------------------------------------------------------------------------
export type ToolResult = {
  values: Record<string, number>; // outputs by key (NaN when not computable)
  insights: string[];
};

export function calculate(config: ToolConfig, inputValues: Record<string, number>): ToolResult {
  const vars: Record<string, number> = { ...inputValues };
  const values: Record<string, number> = {};
  for (const o of config.outputs) {
    let v: number;
    try {
      v = evaluate(o.formula, vars);
    } catch {
      v = NaN;
    }
    if (!Number.isFinite(v)) v = NaN;
    vars[o.key] = v;
    values[o.key] = v;
  }
  const insights: string[] = [];
  for (const n of config.insights) {
    try {
      if (evaluate(n.when, vars)) insights.push(n.text);
    } catch {
      /* ignore */
    }
  }
  return { values, insights };
}

export function formatValue(
  v: number,
  o: { decimals: number; prefix?: string; suffix?: string },
): string {
  if (!Number.isFinite(v)) return "—";
  const body = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: o.decimals,
    maximumFractionDigits: o.decimals,
  }).format(v);
  return `${v < 0 && o.prefix ? "-" : ""}${o.prefix ?? ""}${o.prefix && v < 0 ? body.replace("-", "") : body}${o.suffix ?? ""}`;
}

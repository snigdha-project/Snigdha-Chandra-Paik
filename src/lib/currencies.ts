// Currencies a calculator can offer. A tool opts in from WordPress with
//   "currency": { "default": "INR", "options": ["INR", "USD", "GBP"] }
// and uses the token {cur} wherever a symbol belongs ("prefix": "{cur}").
//
// `perINR` is an approximate conversion factor used only to rescale the
// visitor's amounts when they switch currency (so a ₹50,000 budget becomes a
// sensible dollar amount instead of $50,000). These are rounded planning
// rates, not live exchange rates.

export type CurrencyCode = "INR" | "USD" | "GBP" | "EUR" | "AED" | "AUD" | "CAD" | "SGD";

export type Currency = {
  code: CurrencyCode;
  symbol: string;
  locale: string; // number grouping, e.g. en-IN gives 1,00,000
  perINR: number;
};

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  INR: { code: "INR", symbol: "₹", locale: "en-IN", perINR: 1 },
  USD: { code: "USD", symbol: "$", locale: "en-US", perINR: 0.0118 },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", perINR: 0.0094 },
  EUR: { code: "EUR", symbol: "€", locale: "en-IE", perINR: 0.0108 },
  AED: { code: "AED", symbol: "AED ", locale: "en-AE", perINR: 0.0433 },
  AUD: { code: "AUD", symbol: "A$", locale: "en-AU", perINR: 0.0181 },
  CAD: { code: "CAD", symbol: "C$", locale: "en-CA", perINR: 0.0163 },
  SGD: { code: "SGD", symbol: "S$", locale: "en-SG", perINR: 0.0158 },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export type CurrencyConfig = { default: CurrencyCode; options: CurrencyCode[] };

export function isCurrencyCode(v: unknown): v is CurrencyCode {
  return typeof v === "string" && v in CURRENCIES;
}

/** Replaces the {cur} token with a symbol. */
export function withSymbol(text: string | undefined, symbol: string): string | undefined {
  return text?.replace(/\{cur\}/g, symbol);
}

/** Rescales an amount between currencies, rounding to a sensible precision. */
export function convertAmount(value: number, from: CurrencyCode, to: CurrencyCode): number {
  if (!Number.isFinite(value) || from === to) return value;
  const v = (value / CURRENCIES[from].perINR) * CURRENCIES[to].perINR;
  if (Math.abs(v) >= 100) return Math.round(v);
  if (Math.abs(v) >= 1) return Math.round(v * 100) / 100;
  return Math.round(v * 1000) / 1000;
}

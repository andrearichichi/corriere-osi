const nf = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });

export const fmtInt = (v: number) => nf.format(Math.round(v));

export function fmtPct(v: number, digits?: number) {
  const d = digits ?? (Math.abs(v) < 0.01 ? 2 : Math.abs(v) < 0.1 ? 1 : 0);
  return `${(v * 100).toLocaleString("it-IT", { minimumFractionDigits: d, maximumFractionDigits: d })}%`;
}

export function fmtPp(v: number, digits = 1) {
  const s = (v * 100).toLocaleString("it-IT", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return `${v > 0 ? "+" : ""}${s} pp`;
}

export function fmtEur(v: number) {
  const a = Math.abs(v);
  const sign = v < 0 ? "−" : "";
  if (a >= 1_000_000) return `${sign}€${(a / 1_000_000).toLocaleString("it-IT", { maximumFractionDigits: 2 })} mln`;
  if (a >= 10_000) return `${sign}€${Math.round(a / 1000).toLocaleString("it-IT")}k`;
  return `${sign}€${a.toLocaleString("it-IT", { maximumFractionDigits: a < 10 ? 3 : 0 })}`;
}

export function fmtCompact(v: number) {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `${(v / 1_000_000).toLocaleString("it-IT", { maximumFractionDigits: 1 })} mln`;
  if (a >= 10_000) return `${Math.round(v / 1000).toLocaleString("it-IT")}k`;
  return fmtInt(v);
}

export function fmtParam(v: number, kind: "count" | "pct" | "eur" | "num") {
  if (kind === "pct") return fmtPct(v, v < 0.01 ? 2 : 1);
  if (kind === "eur") return fmtEur(v);
  if (kind === "count") return fmtCompact(v);
  return v.toLocaleString("it-IT", { maximumFractionDigits: 2 });
}

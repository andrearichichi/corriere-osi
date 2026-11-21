/**
 * Statistica per il Growth Lab. Tutti i dataset generati qui sono SIMULATI
 * con un generatore deterministico: stessi parametri → stessi numeri.
 */

/** PRNG deterministico (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Normale standard via Box-Muller. */
export function randn(r: () => number) {
  const u = Math.max(r(), 1e-12);
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Binomiale: esatta per n piccoli, approssimazione normale per n grandi. */
export function binomial(n: number, p: number, r: () => number) {
  if (n <= 200) {
    let k = 0;
    for (let i = 0; i < n; i++) if (r() < p) k++;
    return k;
  }
  const k = Math.round(n * p + Math.sqrt(n * p * (1 - p)) * randn(r));
  return Math.min(n, Math.max(0, k));
}

/** CDF normale standard (Abramowitz-Stegun 26.2.17, errore < 7.5e-8). */
export function normCdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

/** Quantile normale standard (Acklam). */
export function normInv(p: number): number {
  const a = [-39.69683028665376, 220.9460984245205, -275.928510446969, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - pl) return -normInv(1 - p);
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

export type TwoProp = {
  pC: number;
  pT: number;
  diff: number; // pT − pC
  lift: number; // (pT − pC) / pC
  se: number;
  lo: number;
  hi: number;
  z: number;
  pValue: number;
};

/** Differenza tra due proporzioni: IC di Wald al livello (1−alpha), test z bilaterale con varianza pooled. */
export function twoProportion(xC: number, nC: number, xT: number, nT: number, alpha = 0.05): TwoProp {
  const pC = xC / nC;
  const pT = xT / nT;
  const diff = pT - pC;
  const se = Math.sqrt((pC * (1 - pC)) / nC + (pT * (1 - pT)) / nT);
  const zc = normInv(1 - alpha / 2);
  const pp = (xC + xT) / (nC + nT);
  const sePooled = Math.sqrt(pp * (1 - pp) * (1 / nC + 1 / nT));
  const z = sePooled > 0 ? diff / sePooled : 0;
  return { pC, pT, diff, lift: pC > 0 ? diff / pC : 0, se, lo: diff - zc * se, hi: diff + zc * se, z, pValue: 2 * (1 - normCdf(Math.abs(z))) };
}

/** Effetto minimo rilevabile (assoluto) per due proporzioni con n per braccio. */
export function mde(p0: number, nPerArm: number, alpha = 0.05, power = 0.8) {
  return (normInv(1 - alpha / 2) + normInv(power)) * Math.sqrt((2 * p0 * (1 - p0)) / nPerArm);
}

/** Numerosità per braccio necessaria per rilevare una differenza assoluta `delta`. */
export function sampleSize(p0: number, delta: number, alpha = 0.05, power = 0.8) {
  const z = normInv(1 - alpha / 2) + normInv(power);
  return Math.ceil((2 * z * z * p0 * (1 - p0)) / (delta * delta));
}

/** Curva di retention settimanale: plateau + decadimento esponenziale. */
export function retentionCurve(weeks: number, plateau: number, tau: number) {
  return Array.from({ length: weeks + 1 }, (_, w) => (w === 0 ? 1 : plateau + (1 - plateau) * Math.exp(-w / tau)));
}

export type Cohort = { label: string; size: number; values: (number | null)[] };

/** Coorti settimanali simulate: ogni coorte osserva solo le settimane già trascorse. */
export function simulateCohorts(opts: { cohorts: number; weeks: number; size: number; plateau: number; tau: number; seed: number; startLabel?: string[] }): Cohort[] {
  const r = rng(opts.seed);
  const curve = retentionCurve(opts.weeks, opts.plateau, opts.tau);
  return Array.from({ length: opts.cohorts }, (_, c) => {
    const size = Math.round(opts.size * (0.9 + 0.2 * r()));
    const observed = opts.weeks - c;
    const values = curve.map((p, w) => {
      if (w > observed) return null;
      if (w === 0) return 1;
      return binomial(size, p, r) / size;
    });
    return { label: opts.startLabel?.[c] ?? `Coorte ${c + 1}`, size, values };
  });
}

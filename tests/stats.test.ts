import { describe, expect, it } from "vitest";
import { mde, normCdf, normInv, rng, sampleSize, simulateCohorts, twoProportion } from "@/lib/stats";

describe("statistica", () => {
  it("normInv e normCdf sono coerenti", () => {
    expect(normInv(0.975)).toBeCloseTo(1.959964, 4);
    expect(normInv(0.8)).toBeCloseTo(0.841621, 4);
    expect(normCdf(1.959964)).toBeCloseTo(0.975, 4);
    for (const p of [0.01, 0.2, 0.5, 0.9, 0.995]) expect(normCdf(normInv(p))).toBeCloseTo(p, 5);
  });

  it("twoProportion: caso noto", () => {
    const r = twoProportion(100, 1000, 130, 1000);
    expect(r.diff).toBeCloseTo(0.03, 10);
    expect(r.lift).toBeCloseTo(0.3, 10);
    expect(r.lo).toBeLessThan(r.diff);
    expect(r.hi).toBeGreaterThan(r.diff);
    expect(r.pValue).toBeGreaterThan(0.01);
    expect(r.pValue).toBeLessThan(0.05);
  });

  it("MDE e sample size sono una l'inverso dell'altro", () => {
    const n = sampleSize(0.2, 0.02);
    expect(mde(0.2, n)).toBeLessThanOrEqual(0.02 + 1e-9);
    expect(mde(0.2, n - 50)).toBeGreaterThan(0.02);
  });

  it("le simulazioni sono riproducibili", () => {
    const a = simulateCohorts({ cohorts: 4, weeks: 6, size: 1000, plateau: 0.2, tau: 1.5, seed: 7 });
    const b = simulateCohorts({ cohorts: 4, weeks: 6, size: 1000, plateau: 0.2, tau: 1.5, seed: 7 });
    expect(a).toEqual(b);
    expect(a[3].values.filter((v) => v === null).length).toBe(3);
    const r1 = rng(1);
    const r2 = rng(1);
    expect(r1()).toBe(r2());
  });
});

import { describe, it, expect } from "vitest";
import { compute, SCENARIOS, BASE, sensitivity, PARAMS } from "@/lib/model";

describe("modello d'impatto", () => {
  it("stampa gli scenari (diagnostica)", () => {
    for (const k of ["prudente", "base", "ottimistico"] as const) {
      const o = compute(SCENARIOS[k]);
      console.log(k, JSON.stringify(Object.fromEntries(Object.entries(o).map(([a, b]) => [a, typeof b === "number" ? Math.round(b) : b]))));
    }
  });
  it("gli scenari sono ordinati: prudente < base < ottimistico", () => {
    const p = compute(SCENARIOS.prudente).net, b = compute(SCENARIOS.base).net, o = compute(SCENARIOS.ottimistico).net;
    expect(p).toBeLessThan(b);
    expect(b).toBeLessThan(o);
  });
  it("senza differenza trattamento-controllo l'acquisizione incrementale è zero", () => {
    const o = compute({ ...BASE, convTreatment: BASE.convControl });
    expect(o.incFirstPlays).toBe(0);
    expect(o.incHabitualAcquisition).toBe(0);
  });
  it("con κ = 0 non ci sono abbonamenti incrementali", () => {
    expect(compute({ ...BASE, causalShare: 0 }).incSubscriptions).toBe(0);
  });
  it("il valore totale è la somma delle componenti", () => {
    const o = compute(BASE);
    expect(o.totalValue).toBeCloseTo(o.subscriptionValue + o.retentionValue + o.adValue + o.registrationValue, 6);
    expect(o.net).toBeCloseTo(o.totalValue - o.annualCost, 6);
  });
  it("ogni parametro ha metadati e valore di default nel range", () => {
    for (const p of PARAMS) {
      expect(BASE[p.key]).toBeGreaterThanOrEqual(p.min);
      expect(BASE[p.key]).toBeLessThanOrEqual(p.max);
    }
    expect(PARAMS.length).toBe(Object.keys(BASE).length);
  });
  it("la sensibilità è ordinata per ampiezza", () => {
    const s = sensitivity(BASE);
    for (let i = 1; i < s.length; i++) expect(s[i - 1].span).toBeGreaterThanOrEqual(s[i].span);
  });
});

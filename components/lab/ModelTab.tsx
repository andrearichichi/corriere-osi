"use client";
import clsx from "clsx";
import { useMemo } from "react";
import { compute, PARAMS, SCENARIOS, sensitivity, type Inputs, type Scenario } from "@/lib/model";
import { fmtCompact, fmtEur, fmtInt, fmtParam, fmtPct } from "@/lib/format";
import { SimTag } from "../ui";

export const C = { blue: "#1e5b9c", orange: "#e08a3c", azure: "#2a9fd8" };

const GROUPS = ["Retention", "Acquisizione", "Referral", "Monetizzazione", "Costi"] as const;

export function ScenarioPicker({ inputs, setInputs }: { inputs: Inputs; setInputs: (i: Inputs) => void }) {
  const active = (Object.keys(SCENARIOS) as Scenario[]).find((k) => JSON.stringify(SCENARIOS[k]) === JSON.stringify(inputs));
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Scenario</span>
      {(Object.keys(SCENARIOS) as Scenario[]).map((k) => (
        <button
          key={k}
          onClick={() => setInputs(SCENARIOS[k])}
          aria-pressed={active === k}
          className={clsx("h-9 rounded-full px-4 text-sm font-semibold capitalize transition-colors", active === k ? "bg-navy text-white" : "bg-card text-navy ring-1 ring-rule hover:ring-navy/40")}
        >
          {k}
        </button>
      ))}
      {!active && <span className="text-xs font-medium text-azure-ink">Ipotesi personalizzate</span>}
    </div>
  );
}

export function ParamPanel({ inputs, setInputs }: { inputs: Inputs; setInputs: (i: Inputs) => void }) {
  return (
    <div className="space-y-2">
      {GROUPS.map((g, gi) => (
        <details key={g} open={gi < 2} className="group rounded-xl bg-card ring-1 ring-rule">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-ink">
            {g}
            <span className="text-muted transition-transform group-open:rotate-180" aria-hidden>
              ▾
            </span>
          </summary>
          <div className="space-y-4 border-t border-rule px-4 py-4">
            {PARAMS.filter((p) => p.group === g).map((p) => (
              <div key={p.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor={`p-${p.key}`} className="text-[0.82rem] leading-snug text-ink-2">
                    {p.label}
                  </label>
                  <span className="shrink-0 text-sm font-semibold text-ink tabular">{fmtParam(inputs[p.key], p.kind)}</span>
                </div>
                <input
                  id={`p-${p.key}`}
                  type="range"
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={inputs[p.key]}
                  onChange={(e) => setInputs({ ...inputs, [p.key]: Number(e.target.value) })}
                  className="mt-1.5 w-full"
                />
                <p className="mt-0.5 text-[0.7rem] leading-snug text-muted">{p.why}</p>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function Tile({ label, value, sub, strong }: { label: string; value: string; sub?: string; strong?: boolean }) {
  return (
    <div className={clsx("rounded-2xl p-5", strong ? "bg-navy text-white" : "bg-card ring-1 ring-rule")}>
      <p className={clsx("text-[0.7rem] font-semibold uppercase tracking-[0.14em]", strong ? "text-white/70" : "text-muted")}>{label}</p>
      <p className="mt-2 font-serif text-[2rem] font-semibold leading-none tabular">{value}</p>
      {sub && <p className={clsx("mt-2 text-xs leading-snug", strong ? "text-white/75" : "text-muted")}>{sub}</p>}
    </div>
  );
}

export function ModelResults({ inputs }: { inputs: Inputs }) {
  const o = useMemo(() => compute(inputs), [inputs]);
  const scen = useMemo(() => (Object.keys(SCENARIOS) as Scenario[]).map((k) => ({ k, net: compute(SCENARIOS[k]).net })), []);
  const comps = [
    { label: "Nuovi abbonamenti (LTV 3 anni)", v: o.subscriptionValue },
    { label: "Abbonati digitali trattenuti", v: o.retentionValue },
    { label: "Registrazioni", v: o.registrationValue },
    { label: "Pubblicità sui giorni di gioco", v: o.adValue },
  ];
  const maxBar = Math.max(o.totalValue, o.annualCost, 1);
  const maxScen = Math.max(...scen.map((s) => Math.abs(s.net)), Math.abs(o.net), 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <SimTag>Modello illustrativo</SimTag>
        <p className="text-xs text-muted">Nessun dato interno Corriere. Vista annua a regime; sviluppo ammortizzato su 3 anni.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Tile strong label="Giocatori abituali in più" value={fmtCompact(o.incHabitualTotal)} sub="≥4 giorni su 7. North Star, quota incrementale." />
        <Tile label="DAU medi in più" value={fmtCompact(o.incDAU)} sub="Giorni di gioco incrementali / 365" />
        <Tile label="Valore netto annuo" value={fmtEur(o.net)} sub={`ROI ${fmtPct(o.roi, 0)} sui costi annui`} />
        <Tile label="Rientro dell'investimento" value={o.paybackMonths ? `${Math.round(o.paybackMonths)} mesi` : "—"} sub={o.paybackMonths ? "Sviluppo / margine mensile" : "Il valore non copre l'esercizio"} />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <figure>
          <figcaption className="text-sm font-semibold text-ink">Da dove viene il valore, rispetto al costo annuo</figcaption>
          <ul className="mt-4 space-y-3">
            {comps.map((c) => (
              <li key={c.label}>
                <div className="flex justify-between text-[0.82rem]">
                  <span className="text-ink-2">{c.label}</span>
                  <span className="font-semibold text-ink tabular">{fmtEur(c.v)}</span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-paper-2">
                  <div className="h-2.5 rounded-full" style={{ width: `${(c.v / maxBar) * 100}%`, background: C.blue }} title={`${c.label}: ${fmtEur(c.v)}`} />
                </div>
              </li>
            ))}
            <li className="border-t border-rule pt-3">
              <div className="flex justify-between text-[0.82rem]">
                <span className="font-semibold text-ink">Valore totale</span>
                <span className="font-semibold text-ink tabular">{fmtEur(o.totalValue)}</span>
              </div>
              <div className="mt-1 h-2.5 rounded-full bg-paper-2">
                <div className="h-2.5 rounded-full" style={{ width: `${(o.totalValue / maxBar) * 100}%`, background: C.blue }} />
              </div>
            </li>
            <li>
              <div className="flex justify-between text-[0.82rem]">
                <span className="font-semibold text-ink">Costo annuo (esercizio + sviluppo / 3)</span>
                <span className="font-semibold text-ink tabular">{fmtEur(o.annualCost)}</span>
              </div>
              <div className="mt-1 h-2.5 rounded-full bg-paper-2">
                <div className="h-2.5 rounded-full" style={{ width: `${(o.annualCost / maxBar) * 100}%`, background: C.orange }} />
              </div>
            </li>
          </ul>
        </figure>

        <figure>
          <figcaption className="text-sm font-semibold text-ink">Valore netto annuo per scenario</figcaption>
          <ul className="mt-4 space-y-4">
            {[...scen, { k: "attuale" as const, net: o.net }].map((s) => (
              <li key={s.k} className="grid grid-cols-[96px_1fr_72px] items-center gap-3">
                <span className={clsx("text-[0.82rem] text-ink-2", s.k !== "attuale" && "capitalize")}>{s.k === "attuale" ? "Le tue ipotesi" : s.k}</span>
                <div className="relative h-7">
                  <span className="absolute inset-y-0 left-1/2 w-px bg-ink/30" aria-hidden />
                  <span
                    className="absolute top-1.5 h-4 rounded-[4px]"
                    style={{
                      background: s.net >= 0 ? C.blue : C.orange,
                      left: s.net >= 0 ? "50%" : `${50 - (Math.abs(s.net) / maxScen) * 50}%`,
                      width: `max(2px, ${(Math.abs(s.net) / maxScen) * 50}%)`,
                    }}
                    title={fmtEur(s.net)}
                  />
                </div>
                <span className="text-right text-xs font-semibold tabular text-ink">{fmtEur(s.net)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Pareggio: ogni giocatore abituale incrementale deve generare almeno{" "}
            <strong className="text-ink">{isFinite(o.breakEvenPerHabitual) ? fmtEur(o.breakEvenPerHabitual) : "—"}</strong> all&apos;anno.
          </p>
        </figure>
      </div>

      <details className="rounded-xl bg-card ring-1 ring-rule">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-ink">Tabella dei risultati e formule</summary>
        <div className="overflow-x-auto border-t border-rule">
          <table className="w-full min-w-[560px] text-left text-[0.82rem]">
            <tbody>
              {[
                ["Adottanti del Filo", fmtInt(o.adopters), "eleggibili × esposizione × adozione"],
                ["Abituali incrementali · retention", fmtInt(o.incHabitualRetention), "adottanti × incremento assoluto"],
                ["Prime Edizioni incrementali · acquisizione", fmtInt(o.incFirstPlays), "lettori × esposizione × 12 × (conv. T − conv. C)"],
                ["Abituali incrementali · acquisizione", fmtInt(o.incHabitualAcquisition), "prime Edizioni × quota abituali a 4 sett."],
                ["Nuovi giocatori da referral", fmtInt(o.referralNewPlayers), "base abituali × inviti × 12 × invito→gioco × nuovi × incrementalità"],
                ["Abbonamenti incrementali", fmtInt(o.incSubscriptions), "abituali × non abbonati × Δ tasso × κ"],
                ["Abbonati trattenuti", fmtInt(o.churnAvoided), "adottanti × quota abbonati × riduzione churn"],
                ["Registrazioni incrementali", fmtInt(o.incRegistrations), "nuovi giocatori × tasso di registrazione"],
                ["Fattore LTV (anni)", o.ltvYears.toFixed(2), "1 + (1−churn) + (1−churn)²"],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-rule last:border-0">
                  <td className="px-4 py-2 text-ink">{r[0]}</td>
                  <td className="px-4 py-2 text-right font-semibold tabular text-ink">{r[1]}</td>
                  <td className="px-4 py-2 font-mono text-[0.72rem] text-muted">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export function DriversTab({ inputs }: { inputs: Inputs }) {
  const rows = useMemo(() => sensitivity(inputs).slice(0, 10), [inputs]);
  const max = Math.max(...rows.flatMap((r) => [Math.abs(r.lo), Math.abs(r.hi)]), 1);
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h3 className="font-serif text-2xl font-semibold text-ink">Quali ipotesi decidono il risultato</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">
          Ogni barra mostra come cambia il valore netto annuo se un&apos;ipotesi varia del 25% in meno o in più, a parità delle altre. Le prime righe sono
          le ipotesi da verificare per prime: sono loro a decidere l&apos;ordine della fase Validate.
        </p>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-ink-2">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-[3px]" style={{ background: C.orange }} /> ipotesi −25%
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-[3px]" style={{ background: C.blue }} /> ipotesi +25%
        </span>
        <SimTag>Modello illustrativo</SimTag>
      </div>
      <ul className="space-y-2.5">
        {rows.map((r) => (
          <li key={r.key} className="grid items-center gap-2 md:grid-cols-[minmax(0,320px)_1fr_150px] md:gap-4">
            <span className="text-[0.82rem] leading-snug text-ink-2">{r.label}</span>
            <div className="relative h-7" title={`−25%: ${fmtEur(r.lo)} · +25%: ${fmtEur(r.hi)}`}>
              <span className="absolute inset-y-0 left-1/2 w-px bg-ink/30" aria-hidden />
              {[r.lo, r.hi].map((v, i) => (
                <span
                  key={i}
                  className="absolute top-1.5 h-4 rounded-[4px]"
                  style={{
                    background: i === 0 ? C.orange : C.blue,
                    left: v >= 0 ? "50%" : `${50 - (Math.abs(v) / max) * 50}%`,
                    width: `max(2px, ${(Math.abs(v) / max) * 50}%)`,
                    opacity: 0.92,
                  }}
                />
              ))}
            </div>
            <span className="text-[0.72rem] font-semibold tabular text-ink md:text-right">
              {fmtEur(Math.min(r.lo, r.hi))} … {fmtEur(Math.max(r.lo, r.hi))}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm leading-relaxed text-ink-2">
        <strong className="text-ink">Come si legge.</strong> Se in cima compaiono κ (la quota causale del legame abitudine–abbonamento) o la conversione di
        «Gioca la notizia», il caso economico dipende da ciò che solo un esperimento può dire. Per questo l&apos;holdout di 6 mesi e il test A1 non sono
        opzionali.
      </p>
    </div>
  );
}

"use client";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EXPERIMENTS } from "@/data/experiments";
import type { Inputs } from "@/lib/model";
import { binomial, mde, rng, sampleSize, simulateCohorts, twoProportion } from "@/lib/stats";
import { fmtInt, fmtPct, fmtPp } from "@/lib/format";
import { Button, SimTag } from "../ui";
import { C } from "./ModelTab";

/* ================= Funnel di acquisizione ================= */

/** Scomposizione degli stadi: ipotesi esplicite. Il prodotto degli stadi riproduce le conversioni del modello. */
const STAGE = { answerRate: 0.05, startGivenAnswer: 0.4, clickRate: 0.006, startGivenClick: 0.75, d1C: 0.22, d1Lift: 0.15 };

export function FunnelTab({ inputs }: { inputs: Inputs }) {
  const N = 100_000;
  const completeT = inputs.convTreatment / (STAGE.answerRate * STAGE.startGivenAnswer);
  const completeC = inputs.convControl / (STAGE.clickRate * STAGE.startGivenClick);
  const t1 = N * STAGE.answerRate;
  const t2 = t1 * STAGE.startGivenAnswer;
  const t3 = t2 * completeT;
  const c1 = N * STAGE.clickRate;
  const c2 = c1 * STAGE.startGivenClick;
  const c3 = c2 * completeC;
  const d1T = STAGE.d1C * (1 + STAGE.d1Lift);
  const rows = [
    { label: "Lettori esposti al touchpoint", c: N, t: N, def: "Utenti unici con impression ≥1s del modulo o del promo" },
    { label: "Interagiscono (risposta o clic)", c: c1, t: t1, def: "inline_question_answered (T) · clic sul promo (C)" },
    { label: "Iniziano un'Edizione o un gioco", c: c2, t: t2, def: "edition_started con entry dall'articolo" },
    { label: "Completano il primo gioco: attivazione", c: c3, t: t3, def: "edition_completed (prima volta)" },
    { label: "Si registrano", c: c3 * inputs.registrationRate, t: t3 * inputs.registrationRate, def: "registration_completed attribuita" },
    { label: "Tornano il giorno dopo (D1)", c: c3 * STAGE.d1C, t: t3 * d1T, def: "return_visit nel giorno di calendario successivo" },
    { label: "Abituali a 4 settimane", c: c3 * inputs.newHabit, t: t3 * inputs.newHabit, def: "≥4 giorni di gioco nella settimana 4" },
  ];
  const valid = completeT <= 1 && completeC <= 1;
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h3 className="font-serif text-2xl font-semibold text-ink">Funnel lettore → giocatore, ogni 100.000 lettori esposti</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">
          Confronto tra il promo attuale (controllo) e «Gioca la notizia» (trattamento). Conversioni, registrazione e quota di abituali vengono dalle ipotesi
          del modello; la scomposizione per stadio è un&apos;ipotesi esplicita. Il test A1 misura la riga «attivazione», il test A2 la riga D1.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-ink-2">
        <Legend color={C.orange} label="Controllo: promo attuale" />
        <Legend color={C.blue} label="Trattamento: Gioca la notizia" />
        <SimTag>Dati simulati</SimTag>
      </div>
      {!valid && <p className="rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn">Le conversioni impostate superano ciò che gli stadi ipotizzati consentono: riducile nel tab Modello.</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[0.85rem]">
          <thead>
            <tr className="text-[0.7rem] uppercase tracking-wider text-muted">
              <th className="py-2 pr-4 font-semibold">Stadio</th>
              <th className="w-[44%] py-2 pr-4 font-semibold">Confronto (scala per riga)</th>
              <th className="py-2 pr-2 text-right font-semibold">Controllo</th>
              <th className="py-2 pr-2 text-right font-semibold">Trattamento</th>
              <th className="py-2 text-right font-semibold">Rapporto</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const m = Math.max(r.c, r.t, 1e-9);
              return (
                <tr key={r.label} className="border-t border-rule align-middle">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-ink">{r.label}</p>
                    <p className="text-[0.7rem] text-muted">{r.def}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="space-y-1">
                      <div className="h-2.5 rounded-[4px]" style={{ width: `${(r.c / m) * 100}%`, background: C.orange }} title={`Controllo: ${fmtInt(r.c)}`} />
                      <div className="h-2.5 rounded-[4px]" style={{ width: `${(r.t / m) * 100}%`, background: C.blue }} title={`Trattamento: ${fmtInt(r.t)}`} />
                    </div>
                  </td>
                  <td className="py-3 pr-2 text-right font-semibold tabular text-ink">{fmtInt(r.c)}</td>
                  <td className="py-3 pr-2 text-right font-semibold tabular text-ink">{fmtInt(r.t)}</td>
                  <td className="py-3 text-right tabular text-ink-2">{r.c > 0 ? `${(r.t / r.c).toLocaleString("it-IT", { maximumFractionDigits: 1 })}×` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-sm leading-relaxed text-ink-2">
        <strong className="text-ink">Il punto chiave.</strong> Il vantaggio si crea nei primi due stadi: rispondere a una domanda nella pagina costa meno
        che lasciare l&apos;articolo. Ma l&apos;acquisizione vale solo se i nuovi giocatori tornano. Per questo la metrica che decide l&apos;estensione è
        l&apos;attivazione, non il clic, e il D1 è il criterio della prima esperienza.
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-3 w-3 rounded-[3px]" style={{ background: color }} />
      {label}
    </span>
  );
}

/* ================= Coorti di retention ================= */

const WEEKS = 8;
const LABELS = ["1 feb", "8 feb", "15 feb", "22 feb", "1 mar", "8 mar", "15 mar", "22 mar"];

export function CohortTab() {
  const [lift, setLift] = useState(0.25);
  const base = 0.18;
  const control = useMemo(() => simulateCohorts({ cohorts: 8, weeks: WEEKS, size: 2500, plateau: base, tau: 1.6, seed: 11, startLabel: LABELS }), []);
  const treat = useMemo(() => simulateCohorts({ cohorts: 8, weeks: WEEKS, size: 2500, plateau: base * (1 + lift), tau: 1.9, seed: 23, startLabel: LABELS }), [lift]);

  const avg = (cs: typeof control, w: number) => {
    const vals = cs.map((c) => c.values[w]).filter((v): v is number => v !== null);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };
  const curve = Array.from({ length: WEEKS + 1 }, (_, w) => ({ w: `S${w}`, Controllo: avg(control, w), Filo: avg(treat, w) }));

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h3 className="font-serif text-2xl font-semibold text-ink">Retention per coorte: cosa ci aspettiamo di vedere nel pilot</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">
          Coorti settimanali di utenti del target, assegnate al controllo o al Filo. Per ogni settimana successiva, la quota che ha giocato almeno un giorno. I
          dati sono simulati con un generatore deterministico: servono a mostrare come leggeremo il pilot, non sono una previsione.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="lift" className="text-sm text-ink-2">
          Effetto ipotizzato sul plateau di retention
        </label>
        <input id="lift" type="range" min={0} max={0.6} step={0.05} value={lift} onChange={(e) => setLift(Number(e.target.value))} className="w-48" />
        <span className="text-sm font-semibold tabular text-ink">+{fmtPct(lift, 0)}</span>
        <SimTag>Dati simulati</SimTag>
      </div>

      <figure>
        <figcaption className="text-sm font-semibold text-ink">Curva media di retention settimanale</figcaption>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-2">
          <Legend color={C.orange} label="Controllo" />
          <Legend color={C.blue} label="Filo" />
        </div>
        <div className="mt-3 h-[280px] w-full">
          <ResponsiveContainer>
            <LineChart data={curve} margin={{ top: 10, right: 56, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#e9e4da" vertical={false} />
              <XAxis dataKey="w" tick={{ fontSize: 12, fill: "#646b76" }} axisLine={{ stroke: "#ddd6c8" }} tickLine={false} />
              <YAxis tickFormatter={(v) => fmtPct(v, 0)} tick={{ fontSize: 12, fill: "#646b76" }} axisLine={false} tickLine={false} width={44} domain={[0, 1]} />
              <Tooltip
                formatter={(v) => fmtPct(Number(v), 1)}
                contentStyle={{ borderRadius: 12, border: "1px solid #ddd6c8", fontSize: 12 }}
                cursor={{ stroke: "#13294b", strokeOpacity: 0.25 }}
              />
              {(["Controllo", "Filo"] as const).map((k) => (
                <Line
                  key={k}
                  type="monotone"
                  dataKey={k}
                  stroke={k === "Filo" ? C.blue : C.orange}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                  label={(p: { x?: number | string; y?: number | string; index?: number }) =>
                    p.index === WEEKS ? (
                      <text x={Number(p.x ?? 0) + 8} y={Number(p.y ?? 0) + 4} fontSize={12} fill="#3a404a" fontWeight={600}>
                        {k}
                      </text>
                    ) : (
                      <g />
                    )
                  }
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </figure>

      <div className="grid gap-8 xl:grid-cols-2">
        <Heatmap title="Controllo" cohorts={control} />
        <Heatmap title="Filo" cohorts={treat} />
      </div>
      <p className="text-sm leading-relaxed text-ink-2">
        <strong className="text-ink">Come leggerla.</strong> Il segnale da cercare non è la settimana 1, gonfiata dalla novità, ma il plateau delle
        settimane 3–6: è lì che si vede se è nata un&apos;abitudine. Per questo la metrica primaria di R1 esclude le prime due settimane.
      </p>
    </div>
  );
}

function Heatmap({ title, cohorts }: { title: string; cohorts: ReturnType<typeof simulateCohorts> }) {
  return (
    <figure>
      <figcaption className="text-sm font-semibold text-ink">{title} · quota attiva per settimana</figcaption>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] border-separate border-spacing-[2px] text-[0.72rem]">
          <thead>
            <tr className="text-muted">
              <th className="px-1 text-left font-semibold">Coorte</th>
              <th className="px-1 text-right font-semibold">n</th>
              {Array.from({ length: WEEKS + 1 }, (_, w) => (
                <th key={w} className="font-semibold">
                  S{w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr key={c.label}>
                <td className="whitespace-nowrap px-1 text-ink-2">{c.label}</td>
                <td className="px-1 text-right tabular text-muted">{fmtInt(c.size)}</td>
                {c.values.map((v, w) => (
                  <td
                    key={w}
                    className={clsx("h-7 rounded-[3px] text-center tabular", v === null ? "bg-transparent" : v > 0.45 ? "text-white" : "text-ink")}
                    style={v === null ? undefined : { background: seq(v) }}
                    title={v === null ? "Non ancora osservata" : `${c.label}, settimana ${w}: ${fmtPct(v, 1)}`}
                  >
                    {v === null ? "" : Math.round(v * 100)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/** Scala sequenziale a una tinta (azzurro chiaro → blu profondo). */
function seq(v: number) {
  const t = Math.min(1, Math.max(0, (v - 0.1) / 0.9));
  const a = [228, 242, 250];
  const b = [19, 41, 75];
  const c = a.map((x, i) => Math.round(x + (b[i] - x) * Math.pow(t, 0.8)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/* ================= Esperimenti ================= */

export function ExperimentTab() {
  const [id, setId] = useState<(typeof EXPERIMENTS)[number]["id"]>("R1");
  const ex = EXPERIMENTS.find((e) => e.id === id)!;
  const [n, setN] = useState(ex.sim.n);
  const [lift, setLift] = useState(ex.sim.lift);
  const [seed, setSeed] = useState(1);

  const select = (nid: typeof id) => {
    const e = EXPERIMENTS.find((x) => x.id === nid)!;
    setId(nid);
    setN(e.sim.n);
    setLift(e.sim.lift);
    setSeed(1);
  };

  const p0 = ex.sim.p0;
  const pT = Math.min(0.99, p0 * (1 + lift));
  const res = useMemo(() => {
    const r = rng(seed * 7919 + n);
    const xC = binomial(n, p0, r);
    const xT = binomial(n, pT, r);
    return twoProportion(xC, n, xT, n);
  }, [seed, n, p0, pT]);
  const minEffect = mde(p0, n);
  const needed = pT > p0 ? sampleSize(p0, pT - p0) : null;
  const ship = res.lo > 0;

  const span = Math.max(Math.abs(res.lo), Math.abs(res.hi), minEffect) * 1.25;
  const pos = (v: number) => `${50 + (v / span) * 50}%`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Esperimenti">
        {EXPERIMENTS.map((e) => (
          <button
            key={e.id}
            role="tab"
            aria-selected={e.id === id}
            onClick={() => select(e.id)}
            className={clsx("h-9 rounded-full px-4 text-sm font-semibold transition-colors", e.id === id ? "bg-navy text-white" : "bg-card text-navy ring-1 ring-rule hover:ring-navy/40")}
          >
            {e.id} · {e.case}
          </button>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr]">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-ink">{ex.name}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{ex.hypothesis}</p>
          <dl className="mt-5 grid gap-x-6 gap-y-4 text-[0.85rem] sm:grid-cols-2">
            {(
              [
                ["Controllo", ex.control],
                ["Trattamento", ex.treatment],
                ["Popolazione", ex.population],
                ["Unità di randomizzazione", ex.unit],
                ["Metrica primaria", ex.primary],
                ["Guardrail", ex.guardrails],
                ["Criterio decisionale", ex.decision],
                ["Limiti interpretativi", ex.limits],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">{k}</dt>
                <dd className="mt-1 leading-relaxed text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl bg-card p-5 ring-1 ring-rule">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold text-ink">Simulatore: come leggeremmo il risultato</p>
            <SimTag>Simulato</SimTag>
          </div>
          <p className="mt-1 text-xs text-muted">
            Baseline ipotizzata {fmtPct(p0)} · metrica: {ex.sim.metricShort}. L&apos;«effetto vero» è un&apos;ipotesi che puoi cambiare: il test
            esiste proprio per scoprirlo.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-[0.82rem]">
                <label htmlFor="n" className="text-ink-2">
                  Utenti per braccio
                </label>
                <span className="font-semibold tabular text-ink">{fmtInt(n)}</span>
              </div>
              <input id="n" type="range" min={500} max={ex.sim.n * 4} step={500} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="flex justify-between text-[0.82rem]">
                <label htmlFor="lift-ex" className="text-ink-2">
                  Effetto vero ipotizzato (relativo)
                </label>
                <span className="font-semibold tabular text-ink">+{fmtPct(lift, 0)}</span>
              </div>
              <input id="lift-ex" type="range" min={0} max={Math.max(1, ex.sim.lift * 2)} step={0.05} value={lift} onChange={(e) => setLift(Number(e.target.value))} className="w-full" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-paper p-3">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted">Controllo osservato</p>
              <p className="mt-1 font-serif text-xl font-semibold tabular text-ink">{fmtPct(res.pC, 2)}</p>
            </div>
            <div className="rounded-xl bg-paper p-3">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted">Trattamento osservato</p>
              <p className="mt-1 font-serif text-xl font-semibold tabular text-ink">{fmtPct(res.pT, 2)}</p>
            </div>
          </div>

          <figure className="mt-5">
            <figcaption className="text-xs font-semibold text-ink">Differenza T − C con intervallo di confidenza al 95%</figcaption>
            <div className="relative mt-3 h-14" role="img" aria-label={`Differenza ${fmtPp(res.diff, 2)}, IC da ${fmtPp(res.lo, 2)} a ${fmtPp(res.hi, 2)}`}>
              <span className="absolute inset-y-0 w-px bg-ink/40" style={{ left: "50%" }} />
              <span className="absolute bottom-0 -translate-x-1/2 text-[0.65rem] text-muted" style={{ left: "50%" }}>
                0
              </span>
              <span className="absolute inset-y-2 w-px border-l border-dashed" style={{ left: pos(minEffect), borderColor: C.azure }} />
              <span className="absolute bottom-0 -translate-x-1/2 whitespace-nowrap text-[0.65rem] text-azure-ink" style={{ left: pos(minEffect) }}>
                MDE
              </span>
              <span className="absolute top-5 h-0.5 rounded" style={{ left: pos(res.lo), width: `calc(${pos(res.hi)} - ${pos(res.lo)})`, background: ship ? C.blue : C.orange }} />
              <span
                className="absolute top-[14px] h-3 w-3 -translate-x-1/2 rounded-full ring-2 ring-white"
                style={{ left: pos(res.diff), background: ship ? C.blue : C.orange }}
              />
            </div>
          </figure>

          <dl className="mt-4 space-y-1.5 text-[0.82rem]">
            <Row k="Differenza osservata" v={`${fmtPp(res.diff, 2)} (${res.lift >= 0 ? "+" : ""}${fmtPct(res.lift, 0)})`} />
            <Row k="IC 95%" v={`${fmtPp(res.lo, 2)} … ${fmtPp(res.hi, 2)}`} />
            <Row k="p-value (bilaterale)" v={res.pValue < 0.001 ? "< 0,001" : res.pValue.toFixed(3).replace(".", ",")} />
            <Row k="MDE con questa n (α 5%, potenza 80%)" v={`${fmtPp(minEffect, 2)} · ${fmtPct(minEffect / p0, 0)} relativo`} />
            <Row k="n per braccio per l'effetto ipotizzato" v={needed ? fmtInt(needed) : "—"} />
          </dl>
          <p className={clsx("mt-4 rounded-lg px-3 py-2 text-sm font-medium", ship ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn")} aria-live="polite">
            {ship
              ? "Decisione: si procede, se anche i guardrail sono nelle soglie. Il limite inferiore dell'IC è sopra lo zero."
              : "Decisione: non si procede. L'IC include lo zero: l'effetto non è distinguibile dal caso con questa numerosità."}
          </p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => setSeed((s) => s + 1)}>
            Nuova estrazione casuale
          </Button>
          <p className="mt-2 text-[0.7rem] leading-snug text-muted">
            Ogni estrazione simula lo stesso esperimento con un campione diverso: è la variabilità che il criterio decisionale deve sopportare.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-2">{k}</dt>
      <dd className="text-right font-semibold tabular text-ink">{v}</dd>
    </div>
  );
}

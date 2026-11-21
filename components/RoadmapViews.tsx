import clsx from "clsx";
import { INITIATIVES, PHASES } from "@/data/roadmap";

const PHASE_COLOR = { 1: "#1e5b9c", 2: "#2a9fd8", 3: "#e08a3c" } as const;

/** Matrice impatto/sforzo: posizioni da punteggi 1–5; in caso di sovrapposizione i punti si affiancano. */
export function ImpactEffortMatrix({ compact = false }: { compact?: boolean }) {
  const cells = new Map<string, number>();
  const pts = INITIATIVES.map((i) => {
    const key = `${i.impact}-${i.effort}`;
    const k = cells.get(key) ?? 0;
    cells.set(key, k + 1);
    return { ...i, k };
  });
  const W = 560;
  const H = 400;
  const pad = { l: 44, b: 36, t: 12, r: 12 };
  const x = (e: number) => pad.l + ((e - 0.5) / 5) * (W - pad.l - pad.r);
  const y = (im: number) => H - pad.b - ((im - 0.5) / 5) * (H - pad.b - pad.t);
  const midX = x(3);
  const midY = y(3);
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Matrice impatto sforzo delle iniziative">
        <rect x={pad.l} y={pad.t} width={midX - pad.l} height={midY - pad.t} fill="#e4f2fa" rx={6} />
        <text x={pad.l + 10} y={pad.t + 20} fontSize={11} fontWeight={700} fill="#1474a8" letterSpacing="0.08em">
          PRIMA QUESTE
        </text>
        <line x1={midX} x2={midX} y1={pad.t} y2={H - pad.b} stroke="#ddd6c8" strokeDasharray="3 4" />
        <line x1={pad.l} x2={W - pad.r} y1={midY} y2={midY} stroke="#ddd6c8" strokeDasharray="3 4" />
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="#3a404a" strokeOpacity={0.4} />
        <line x1={pad.l} x2={pad.l} y1={pad.t} y2={H - pad.b} stroke="#3a404a" strokeOpacity={0.4} />
        <text x={(W + pad.l) / 2} y={H - 8} fontSize={12} textAnchor="middle" fill="#646b76">
          Sforzo →
        </text>
        <text x={14} y={(H - pad.b) / 2} fontSize={12} textAnchor="middle" fill="#646b76" transform={`rotate(-90 14 ${(H - pad.b) / 2})`}>
          Impatto atteso →
        </text>
        {pts.map((p) => {
          const cx = x(p.effort) + (p.k - 0.5) * 26 * (cells.get(`${p.impact}-${p.effort}`)! > 1 ? 1 : 0);
          const cy = y(p.impact);
          return (
            <g key={p.id}>
              <title>{`${p.id} · ${p.name} — impatto ${p.impact}, sforzo ${p.effort}, fase ${p.phase}`}</title>
              <circle cx={cx} cy={cy} r={11} fill={PHASE_COLOR[p.phase]} stroke="#fff" strokeWidth={2} />
              <text x={cx} y={cy + 3.5} fontSize={8.5} fontWeight={700} textAnchor="middle" fill="#fff">
                {p.id.replace("I", "")}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-2">
        {[1, 2, 3].map((n) => (
          <span key={n} className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: PHASE_COLOR[n as 1 | 2 | 3] }} />
            Fase {n} · {PHASES[n - 1].name}
          </span>
        ))}
      </div>
      {!compact && (
        <ol className="mt-4 grid gap-x-6 gap-y-1.5 text-[0.82rem] sm:grid-cols-2">
          {INITIATIVES.map((i) => (
            <li key={i.id} className="flex gap-2">
              <span className="w-5 shrink-0 text-right font-semibold tabular text-muted">{i.id.replace("I", "")}</span>
              <span className="text-ink">
                {i.name} <span className="text-muted">· {i.note}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
      <figcaption className="mt-3 text-xs text-muted">Punteggi 1–5 assegnati dal team, motivati in docs/ROADMAP.md. Sono giudizi, non misure.</figcaption>
    </figure>
  );
}

export function PhaseCards() {
  return (
    <ol className="grid gap-4 lg:grid-cols-3">
      {PHASES.map((p) => (
        <li key={p.n} className={clsx("flex flex-col rounded-2xl p-6", p.n === 1 ? "bg-navy text-white" : "bg-card ring-1 ring-rule")}>
          <p className={clsx("text-[0.7rem] font-semibold uppercase tracking-[0.16em]", p.n === 1 ? "text-white/70" : "text-muted")}>
            Fase {p.n} · {p.when}
          </p>
          <p className="mt-2 font-serif text-[1.8rem] font-semibold">{p.name}</p>
          <p className={clsx("mt-2 text-sm leading-relaxed", p.n === 1 ? "text-white/85" : "text-ink-2")}>{p.goal}</p>
          <Section title="Deliverable" items={p.deliverables} dark={p.n === 1} />
          <Section title="Go / no-go" items={p.gate} dark={p.n === 1} />
          <Section title="Dipendenze" items={p.dependencies} dark={p.n === 1} />
          <Section title="Team" items={p.teams} dark={p.n === 1} inline />
          <Section title="KPI" items={p.kpis} dark={p.n === 1} />
          <Section title="Rischi" items={p.risks} dark={p.n === 1} />
          <p className={clsx("mt-5 border-t pt-3 text-xs", p.n === 1 ? "border-white/20 text-white/70" : "border-rule text-muted")}>
            Complessità: <strong className={p.n === 1 ? "text-white" : "text-ink"}>{p.complexity}</strong> · Priorità:{" "}
            <strong className={p.n === 1 ? "text-white" : "text-ink"}>{p.priority}</strong>
          </p>
        </li>
      ))}
    </ol>
  );
}

function Section({ title, items, dark, inline }: { title: string; items: string[]; dark: boolean; inline?: boolean }) {
  return (
    <div className="mt-5">
      <p className={clsx("text-[0.68rem] font-semibold uppercase tracking-[0.14em]", dark ? "text-white/60" : "text-muted")}>{title}</p>
      {inline ? (
        <p className={clsx("mt-1.5 text-[0.85rem]", dark ? "text-white/90" : "text-ink")}>{items.join(" · ")}</p>
      ) : (
        <ul className={clsx("mt-1.5 space-y-1 text-[0.85rem] leading-snug", dark ? "text-white/90" : "text-ink")}>
          {items.map((it) => (
            <li key={it} className="flex gap-2">
              <span aria-hidden className={dark ? "text-azure" : "text-azure-ink"}>
                –
              </span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

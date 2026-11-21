"use client";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { EVENT_DOC, type TrackedEvent } from "@/lib/events";
import { Arrow, Button, Kicker } from "../ui";

export type Step = {
  title: string;
  body: ReactNode;
  lever?: string; // leva di prodotto / comunicazione
  metric?: string; // metrica che deve spostare
};

export function ExperienceShell({
  kicker,
  title,
  intro,
  steps,
  step,
  onStep,
  onReset,
  children,
  below,
  nextDisabled,
  nextHint,
}: {
  kicker: string;
  title: string;
  intro: ReactNode;
  steps: Step[];
  step: number;
  onStep: (n: number) => void;
  onReset: () => void;
  children: ReactNode;
  below?: ReactNode;
  nextDisabled?: boolean;
  nextHint?: string;
}) {
  const s = steps[step];
  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="max-w-3xl">
        <Kicker>{kicker}</Kicker>
        <h1 className="display mt-3 text-[2rem] text-ink sm:text-[2.6rem]">{title}</h1>
        <div className="mt-3 text-[1.02rem] leading-relaxed text-ink-2">{intro}</div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12">
        {/* Percorso narrativo */}
        <section aria-label="Passaggi della demo" className="order-1 lg:col-start-1 lg:row-start-1">
          <ol className="flex gap-1.5 overflow-x-auto pb-1" role="tablist">
            {steps.map((st, i) => (
              <li key={st.title} className="min-w-0 flex-1">
                <button
                  role="tab"
                  aria-selected={i === step}
                  onClick={() => onStep(i)}
                  className="group w-full min-w-[64px] text-left"
                >
                  <span className={clsx("block h-1 rounded-full transition-colors", i <= step ? "bg-navy" : "bg-rule group-hover:bg-navy/30")} />
                  <span className={clsx("mt-2 block truncate text-xs font-semibold", i === step ? "text-navy" : "text-muted")}>
                    {i + 1}. {st.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-6 min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <p className="kicker text-azure-ink">
                  Passo {step + 1} di {steps.length}
                </p>
                <h2 className="display mt-2 text-[1.6rem] text-ink sm:text-[1.9rem]">{s.title}</h2>
                <div className="mt-3 space-y-3 text-[1rem] leading-relaxed text-ink-2">{s.body}</div>
                {(s.lever || s.metric) && (
                  <dl className="mt-6 grid gap-4 border-t border-rule pt-4 sm:grid-cols-2">
                    {s.lever && (
                      <div>
                        <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">Leva</dt>
                        <dd className="mt-1 text-sm font-medium text-ink">{s.lever}</dd>
                      </div>
                    )}
                    {s.metric && (
                      <div>
                        <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">Metrica che deve muovere</dt>
                        <dd className="mt-1 text-sm font-medium text-ink">{s.metric}</dd>
                      </div>
                    )}
                  </dl>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => onStep(Math.max(0, step - 1))} disabled={step === 0}>
              <Arrow dir="left" /> Indietro
            </Button>
            {step < steps.length - 1 && (
              <Button onClick={() => onStep(step + 1)} disabled={nextDisabled}>
                Passo successivo <Arrow />
              </Button>
            )}
            <Button variant="ghost" onClick={onReset}>
              Ricomincia la demo
            </Button>
          </div>
          {nextDisabled && nextHint && <p className="mt-2 text-sm text-muted">{nextHint}</p>}

        </section>

        {/* Prodotto */}
        <section aria-label="Prototipo interattivo" className="order-2 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          {children}
        </section>

        {below && <div className="order-3 lg:col-start-1 lg:row-start-2">{below}</div>}
      </div>
    </div>
  );
}

export function PhoneFrame({ children, time = "08:12", label, tone = "paper" }: { children: ReactNode; time?: string; label?: string; tone?: "paper" | "white" }) {
  return (
    <div className="mx-auto w-full max-w-[400px]">
      {label && <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>}
      <div className="rounded-[2.6rem] bg-ink p-[10px] shadow-[0_30px_60px_-30px_rgba(19,41,75,0.45)]">
        <div className={clsx("relative overflow-hidden rounded-[2.1rem]", tone === "paper" ? "bg-paper" : "bg-white")}>
          <div className="flex h-9 items-center justify-between px-7 text-[0.75rem] font-semibold text-ink tabular">
            <span>{time}</span>
            <span className="h-5 w-24 rounded-full bg-ink" aria-hidden />
            <span aria-hidden className="flex items-center gap-1">
              <span className="h-2.5 w-4 rounded-[3px] border border-ink/70" />
            </span>
          </div>
          <div className="h-[640px] overflow-y-auto overscroll-contain" data-phone-scroll>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventLog({ events, title = "Eventi tracciati in questa demo" }: { events: TrackedEvent[]; title?: string }) {
  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-rule">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-muted tabular">{events.length} eventi</p>
      </div>
      <p className="mt-1 text-xs text-muted">Così misureremmo l&apos;esperienza: nomi e proprietà sono definiti in docs/METRICS.md.</p>
      <ol className="mt-4 max-h-[300px] space-y-2 overflow-y-auto pr-1" aria-live="polite">
        {events.length === 0 && <li className="text-sm text-muted">Nessun evento ancora: interagisci con il prototipo.</li>}
        {[...events].reverse().map((e) => (
          <li key={e.id} className="rounded-lg bg-paper px-3 py-2">
            <div className="flex items-baseline justify-between gap-2">
              <code className="text-[0.8rem] font-semibold text-navy">{e.name}</code>
              <span className="text-[0.7rem] text-muted tabular">{e.at}</span>
            </div>
            <p className="mt-0.5 text-[0.72rem] text-muted">{EVENT_DOC[e.name]}</p>
            {Object.keys(e.props).length > 0 && (
              <p className="mt-1 break-all font-mono text-[0.7rem] leading-relaxed text-ink-2">
                {Object.entries(e.props)
                  .map(([k, v]) => `${k}=${v}`)
                  .join("  ")}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

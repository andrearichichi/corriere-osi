"use client";
import clsx from "clsx";
import type { ReactNode } from "react";
import { EDITIONS } from "@/data/week";
import { clueStatus, cluesCollected, isComplete, onTimeDays, recoverable, weeklyPoints, type FiloState } from "@/lib/filo";
import { FiloBoard } from "../filo/Filo";
import { Arrow, Button } from "../ui";

/** Catalogo esistente di Corriere Giochi (fonte: docs/PRODUCT_AUDIT.md). Il Filo NON lo sostituisce. */
export const EXISTING_GAMES = [
  "Il Quiz del Corriere",
  "In altre parole",
  "Apegramma",
  "Prima o Dopo",
  "Cruciverba",
  "Mini Cruciverba",
  "Sudoku",
  "Crucipuzzle",
];

export function AppHeader({ title = "Giochi", right }: { title?: string; right?: ReactNode }) {
  return (
    <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-rule bg-paper/95 px-5 backdrop-blur">
      <span className="font-serif text-[1.05rem] font-semibold text-navy">
        Corriere <span className="italic">{title}</span>
      </span>
      {right}
    </div>
  );
}

/** Rappresentazione schematica dell'hub attuale: non è uno screenshot. */
export function CurrentHub() {
  return (
    <div>
      <AppHeader />
      <div className="px-5 py-4">
        <p className="rounded-lg bg-warn-soft px-3 py-2 text-[0.72rem] font-medium leading-snug text-warn">
          Schema dell&apos;hub attuale ricostruito dall&apos;audit pubblico. Non è uno screenshot.
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Tutti i giochi</p>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {EXISTING_GAMES.map((g) => (
            <li key={g} className="rounded-xl bg-card px-3 py-4 text-sm font-semibold text-ink ring-1 ring-rule">
              {g}
            </li>
          ))}
        </ul>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[0.7rem] font-semibold text-muted">
          <span className="rounded-lg bg-paper-2 py-2">Statistiche</span>
          <span className="rounded-lg bg-paper-2 py-2">Sfide</span>
          <span className="rounded-lg bg-paper-2 py-2">Classifiche</span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-ink-2">
          Otto giochi, nessun percorso suggerito e nessun legame tra la partita di oggi e quella di domani.
        </p>
      </div>
    </div>
  );
}

export function FiloHome({
  state,
  name,
  onPlay,
  onNodo,
  sfida,
  notice,
}: {
  state: FiloState;
  name?: string;
  onPlay: (day: number) => void;
  onNodo?: () => void;
  sfida?: { name: string; points: number; you?: boolean }[];
  notice?: ReactNode;
}) {
  const today = state.today;
  const ed = EDITIONS[today];
  const todayDone = today < 6 && isComplete(state, today);
  const rec = recoverable(state);
  const collected = cluesCollected(state);

  return (
    <div>
      <AppHeader right={<span className="text-xs font-semibold text-muted tabular">{weeklyPoints(state)} punti</span>} />
      <div className="space-y-5 px-5 py-5">
        <div>
          <p className="text-xs font-semibold text-muted">{today < 6 ? `${ed.dayName} ${ed.dateLabel}` : "Domenica 6 dicembre"}</p>
          <h2 className="mt-1 font-serif text-[1.55rem] font-semibold leading-tight text-ink">
            {name ? `Buongiorno, ${name}.` : "Buongiorno."}
          </h2>
        </div>

        {notice}

        {/* Card principale: l'appuntamento di oggi */}
        {today < 6 ? (
          <div className="overflow-hidden rounded-2xl bg-navy text-white">
            <div className="p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/70">L&apos;Edizione di oggi</p>
              <p className="mt-2 font-serif text-[1.35rem] font-semibold leading-snug">
                {todayDone ? `Fatto. L'indizio di oggi è «${ed.clue.word}».` : "Tre giochi, tre minuti, un indizio."}
              </p>
              <p className="mt-2 text-sm text-white/75">
                {todayDone ? "Domani alle 7 esce il prossimo." : "Il Quiz · Prima o Dopo · L'Anagramma"}
              </p>
            </div>
            {!todayDone && (
              <button onClick={() => onPlay(today)} className="flex w-full items-center justify-between bg-azure px-5 py-3.5 text-left text-[0.95rem] font-semibold hover:bg-azure-ink">
                Gioca l&apos;Edizione <Arrow />
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-navy text-white">
            <div className="p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/70">Domenica</p>
              <p className="mt-2 font-serif text-[1.35rem] font-semibold leading-snug">
                {state.nodo.solved ? "Nodo sciolto. Lunedì si riparte." : "Il Nodo della settimana è pronto."}
              </p>
              <p className="mt-2 text-sm text-white/75">Hai {collected} indizi su 6.</p>
            </div>
            {!state.nodo.solved && onNodo && (
              <button onClick={onNodo} className="flex w-full items-center justify-between bg-azure px-5 py-3.5 text-left text-[0.95rem] font-semibold hover:bg-azure-ink">
                Sciogli il Nodo <Arrow />
              </button>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-card p-4 ring-1 ring-rule">
          <FiloBoard state={state} onSelect={onPlay} />
          {rec.length > 0 && today < 6 && (
            <p className="mt-3 text-[0.8rem] leading-snug text-ink-2">
              {rec.length === 1 ? "Un indizio è" : `${rec.length} indizi sono`} ancora recuperabili: tocca il cerchio tratteggiato. Vale 1 punto invece di 2.
            </p>
          )}
        </div>

        {sfida && (
          <div className="rounded-2xl bg-card p-4 ring-1 ring-rule">
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy">La tua Sfida · questa settimana</p>
              <span className="tag-sim">Simulato</span>
            </div>
            <ol className="mt-3 space-y-1.5">
              {[...sfida]
                .sort((a, b) => b.points - a.points)
                .map((p, i) => (
                  <li key={p.name} className={clsx("flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm", p.you && "bg-azure-soft")}>
                    <span className="w-4 text-xs font-semibold text-muted tabular">{i + 1}</span>
                    <span className={clsx("flex-1", p.you ? "font-semibold text-navy" : "text-ink")}>{p.name}</span>
                    <span className="font-semibold tabular text-ink">{p.points}</span>
                  </li>
                ))}
            </ol>
            <p className="mt-2 text-[0.72rem] text-muted">Puntuale 2 · recuperato 1 · Nodo 4. Si azzera ogni lunedì.</p>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Tutti i giochi</p>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-2">{EXISTING_GAMES.join(" · ")}</p>
          <p className="mt-1 text-[0.72rem] text-muted">Il catalogo resta com&apos;è: il Filo è la porta d&apos;ingresso quotidiana.</p>
        </div>
      </div>
    </div>
  );
}

export function WeekRhythm({ state }: { state: FiloState }) {
  return (
    <p className="text-sm text-ink-2">
      Giorni puntuali: <strong className="text-ink tabular">{onTimeDays(state)}</strong> · indizi:{" "}
      <strong className="text-ink tabular">{cluesCollected(state)}/6</strong> · punti: <strong className="text-ink tabular">{weeklyPoints(state)}</strong>
    </p>
  );
}

export function PlayScreen({ children, onBack, backLabel = "Il Filo" }: { children: ReactNode; onBack?: () => void; backLabel?: string }) {
  return (
    <div>
      <AppHeader
        right={
          onBack && <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-navy">
            <Arrow dir="left" className="h-3.5 w-3.5" /> {backLabel}
          </button>
        }
      />
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

export function LockScreen({ time, date, notifications }: { time: string; date: string; notifications: { app: string; title: string; body: string; onOpen?: () => void; meta?: string }[] }) {
  return (
    <div className="flex min-h-[640px] flex-col bg-gradient-to-b from-navy to-[#0c1a31] px-4 pb-6 pt-10 text-white">
      <p className="text-center text-sm font-medium text-white/80">{date}</p>
      <p className="text-center font-sans text-[4.2rem] font-light leading-none tracking-tight tabular">{time}</p>
      <ul className="mt-10 space-y-2">
        {notifications.map((n) => (
          <li key={n.title}>
            <button
              onClick={n.onOpen}
              disabled={!n.onOpen}
              className="w-full rounded-2xl bg-white/90 p-3.5 text-left text-ink backdrop-blur transition-transform enabled:hover:scale-[1.01] enabled:active:scale-[0.99]"
            >
              <div className="flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
                <span>{n.app}</span>
                <span>{n.meta ?? "ora"}</span>
              </div>
              <p className="mt-1 text-[0.92rem] font-semibold">{n.title}</p>
              <p className="mt-0.5 text-[0.85rem] leading-snug text-ink-2">{n.body}</p>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-8 text-center text-xs text-white/60">Tocca la notifica per aprirla</p>
    </div>
  );
}

export function EditionDone({ children, onContinue, cta }: { children: ReactNode; onContinue: () => void; cta: string }) {
  return (
    <div className="space-y-6">
      {children}
      <Button className="w-full" onClick={onContinue}>
        {cta} <Arrow />
      </Button>
    </div>
  );
}

export { clueStatus };

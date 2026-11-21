"use client";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DAY_SHORT, EDITIONS, NODO, type Edition } from "@/data/week";
import {
  clueStatus,
  cluesCollected,
  dayRecord,
  guessNodo,
  type FiloState,
  type GameResult,
} from "@/lib/filo";
import { QuizGame } from "../games/QuizGame";
import { OrderGame } from "../games/OrderGame";
import { WordGame } from "../games/WordGame";
import { Arrow, Button, Check, FiloMark } from "../ui";

/* ---------------- Tabellone settimanale ---------------- */

export function FiloBoard({
  state,
  onSelect,
  compact = false,
  highlight,
}: {
  state: FiloState;
  onSelect?: (day: number) => void;
  compact?: boolean;
  highlight?: number;
}) {
  const collected = cluesCollected(state);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-navy">
          <FiloMark className="text-azure" /> Il Filo della settimana
        </p>
        <p className="text-xs font-semibold text-muted tabular">{collected}/6 indizi</p>
      </div>
      <div className="relative mt-3">
        {/* il filo */}
        <svg aria-hidden className="absolute inset-x-3 top-[22px] h-2 w-[calc(100%-1.5rem)]" preserveAspectRatio="none" viewBox="0 0 100 4">
          <path d="M0 2 Q 8 0 16.6 2 T 33.3 2 T 50 2 T 66.6 2 T 83.3 2 T 100 2" stroke="var(--rule)" strokeWidth="0.8" fill="none" vectorEffect="non-scaling-stroke" />
          <path
            d="M0 2 Q 8 0 16.6 2 T 33.3 2 T 50 2 T 66.6 2 T 83.3 2 T 100 2"
            stroke="var(--azure)"
            strokeWidth="1.6"
            fill="none"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - collected / 6}
            style={{ transition: "stroke-dashoffset .8s ease" }}
          />
        </svg>
        <ol className="relative grid grid-cols-7 gap-1">
          {EDITIONS.map((e) => (
            <BoardSlot key={e.dayIndex} e={e} state={state} onSelect={onSelect} highlight={highlight === e.dayIndex} />
          ))}
          <li className="flex flex-col items-center">
            <span
              className={clsx(
                "grid h-11 w-11 place-items-center rounded-full font-serif text-sm font-semibold ring-1 ring-inset",
                state.nodo.solved ? "bg-ok text-white ring-ok" : state.today === 6 ? "bg-white text-navy ring-azure animate-[pulseRing_1.6s_ease-out_infinite]" : "bg-paper-2 text-muted ring-rule",
              )}
              title="Il Nodo della domenica"
            >
              {state.nodo.solved ? <Check /> : "?"}
            </span>
            <span className="mt-1.5 text-[0.68rem] font-semibold text-muted">D</span>
          </li>
        </ol>
      </div>
      {!compact && (
        <ul className="mt-4 space-y-1.5">
          {EDITIONS.filter((e) => {
            const s = clueStatus(state, e.dayIndex);
            return s === "puntuale" || s === "recuperato";
          }).map((e) => (
            <li key={e.dayIndex} className="flex items-baseline gap-3 text-sm">
              <span className="w-8 text-xs font-semibold text-muted">{e.dayName.slice(0, 3)}</span>
              <span className="font-serif text-[1.02rem] font-semibold text-navy">{e.clue.word}</span>
              {clueStatus(state, e.dayIndex) === "recuperato" && <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-azure-ink">recuperato</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BoardSlot({ e, state, onSelect, highlight }: { e: Edition; state: FiloState; onSelect?: (d: number) => void; highlight: boolean }) {
  const s = clueStatus(state, e.dayIndex);
  const clickable = !!onSelect && (s === "oggi" || s === "da-recuperare");
  const label = {
    puntuale: `${e.dayName}: indizio ottenuto`,
    recuperato: `${e.dayName}: indizio recuperato`,
    "da-recuperare": `${e.dayName}: indizio da recuperare`,
    oggi: `${e.dayName}: Edizione di oggi`,
    futuro: `${e.dayName}: non ancora uscito`,
  }[s];
  const inner = (
    <span
      className={clsx(
        "grid h-11 w-11 place-items-center rounded-full text-sm font-semibold transition-all",
        s === "puntuale" && "bg-navy text-white",
        s === "recuperato" && "bg-white text-navy ring-2 ring-inset ring-navy",
        s === "da-recuperare" && "border-2 border-dashed border-azure bg-white text-azure-ink",
        s === "oggi" && "bg-azure text-white animate-[pulseRing_1.6s_ease-out_infinite]",
        s === "futuro" && "bg-paper-2 text-muted",
        highlight && "scale-110",
      )}
    >
      {s === "puntuale" || s === "recuperato" ? <Check /> : e.dayIndex + 1}
    </span>
  );
  return (
    <li className="flex flex-col items-center">
      {clickable ? (
        <button onClick={() => onSelect!(e.dayIndex)} aria-label={label} className="rounded-full">
          {inner}
        </button>
      ) : (
        <span aria-label={label} role="img">
          {inner}
        </span>
      )}
      <span className={clsx("mt-1.5 text-[0.68rem] font-semibold", s === "oggi" ? "text-azure-ink" : "text-muted")}>{DAY_SHORT[e.dayIndex]}</span>
    </li>
  );
}

/* ---------------- Player dell'Edizione ---------------- */

const GAME_LABELS = ["Il Quiz", "Prima o Dopo", "L'Anagramma"];

export function EditionPlayer({
  edition,
  state,
  onResult,
  isRecovery = false,
}: {
  edition: Edition;
  state: FiloState;
  onResult: (gameIndex: number, r: GameResult) => void;
  isRecovery?: boolean;
}) {
  const rec = dayRecord(state, edition.dayIndex);
  const current = rec.results.findIndex((r) => r === null);
  if (current === -1) return null;
  const seed = edition.dayIndex * 10 + current;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">
            {isRecovery ? "Recupero · " : ""}Edizione di {edition.dayName.toLowerCase()} {edition.dateLabel}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-navy">
            {current + 1} di 3 · {GAME_LABELS[current]}
          </p>
        </div>
        <div className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={clsx("h-1.5 w-6 rounded-full", i < current ? "bg-navy" : i === current ? "bg-azure" : "bg-paper-2")} />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${edition.dayIndex}-${current}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {current === 0 && <QuizGame game={edition.games[0]} onDone={(r) => onResult(0, r)} />}
            {current === 1 && <OrderGame game={edition.games[1]} seed={seed} onDone={(r) => onResult(1, r)} />}
            {current === 2 && <WordGame game={edition.games[2]} seed={seed} onDone={(r) => onResult(2, r)} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- Rivelazione dell'indizio ---------------- */

export function ClueReveal({ edition, state, recovered = false }: { edition: Edition; state: FiloState; recovered?: boolean }) {
  const rec = dayRecord(state, edition.dayIndex);
  const score = rec.results.filter((r) => r?.correct).length;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="text-center">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-azure-ink">
        {recovered ? "Indizio recuperato" : `Indizio n. ${edition.dayIndex + 1} di 6`}
      </p>
      <motion.p
        initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mt-3 font-serif text-[2rem] font-semibold italic leading-tight text-navy"
      >
        {edition.clue.word}
      </motion.p>
      <p className="mt-2 text-sm text-ink-2">{edition.clue.note}</p>
      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper-2 px-3 py-1 text-xs font-semibold text-ink-2 tabular">
        {score}/3 risposte esatte · l&apos;indizio arriva comunque
      </p>
    </motion.div>
  );
}

/* ---------------- Il Nodo della domenica ---------------- */

export function NodoCard({ state, setState, onAttempt }: { state: FiloState; setState: (s: FiloState) => void; onAttempt?: (ok: boolean, guess: string) => void }) {
  const [guess, setGuess] = useState("");
  const collected = cluesCollected(state);
  const clues = EDITIONS.filter((e) => {
    const s = clueStatus(state, e.dayIndex);
    return s === "puntuale" || s === "recuperato";
  });
  const lastWrong = !state.nodo.solved && state.nodo.guesses.length > 0;

  if (state.nodo.solved) {
    return (
      <div className="text-center">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ok">Nodo sciolto</p>
        <p className="mt-3 font-serif text-[2rem] font-semibold italic text-navy">{NODO.solution}</p>
        <p className="mt-3 text-left text-sm leading-relaxed text-ink-2">{NODO.explain}</p>
        <p className="mt-4 text-xs text-muted">Lunedì comincia un nuovo Filo.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-azure-ink">Domenica · Il Nodo</p>
      <h3 className="mt-2 font-serif text-xl font-semibold text-ink">{NODO.prompt}</h3>
      <p className="mt-1 text-sm text-ink-2">
        Hai {collected} indizi su 6. {collected < 4 ? "Più indizi, più è facile: ma puoi provarci lo stesso." : "Ne hai abbastanza per provarci."}
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {clues.map((e) => (
          <li key={e.dayIndex} className="rounded-full bg-azure-soft px-3 py-1 font-serif text-[0.95rem] font-semibold text-navy">
            {e.clue.word}
          </li>
        ))}
        {Array.from({ length: 6 - clues.length }).map((_, i) => (
          <li key={`m${i}`} className="rounded-full border border-dashed border-rule px-3 py-1 text-sm text-muted">
            ?
          </li>
        ))}
      </ul>
      <form
        className="mt-5 flex gap-2"
        onSubmit={(ev) => {
          ev.preventDefault();
          if (!guess.trim()) return;
          const next = guessNodo(state, guess);
          setState(next);
          onAttempt?.(next.nodo.solved, guess);
          setGuess("");
        }}
      >
        <label htmlFor="nodo-guess" className="sr-only">
          La tua risposta
        </label>
        <input
          id="nodo-guess"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Chi o che cosa?"
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-full bg-card px-4 text-[0.95rem] ring-1 ring-inset ring-rule placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-azure"
        />
        <Button type="submit" aria-label="Prova">
          Prova <Arrow />
        </Button>
      </form>
      {lastWrong && (
        <p className="mt-2 text-sm text-warn" aria-live="polite">
          «{state.nodo.guesses[state.nodo.guesses.length - 1]}» non è il filo. Pensa a Milano.
        </p>
      )}
    </div>
  );
}

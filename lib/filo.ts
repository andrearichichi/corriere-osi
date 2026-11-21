/**
 * Motore di stato de "Il Filo".
 * Regole di prodotto (documentate in docs/STRATEGY.md):
 *  - Ogni giorno (lun–sab) un'Edizione di 3 micro-giochi, circa 3 minuti.
 *  - Completare l'Edizione (non indovinare tutto) sblocca l'indizio del giorno.
 *  - Un indizio perso si può recuperare entro la settimana: si ottiene l'indizio
 *    ma vale meno punti. Principio: "recupera, non perdere" (niente streak che si azzera).
 *  - Domenica il Nodo: con gli indizi raccolti si indovina il filo della settimana.
 */
import { EDITIONS, isNodoCorrect } from "@/data/week";

export type GameResult = { correct: boolean; attempts: number };
export type DayRecord = { results: (GameResult | null)[]; completedOn: number | null };
export type FiloState = {
  today: number; // 0 = lunedì … 6 = domenica
  days: Record<number, DayRecord>;
  nodo: { solved: boolean; guesses: string[]; solvedOn: number | null };
};

export type ClueStatus = "puntuale" | "recuperato" | "da-recuperare" | "oggi" | "futuro";

export const POINTS = { puntuale: 2, recuperato: 1, nodo: 4 } as const;

export function emptyDay(): DayRecord {
  return { results: [null, null, null], completedOn: null };
}

export function initialState(today = 0, played: Record<number, number> = {}): FiloState {
  const days: Record<number, DayRecord> = {};
  for (const [d, on] of Object.entries(played)) {
    days[Number(d)] = {
      results: [
        { correct: true, attempts: 1 },
        { correct: true, attempts: 1 },
        { correct: true, attempts: 1 },
      ],
      completedOn: on,
    };
  }
  return { today, days, nodo: { solved: false, guesses: [], solvedOn: null } };
}

export function dayRecord(s: FiloState, day: number): DayRecord {
  return s.days[day] ?? emptyDay();
}

export function isComplete(s: FiloState, day: number): boolean {
  return dayRecord(s, day).completedOn !== null;
}

export function clueStatus(s: FiloState, day: number): ClueStatus {
  const r = dayRecord(s, day);
  if (r.completedOn !== null) return r.completedOn === day ? "puntuale" : "recuperato";
  if (day === s.today) return "oggi";
  if (day < s.today) return "da-recuperare";
  return "futuro";
}

export function recordResult(s: FiloState, day: number, gameIndex: number, result: GameResult): FiloState {
  if (day > s.today || day > 5) return s;
  const prev = dayRecord(s, day);
  const results = prev.results.slice();
  results[gameIndex] = result;
  const done = results.every(Boolean);
  return {
    ...s,
    days: {
      ...s.days,
      [day]: { results, completedOn: prev.completedOn ?? (done ? s.today : null) },
    },
  };
}

export function cluesCollected(s: FiloState): number {
  return EDITIONS.filter((e) => isComplete(s, e.dayIndex)).length;
}

export function onTimeDays(s: FiloState): number {
  return EDITIONS.filter((e) => clueStatus(s, e.dayIndex) === "puntuale").length;
}

export function weeklyPoints(s: FiloState): number {
  let p = 0;
  for (const e of EDITIONS) {
    const st = clueStatus(s, e.dayIndex);
    if (st === "puntuale") p += POINTS.puntuale;
    if (st === "recuperato") p += POINTS.recuperato;
  }
  if (s.nodo.solved) p += POINTS.nodo;
  return p;
}

export function guessNodo(s: FiloState, guess: string): FiloState {
  if (s.nodo.solved || s.today < 6) return s;
  const ok = isNodoCorrect(guess);
  return {
    ...s,
    nodo: { solved: ok, guesses: [...s.nodo.guesses, guess], solvedOn: ok ? s.today : null },
  };
}

export function advanceDay(s: FiloState, by = 1): FiloState {
  return { ...s, today: Math.min(6, s.today + by) };
}

/** Indizi che l'utente può ancora recuperare oggi (giorni passati non completati). */
export function recoverable(s: FiloState): number[] {
  return EDITIONS.filter((e) => clueStatus(s, e.dayIndex) === "da-recuperare").map((e) => e.dayIndex);
}

/**
 * Messaggio di riattivazione scelto dalle regole di lifecycle (docs/STRATEGY.md §Riattivazione).
 * Basato sul progresso, mai sulla colpa. Restituisce null se non serve contattare l'utente.
 */
export function reactivationMessage(s: FiloState): { title: string; body: string; rule: string } | null {
  const missing = recoverable(s);
  const collected = cluesCollected(s);
  if (s.today === 6 && !s.nodo.solved) {
    return {
      title: "Il Nodo si scioglie oggi",
      body: `Hai ${collected} indizi su 6. Bastano per provarci: chi lega la settimana?`,
      rule: "R3 · domenica, Nodo non ancora risolto",
    };
  }
  if (missing.length > 0 && !isComplete(s, s.today)) {
    const d = missing[missing.length - 1];
    return {
      title: `L'indizio di ${EDITIONS[d].dayName.toLowerCase()} ti aspetta`,
      body: `Oggi ne esce un altro. Li prendi entrambi in circa 5 minuti: sei a ${collected} su 6.`,
      rule: "R2 · giorno saltato, indizio recuperabile, inviato all'orario abituale dell'utente",
    };
  }
  if (!isComplete(s, s.today)) {
    return {
      title: "Il nuovo indizio è uscito",
      body: `Tre minuti per l'Edizione di oggi. Sei a ${collected} su 6.`,
      rule: "R1 · promemoria all'orario abituale, solo se opt-in",
    };
  }
  return null;
}

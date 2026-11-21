import { describe, expect, it } from "vitest";
import { advanceDay, clueStatus, cluesCollected, guessNodo, initialState, reactivationMessage, recordResult, recoverable, weeklyPoints } from "@/lib/filo";
import { isNodoCorrect, scramble, shuffledOrder, EDITIONS } from "@/data/week";

const ok = { correct: true, attempts: 1 };
const play = (s: ReturnType<typeof initialState>, day: number) => [0, 1, 2].reduce((acc, g) => recordResult(acc, day, g, ok), s);

describe("motore del Filo", () => {
  it("l'indizio arriva completando, non indovinando", () => {
    let s = initialState(0);
    s = recordResult(s, 0, 0, { correct: false, attempts: 1 });
    s = recordResult(s, 0, 1, { correct: false, attempts: 2 });
    expect(clueStatus(s, 0)).toBe("oggi");
    s = recordResult(s, 0, 2, { correct: false, attempts: 2 });
    expect(clueStatus(s, 0)).toBe("puntuale");
  });

  it("un giorno perso si recupera, con meno punti", () => {
    let s = initialState(2);
    expect(recoverable(s)).toEqual([0, 1]);
    s = play(s, 0);
    expect(clueStatus(s, 0)).toBe("recuperato");
    s = play(s, 2);
    expect(weeklyPoints(s)).toBe(1 + 2);
    expect(cluesCollected(s)).toBe(2);
  });

  it("non si gioca il futuro", () => {
    const s = recordResult(initialState(1), 3, 0, ok);
    expect(s.days[3]).toBeUndefined();
  });

  it("il Nodo si tenta solo di domenica e accetta varianti", () => {
    expect(guessNodo(initialState(5), "Sant'Ambrogio").nodo.solved).toBe(false);
    const s = guessNodo(advanceDay(initialState(5)), "sant ambrogio");
    expect(s.nodo.solved).toBe(true);
    expect(isNodoCorrect("Sant’Ambrogio")).toBe(true);
    expect(isNodoCorrect("Milano")).toBe(false);
  });

  it("la riattivazione parla del progresso", () => {
    const s = play(initialState(4, { 2: 2 }), 2);
    const m = reactivationMessage(s);
    expect(m?.title).toMatch(/giovedì/);
    expect(reactivationMessage(play(s, 4))).toBeNull();
  });

  it("anagrammi e ordini non partono mai già risolti", () => {
    for (const e of EDITIONS) {
      for (let seed = 0; seed < 30; seed++) {
        expect(scramble(e.games[2].answer, seed).join("")).not.toBe(e.games[2].answer);
        expect(shuffledOrder(4, seed).every((v, i) => v === i)).toBe(false);
      }
      const years = e.games[1].events.map((x) => x.year);
      expect([...years].sort((a, b) => a - b)).toEqual(years);
    }
  });
});

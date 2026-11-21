"use client";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { scramble, type WordGame as WordGameT } from "@/data/week";
import type { GameResult } from "@/lib/filo";
import { Arrow, Button } from "../ui";

/** L'Anagramma: tocca le lettere (o digita) per ricomporre la parola. */
export function WordGame({ game, seed, onDone }: { game: WordGameT; seed: number; onDone: (r: GameResult) => void }) {
  const tiles = useMemo(() => scramble(game.answer, seed), [game, seed]);
  const [picked, setPicked] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<"playing" | "wrong" | "right" | "revealed">("playing");

  const word = picked.map((i) => tiles[i]).join("");
  const done = status === "right" || status === "revealed";

  useEffect(() => {
    if (picked.length !== tiles.length || done) return;
    const t = setTimeout(() => {
      setAttempts((a) => a + 1);
      setStatus(word === game.answer ? "right" : "wrong");
    }, 180);
    return () => clearTimeout(t);
  }, [picked, tiles.length, word, game.answer, done]);

  const pick = (i: number) => {
    if (done || picked.includes(i) || picked.length >= tiles.length) return;
    if (status === "wrong") setStatus("playing");
    setPicked((p) => [...p, i]);
  };
  const undo = () => {
    if (done) return;
    setStatus("playing");
    setPicked((p) => p.slice(0, -1));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Backspace") return undo();
      const k = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(k)) return;
      const idx = tiles.findIndex((l, i) => l === k && !picked.includes(i));
      if (idx >= 0) pick(idx);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const slots = status === "revealed" ? game.answer.split("") : tiles.map((_, i) => (picked[i] !== undefined ? tiles[picked[i]] : ""));

  return (
    <div>
      <p className="text-xs font-medium text-muted">L&apos;Anagramma</p>
      <h3 className="mt-2 font-serif text-xl font-semibold text-ink">{game.prompt}</h3>
      <p className="mt-1 text-sm text-ink-2">{game.hint}</p>

      <div
        className={clsx("mt-5 flex flex-wrap justify-center gap-1.5", status === "wrong" && "animate-[shake_.35s_ease-in-out]")}
        aria-label={`Parola composta: ${word || "vuota"}`}
        aria-live="polite"
      >
        {slots.map((l, i) => (
          <span
            key={i}
            className={clsx(
              "grid h-11 w-9 place-items-center rounded-lg border-b-2 font-serif text-xl font-semibold transition-colors",
              status === "right" && "border-ok bg-ok-soft text-ok",
              status === "revealed" && "border-navy/40 bg-azure-soft text-navy",
              status === "wrong" && "border-warn bg-warn-soft text-warn",
              status === "playing" && (l ? "border-navy bg-card text-ink" : "border-rule bg-paper-2/60"),
            )}
          >
            {l}
          </span>
        ))}
      </div>

      {!done && (
        <div className="mt-5 flex flex-wrap justify-center gap-1.5">
          {tiles.map((l, i) => (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={picked.includes(i)}
              aria-label={`Lettera ${l}`}
              className="grid h-11 w-10 place-items-center rounded-lg bg-navy font-serif text-lg font-semibold text-white transition-all hover:bg-navy-2 active:scale-95 disabled:bg-paper-2 disabled:text-transparent"
            >
              {l}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5" aria-live="polite">
        {status === "wrong" && <p className="mb-3 text-center text-sm text-warn">Non è questa. Cancella e riprova.</p>}
        {!done && (
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={undo} disabled={picked.length === 0}>
              Cancella
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setPicked([])} disabled={picked.length === 0}>
              Ricomincia
            </Button>
            {attempts >= 2 && (
              <Button variant="ghost" className="flex-1" onClick={() => setStatus("revealed")}>
                Rivela
              </Button>
            )}
          </div>
        )}
        {done && (
          <>
            <p className={clsx("mb-3 text-center text-sm font-semibold", status === "right" ? "text-ok" : "text-navy")}>
              {status === "right" ? "Trovata." : `Era ${game.answer}.`}
            </p>
            <Button className="w-full" onClick={() => onDone({ correct: status === "right", attempts: Math.max(1, attempts) })}>
              Completa l&apos;Edizione <Arrow />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

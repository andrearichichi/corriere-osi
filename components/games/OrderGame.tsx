"use client";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { shuffledOrder, type OrderGame as OrderGameT } from "@/data/week";
import type { GameResult } from "@/lib/filo";
import { Arrow, Button } from "../ui";

const MAX_ATTEMPTS = 2;

/** Versione breve (4 eventi) del formato esistente «Prima o Dopo». Riordino con frecce: accessibile anche da tastiera. */
export function OrderGame({ game, seed, onDone }: { game: OrderGameT; seed: number; onDone: (r: GameResult) => void }) {
  const initial = useMemo(() => shuffledOrder(game.events.length, seed), [game, seed]);
  const [order, setOrder] = useState<number[]>(initial);
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);

  const allRight = order.every((v, i) => v === i);
  const finished = checked && (allRight || attempts >= MAX_ATTEMPTS);

  const move = (pos: number, dir: -1 | 1) => {
    const to = pos + dir;
    if (to < 0 || to >= order.length || finished) return;
    const next = order.slice();
    [next[pos], next[to]] = [next[to], next[pos]];
    setOrder(next);
    setChecked(false);
  };

  const verify = () => {
    setAttempts((a) => a + 1);
    setChecked(true);
  };

  const reveal = finished && !allRight;
  const shown = reveal ? game.events.map((_, i) => i) : order;

  return (
    <div>
      <p className="text-xs font-medium text-muted">Prima o Dopo · versione breve</p>
      <h3 className="mt-2 font-serif text-xl font-semibold text-ink">{game.prompt}</h3>
      <ol className="mt-4 space-y-2">
        {shown.map((evIdx, pos) => {
          const ev = game.events[evIdx];
          const right = evIdx === pos;
          return (
            <li
              key={ev.label}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-inset transition-colors",
                checked && right && "bg-ok-soft ring-ok/40",
                checked && !right && !reveal && "bg-warn-soft ring-warn/30",
                (!checked || reveal) && "bg-card ring-rule",
              )}
            >
              <span className="w-5 text-center text-sm font-semibold text-muted tabular">{pos + 1}</span>
              <span className="flex-1 text-[0.92rem] leading-snug text-ink">
                {ev.label}
                {(finished || (checked && right)) && (
                  <span className="ml-2 font-semibold text-navy tabular">{ev.year}</span>
                )}
              </span>
              {!finished && (
                <span className="flex flex-col">
                  <button
                    aria-label={`Sposta «${ev.label}» in su`}
                    onClick={() => move(pos, -1)}
                    disabled={pos === 0}
                    className="grid h-7 w-8 place-items-center rounded-md text-navy hover:bg-navy/5 disabled:text-rule"
                  >
                    <Arrow dir="up" className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label={`Sposta «${ev.label}» in giù`}
                    onClick={() => move(pos, 1)}
                    disabled={pos === order.length - 1}
                    className="grid h-7 w-8 place-items-center rounded-md text-navy hover:bg-navy/5 disabled:text-rule"
                  >
                    <Arrow dir="down" className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-4" aria-live="polite">
        {!finished && (
          <>
            {checked && !allRight && (
              <p className="mb-3 text-sm text-warn">
                Quasi. Gli eventi in verde sono al posto giusto: hai ancora {MAX_ATTEMPTS - attempts} tentativo.
              </p>
            )}
            <Button className="w-full" onClick={verify} disabled={checked}>
              Verifica l&apos;ordine
            </Button>
          </>
        )}
        {finished && (
          <>
            <p className={clsx("mb-3 text-sm font-semibold", allRight ? "text-ok" : "text-warn")}>
              {allRight ? (attempts === 1 ? "Perfetto al primo colpo." : "Giusto.") : "Ecco l'ordine corretto."}
            </p>
            <Button className="w-full" onClick={() => onDone({ correct: allRight, attempts })}>
              Avanti <Arrow />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

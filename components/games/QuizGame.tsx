"use client";
import clsx from "clsx";
import { useState } from "react";
import type { QuestionGame } from "@/data/week";
import type { GameResult } from "@/lib/filo";
import { Arrow, Button, Check } from "../ui";

export function QuizGame({
  game,
  onDone,
  compact = false,
  ctaLabel = "Avanti",
}: {
  game: QuestionGame;
  onDone: (r: GameResult) => void;
  compact?: boolean;
  ctaLabel?: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked === game.answer;

  return (
    <div>
      <p className="text-xs font-medium text-muted">{game.source}</p>
      <h3 className={clsx("mt-2 font-serif font-semibold leading-snug text-ink", compact ? "text-lg" : "text-xl")}>
        {game.prompt}
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Opzioni di risposta">
        {game.options.map((opt, i) => {
          const isAnswer = i === game.answer;
          const isPicked = i === picked;
          return (
            <button
              key={opt}
              disabled={answered}
              onClick={() => setPicked(i)}
              className={clsx(
                "flex h-12 items-center justify-between rounded-xl px-4 text-left text-[0.95rem] font-semibold tabular transition-all",
                !answered && "bg-card text-ink ring-1 ring-inset ring-rule hover:ring-navy/50 active:scale-[0.98]",
                answered && isAnswer && "bg-ok text-white",
                answered && isPicked && !isAnswer && "bg-warn-soft text-warn ring-1 ring-inset ring-warn/40",
                answered && !isPicked && !isAnswer && "bg-card text-muted ring-1 ring-inset ring-rule",
              )}
            >
              {opt}
              {answered && isAnswer && <Check />}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-4 animate-[fadeIn_.25s_ease-out]" aria-live="polite">
          <p className={clsx("text-sm font-semibold", correct ? "text-ok" : "text-warn")}>
            {correct ? "Esatto." : "Non questa volta."}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">{game.explain}</p>
          <Button className="mt-4 w-full" onClick={() => onDone({ correct, attempts: 1 })}>
            {ctaLabel} <Arrow />
          </Button>
        </div>
      )}
    </div>
  );
}

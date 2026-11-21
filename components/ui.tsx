import clsx from "clsx";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-2 disabled:bg-ink-2/40",
  secondary: "bg-card text-navy ring-1 ring-inset ring-rule hover:ring-navy/40 disabled:text-muted",
  ghost: "text-navy hover:bg-navy/5 disabled:text-muted",
  light: "bg-white text-navy hover:bg-azure-soft",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:cursor-not-allowed select-none";
const sizes = { sm: "h-9 px-4 text-sm", md: "h-11 px-5 text-[0.95rem]", lg: "h-12 px-6 text-base" };

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <Link className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}

/** Etichetta obbligatoria per ogni numero non reale. */
export function SimTag({ children = "Simulato" }: { children?: ReactNode }) {
  return <span className="tag-sim">{children}</span>;
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx("kicker", className)}>{children}</p>;
}

export function Arrow({ className, dir = "right" }: { className?: string; dir?: "right" | "left" | "up" | "down" }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={clsx("h-4 w-4", className)}
      style={{ transform: `rotate(${rot}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function Check({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={clsx("h-4 w-4", className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

/** Il segno grafico del Filo: un filo che attraversa sei nodi. */
export function FiloMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 16" className={clsx("h-4 w-10", className)} fill="none">
      <path d="M1 8c4-6 6 6 10 0s6 6 10 0 6 6 10 0 6 6 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="39" cy="8" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={clsx("inline-flex items-baseline gap-2", light ? "text-white" : "text-navy")}>
      <span className="font-serif text-[1.35rem] font-semibold italic tracking-tight">Il Filo</span>
      <span className={clsx("text-[0.7rem] font-semibold uppercase tracking-[0.18em]", light ? "text-white/70" : "text-muted")}>
        Corriere Giochi · concept
      </span>
    </span>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={clsx("text-xs leading-relaxed text-muted", className)}>
      Proposta indipendente per il case study «Più giocatori, ogni giorno» (novembre 2026). Non è un prodotto ufficiale né
      usa dati interni di Corriere della Sera o RCS: contenuti dimostrativi originali, numeri etichettati come simulati o
      ipotesi.
    </p>
  );
}

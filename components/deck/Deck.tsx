"use client";
import clsx from "clsx";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES, type SlideDef } from "./Slides";
import { Arrow, FiloMark } from "../ui";

const W = 1280;
const H = 720;

function SlideCanvas({ s, i, fixed }: { s: SlideDef; i: number; fixed: boolean }) {
  const total = SLIDES.length;
  if (s.dark) {
    const cover = s.id === "cover";
    return (
      <div className={clsx("relative flex flex-col justify-center overflow-hidden bg-navy px-6 py-16 text-white md:px-[96px]", fixed ? "h-[720px] w-[1280px]" : "min-h-[70vh]")}>
        <svg aria-hidden viewBox="0 0 1280 200" className="pointer-events-none absolute inset-x-0 bottom-[80px] w-full opacity-30" fill="none">
          <path d="M0 120 C 120 40, 200 200, 320 110 S 520 30, 640 110 S 860 190, 960 100 S 1160 40, 1280 110" stroke="#2a9fd8" strokeWidth="2" />
          {[160, 320, 480, 640, 800, 960, 1120].map((x) => (
            <circle key={x} cx={x} cy={110 + Math.sin(x / 90) * 18} r="5" fill="#2a9fd8" />
          ))}
        </svg>
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/60">{cover ? "Corriere Giochi · Case study · Novembre 2026" : "Visione"}</p>
        {cover ? (
          <>
            <h1 className="mt-6 font-serif text-[64px] font-semibold italic leading-none md:text-[120px]">Il Filo</h1>
            <p className="mt-6 max-w-[860px] font-serif text-[24px] leading-snug text-white/90 md:text-[34px]">
              Ogni giorno un indizio, ogni domenica la storia della settimana. Un appuntamento quotidiano che solo il Corriere può offrire.
            </p>
            <p className="mt-10 max-w-[760px] text-[14px] leading-relaxed text-white/70 md:text-[16px]">
              Risposta ai due case «Più giocatori, ogni giorno»: retention degli occasionali e acquisizione dal mondo Corriere, in un unico sistema.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-6 max-w-[1000px] font-serif text-[36px] font-semibold leading-[1.1] md:text-[60px]">{s.title}</h2>
            <p className="mt-8 max-w-[760px] text-[15px] leading-relaxed text-white/75 md:text-[18px]">
              Leggere, giocare, tornare, invitare: un solo gesto quotidiano che fa crescere i giocatori abituali e porta nuovi lettori nel Corriere.
            </p>
          </>
        )}
        <p className="absolute bottom-6 left-6 text-[11px] text-white/50 md:left-[96px]">Proposta indipendente · contenuti dimostrativi · numeri illustrativi</p>
        <p className="absolute bottom-6 right-6 text-[11px] tabular text-white/50 md:right-[96px]">
          {i + 1} / {total}
        </p>
      </div>
    );
  }
  return (
    <div className={clsx("relative flex flex-col bg-paper px-5 py-10 md:px-[72px] md:pb-[56px] md:pt-[52px]", fixed ? "h-[720px] w-[1280px] overflow-hidden" : "")}>
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-azure-ink">
        <span className="tabular text-muted">{String(i).padStart(2, "0")}</span> {s.section}
      </p>
      <h2 className="mt-3 max-w-[1080px] font-serif text-[25px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink md:text-[33px]">{s.title}</h2>
      <div className="mt-6 md:mt-7 md:flex-1">{s.body}</div>
      <div className="mt-8 flex items-center justify-between border-t border-rule pt-3 text-[11px] text-muted md:absolute md:inset-x-[72px] md:bottom-5 md:mt-0">
        <span className="flex items-center gap-2">
          <FiloMark className="text-azure" /> Il Filo · Corriere Giochi
        </span>
        <span className="tabular">
          {i + 1} / {total}
        </span>
      </div>
    </div>
  );
}

export function Deck() {
  const [idx, setIdx] = useState(0);
  const [notes, setNotes] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const fromHash = Number(window.location.hash.replace("#", ""));
    if (fromHash >= 1 && fromHash <= SLIDES.length) setIdx(fromHash - 1);
  }, []);

  const go = useCallback((n: number) => {
    const next = Math.max(0, Math.min(SLIDES.length - 1, n));
    setIdx(next);
    try {
      window.history.replaceState(null, "", `#${next + 1}`);
    } catch {
      /* ignora */
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(idx + 1);
      }
      if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(idx - 1);
      }
      if (e.key === "Home") go(0);
      if (e.key === "End") go(SLIDES.length - 1);
      if (e.key.toLowerCase() === "n") setNotes((v) => !v);
      if (e.key.toLowerCase() === "f") document.documentElement.requestFullscreen?.().catch(() => undefined);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, go]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setScale(Math.min(width / W, height / H));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [notes]);

  const s = SLIDES[idx];

  return (
    <>
      {/* Desktop: presentazione */}
      <div className="hidden h-dvh flex-col bg-[#e9e4da] md:flex print:hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 px-5">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
            <Arrow dir="left" /> Il Filo
          </Link>
          <p className="truncate text-sm text-ink-2">
            <span className="tabular font-semibold text-ink">
              {idx + 1} / {SLIDES.length}
            </span>
            {s.section && <span className="ml-3 text-muted">{s.section}</span>}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setNotes((v) => !v)} aria-pressed={notes} className={clsx("h-9 rounded-full px-4 text-sm font-semibold", notes ? "bg-navy text-white" : "bg-white text-navy")}>
              Note (N)
            </button>
            <button onClick={() => document.documentElement.requestFullscreen?.().catch(() => undefined)} className="h-9 rounded-full bg-white px-4 text-sm font-semibold text-navy">
              Schermo intero (F)
            </button>
            <button onClick={() => window.print()} className="h-9 rounded-full bg-white px-4 text-sm font-semibold text-navy">
              Esporta PDF
            </button>
          </div>
        </header>
        <div ref={stageRef} className="relative min-h-0 flex-1">
          <div className="absolute left-1/2 top-1/2" style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}>
            <div className="h-full w-full overflow-hidden rounded-[6px] shadow-[0_20px_50px_-25px_rgba(19,41,75,0.45)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <SlideCanvas s={s} i={idx} fixed />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        {notes && (
          <aside className="max-h-[22vh] shrink-0 overflow-y-auto border-t border-rule bg-white px-8 py-4" aria-label="Note per il relatore">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Note per il relatore</p>
            <p className="mt-1 max-w-4xl text-[15px] leading-relaxed text-ink">{s.notes}</p>
          </aside>
        )}
        <footer className="flex h-14 shrink-0 items-center gap-4 px-5">
          <button onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Slide precedente" className="grid h-9 w-9 place-items-center rounded-full bg-white text-navy disabled:opacity-40">
            <Arrow dir="left" />
          </button>
          <div className="flex flex-1 gap-1">
            {SLIDES.map((sl, i) => (
              <button key={sl.id} onClick={() => go(i)} aria-label={`Vai alla slide ${i + 1}`} className="group flex-1 py-2">
                <span className={clsx("block h-1 rounded-full transition-colors", i <= idx ? "bg-navy" : "bg-white group-hover:bg-navy/30")} />
              </button>
            ))}
          </div>
          <button onClick={() => go(idx + 1)} disabled={idx === SLIDES.length - 1} aria-label="Slide successiva" className="grid h-9 w-9 place-items-center rounded-full bg-navy text-white disabled:opacity-40">
            <Arrow />
          </button>
        </footer>
      </div>

      {/* Mobile: lettura verticale */}
      <div className="md:hidden print:hidden">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-rule bg-paper/95 px-4 backdrop-blur">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
            <Arrow dir="left" /> Il Filo
          </Link>
          <span className="text-xs text-muted">Presentazione · {SLIDES.length} sezioni</span>
        </header>
        {SLIDES.map((sl, i) => (
          <section key={sl.id} className="border-b border-rule">
            <SlideCanvas s={sl} i={i} fixed={false} />
            <details className="bg-white px-5 py-3">
              <summary className="cursor-pointer text-xs font-semibold text-muted">Note per il relatore</summary>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{sl.notes}</p>
            </details>
          </section>
        ))}
      </div>

      {/* Stampa: una slide per pagina */}
      <div className="hidden print:block">
        {SLIDES.map((sl, i) => (
          <div key={sl.id} className="print-slide">
            <SlideCanvas s={sl} i={i} fixed />
          </div>
        ))}
      </div>
    </>
  );
}

import clsx from "clsx";

/** Il sistema in una figura: tre ingressi, un appuntamento quotidiano, un arco settimanale, un'uscita che riporta nuovi giocatori. */
const NODES = [
  { k: "in", title: "Ingressi", items: ["«Gioca la notizia» negli articoli", "Card nell'app News", "Invito di un amico"], tone: "light" },
  { k: "daily", title: "Ogni giorno", items: ["L'Edizione: 3 giochi, 3 minuti", "Completarla dà un indizio", "Un giorno perso si recupera"], tone: "navy" },
  { k: "weekly", title: "Ogni settimana", items: ["Sei indizi, un Filo", "Domenica: il Nodo", "Lunedì riparte"], tone: "azure" },
  { k: "out", title: "Ritorno e passaparola", items: ["Promemoria all'ora abituale", "Sfida settimanale tra amici", "Invito che si gioca subito"], tone: "light" },
] as const;

export function SystemLoop({ dense = false }: { dense?: boolean }) {
  return (
    <div className="relative">
      <ol className="grid gap-3 md:grid-cols-4">
        {NODES.map((n, i) => (
          <li
            key={n.k}
            className={clsx(
              "relative rounded-2xl p-5",
              n.tone === "navy" && "bg-navy text-white",
              n.tone === "azure" && "bg-azure-soft text-navy",
              n.tone === "light" && "bg-card text-ink ring-1 ring-rule",
            )}
          >
            <p className={clsx("text-[0.68rem] font-semibold uppercase tracking-[0.16em]", n.tone === "navy" ? "text-white/70" : "text-muted")}>
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className={clsx("mt-1 font-serif font-semibold", dense ? "text-lg" : "text-xl")}>{n.title}</p>
            <ul className={clsx("mt-3 space-y-1.5", dense ? "text-[0.82rem]" : "text-sm")}>
              {n.items.map((it) => (
                <li key={it} className={n.tone === "navy" ? "text-white/85" : "text-ink-2"}>
                  {it}
                </li>
              ))}
            </ul>
            {i < NODES.length - 1 && (
              <span aria-hidden className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-paper text-navy ring-1 ring-rule md:grid">
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className={clsx("mt-3 flex items-center gap-2 text-muted", dense ? "text-xs" : "text-sm")}>
        <svg viewBox="0 0 24 12" className="h-3 w-6 text-azure" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M22 6H4M8 2 4 6l4 4" />
        </svg>
        Chi invita porta nuovi lettori nel punto 01: il ciclo si chiude.
      </p>
    </div>
  );
}

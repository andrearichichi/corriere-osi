import Link from "next/link";
import { Arrow, Kicker } from "@/components/ui";

const ITEMS = [
  {
    href: "/prototype/retention",
    tag: "Esperienza A · Retention",
    title: "Da 1,4 giorni a settimana a un appuntamento",
    steps: ["Situazione iniziale", "Intervento", "Edizione giocabile", "Meccanismo di ritorno", "Riattivazione", "Giorno dopo e Nodo"],
  },
  {
    href: "/prototype/acquisition",
    tag: "Esperienza B · Acquisizione",
    title: "Dalla notizia al primo indizio, in tre minuti",
    steps: ["Articolo", "Touchpoint nel testo", "Ingresso da ospite", "Microgioco completo", "Post-gioco", "Ritorno di martedì"],
  },
  {
    href: "/prototype/referral",
    tag: "Esperienza C · Referral",
    title: "Un invito che si gioca subito",
    steps: ["Entry point", "Invito e condivisione", "Landing", "Prima esperienza", "Misurazione"],
  },
];

export default function PrototypeIndex() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-12 sm:px-6">
      <Kicker>Prototipo interattivo</Kicker>
      <h1 className="display mt-3 max-w-3xl text-[2.2rem] text-ink sm:text-[3rem]">Tre persone, la stessa settimana del Filo</h1>
      <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-2">
        Le tre esperienze usano la stessa settimana dimostrativa (30 novembre – 6 dicembre 2026), lo stesso motore di gioco e la stessa tassonomia di eventi.
        Ogni interazione è reale e lo stato si salva in questo browser. Ogni esperienza ha il suo pulsante per ricominciare.
      </p>
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {ITEMS.map((it, i) => (
          <li key={it.href}>
            <Link href={it.href} className={`group flex h-full flex-col rounded-2xl p-6 ${i === 0 ? "bg-navy text-white" : "bg-card ring-1 ring-rule"}`}>
              <p className={`text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${i === 0 ? "text-white/70" : "text-azure-ink"}`}>{it.tag}</p>
              <p className="mt-3 font-serif text-[1.5rem] font-semibold leading-snug">{it.title}</p>
              <ol className={`mt-5 space-y-1 text-sm ${i === 0 ? "text-white/80" : "text-ink-2"}`}>
                {it.steps.map((s, j) => (
                  <li key={s}>
                    <span className="tabular opacity-60">{j + 1}.</span> {s}
                  </li>
                ))}
              </ol>
              <span className={`mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold ${i === 0 ? "text-azure" : "text-navy"}`}>
                Inizia <Arrow />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-12 grid gap-6 border-t border-rule pt-8 text-sm leading-relaxed text-ink-2 md:grid-cols-3">
        <p>
          <strong className="text-ink">Cosa è nuovo:</strong> l&apos;Edizione, il Filo e il Nodo, gli indizi recuperabili, «Gioca la notizia» negli articoli,
          la landing d&apos;invito senza registrazione e il lifecycle basato sul progresso.
        </p>
        <p>
          <strong className="text-ink">Cosa esiste già e riusiamo:</strong> Quiz, Prima o Dopo, Sfide tra amici, streak, statistiche e classifiche. Le
          fonti sono in docs/PRODUCT_AUDIT.md.
        </p>
        <p>
          <strong className="text-ink">Cosa è simulato:</strong> persone, punteggi degli amici, account e notifiche. I contenuti di gioco sono originali e
          usano fatti storici stabili.
        </p>
      </div>
    </div>
  );
}

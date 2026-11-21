import Link from "next/link";
import { SystemLoop } from "@/components/SystemLoop";
import { Arrow, ButtonLink, Kicker } from "@/components/ui";

const EXPERIENCES = [
  { href: "/prototype/retention", tag: "A · Retention", title: "Da 1,4 giorni a settimana a un appuntamento", who: "Giulia, giocatrice occasionale" },
  { href: "/prototype/acquisition", tag: "B · Acquisizione", title: "Dalla notizia al primo indizio, in tre minuti", who: "Stefano, lettore che non ha mai giocato" },
  { href: "/prototype/referral", tag: "C · Referral", title: "Un invito che si gioca subito", who: "Paolo invita Chiara" },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-[1240px] px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <Kicker>Corriere Giochi · Case study · Novembre 2026</Kicker>
        <h1 className="display mt-5 max-w-4xl text-[2.6rem] text-ink sm:text-[4.2rem]">
          Il Filo. <span className="italic text-navy">Ogni giorno un indizio,</span> ogni domenica la storia della settimana.
        </h1>
        <p className="mt-6 max-w-2xl text-[1.1rem] leading-relaxed text-ink-2">
          Una proposta per aumentare i giocatori quotidiani del Corriere. Chi gioca poco non è disinteressato: gli manca un motivo per tornare domani. Il
          Filo glielo dà, e porta i lettori dal giornale al gioco senza farli uscire dall&apos;articolo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/strategy" size="lg">
            Apri la presentazione <Arrow />
          </ButtonLink>
          <ButtonLink href="/prototype/retention" size="lg" variant="secondary">
            Prova il prototipo
          </ButtonLink>
        </div>
      </section>

      <section className="border-y border-rule bg-card">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              k: "Perché funziona",
              t: "Trasforma una partita isolata in un arco di sei giorni che si può sempre recuperare, costruito sul vantaggio che solo il Corriere ha: il giornale del giorno.",
            },
            {
              k: "Come lo dimostriamo",
              t: "Cinque esperimenti randomizzati, con metriche e guardrail fissati prima, e un holdout di sei mesi per separare la correlazione abitudine–abbonamento dalla causalità.",
            },
            {
              k: "Cosa costruiamo per primo",
              t: "Sei settimane di validazione a basso costo: affidabilità dei progressi, modulo negli articoli su un campione e un Filo pilota via email. Solo dopo, il prodotto.",
            },
          ].map((x) => (
            <div key={x.k}>
              <p className="kicker">{x.k}</p>
              <p className="mt-3 font-serif text-[1.25rem] leading-snug text-ink">{x.t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Il sistema</Kicker>
            <h2 className="display mt-3 text-[2rem] text-ink sm:text-[2.4rem]">Retention e acquisizione sono lo stesso ciclo</h2>
          </div>
        </div>
        <div className="mt-8">
          <SystemLoop />
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-20 sm:px-6">
        <Kicker>Il prototipo</Kicker>
        <h2 className="display mt-3 text-[2rem] text-ink sm:text-[2.4rem]">Tre esperienze, una logica di prodotto</h2>
        <ul className="mt-8 divide-y divide-rule border-y border-rule">
          {EXPERIENCES.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className="group grid items-center gap-2 py-6 sm:grid-cols-[180px_1fr_auto] sm:gap-8">
                <span className="kicker text-azure-ink">{e.tag}</span>
                <span>
                  <span className="block font-serif text-[1.45rem] font-semibold text-ink group-hover:text-navy">{e.title}</span>
                  <span className="mt-1 block text-sm text-muted">{e.who}</span>
                </span>
                <span className="hidden h-11 w-11 place-items-center rounded-full text-navy ring-1 ring-rule transition-colors group-hover:bg-navy group-hover:text-white sm:grid">
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Link href="/growth-lab" className="group rounded-2xl bg-navy p-7 text-white">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/70">Growth Lab</p>
            <p className="mt-3 font-serif text-[1.6rem] font-semibold leading-snug">Ogni numero ha un&apos;origine. Cambia le ipotesi e guarda cosa decide il risultato.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-azure">
              Apri il laboratorio <Arrow />
            </span>
          </Link>
          <Link href="/roadmap" className="group rounded-2xl bg-card p-7 ring-1 ring-rule">
            <p className="kicker">Roadmap</p>
            <p className="mt-3 font-serif text-[1.6rem] font-semibold leading-snug text-ink">Validate, Pilot, Scale: cosa serve, chi serve e quando fermarsi.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy">
              Vedi il piano <Arrow />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { ImpactEffortMatrix, PhaseCards } from "@/components/RoadmapViews";
import { Kicker } from "@/components/ui";

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <Kicker>Roadmap di esecuzione</Kicker>
      <h1 className="display mt-3 max-w-4xl text-[2.2rem] text-ink sm:text-[3rem]">Prima si dimostra, poi si costruisce, poi si estende ciò che funziona</h1>
      <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-ink-2">
        Tre fasi con criteri di uscita espliciti. Ogni fase può fermarsi: è il modo per spendere poco finché le ipotesi decisive (conversione dal giornale,
        nascita dell&apos;abitudine, legame causale con l&apos;abbonamento) non sono dimostrate.
      </p>
      <div className="mt-10">
        <PhaseCards />
      </div>
      <section className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Kicker>Matrice impatto / sforzo</Kicker>
          <h2 className="display mt-3 text-[1.9rem] text-ink">Le prime mosse costano poco e decidono tutto il resto</h2>
          <div className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-rule">
            <ImpactEffortMatrix />
          </div>
        </div>
        <div className="space-y-6 text-[0.95rem] leading-relaxed text-ink-2">
          <div>
            <p className="kicker">Dipendenza critica</p>
            <p className="mt-2">
              Corriere Giochi usa una piattaforma di gioco esterna (fonte: codice pubblico, vedi docs/PRODUCT_AUDIT.md). Edizione, Filo e tassonomia degli
              eventi richiedono un accordo con il fornitore. Va avviato nella prima settimana della fase Validate.
            </p>
          </div>
          <div>
            <p className="kicker">Prerequisito</p>
            <p className="mt-2">
              La perdita di progressi e i problemi di login sono il primo tema delle recensioni negative. Un prodotto che promette «torna domani» non può
              perdere ciò che hai fatto ieri: l&apos;affidabilità viene prima di qualsiasi leva di retention.
            </p>
          </div>
          <div>
            <p className="kicker">Capacità redazionale</p>
            <p className="mt-2">
              L&apos;Edizione richiede circa 1–2 ore al giorno: una domanda dal giornale, un Prima o Dopo da 4 eventi, un anagramma e un indizio. Il
              Filo si pianifica una settimana prima. Nel pilot la soglia di sostenibilità è di 3 ore al giorno.
            </p>
          </div>
          <div>
            <p className="kicker">Cosa non facciamo</p>
            <p className="mt-2">
              Niente nuovi giochi «grandi», niente seconda streak, niente classifiche pubbliche aggiuntive, niente premi economici. Il catalogo e le
              funzioni esistenti restano: il Filo è la porta d&apos;ingresso quotidiana.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

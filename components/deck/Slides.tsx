import clsx from "clsx";
import type { ReactNode } from "react";
import { EXPERIMENTS } from "@/data/experiments";
import { PHASES } from "@/data/roadmap";
import { compute, SCENARIOS, sensitivity, BASE } from "@/lib/model";
import { fmtCompact, fmtEur } from "@/lib/format";
import { SystemLoop } from "../SystemLoop";
import { ImpactEffortMatrix } from "../RoadmapViews";
import { FiloMark } from "../ui";

export type SlideDef = { id: string; section: string; title: string; body: ReactNode; notes: string; dark?: boolean };

/* ---------- primitive ---------- */

function Cols({ children, cols = 3, className }: { children: ReactNode; cols?: 2 | 3 | 4; className?: string }) {
  return (
    <div className={clsx("grid gap-5 md:gap-8", cols === 2 && "md:grid-cols-2", cols === 3 && "md:grid-cols-3", cols === 4 && "md:grid-cols-4", className)}>{children}</div>
  );
}

function Block({ k, title, children, tone = "plain" }: { k?: string; title?: string; children: ReactNode; tone?: "plain" | "navy" | "azure" | "card" }) {
  return (
    <div
      className={clsx(
        tone !== "plain" && "rounded-xl",
        tone === "navy" && "bg-navy p-5 text-white md:p-6",
        tone === "azure" && "bg-azure-soft p-5 md:p-6",
        tone === "card" && "bg-card p-5 ring-1 ring-rule md:p-6",
        tone === "plain" && "border-t-2 border-navy pt-4",
      )}
    >
      {k && <p className={clsx("text-[11px] font-bold uppercase tracking-[0.16em]", tone === "navy" ? "text-white/65" : "text-azure-ink")}>{k}</p>}
      {title && <p className={clsx("mt-1.5 font-serif text-[19px] font-semibold leading-snug md:text-[21px]", tone === "navy" ? "text-white" : "text-ink")}>{title}</p>}
      <div className={clsx("mt-2 text-[14px] leading-relaxed md:text-[15px]", tone === "navy" ? "text-white/85" : "text-ink-2")}>{children}</div>
    </div>
  );
}

function Src({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[11px] leading-snug text-muted md:absolute md:bottom-[52px] md:left-[72px] md:right-[72px] md:mt-0">{children}</p>;
}

function Tbl({ head, rows, small }: { head: string[]; rows: ReactNode[][]; small?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className={clsx("w-full min-w-[560px] text-left", small ? "text-[12.5px]" : "text-[13.5px]")}>
        <thead>
          <tr className="border-b-2 border-navy text-[10.5px] uppercase tracking-[0.12em] text-muted">
            {head.map((h) => (
              <th key={h} className="py-2 pr-4 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-rule align-top">
              {r.map((c, j) => (
                <td key={j} className={clsx("py-2 pr-4 leading-snug", j === 0 ? "font-semibold text-ink" : "text-ink-2")}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- dati calcolati dal modello ---------- */

const scen = (["prudente", "base", "ottimistico"] as const).map((k) => ({ k, o: compute(SCENARIOS[k]) }));
const drivers = sensitivity(BASE).slice(0, 4);

/* ---------- slide ---------- */

export const SLIDES: SlideDef[] = [
  {
    id: "cover",
    section: "",
    title: "Il Filo",
    dark: true,
    body: null,
    notes:
      "Apertura. Il brief chiede più giocatori quotidiani. In 15 minuti rispondiamo a tre domande: perché questa soluzione dovrebbe funzionare, come lo dimostriamo e cosa costruiamo per primo. Poi una demo dal vivo.",
  },
  {
    id: "problem",
    section: "Il problema",
    title: "I giocatori quotidiani valgono di più, ma oggi Giochi è un catalogo da visitare, non un appuntamento da mantenere",
    body: (
      <Cols>
        <Block k="Dal brief" title="L'obiettivo è la frequenza">
          Molti utenti giocano 1–2 volte a settimana. Chi gioca ogni giorno si abbona di più e disdice di meno: lo afferma il brief, e va quantificato con
          i dati interni.
        </Block>
        <Block k="Dall'audit pubblico" title="I giochi e la gamification ci sono già">
          Otto giochi, tra cui Quiz e Prima o Dopo. Streak, trofei, classifiche mensili (da giugno 2026), Sfide tra amici. 4,6 su App Store con 3.559
          valutazioni.
        </Block>
        <Block k="Quello che manca" title="Un motivo per tornare domani" tone="navy">
          Ogni partita è completa in sé: finita quella, non resta niente in sospeso. E il primo tema delle recensioni negative è la perdita di progressi:
          proprio ciò che dovrebbe far tornare.
        </Block>
      </Cols>
    ),
    notes:
      "Non proponiamo nuovi giochi né altra gamification: ci sono già. Il problema non è l'offerta, è la continuità. L'abitudine nasce quando oggi lascia qualcosa in sospeso per domani.",
  },
  {
    id: "insight",
    section: "Il vero insight",
    title: "Chi gioca poco non è disinteressato: arriva per caso, gioca una partita e chiude, perché niente lo lega al giorno dopo",
    body: (
      <>
        <Cols>
          <Block k="Innesco" title="Il gioco nasce dalla lettura">
            Il momento d&apos;ingresso è la notizia, non Giochi. Ma negli articoli di attualità non c&apos;è nessun rimando ai giochi (osservazione
            dell&apos;audit).
          </Block>
          <Block k="Continuità" title="La streak punisce, non attrae">
            Per chi gioca due giorni su sette la streak è sempre a zero: è un traguardo per chi è già abituale. All&apos;occasionale serve un traguardo
            che si possa ancora raggiungere.
          </Block>
          <Block k="Sforzo" title="Otto scelte per tre minuti">
            Il tempo libero dell&apos;occasionale è una pausa breve. Un catalogo da scegliere e formati lunghi non ci stanno dentro.
          </Block>
        </Cols>
        <div className="mt-6 grid gap-3 rounded-xl bg-azure-soft p-5 text-[13.5px] leading-snug text-navy md:grid-cols-3 md:gap-6">
          <p>
            <strong>NYT Games:</strong> «We don&apos;t want 24/7 engagement». Partite brevi, una al giorno.
          </p>
          <p>
            <strong>Twipe (3 editori):</strong> chi fa ≥3 sessioni nella prima settimana ha il 50% di probabilità in meno di disdire.
          </p>
          <p>
            <strong>Washington Post:</strong> la newsletter Game Break è la seconda del giornale per click-through.
          </p>
        </div>
        <Src>Fonti in docs/BENCHMARK.md (consultate il 21/11/2026): Jonathan Knight, NYT; Digiday su dati Twipe; JournalismUK sul Washington Post.</Src>
      </>
    ),
    notes:
      "Tre frizioni: innesco, continuità, sforzo. Diventano le tre ipotesi diagnostiche del Case 1. Il benchmark dice che i giochi editoriali vincenti sono brevi, quotidiani e agganciati a un canale che si usa già.",
  },
  {
    id: "journey",
    section: "Opportunità nel percorso",
    title: "Le opportunità sono in tre momenti che oggi nessuno presidia: durante la lettura, a fine partita e il mattino dopo",
    body: (
      <div>
        <ol className="grid gap-3 md:grid-cols-7 md:gap-2">
          {[
            ["Legge una notizia", "Milioni di lettori al giorno", false],
            ["Momento 1", "Nessun invito a giocare dentro l'articolo", true],
            ["Scopre Giochi", "Fascia in homepage, sezione dedicata", false],
            ["Gioca una partita", "Uno degli 8 giochi", false],
            ["Momento 2", "Fine partita = fine della relazione", true],
            ["Il giorno dopo", "Nessun motivo personale per tornare", false],
            ["Momento 3", "Nessuna newsletter giochi trovata; push non verificabili", true],
          ].map(([t, d, gap], i) => (
            <li key={i} className={clsx("rounded-xl p-4", gap ? "bg-navy text-white" : "bg-card ring-1 ring-rule")}>
              <p className={clsx("text-[10.5px] font-bold uppercase tracking-[0.14em]", gap ? "text-azure" : "text-muted")}>{gap ? "Opportunità" : `Fase ${Math.ceil((i + 1) / 2)}`}</p>
              <p className="mt-1 font-serif text-[16px] font-semibold leading-snug">{t as string}</p>
              <p className={clsx("mt-1.5 text-[12.5px] leading-snug", gap ? "text-white/80" : "text-ink-2")}>{d as string}</p>
            </li>
          ))}
        </ol>
        <Cols className="mt-6">
          <Block k="Momento 1 → Case 2">«Gioca la notizia»: una domanda dentro l&apos;articolo, a cui si risponde senza lasciare la pagina.</Block>
          <Block k="Momento 2 → entrambi">A fine partita resta un indizio in sospeso e un amico da sfidare.</Block>
          <Block k="Momento 3 → Case 1">Un promemoria che parla del tuo progresso, all&apos;ora in cui leggi già il Corriere.</Block>
        </Cols>
      </div>
    ),
    notes:
      "Questa è la mappa che lega i due case. Retention e acquisizione non sono due progetti: sono tre momenti dello stesso percorso. Il Momento 2 serve a entrambi.",
  },
  {
    id: "idea",
    section: "La grande idea",
    title: "Il Filo: ogni giorno un indizio, ogni domenica la storia della settimana",
    body: (
      <div className="grid gap-6 md:grid-cols-[1fr_1.35fr] md:gap-10">
        <div className="space-y-4 text-[15px] leading-relaxed text-ink-2 md:text-[16px]">
          <p>
            <strong className="text-ink">Ogni giorno</strong> un&apos;Edizione: tre giochi brevi, circa tre minuti, tratti dal giornale e da formati che
            esistono già. Completarla dà un indizio.
          </p>
          <p>
            <strong className="text-ink">Ogni settimana</strong> sei indizi compongono un Filo. Domenica si scioglie il Nodo: chi o che cosa li lega. Un
            giorno perso si recupera.
          </p>
          <p className="rounded-xl bg-azure-soft p-4 font-serif text-[17px] italic leading-snug text-navy">
            Da «leggo una notizia, forse provo un gioco» a «ogni giorno ho un appuntamento con il Corriere che voglio completare e condividere».
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Perché solo il Corriere può farlo</p>
          {[
            ["Un'edizione al giorno", "Il quotidiano è già un appuntamento: il Filo ne usa la stessa grammatica."],
            ["Le notizie come materia prima", "Domande e indizi nascono dal lavoro della redazione: nessun concorrente di puro gaming può copiarli."],
            ["L'autorevolezza", "Un gioco che fa ricordare ciò che hai letto, non un passatempo qualsiasi."],
            ["Il pubblico", "Milioni di lettori sono già nell'articolo: il gioco va da loro."],
          ].map(([t, d]) => (
            <div key={t} className="flex gap-3 border-t border-rule pt-3">
              <FiloMark className="mt-1 shrink-0 text-azure" />
              <p className="text-[14px] leading-snug text-ink-2">
                <strong className="text-ink">{t}.</strong> {d}
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes:
      "Il Filo è un arco narrativo settimanale fatto di micro-appuntamenti quotidiani. Non è un clone di Wordle e non punta tutto sulle streak: il recupero rende il traguardo sempre raggiungibile. Il vantaggio competitivo è editoriale.",
  },
  {
    id: "system",
    section: "Come funziona",
    title: "Retention e acquisizione sono lo stesso ciclo: chi entra dalla notizia trova un appuntamento, chi lo mantiene invita altri",
    body: (
      <div>
        <SystemLoop dense />
        <div className="mt-6">
          <Tbl
            small
            head={["Concept valutato", "Impatto", "Originalità", "Fit brand", "Chiarezza 35–55", "Abitudine", "Integrazione", "Complessità ↓", "Misurabilità", "Totale"]}
            rows={[
              ["Il Filo (scelto)", "5", "5", "5", "4", "5", "5", "3", "5", <strong key="t">37</strong>],
              ["Gioca la notizia, da solo", "4", "4", "5", "5", "2", "5", "4", "5", "34"],
              ["Circoli sociali", "3", "2", "3", "3", "4", "2", "2", "4", "23"],
              ["Percorso personale a livelli", "3", "2", "3", "3", "3", "2", "3", "4", "23"],
            ]}
          />
          <p className="mt-2 text-[11px] text-muted">Punteggi 1–5 del team; «Complessità ↓»: 5 = più semplice. Analisi completa in docs/STRATEGY.md §3.</p>
        </div>
      </div>
    ),
    notes:
      "Abbiamo confrontato quattro concept. «Gioca la notizia» da solo porta lettori ma non li trattiene. I Circoli duplicano le Sfide che esistono già. Il Filo è l'unico che fa da spina dorsale per entrambi i case, e Gioca la notizia ne diventa il canale d'ingresso.",
  },
  {
    id: "c1-diagnosis",
    section: "Case 1 · Diagnosi",
    title: "Tre ipotesi sul perché gli occasionali non tornano, ognuna verificabile con dati che il Corriere possiede già",
    body: (
      <Tbl
        head={["Ipotesi", "Cosa vedremmo nei dati se è vera", "Dati e metodo per verificarla", "Se confermata"]}
        rows={[
          [
            "H1 · Nessun appuntamento",
            "Gli occasionali arrivano soprattutto dagli articoli, a orari variabili; chi gioca a orario fisso torna di più.",
            "Sorgente di ogni sessione (referrer, intcmp); varianza dell'orario di gioco per utente; ritorno a 7 giorni per sorgente.",
            "Edizione in home, card nell'app News, promemoria all'orario abituale",
          ],
          [
            "H2 · Nessun motivo per domani",
            "Il ritorno il giorno dopo non dipende da com'è andata la partita; dopo la rottura di una streak la frequenza crolla.",
            "D1 per gioco ed esito; frequenza nelle 2 settimane dopo una streak interrotta; clic sulla schermata di fine partita.",
            "Filo con indizi recuperabili e Nodo della domenica",
          ],
          [
            "H3 · Attrito e fiducia",
            "Abbandoni prima della fine nei giochi lunghi; ritorni più bassi dopo un errore di login o una perdita di progressi.",
            "Completamento per gioco e dispositivo; tempo al primo gesto; log di errori di sessione; temi delle recensioni (271 lette).",
            "Fix di affidabilità; Edizione da 3 minuti; ingresso da ospite",
          ],
        ]}
      />
    ),
    notes:
      "Ogni ipotesi ha un segnale atteso, una fonte dati e una leva. Si verificano con i dati esistenti nelle prime 2–3 settimane della fase Validate, prima di scrivere codice di prodotto.",
  },
  {
    id: "c1-solution",
    section: "Case 1 · Soluzione e riattivazione",
    title: "L'abitudine nasce da un compito breve, un progresso che si accumula e un promemoria che parla di te",
    body: (
      <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8">
        <div className="space-y-3">
          {[
            ["Edizione del giorno", "Home Giochi", "Troppa scelta, poco tempo → 3 giochi, 3 minuti, un traguardo", "Completamento Edizione"],
            ["Indizi recuperabili", "Fine Edizione, home", "La streak azzera → un giorno perso vale meno, ma non si perde", "Giorni di gioco a settimana"],
            ["Nodo della domenica", "Domenica, email del sabato", "Nessuna attesa → un finale settimanale", "Quota ≥4 giorni su 7"],
            ["Sfide settimanali", "Sfide esistenti", "Classifiche mensili lontane → si riparte ogni lunedì", "Ritorno a 7 giorni"],
          ].map(([t, where, why, kpi]) => (
            <div key={t} className="grid grid-cols-[1fr] gap-1 border-t border-rule pt-3 md:grid-cols-[150px_1fr]">
              <p className="font-serif text-[16px] font-semibold text-ink">{t}</p>
              <p className="text-[13px] leading-snug text-ink-2">
                {why}. <span className="text-muted">Dove: {where} · KPI: {kpi}</span>
              </p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Piano di riattivazione</p>
          <Tbl
            small
            head={["Regola", "Quando", "Canale"]}
            rows={[
              ["R1 Promemoria", "Ogni giorno, all'ora abituale", "Push (solo con consenso)"],
              ["R2 Giorno saltato", "Il mattino dopo", "Push o card nell'app News"],
              ["R3 Nodo", "Sabato e domenica", "Email del sabato e push"],
              ["R4 Nuovo inizio", "Lunedì, dopo ≥7 giorni di pausa", "Email: «comincia un nuovo Filo»"],
              ["R5 Inattivo da 21+ giorni", "Una volta", "Email, poi silenzio"],
            ]}
          />
          <p className="mt-2 text-[11.5px] leading-snug text-muted">
            Al massimo un messaggio al giorno su tutti i canali; stop dopo 2 messaggi ignorati; tono di progresso, mai di colpa.
          </p>
        </div>
      </div>
    ),
    notes:
      "Demo dal vivo qui: Esperienza A. Mostrare Giulia mercoledì, giocare l'Edizione, recuperare lunedì, la notifica di venerdì, il Nodo di domenica. Sottolineare: la streak esistente resta, il Filo aggiunge un traguardo settimanale sempre raggiungibile.",
  },
  {
    id: "c1-measure",
    section: "Case 1 · Misurazione",
    title: "Misuriamo l'abitudine, non i clic: la North Star è chi gioca almeno 4 giorni su 7",
    body: (
      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:gap-8">
        <div className="space-y-4">
          <Block tone="navy" k="North Star" title="Giocatori abituali settimanali">
            Utenti registrati con un gioco completato in ≥4 giorni di calendario distinti (Europe/Rome) negli ultimi 7. Si riportano anche le soglie a 5 e a
            7 giorni.
          </Block>
          <Block tone="card" k="Metriche di input">
            Giorni di gioco per utente attivo a settimana · ritorno D1 · completamento dell&apos;Edizione · indizi per settimana · rientro entro 24 ore dal
            messaggio.
          </Block>
        </div>
        <div className="space-y-3">
          {EXPERIMENTS.filter((e) => e.case === "Retention").map((e) => (
            <div key={e.id} className="rounded-xl bg-card p-4 ring-1 ring-rule">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-azure-ink">
                {e.id} · {e.name}
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-ink">
                <strong>Primaria:</strong> {e.primary}
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-2">
                <strong>Unità:</strong> {e.unit} <strong>Decisione:</strong> {e.decision.split(".")[0]}.
              </p>
            </div>
          ))}
          <p className="text-[12.5px] leading-snug text-ink-2">
            <strong className="text-ink">Correlazione ≠ causalità.</strong> Che i giocatori quotidiani si abbonino di più non dimostra che aumentare la
            frequenza crei abbonamenti. Per questo un holdout del 10% resta fuori dal Filo per 6 mesi e misura churn e abbonamenti incrementali.
          </p>
        </div>
      </div>
    ),
    notes:
      "Primaria di R1 sulle settimane 3–6 per escludere l'effetto novità. Guardrail sui giochi lunghi per evitare la cannibalizzazione. L'holdout è l'unico modo onesto di stimare il legame con l'abbonamento.",
  },
  {
    id: "c2-channels",
    section: "Case 2 · Punti di contatto",
    title: "Il pubblico è già nel Corriere: il punto di contatto giusto è dentro la notizia, non accanto",
    body: (
      <div>
        <Tbl
          head={["Punto di contatto", "Meccanica", "Logica di acquisizione", "Metrica"]}
          rows={[
            ["Articoli (web e app News)", "«Gioca la notizia»: una domanda in pagina, poi l'Edizione da ospite", "Articoli scelti dalla redazione; esclusi i giocatori già attivi; massimo 1 al giorno per lettore", "Lettore → giocatore a 7 giorni"],
            ["Feed dell'app News", "Card del Filo con l'indizio del giorno", "Solo per chi ha giocato almeno una volta o ha interagito col modulo", "Ritorno D1 e D7"],
            ["Homepage Corriere.it", "La fascia giochi esistente punta all'Edizione di oggi", "Un'unica porta d'ingresso al posto di otto", "Clic → Edizione completata"],
            ["Newsletter Corriere", "Blocco «Il Filo di questa settimana» nelle newsletter esistenti", "Lunedì: «comincia un nuovo Filo», il giorno migliore per iniziare", "Clic → prima Edizione"],
            ["Quotidiano cartaceo", "QR con la domanda del giorno (test opzionale)", "Lettori di carta 35–55: un ponte verso il digitale", "Scansioni → registrazioni"],
            ["Giocatori ambasciatori", "Invito che si gioca subito (pagina seguente)", "Randomizzato per invitante", "Nuovi attivi per invitante"],
          ]}
        />
      </div>
    ),
    notes:
      "Demo dal vivo: Esperienza B. Stefano legge un articolo, risponde nella pagina, continua da ospite, ottiene il primo indizio, sceglie il promemoria; martedì la card nell'app News lo riporta. Sottolineare: nessun accesso premium regalato; l'Edizione usa solo formati gratuiti.",
  },
  {
    id: "c2-first",
    section: "Case 2 · Primo contatto e referral",
    title: "Il primo giorno deve finire con una promessa per domani, e l'invito non deve chiedere un account",
    body: (
      <Cols cols={2}>
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">La prima esperienza, in 4 regole</p>
          {[
            ["Prima il valore, poi l'account", "Si gioca da ospite; il salvataggio viene chiesto dopo l'indizio."],
            ["Tre minuti, un traguardo", "La risposta nell'articolo conta già come primo gioco: si parte con 1 su 3."],
            ["Una promessa precisa", "«Il prossimo indizio esce domani alle 7». Un motivo concreto, con un orario."],
            ["Il promemoria lo sceglie il lettore", "Account, calendario (.ics) o niente. Anche senza consenso, la card nell'app News lo ritrova."],
          ].map(([t, d], i) => (
            <div key={t} className="flex gap-3 border-t border-rule pt-3">
              <span className="font-serif text-[20px] font-semibold text-azure">{i + 1}</span>
              <p className="text-[13.5px] leading-snug text-ink-2">
                <strong className="text-ink">{t}.</strong> {d}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Referral: evoluzione delle Sfide esistenti</p>
          {[
            ["Al momento giusto", "L'invito compare a fine Edizione, quando il giocatore è soddisfatto."],
            ["Senza spoiler", "La card mostra il risultato, non le risposte. È pensata per WhatsApp."],
            ["Gioca prima", "Oggi la Sfida chiede di registrarsi; la nuova landing fa giocare subito."],
            ["Premio di qualità", "Un indizio jolly all'invitante, solo quando l'invitato gioca due giorni. Nessun valore economico."],
          ].map(([t, d], i) => (
            <div key={t} className="flex gap-3 border-t border-rule pt-3">
              <span className="font-serif text-[20px] font-semibold text-azure">{i + 1}</span>
              <p className="text-[13.5px] leading-snug text-ink-2">
                <strong className="text-ink">{t}.</strong> {d}
              </p>
            </div>
          ))}
        </div>
      </Cols>
    ),
    notes: "Demo dal vivo: Esperienza C. Paolo invita Chiara, Chiara gioca da ospite, entra nella Sfida, torna venerdì; il registro eventi mostra l'attribuzione.",
  },
  {
    id: "c2-measure",
    section: "Case 2 · Analisi dei risultati",
    title: "Contiamo solo i giocatori che non sarebbero arrivati comunque",
    body: (
      <div className="grid gap-6 md:grid-cols-[1fr_1.3fr] md:gap-8">
        <div className="space-y-4">
          <Block tone="navy" k="KPI di acquisizione" title="Lettore → giocatore attivato">
            Lettori 35–55 mai giocato con ≥1 Edizione completata entro 7 giorni, diviso lettori esposti al touchpoint. Poi ritorno D1 e abituali a 4
            settimane.
          </Block>
          <Block tone="card" k="Attribuzione">
            Sorgente di primo tocco con finestra di 7 giorni; codice d&apos;invito nel link; si escludono i lettori con storico di gioco nei 90 giorni o con
            un account Giochi.
          </Block>
        </div>
        <div className="space-y-3">
          {EXPERIMENTS.filter((e) => e.case === "Acquisizione").map((e) => (
            <div key={e.id} className="rounded-xl bg-card p-4 ring-1 ring-rule">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-azure-ink">
                {e.id} · {e.name}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-snug text-ink">
                <strong>Primaria:</strong> {e.primary}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-ink-2">
                <strong>Unità:</strong> {e.unit.split(":")[0]}. <strong>Guardrail:</strong> {e.guardrails.split(".")[0]}.
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes:
      "L'attribuzione dice da dove arriva un utente; solo la randomizzazione dice se è incrementale. A1 randomizza per lettore, non per pagina vista. A3 randomizza per invitante, così gli invitati non si contaminano.",
  },
  {
    id: "model",
    section: "Growth model e impatto",
    title: "Nel caso base il progetto è in pareggio: il valore dipende da poche ipotesi, verificabili in sei settimane",
    body: (
      <div className="grid gap-6 md:grid-cols-[1.25fr_1fr] md:gap-10">
        <div>
          <Tbl
            head={["Annuo, a regime", "Prudente", "Base", "Ottimistico"]}
            rows={[
              ["Giocatori abituali in più", ...scen.map((s) => fmtCompact(s.o.incHabitualTotal))],
              ["DAU medi in più", ...scen.map((s) => fmtCompact(s.o.incDAU))],
              ["Abbonamenti incrementali", ...scen.map((s) => fmtCompact(s.o.incSubscriptions))],
              ["Abbonati digitali trattenuti", ...scen.map((s) => fmtCompact(s.o.churnAvoided))],
              ["Valore annuo", ...scen.map((s) => fmtEur(s.o.totalValue))],
              ["Costo annuo", ...scen.map((s) => fmtEur(s.o.annualCost))],
              [<strong key="n">Valore netto</strong>, ...scen.map((s) => <strong key={s.k}>{fmtEur(s.o.net)}</strong>)],
            ]}
          />
          <p className="mt-2 inline-block rounded-full bg-warn-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-warn">
            Modello illustrativo · nessun dato interno Corriere
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Le ipotesi che pesano di più (±25%)</p>
          <ol className="space-y-2">
            {drivers.map((d, i) => (
              <li key={d.key} className="flex gap-3 border-t border-rule pt-2 text-[13.5px] leading-snug text-ink">
                <span className="font-serif font-semibold text-azure">{i + 1}</span>
                {d.label}
              </li>
            ))}
          </ol>
          <p className="text-[13px] leading-relaxed text-ink-2">
            Il valore non sta nel prezzo Giochi (€24,99 l&apos;anno in app, €1 il primo anno sul web), ma nel trattenere gli abbonati digitali del Corriere
            (805 mila) e nel registrare nuovi lettori. Tutto si può verificare nel Growth Lab.
          </p>
        </div>
      </div>
    ),
    notes:
      "Siamo onesti: il caso base è in pareggio. Non è un problema, è un'informazione. Le ipotesi decisive (conversione dagli articoli, nascita dell'abitudine, quota causale) si misurano nella fase Validate e nel pilot, spendendo poco. Aprire il Growth Lab e muovere κ dal vivo.",
  },
  {
    id: "roadmap",
    section: "Esperimenti e roadmap",
    title: "Cinque esperimenti, tre fasi, ogni fase con un criterio per fermarsi",
    body: (
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:gap-8">
        <div className="space-y-3">
          {PHASES.map((p) => (
            <div key={p.n} className={clsx("rounded-xl p-4", p.n === 1 ? "bg-navy text-white" : "bg-card ring-1 ring-rule")}>
              <p className={clsx("text-[10.5px] font-bold uppercase tracking-[0.14em]", p.n === 1 ? "text-white/65" : "text-muted")}>
                Fase {p.n} · {p.when}
              </p>
              <p className="mt-1 font-serif text-[18px] font-semibold">{p.name}</p>
              <p className={clsx("mt-1 text-[12.5px] leading-snug", p.n === 1 ? "text-white/85" : "text-ink-2")}>
                <strong>Go/no-go:</strong> {p.gate[0]}.
              </p>
            </div>
          ))}
          <p className="text-[12px] text-muted">Esperimenti: A1 in forma ridotta nella fase 1; R1, R2, A1, A2 nel pilot; A3 e lettura dell&apos;holdout nella fase di scala.</p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-rule">
          <ImpactEffortMatrix compact />
        </div>
      </div>
    ),
    notes: "La matrice mostra che le prime quattro mosse costano poco e decidono tutto il resto. Ogni fase ha un criterio di uscita fissato prima.",
  },
  {
    id: "ask",
    section: "Priorità e decisioni",
    title: "Per partire a dicembre servono tre decisioni, non un budget di prodotto",
    body: (
      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:gap-10">
        <ol className="space-y-4">
          {[
            ["Approvare la fase Validate", "6–8 settimane, un team ridotto: PM, data analyst, uno sviluppatore, un redattore part-time."],
            ["Aprire dati e piattaforma", "Accesso ad analytics e CRM; un accordo con il fornitore della piattaforma per eventi e fix di affidabilità."],
            ["Concedere spazio editoriale", "«Gioca la notizia» su un campione di articoli e un Filo pilota via email per 5–10 mila volontari."],
          ].map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[44px_1fr] gap-3 border-t-2 border-navy pt-4">
              <span className="font-serif text-[34px] font-semibold leading-none text-navy">{i + 1}</span>
              <div>
                <p className="font-serif text-[20px] font-semibold text-ink">{t}</p>
                <p className="mt-1 text-[14px] leading-snug text-ink-2">{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <Block tone="azure" k="Cosa costruiamo per primo" title="Ciò che rende vera la promessa «torna domani»">
          <ul className="mt-1 space-y-1.5">
            <li>1. Affidabilità di login e progressi</li>
            <li>2. Tassonomia degli eventi e baseline</li>
            <li>3. «Gioca la notizia» in forma minima</li>
            <li>4. Il Filo pilota, senza codice di prodotto</li>
          </ul>
          <p className="mt-3">Il prodotto completo arriva solo se i criteri di uscita della fase 1 sono superati.</p>
        </Block>
      </div>
    ),
    notes: "Chiudere sulle richieste. Sono piccole e reversibili: se le ipotesi non reggono, ci fermiamo dopo sei settimane, con dati che oggi non abbiamo.",
  },
  {
    id: "vision",
    section: "",
    title: "Ogni mattina, un appuntamento con il Corriere che si vuole completare e condividere",
    dark: true,
    body: null,
    notes:
      "Visione: il Filo può diventare il rito digitale del Corriere, come lo è stata la lettura del giornale. Grazie. Lasciare spazio alle domande; tenere aperti prototipo e Growth Lab.",
  },
];

"use client";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { EDITIONS } from "@/data/week";
import { cluesCollected, initialState, isComplete, recordResult, type FiloState, type GameResult } from "@/lib/filo";
import { useStoredState } from "@/lib/store";
import { useEventLog } from "@/lib/useEvents";
import { ClueReveal, EditionPlayer, FiloBoard } from "@/components/filo/Filo";
import { QuizGame } from "@/components/games/QuizGame";
import { AppHeader, FiloHome, PlayScreen } from "@/components/prototype/GiochiApp";
import { EventLog, ExperienceShell, PhoneFrame, type Step } from "@/components/prototype/Shell";
import { Arrow, Button, Check } from "@/components/ui";

type Screen = "article" | "play" | "after" | "feed" | "home" | "play2";
type Save = null | "account" | "calendar" | "none";
type AS = { step: number; screen: Screen; filo: FiloState; inlineAnswered: boolean; save: Save; playDay: number };

const START: AS = { step: 0, screen: "article", filo: initialState(0), inlineAnswered: false, save: null, playDay: 0 };
const MON = EDITIONS[0];

export default function AcquisitionPage() {
  const [s, setS, resetState, hydrated] = useStoredState<AS>("proto:acquisition:v1", START);
  const { events, track, reset: resetEvents } = useEventLog("acquisition");
  const moduleRef = useRef<HTMLDivElement>(null);
  const f = s.filo;
  const monDone = isComplete(f, 0);
  const at = f.today === 0 ? "Lun 08:21" : "Mar 07:42";

  useEffect(() => {
    if (s.step === 1 && s.screen === "article") moduleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [s.step, s.screen]);

  const goStep = (n: number) => {
    setS((p) => {
      let screen: Screen = p.screen;
      if (n <= 1) screen = "article";
      if (n === 2 || n === 3) screen = isComplete(p.filo, 0) ? "after" : "play";
      if (n === 4) screen = "after";
      if (n === 5) screen = p.filo.today === 1 ? p.screen : "feed";
      const filo = n === 5 && p.filo.today === 0 ? { ...p.filo, today: 1 } : p.filo;
      return { ...p, step: n, screen, filo };
    });
    if (n === 0 && !events.some((e) => e.name === "article_view")) track("article_view", "Lun 08:19", { section: "sport", platform: "app_news", is_player: false });
    if (n === 1 && !events.some((e) => e.name === "inline_question_impression"))
      track("inline_question_impression", "Lun 08:20", { article_id: "demo-torino-2006", position: "after_p2", variant: "gioca_la_notizia" });
    if (n === 4 && !events.some((e) => e.name === "save_progress_prompt_view")) track("save_progress_prompt_view", "Lun 08:23", { after: "edition_completed", guest: true });
    if (n === 5 && f.today === 0) track("return_visit", "Mar 07:42", { days_since_first: 1, source: s.save === "calendar" ? "calendar" : s.save === "account" ? "push_opt_in" : "news_app_card" });
  };

  const onInline = (r: GameResult) => {
    track("inline_question_answered", "Lun 08:20", { article_id: "demo-torino-2006", correct: r.correct });
    track("edition_started", "Lun 08:20", { day: MON.isoDate, entry: "inline_article", guest: true });
    setS((p) => ({ ...p, inlineAnswered: true, filo: recordResult(p.filo, 0, 0, r) }));
  };

  const onResult = (gi: number, r: GameResult) => {
    const day = s.playDay;
    const next = recordResult(f, day, gi, r);
    track("game_completed", at, { day: EDITIONS[day].isoDate, game: ["quiz", "prima_o_dopo", "anagramma"][gi], correct: r.correct, guest: s.save !== "account" });
    if (isComplete(next, day) && !isComplete(f, day)) {
      track("edition_completed", at, { day: EDITIONS[day].isoDate, first_ever: day === 0, guest: s.save !== "account" });
      track("clue_unlocked", at, { clue_index: day + 1, clues_total: cluesCollected(next) });
      setS((p) => ({ ...p, filo: next, screen: day === 0 ? "after" : "play2", step: day === 0 ? Math.max(p.step, 4) : p.step }));
      if (day === 0) track("save_progress_prompt_view", "Lun 08:23", { after: "edition_completed", guest: true });
    } else setS((p) => ({ ...p, filo: next }));
  };

  const choose = (c: Exclude<Save, null>) => {
    setS((p) => ({ ...p, save: c }));
    if (c === "account") {
      track("registration_completed", "Lun 08:24", { source: "inline_article", first_touch: "demo-torino-2006", method: "email" });
      track("reminder_opt_in", "Lun 08:24", { channel: "push", time: "07:30" });
    }
    if (c === "calendar") {
      track("reminder_opt_in", "Lun 08:24", { channel: "calendar_ics", time: "07:30" });
      downloadIcs();
    }
  };

  const reset = () => {
    resetState();
    resetEvents();
  };

  const steps: Step[] = [
    {
      title: "Un lettore, non ancora un giocatore",
      body: (
        <>
          <p>
            <strong className="text-ink">Stefano, 41 anni, Roma.</strong> Legge il Corriere sull&apos;app News quasi ogni mattina. Non ha mai aperto
            Giochi e non è registrato: è il target «lettori 35–55 che non hanno mai giocato» del Case 2.
          </p>
          <p>
            Oggi i giochi si trovano nella fascia in homepage e nella loro sezione. Negli articoli di attualità, secondo il nostro audit, non c&apos;è
            nessun rimando ai giochi. Ma è lì che Stefano passa il suo tempo.
          </p>
        </>
      ),
      lever: "—",
      metric: "Denominatore: lettori 35–55 esposti, mai giocato",
    },
    {
      title: "La notizia diventa una domanda",
      body: (
        <>
          <p>
            A metà articolo trova <strong className="text-ink">«Gioca la notizia»</strong>: una domanda legata a ciò che sta leggendo, a cui si risponde
            senza lasciare la pagina. Rispondi tu nel telefono.
          </p>
          <p>
            È un gesto da un secondo, in un momento in cui Stefano è già attento. Non è un banner che lo porta via dall&apos;articolo, e infatti
            controlliamo che la lettura non ne risenta (guardrail del test A1).
          </p>
        </>
      ),
      lever: "Modulo «Gioca la notizia» negli articoli selezionati dalla redazione",
      metric: "Conversione lettore → giocatore: risposte / impression del modulo",
    },
    {
      title: "Entra in Giochi senza registrarsi",
      body: (
        <>
          <p>
            La risposta conta già come primo gioco dell&apos;Edizione di oggi. Con un tocco Stefano continua nella stessa sessione, da ospite: nessun
            account prima di aver provato qualcosa che vale.
          </p>
          <p>L&apos;Edizione del lunedì è il punto d&apos;ingresso ideale, perché il Filo comincia proprio oggi.</p>
        </>
      ),
      lever: "Ingresso da ospite e primo gioco già completato (effetto progresso avviato)",
      metric: "Edizioni iniziate / risposte nel modulo",
    },
    {
      title: "La prima Edizione completa",
      body: (
        <>
          <p>Gioca Prima o Dopo e l&apos;Anagramma. In tutto ci vogliono circa tre minuti, pensati per la pausa caffè, non per una sessione lunga.</p>
          <p className="text-sm text-muted">Completa l&apos;Edizione nel telefono per vedere l&apos;esperienza post-gioco.</p>
        </>
      ),
      lever: "Edizione breve: time-to-value sotto i 3 minuti",
      metric: "Attivazione: prima Edizione completata entro la sessione",
    },
    {
      title: "Prima il valore, poi la richiesta",
      body: (
        <>
          <p>
            Dopo il gioco Stefano riceve il primo indizio e capisce il Filo in una riga: sei indizi, la soluzione domenica. Solo a questo punto gli
            chiediamo qualcosa: salvare l&apos;indizio.
          </p>
          <p>
            Ci sono tre opzioni, tutte legittime. Il promemoria nel calendario funziona davvero (scarica un file .ics) e non richiede alcun account.
          </p>
        </>
      ),
      lever: "Salvataggio dopo il valore, promemoria del mattino a scelta",
      metric: "Registrazioni / prime Edizioni; consensi a un promemoria",
    },
    {
      title: "Martedì: il motivo per tornare",
      body: (
        <>
          <p>
            Martedì mattina, nell&apos;app News, tra le notizie c&apos;è una card: è uscito il secondo indizio. Arriva anche se Stefano non ha dato il
            consenso alle notifiche, perché vive dove lui legge già.
          </p>
          <p>
            Questo è il momento che il case chiede di progettare: <strong className="text-ink">il ritorno del giorno dopo</strong>. Lo misuriamo come
            sessione con un&apos;Edizione nel giorno di calendario successivo alla prima.
          </p>
        </>
      ),
      lever: "Card persistente nell'app News + promemoria scelto",
      metric: "Ritorno D1 dei nuovi giocatori (test A2)",
    },
  ];

  const screen = !hydrated ? null : (
    <>
      {s.screen === "article" && (
        <ArticleScreen moduleRef={moduleRef} answered={s.inlineAnswered} onInline={onInline} onContinue={() => goStep(2)} onRead={() => undefined} filo={f} />
      )}
      {s.screen === "play" && (
        <PlayScreen onBack={() => setS((p) => ({ ...p, screen: "article" }))} backLabel="Articolo">
          <div className="mb-4 rounded-xl bg-azure-soft px-4 py-2.5 text-[0.8rem] text-navy">Stai giocando da ospite. Nessun account richiesto.</div>
          <EditionPlayer edition={MON} state={f} onResult={onResult} />
        </PlayScreen>
      )}
      {s.screen === "after" && <AfterScreen filo={f} save={s.save} onChoose={choose} />}
      {s.screen === "feed" && (
        <NewsFeed
          onOpen={() => {
            track("edition_started", "Mar 07:43", { day: EDITIONS[1].isoDate, entry: "news_app_card", guest: s.save !== "account" });
            setS((p) => ({ ...p, screen: "play2", playDay: 1 }));
          }}
        />
      )}
      {s.screen === "play2" && (
        <PlayScreen onBack={() => setS((p) => ({ ...p, screen: "home" }))}>
          {isComplete(f, 1) ? (
            <div className="space-y-6">
              <ClueReveal edition={EDITIONS[1]} state={f} />
              <div className="rounded-2xl bg-card p-4 ring-1 ring-rule">
                <FiloBoard state={f} compact />
              </div>
              <Button className="w-full" onClick={() => setS((p) => ({ ...p, screen: "home" }))}>
                Vai al Filo <Arrow />
              </Button>
            </div>
          ) : (
            <EditionPlayer edition={EDITIONS[1]} state={f} onResult={onResult} />
          )}
        </PlayScreen>
      )}
      {s.screen === "home" && <FiloHome state={f} onPlay={(d) => setS((p) => ({ ...p, screen: "play2", playDay: d }))} />}
    </>
  );

  return (
    <ExperienceShell
      kicker="Prototipo · Esperienza B · Acquisizione"
      title="Dalla notizia al primo indizio, in tre minuti"
      intro={<p>Un lettore che non ha mai giocato incontra Giochi dentro un articolo. L&apos;articolo è dimostrativo, scritto per il prototipo.</p>}
      steps={steps}
      step={s.step}
      onStep={goStep}
      onReset={reset}
      nextDisabled={(s.step === 1 && !s.inlineAnswered) || (s.step === 3 && !monDone)}
      nextHint={s.step === 1 ? "Rispondi alla domanda nell'articolo per proseguire." : "Completa l'Edizione nel telefono per proseguire."}
      below={<EventLog events={events} />}
    >
      <PhoneFrame time={f.today === 0 ? "08:20" : "07:42"} tone="white">
        {screen}
      </PhoneFrame>
    </ExperienceShell>
  );
}

function NewsHeader() {
  return (
    <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-rule bg-white/95 px-5 backdrop-blur">
      <span className="font-serif text-[1.05rem] font-semibold text-ink">Corriere · News</span>
      <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-warn">Demo</span>
    </div>
  );
}

function ArticleScreen({
  moduleRef,
  answered,
  onInline,
  onContinue,
  filo,
}: {
  moduleRef: React.RefObject<HTMLDivElement | null>;
  answered: boolean;
  onInline: (r: GameResult) => void;
  onContinue: () => void;
  onRead: () => void;
  filo: FiloState;
}) {
  const r = filo.days[0]?.results[0];
  return (
    <div className="bg-white">
      <NewsHeader />
      <article className="px-5 pb-10 pt-5">
        <p className="rounded-md bg-warn-soft px-2.5 py-1.5 text-[0.68rem] font-semibold text-warn">Articolo dimostrativo · contenuto originale per il prototipo</p>
        <p className="kicker mt-4 text-azure-ink">Sport</p>
        <h2 className="mt-2 font-serif text-[1.6rem] font-semibold leading-[1.12] text-ink">Vent&apos;anni dopo Torino 2006: che cosa resta dei Giochi invernali</h2>
        <p className="mt-3 font-serif text-[1.02rem] italic leading-snug text-ink-2">
          Dagli impianti al volontariato, l&apos;eredità di un&apos;Olimpiade si misura negli anni. Il confronto con Milano Cortina 2026.
        </p>
        <p className="mt-3 text-xs text-muted">Redazione demo · Lunedì 30 novembre 2026</p>
        <div className="mt-5 space-y-4 font-serif text-[1.02rem] leading-[1.6] text-ink">
          <p>
            Nel febbraio 2006 Torino ospitò i Giochi olimpici invernali, mezzo secolo dopo Cortina d&apos;Ampezzo 1956. Vent&apos;anni più tardi, con
            Milano Cortina 2026 alle spalle, il dibattito sull&apos;eredità dei grandi eventi sportivi è tornato d&apos;attualità.
          </p>
          <p>
            La domanda è sempre la stessa: che cosa resta quando si spengono i riflettori? Impianti che continuano a vivere, competenze organizzative,
            migliaia di volontari formati. Ma anche strutture rimaste senza uso.
          </p>
        </div>

        {/* Touchpoint di acquisizione */}
        <div ref={moduleRef} className="my-6 rounded-2xl bg-paper p-4 ring-1 ring-rule">
          <div className="flex items-center justify-between">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-navy">Gioca la notizia</p>
            <p className="text-[0.68rem] font-semibold text-muted">Corriere Giochi</p>
          </div>
          <div className="mt-3">
            {!answered ? (
              <QuizGame game={MON.games[0]} compact onDone={onInline} ctaLabel="Conferma" />
            ) : (
              <div>
                <p className={clsx("flex items-center gap-2 text-sm font-semibold", r?.correct ? "text-ok" : "text-navy")}>
                  {r?.correct && <Check />} {r?.correct ? "Risposta esatta." : "Era il 2006."} Hai giocato il primo dei 3 giochi di oggi.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  Altri due, circa due minuti, e ottieni il primo indizio del Filo: la storia della settimana, che si scioglie domenica.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1" onClick={onContinue}>
                    Continua l&apos;Edizione
                  </Button>
                </div>
                <p className="mt-2 text-center text-xs text-muted">Senza registrazione. Puoi anche continuare a leggere.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 font-serif text-[1.02rem] leading-[1.6] text-ink">
          <p>
            Chi studia i grandi eventi distingue tra eredità materiale e immateriale. La prima si conta in infrastrutture, la seconda in abitudini,
            turismo e immagine internazionale. Per valutare entrambe servono anni.
          </p>
        </div>
      </article>
    </div>
  );
}

function AfterScreen({ filo, save, onChoose }: { filo: FiloState; save: Save; onChoose: (c: Exclude<Save, null>) => void }) {
  return (
    <div>
      <AppHeader />
      <div className="space-y-6 px-5 py-6">
        <ClueReveal edition={MON} state={filo} />
        <div className="rounded-2xl bg-card p-4 ring-1 ring-rule">
          <FiloBoard state={filo} compact />
          <p className="mt-3 text-[0.82rem] leading-relaxed text-ink-2">
            Ogni giorno un&apos;Edizione ti dà un indizio. Domenica li leghi tutti e sciogli il Nodo. Il prossimo esce domani alle 7.
          </p>
        </div>
        {save === null ? (
          <div className="rounded-2xl bg-navy p-5 text-white">
            <p className="font-serif text-lg font-semibold">Salva il tuo indizio</p>
            <p className="mt-1 text-sm text-white/75">Così domani lo ritrovi, su qualsiasi dispositivo.</p>
            <div className="mt-4 space-y-2">
              <Button variant="light" className="w-full" onClick={() => onChoose("account")}>
                Crea un account gratuito
              </Button>
              <button onClick={() => onChoose("calendar")} className="h-11 w-full rounded-full text-sm font-semibold text-white ring-1 ring-inset ring-white/40 hover:bg-white/10">
                Aggiungi un promemoria al calendario
              </button>
              <button onClick={() => onChoose("none")} className="h-10 w-full text-sm font-medium text-white/70 hover:text-white">
                No, grazie
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-ok-soft p-4 text-sm text-ok" aria-live="polite">
            {save === "account" && "Account creato (simulato). Domani alle 7:30 ti avvisiamo, se lo vuoi."}
            {save === "calendar" && "Promemoria scaricato: un evento alle 7:30, da martedì a sabato. Nessun account necessario."}
            {save === "none" && "Va bene. Il tuo indizio resta su questo dispositivo per 7 giorni."}
          </div>
        )}
      </div>
    </div>
  );
}

function NewsFeed({ onOpen }: { onOpen: () => void }) {
  const items = ["Mercati, la settimana si apre in rialzo", "Meteo: arriva il primo freddo al Nord", "Serie A, il punto dopo la giornata"];
  return (
    <div className="bg-white">
      <NewsHeader />
      <div className="px-5 py-5">
        <p className="text-xs font-semibold text-muted">Martedì 1 dicembre</p>
        <p className="mt-1 font-serif text-[1.4rem] font-semibold text-ink">Le notizie del mattino</p>
        <ul className="mt-4 divide-y divide-rule">
          <li className="py-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Titolo dimostrativo</p>
            <p className="mt-1 font-serif text-[1.05rem] font-semibold text-ink">{items[0]}</p>
          </li>
          <li className="py-4">
            <button onClick={onOpen} className="w-full rounded-2xl bg-navy p-4 text-left text-white hover:bg-navy-2">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/70">Il tuo Filo · 1 di 6</p>
              <p className="mt-1.5 font-serif text-[1.15rem] font-semibold">È uscito il secondo indizio.</p>
              <p className="mt-1 text-sm text-white/75">Tre giochi, tre minuti. Ieri: «7 dicembre».</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-azure">
                Gioca <Arrow className="h-3.5 w-3.5" />
              </span>
            </button>
          </li>
          {items.slice(1).map((t) => (
            <li key={t} className="py-3">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Titolo dimostrativo</p>
              <p className="mt-1 font-serif text-[1.05rem] font-semibold text-ink">{t}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function downloadIcs() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Il Filo concept demo//IT",
    "BEGIN:VEVENT",
    "UID:il-filo-demo-20261201@concept.local",
    "DTSTAMP:20261130T072400Z",
    "DTSTART:20261201T063000Z",
    "DURATION:PT5M",
    "RRULE:FREQ=DAILY;COUNT=5",
    "SUMMARY:Il Filo · l'indizio di oggi (demo)",
    "DESCRIPTION:Tre giochi\\, tre minuti. Promemoria generato dal prototipo del case study.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  try {
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "il-filo-promemoria.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    /* download non disponibile in questo contesto */
  }
}

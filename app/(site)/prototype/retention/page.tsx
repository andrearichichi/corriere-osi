"use client";
import clsx from "clsx";
import { EDITIONS } from "@/data/week";
import {
  advanceDay,
  cluesCollected,
  initialState,
  isComplete,
  weeklyPoints,
  reactivationMessage,
  recordResult,
  type FiloState,
  type GameResult,
} from "@/lib/filo";
import { useStoredState } from "@/lib/store";
import { useEventLog } from "@/lib/useEvents";
import { ClueReveal, EditionPlayer, NodoCard } from "@/components/filo/Filo";
import { CurrentHub, EditionDone, FiloHome, LockScreen, PlayScreen, WeekRhythm } from "@/components/prototype/GiochiApp";
import { EventLog, ExperienceShell, PhoneFrame, type Step } from "@/components/prototype/Shell";
import { Button, SimTag } from "@/components/ui";

type Screen = "hub" | "home" | "play" | "done" | "lock" | "nodo";
type RS = { step: number; filo: FiloState; screen: Screen; playDay: number | null; recovering: boolean };

const START: RS = { step: 0, filo: initialState(2), screen: "hub", playDay: null, recovering: false };
const DAY3 = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const TIMES = ["08:05", "08:10", "08:40", "08:12", "08:12", "09:30", "10:15"];

/* Persona illustrativa: ultimi 30 giorni (1 = giorno di gioco) */
const ACTIVITY = [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0];
const SOURCES = [
  { label: "Da un articolo", n: 4 },
  { label: "Homepage Corriere.it", n: 1 },
  { label: "App Giochi, diretto", n: 1 },
  { label: "Notifica", n: 0 },
];

export default function RetentionPage() {
  const [s, setS, resetState, hydrated] = useStoredState<RS>("proto:retention:v1", START);
  const { events, track, reset: resetEvents } = useEventLog("retention");
  const f = s.filo;
  const at = `${DAY3[f.today]} ${TIMES[f.today]}`;

  const setFilo = (filo: FiloState) => setS((p) => ({ ...p, filo }));

  const goStep = (n: number) => {
    setS((p) => {
      let filo = p.filo;
      let screen: Screen = p.screen;
      let playDay = p.playDay;
      if (n === 0) screen = "hub";
      if (n === 1) screen = "home";
      if (n === 2) {
        playDay = 2;
        screen = isComplete(filo, 2) ? "done" : "play";
        if (filo.today < 2) filo = { ...filo, today: 2 };
      }
      if (n === 3) screen = "home";
      if (n === 4) {
        if (filo.today < 4) filo = { ...filo, today: 4 };
        screen = "lock";
      }
      if (n === 5) {
        if (filo.today < 4) filo = { ...filo, today: 4 };
        screen = filo.today === 6 ? "nodo" : "home";
      }
      return { ...p, step: n, filo, screen, playDay, recovering: false };
    });
    if (n === 4) {
      const msg = reactivationMessage({ ...f, today: Math.max(4, f.today) });
      if (msg && !events.some((e) => e.name === "reactivation_sent"))
        track("reactivation_sent", "Ven 08:12", { rule: msg.rule.split(" ·")[0], channel: "push", send_time: "personal_08:12", clues: cluesCollected(f) });
    }
  };

  const play = (day: number) => {
    const recovering = day < f.today;
    setS((p) => ({ ...p, screen: isComplete(p.filo, day) ? "done" : "play", playDay: day, recovering, step: day === 2 && p.step < 2 ? 2 : p.step }));
    track("edition_started", at, { day: EDITIONS[day].isoDate, recovery: recovering, entry: "filo_home" });
  };

  const onResult = (gi: number, r: GameResult) => {
    const day = s.playDay!;
    const next = recordResult(f, day, gi, r);
    track("game_completed", at, { day: EDITIONS[day].isoDate, game: ["quiz", "prima_o_dopo", "anagramma"][gi], correct: r.correct, attempts: r.attempts });
    if (isComplete(next, day) && !isComplete(f, day)) {
      track("edition_completed", at, { day: EDITIONS[day].isoDate, score: next.days[day].results.filter((x) => x?.correct).length });
      track(day === f.today ? "clue_unlocked" : "clue_recovered", at, { clue_index: day + 1, clues_total: cluesCollected(next) });
      setS((p) => ({ ...p, filo: next, screen: "done" }));
    } else setFilo(next);
  };

  const openFromPush = () => {
    track("reactivation_opened", "Ven 08:13", { rule: "R2", channel: "push", latency_min: 1 });
    track("return_visit", "Ven 08:13", { days_since_last: 2, source: "push" });
    setS((p) => ({ ...p, step: 5, screen: "home" }));
  };

  const toSunday = () => {
    track("return_visit", "Dom 10:15", { days_since_last: 2, source: "email_sabato" });
    setS((p) => ({ ...p, filo: advanceDay(p.filo, 6 - p.filo.today), screen: "nodo" }));
  };

  const reset = () => {
    resetState();
    resetEvents();
  };

  const sfida = [
    { name: "Marco", points: 13 },
    { name: "Anna", points: 9 },
    { name: "Luca", points: 6 },
    { name: "Giulia (tu)", points: 0, you: true },
  ].map((p) => (p.you ? { ...p, points: weeklyPoints(f) } : p));

  const msg = reactivationMessage({ ...f, today: Math.max(4, f.today) });
  const fridayDone = isComplete(f, 4);

  const steps: Step[] = [
    {
      title: "Il punto di partenza",
      body: (
        <>
          <p>
            <strong className="text-ink">Giulia, 46 anni, Bergamo.</strong> Abbonata digitale al Corriere, registrata a Giochi. Negli ultimi
            30 giorni ha giocato 6 giorni: 1,4 a settimana, quasi sempre la domenica. È esattamente il target del Case 1.
          </p>
          <PersonaPanel />
          <p>
            Nel telefono vedi ciò che trova oggi: un catalogo di otto giochi ben fatti. Ma niente le dice <em>cosa</em> fare oggi, né le
            lascia un motivo per tornare domani.
          </p>
        </>
      ),
      lever: "Nessuna: è la situazione attuale",
      metric: "Baseline: 1,4 giorni di gioco a settimana",
    },
    {
      title: "Un appuntamento, non un catalogo",
      body: (
        <>
          <p>
            Mercoledì Giulia apre Giochi da un articolo. In cima non trova più otto scelte equivalenti, ma{" "}
            <strong className="text-ink">l&apos;Edizione di oggi</strong>: tre giochi brevi, circa tre minuti, che le danno un indizio.
          </p>
          <p>
            Sotto c&apos;è <strong className="text-ink">il Filo della settimana</strong>. Lunedì e martedì non ha giocato, ma i due indizi non
            sono persi: si possono ancora recuperare.
          </p>
        </>
      ),
      lever: "Home con l'Edizione del giorno e il Filo della settimana",
      metric: "Sessioni che iniziano un'Edizione; tempo al primo gioco",
    },
    {
      title: "Gioca l'Edizione di mercoledì",
      body: (
        <>
          <p>Prova davvero, nel telefono a destra. Sono tre formati brevi: due vengono da giochi che esistono già (Quiz e Prima o Dopo), il terzo è un anagramma.</p>
          <p>
            L&apos;indizio si ottiene <strong className="text-ink">completando</strong> l&apos;Edizione, non indovinando tutto. Per un pubblico adulto
            che gioca poco, la paura di sbagliare è un attrito vero.
          </p>
        </>
      ),
      lever: "Edizione: percorso curato di 3 micro-giochi legati al giornale del giorno",
      metric: "Tasso di completamento dell'Edizione; durata mediana (obiettivo ≤ 4 min)",
    },
    {
      title: "Il motivo per tornare domani",
      body: (
        <>
          <p>
            Ogni indizio avvicina alla soluzione di domenica: il Filo dà <strong className="text-ink">un motivo per tornare che dura sei giorni</strong>,
            non uno che si esaurisce a fine partita.
          </p>
          <p>
            Un giorno perso si recupera, con meno punti. Saltare quindi non azzera nulla: la streak attuale resta com&apos;è, il Filo aggiunge
            un traguardo settimanale che si può sempre raggiungere. Le Sfide con gli amici, che già esistono, diventano settimanali.
          </p>
          <p className="text-sm">Prova: tocca il cerchio tratteggiato di lunedì per recuperarlo.</p>
        </>
      ),
      lever: "Indizi recuperabili, Nodo della domenica, classifica settimanale delle Sfide",
      metric: "Giorni di gioco a settimana; quota di utenti con ≥4 giorni su 7",
    },
    {
      title: "Giovedì salta. Venerdì la riattiviamo",
      body: (
        <>
          <p>
            Giovedì Giulia non apre Giochi. Venerdì alle 8:12, l&apos;orario in cui di solito legge il Corriere, riceve un messaggio che parla del
            suo progresso, senza farla sentire in colpa. Tocca la notifica nel telefono.
          </p>
          {msg && (
            <p className="rounded-lg bg-paper-2 px-3 py-2 font-mono text-xs text-ink-2">
              Regola applicata: {msg.rule}
            </p>
          )}
          <ChannelPlan />
        </>
      ),
      lever: "Lifecycle basato sul progresso: push opt-in, card nell'app News, email del sabato",
      metric: "Rientro entro 24 ore dal messaggio, rispetto all'holdout; tasso di disiscrizione",
    },
    {
      title: "Il giorno dopo, e la domenica",
      body: (
        <>
          <p>
            Venerdì Giulia gioca l&apos;Edizione e, se vuole, recupera l&apos;indizio di giovedì. Domenica scioglie il Nodo: la risposta lega i sei
            indizi della settimana.
          </p>
          {!fridayDone && f.today < 6 && <p className="text-sm text-muted">Gioca l&apos;Edizione di venerdì nel telefono, poi vai a domenica.</p>}
          <Button variant={fridayDone ? "primary" : "secondary"} onClick={toSunday} disabled={f.today === 6}>
            {f.today === 6 ? "Sei a domenica" : "Vai a domenica"}
          </Button>
          <div className="rounded-xl bg-card p-4 ring-1 ring-rule">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">La settimana di Giulia nella demo</p>
            <div className="mt-2">
              <WeekRhythm state={f} />
            </div>
            <p className="mt-2 text-sm text-ink-2">
              Giorni con almeno un&apos;Edizione: <strong className="text-ink tabular">{playDays(f)}</strong>, contro 1,4 di partenza. Una persona
              in una demo non è un risultato: il test R1 serve a misurare l&apos;effetto medio sul target.
            </p>
          </div>
        </>
      ),
      lever: "Nodo della domenica e un nuovo Filo il lunedì",
      metric: "Settimane consecutive con ≥4 giorni; risoluzione del Nodo",
    },
  ];

  const screen = !hydrated ? null : (
    <>
      {s.screen === "hub" && <CurrentHub />}
      {s.screen === "home" && (
        <FiloHome
          state={f}
          name="Giulia"
          onPlay={play}
          onNodo={() => setS((p) => ({ ...p, screen: "nodo" }))}
          sfida={s.step >= 3 ? sfida : undefined}
          notice={
            s.step === 5 && f.today === 4 && !fridayDone ? (
              <p className="rounded-xl bg-azure-soft px-4 py-3 text-sm text-navy">Ieri ti sei persa l&apos;indizio di giovedì. Puoi ancora recuperarlo.</p>
            ) : undefined
          }
        />
      )}
      {s.screen === "play" && s.playDay !== null && (
        <PlayScreen onBack={() => setS((p) => ({ ...p, screen: "home" }))}>
          <EditionPlayer edition={EDITIONS[s.playDay]} state={f} onResult={onResult} isRecovery={s.recovering} />
        </PlayScreen>
      )}
      {s.screen === "done" && s.playDay !== null && (
        <PlayScreen onBack={() => setS((p) => ({ ...p, screen: "home" }))}>
          <EditionDone
            cta="Torna al Filo"
            onContinue={() => setS((p) => ({ ...p, screen: "home", step: p.step <= 2 && isComplete(p.filo, 2) ? 3 : p.step }))}
          >
            <ClueReveal edition={EDITIONS[s.playDay]} state={f} recovered={s.recovering} />
          </EditionDone>
        </PlayScreen>
      )}
      {s.screen === "lock" && msg && (
        <LockScreen
          time="08:12"
          date="Venerdì 4 dicembre"
          notifications={[{ app: "Corriere Giochi", title: msg.title, body: msg.body, onOpen: openFromPush }]}
        />
      )}
      {s.screen === "nodo" && (
        <PlayScreen onBack={() => setS((p) => ({ ...p, screen: "home" }))}>
          <NodoCard
            state={f}
            setState={setFilo}
            onAttempt={(ok, g) => {
              track("nodo_attempted", "Dom 10:16", { clues: cluesCollected(f), guess_len: g.length });
              if (ok) track("nodo_solved", "Dom 10:16", { clues: cluesCollected(f), attempts: f.nodo.guesses.length + 1 });
            }}
          />
        </PlayScreen>
      )}
    </>
  );

  return (
    <ExperienceShell
      kicker="Prototipo · Esperienza A · Retention"
      title="Da 1,4 giorni a settimana a un appuntamento"
      intro={<p>Una giocatrice occasionale, una settimana simulata. Tutto ciò che vedi nel telefono è giocabile; lo stato si salva in questo browser.</p>}
      steps={steps}
      step={s.step}
      onStep={goStep}
      onReset={reset}
      nextDisabled={s.step === 2 && !isComplete(f, 2)}
      nextHint="Completa l'Edizione di mercoledì nel telefono per proseguire."
      below={<EventLog events={events} />}
    >
      <PhoneFrame time={s.screen === "lock" ? "" : TIMES[f.today]}>{screen}</PhoneFrame>
    </ExperienceShell>
  );
}

function playDays(f: FiloState) {
  const days = new Set<number>();
  for (const r of Object.values(f.days)) if (r.completedOn != null) days.add(r.completedOn);
  if (f.nodo.solvedOn != null) days.add(f.nodo.solvedOn);
  return days.size;
}

function PersonaPanel() {
  const max = Math.max(...SOURCES.map((x) => x.n));
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-rule">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Ultimi 30 giorni</p>
        <SimTag>Persona illustrativa</SimTag>
      </div>
      <div className="mt-3 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1" role="img" aria-label="6 giorni di gioco su 30">
        {ACTIVITY.map((a, i) => (
          <span key={i} className={clsx("aspect-square rounded-[3px]", a ? "bg-navy" : "bg-paper-2")} />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">6 giorni di gioco su 30 · Quiz e Prima o Dopo · 4 domeniche su 6</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Da dove arriva</p>
      <ul className="mt-2 space-y-1.5">
        {SOURCES.map((x) => (
          <li key={x.label} className="grid grid-cols-[150px_1fr_20px] items-center gap-2 text-xs">
            <span className="text-ink-2">{x.label}</span>
            <span className="h-2 rounded-full bg-paper-2">
              <span className="block h-2 rounded-full bg-azure" style={{ width: `${(x.n / max) * 100}%` }} />
            </span>
            <span className="text-right font-semibold tabular text-ink">{x.n}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-ink-2">
        Corrisponde alle ipotesi H1 (nessun appuntamento: arriva per caso, da un articolo) e H2 (nessun motivo per tornare domani).
      </p>
    </div>
  );
}

function ChannelPlan() {
  const rows = [
    ["Push app Giochi", "Ven 08:12", "Indizio recuperabile + nuovo indizio", "Solo opt-in, max 1 al giorno"],
    ["Card nell'app News", "Alla prima lettura", "«Hai un indizio in sospeso»", "Nessun invio: appare se legge"],
    ["Email del sabato", "Sab 09:00", "Riepilogo del Filo e anteprima del Nodo", "1 a settimana, disiscrizione in un clic"],
  ];
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-rule">
      <table className="w-full min-w-[480px] bg-card text-left text-xs">
        <thead className="bg-paper-2 text-[0.68rem] uppercase tracking-wider text-muted">
          <tr>
            <th className="px-3 py-2 font-semibold">Canale</th>
            <th className="px-3 py-2 font-semibold">Quando</th>
            <th className="px-3 py-2 font-semibold">Messaggio</th>
            <th className="px-3 py-2 font-semibold">Limite</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-rule align-top">
              {r.map((c, i) => (
                <td key={i} className={clsx("px-3 py-2", i === 0 ? "font-semibold text-ink" : "text-ink-2")}>
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


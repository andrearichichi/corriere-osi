"use client";
import clsx from "clsx";
import { EDITIONS } from "@/data/week";
import { cluesCollected, initialState, isComplete, recordResult, recoverable, type FiloState, type GameResult } from "@/lib/filo";
import { useStoredState } from "@/lib/store";
import { useEventLog } from "@/lib/useEvents";
import { ClueReveal, EditionPlayer, FiloBoard } from "@/components/filo/Filo";
import { AppHeader, PlayScreen } from "@/components/prototype/GiochiApp";
import { EventLog, ExperienceShell, PhoneFrame, type Step } from "@/components/prototype/Shell";
import { Arrow, Button, Check, SimTag } from "@/components/ui";

type Who = "paolo" | "chiara";
type PScreen = "done" | "share" | "sent";
type CScreen = "idle" | "chat" | "landing" | "play" | "result" | "joined" | "play2" | "returned";
type RS = {
  step: number;
  view: Who;
  paolo: FiloState;
  pScreen: PScreen;
  channel: string | null;
  chiara: FiloState;
  cScreen: CScreen;
  registered: boolean;
  rewarded: boolean;
};

const INVITE = "PB7K2";
const LINK = `corriere.it/giochi/filo?inv=${INVITE}&s=sfida-famiglia`;
const THU = EDITIONS[3];

const START: RS = {
  step: 0,
  view: "paolo",
  paolo: initialState(3, { 0: 0, 1: 1, 2: 2, 3: 3 }),
  pScreen: "done",
  channel: null,
  chiara: initialState(3),
  cScreen: "idle",
  registered: false,
  rewarded: false,
};

export default function ReferralPage() {
  const [s, setS, resetState, hydrated] = useStoredState<RS>("proto:referral:v1", START);
  const { events, track, reset: resetEvents } = useEventLog("referral");
  const c = s.chiara;
  const has = (n: string) => events.some((e) => e.name === n);

  const goStep = (n: number) => {
    setS((p) => {
      const view: Who = n <= 1 ? "paolo" : "chiara";
      let pScreen = p.pScreen;
      let cScreen = p.cScreen;
      if (n === 0) pScreen = "done";
      if (n === 1) pScreen = p.channel ? "sent" : "share";
      if (n === 2 && (cScreen === "idle" || cScreen === "chat")) cScreen = "chat";
      if (n === 3 && ["idle", "chat", "landing"].includes(cScreen)) cScreen = isComplete(p.chiara, 3) ? "result" : "play";
      return { ...p, step: n, view, pScreen, cScreen };
    });
    if (n === 1 && !has("invite_link_created")) track("invite_link_created", "Gio 08:31", { inviter: "u_paolo", invite_id: INVITE, context: "post_edition", sfida: "famiglia" });
  };

  const share = (channel: string) => {
    setS((p) => ({ ...p, channel, pScreen: "sent" }));
    track("invite_shared", "Gio 08:32", { invite_id: INVITE, channel, card: "spoiler_free" });
  };

  const openLink = () => {
    setS((p) => ({ ...p, cScreen: "landing" }));
    if (!has("referral_landing_view"))
      track("referral_landing_view", "Gio 12:47", { invite_id: INVITE, utm_source: s.channel ?? "whatsapp", utm_medium: "referral", known_device: false, has_account: false });
  };

  const startPlay = () => {
    setS((p) => ({ ...p, cScreen: "play" }));
    track("edition_started", "Gio 12:48", { day: THU.isoDate, entry: "referral_landing", guest: true, invite_id: INVITE });
  };

  const onResult = (day: number) => (gi: number, r: GameResult) => {
    const next = recordResult(c, day, gi, r);
    const at = day === 3 ? "Gio 12:50" : "Ven 08:05";
    track("game_completed", at, { day: EDITIONS[day].isoDate, game: ["quiz", "prima_o_dopo", "anagramma"][gi], correct: r.correct });
    if (isComplete(next, day) && !isComplete(c, day)) {
      track("edition_completed", at, { day: EDITIONS[day].isoDate, invite_id: INVITE, nth_day: day === 3 ? 1 : 2 });
      if (day === 4) {
        track("clue_unlocked", at, { clue_index: 5, clues_total: cluesCollected(next) });
        setS((p) => ({ ...p, chiara: next, cScreen: "returned", rewarded: true }));
        return;
      }
      setS((p) => ({ ...p, chiara: next, cScreen: "result" }));
    } else setS((p) => ({ ...p, chiara: next }));
  };

  const join = () => {
    setS((p) => ({ ...p, registered: true, cScreen: "joined" }));
    track("registration_completed", "Gio 12:52", { source: "referral", invite_id: INVITE, attributed_to: "u_paolo", window: "7d_click" });
    track("sfida_joined", "Gio 12:52", { sfida: "famiglia", invite_id: INVITE });
  };

  const tomorrow = () => {
    setS((p) => ({ ...p, chiara: { ...p.chiara, today: 4 }, cScreen: "play2", view: "chiara" }));
    track("return_visit", "Ven 08:04", { days_since_first: 1, source: "push_opt_in", attributed_invite: INVITE });
    track("edition_started", "Ven 08:04", { day: EDITIONS[4].isoDate, entry: "push", guest: false });
  };

  const reset = () => {
    resetState();
    resetEvents();
  };

  const count = (n: string) => events.filter((e) => e.name === n).length;
  const funnel = [
    { label: "Inviti condivisi", v: count("invite_shared") },
    { label: "Landing aperte", v: count("referral_landing_view") },
    { label: "Prima Edizione completata", v: events.some((e) => e.name === "edition_completed" && e.props.nth_day === 1) ? 1 : 0 },
    { label: "Registrazione attribuita", v: count("registration_completed") },
    { label: "Ritorno il giorno dopo", v: count("return_visit") },
  ];

  const steps: Step[] = [
    {
      title: "L'entry point: subito dopo aver giocato",
      body: (
        <>
          <p>
            <strong className="text-ink">Paolo, 52 anni, Milano.</strong> Gioca cinque giorni su sette ed è nella Sfida «Famiglia», che esiste già oggi.
            Ha appena finito l&apos;Edizione di giovedì.
          </p>
          <p>
            L&apos;invito compare qui, nel momento di massima soddisfazione, e riguarda una cosa precisa: «fai anche tu l&apos;Edizione di oggi». Non è un
            invito generico all&apos;app.
          </p>
        </>
      ),
      lever: "Invito contestuale a fine Edizione (evoluzione delle Sfide esistenti)",
      metric: "Inviti per giocatore abituale al mese",
    },
    {
      title: "L'invito: senza spoiler, fatto per WhatsApp",
      body: (
        <>
          <p>
            La card mostra il risultato di Paolo senza rivelare le risposte, e il link porta con sé un codice d&apos;invito. Scegli un canale nel telefono.
          </p>
          <p>
            Il link non chiede di registrarsi, a differenza della Sfida attuale («Registrati per sfidare i tuoi amici»). È questa la modifica che testiamo.
          </p>
        </>
      ),
      lever: "Card condivisibile senza spoiler + link con codice d'invito",
      metric: "Tasso di condivisione: inviti condivisi / link creati",
    },
    {
      title: "La landing di chi riceve",
      body: (
        <>
          <p>
            <strong className="text-ink">Chiara, 38 anni, Torino.</strong> Legge il Corriere ogni tanto e non ha mai giocato. Apre il messaggio di Paolo.
          </p>
          <p>
            La landing ha un solo obiettivo: farla giocare entro dieci secondi. Il risultato di Paolo resta nascosto finché non ha giocato anche lei:
            prima si gioca, poi ci si confronta.
          </p>
        </>
      ),
      lever: "Landing «gioca prima, registrati dopo»",
      metric: "Landing → Edizione iniziata",
    },
    {
      title: "La prima esperienza, e il confronto",
      body: (
        <>
          <p>
            Chiara gioca l&apos;Edizione di giovedì come ospite. Poi vede il confronto con Paolo e il primo indizio. Per entrare nella Sfida, e per
            recuperare i tre indizi persi della settimana, serve un account: ora ha un motivo per crearlo.
          </p>
        </>
      ),
      lever: "Confronto dopo il gioco; l'account sblocca la Sfida e il recupero",
      metric: "Registrazioni attribuite / landing",
    },
    {
      title: "Come misuriamo l'acquisizione",
      body: (
        <>
          <p>L&apos;attribuzione dice da dove arriva un giocatore. Non dice se sarebbe arrivato comunque: per questo serve l&apos;esperimento.</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[0.95rem]">
            <li>
              <strong className="text-ink">Attribuzione</strong>: codice d&apos;invito nel link, finestra di 7 giorni dal clic, solo per chi non ha
              storico di gioco né account Giochi.
            </li>
            <li>
              <strong className="text-ink">Qualità</strong>: il premio all&apos;invitante (un indizio jolly, nessun valore economico) scatta solo quando
              l&apos;invitato completa Edizioni in due giorni diversi.
            </li>
            <li>
              <strong className="text-ink">Incrementalità</strong>: test A3, randomizzato per invitante. Metà vede il nuovo flusso, metà la Sfida
              attuale. La metrica primaria è il numero di nuovi giocatori attivi a 7 giorni per invitante.
            </li>
          </ul>
          <Button onClick={tomorrow} disabled={!s.registered || s.cScreen === "play2" || s.rewarded} variant={s.registered ? "primary" : "secondary"}>
            Venerdì: Chiara torna
          </Button>
          {!s.registered && <p className="text-sm text-muted">Fai entrare Chiara nella Sfida (passo 4) per simulare il ritorno.</p>}
          <FunnelMini rows={funnel} rewarded={s.rewarded} />
        </>
      ),
      lever: "Attribuzione + test randomizzato per invitante",
      metric: "Nuovi giocatori attivi a 7 giorni per invitante (incrementale)",
    },
  ];

  const paoloScreen = (
    <>
      {s.pScreen === "done" && (
        <PlayScreen>
          <div className="space-y-6">
            <ClueReveal edition={THU} state={s.paolo} />
            <div className="rounded-2xl bg-card p-4 ring-1 ring-rule">
              <FiloBoard state={s.paolo} compact />
            </div>
            <div className="rounded-2xl bg-azure-soft p-4">
              <p className="font-serif text-lg font-semibold text-navy">Chi sfidi oggi?</p>
              <p className="mt-1 text-sm text-ink-2">Mandagli l&apos;Edizione di giovedì. Può giocarla subito, senza registrarsi.</p>
              <Button className="mt-3 w-full" onClick={() => goStep(1)}>
                Sfida qualcuno <Arrow />
              </Button>
            </div>
          </div>
        </PlayScreen>
      )}
      {(s.pScreen === "share" || s.pScreen === "sent") && (
        <div>
          <AppHeader />
          <div className="space-y-5 px-5 py-5">
            <ShareCard />
            <div className="rounded-xl bg-paper-2 px-3 py-2.5 font-mono text-[0.72rem] text-ink-2 break-all">{LINK}</div>
            {s.pScreen === "share" ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Condividi con</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {["WhatsApp", "Email", "Copia link"].map((ch) => (
                    <button key={ch} onClick={() => share(ch.toLowerCase().replace(" ", "_"))} className="h-12 rounded-xl bg-card text-sm font-semibold text-navy ring-1 ring-rule hover:ring-navy/40">
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-ok-soft p-4 text-sm text-ok" aria-live="polite">
                <p className="flex items-center gap-2 font-semibold">
                  <Check /> Inviato a Chiara
                </p>
                {s.rewarded ? (
                  <p className="mt-1">Chiara ha giocato due giorni: hai ricevuto un indizio jolly.</p>
                ) : (
                  <p className="mt-1">Quando Chiara avrà giocato due giorni, riceverai un indizio jolly.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  const chiaraScreen = (
    <>
      {s.cScreen === "idle" && <div className="grid min-h-[600px] place-items-center px-8 text-center text-sm text-muted">Chiara non ha ancora ricevuto l&apos;invito.</div>}
      {s.cScreen === "chat" && <ChatScreen onOpen={openLink} channel={s.channel} />}
      {s.cScreen === "landing" && <Landing onPlay={startPlay} />}
      {s.cScreen === "play" && (
        <PlayScreen onBack={() => setS((p) => ({ ...p, cScreen: "landing" }))} backLabel="Indietro">
          <div className="mb-4 rounded-xl bg-azure-soft px-4 py-2.5 text-[0.8rem] text-navy">L&apos;Edizione di Paolo. Stai giocando da ospite.</div>
          <EditionPlayer edition={THU} state={c} onResult={onResult(3)} />
        </PlayScreen>
      )}
      {s.cScreen === "result" && <ResultScreen chiara={c} onJoin={join} />}
      {s.cScreen === "joined" && <Joined chiara={c} />}
      {s.cScreen === "play2" && (
        <PlayScreen>
          <EditionPlayer edition={EDITIONS[4]} state={c} onResult={onResult(4)} />
        </PlayScreen>
      )}
      {s.cScreen === "returned" && (
        <PlayScreen>
          <div className="space-y-6">
            <ClueReveal edition={EDITIONS[4]} state={c} />
            <p className="rounded-xl bg-ok-soft p-4 text-sm text-ok">Secondo giorno di gioco. Per l&apos;attribuzione Chiara è ora una «nuova giocatrice attiva».</p>
          </div>
        </PlayScreen>
      )}
    </>
  );

  return (
    <ExperienceShell
      kicker="Prototipo · Esperienza C · Referral"
      title="Un invito che si gioca subito"
      intro={<p>Un giocatore abituale invita un&apos;amica. Le Sfide tra amici esistono già: qui cambiamo il momento dell&apos;invito, la landing e la misurazione.</p>}
      steps={steps}
      step={s.step}
      onStep={goStep}
      onReset={reset}
      nextDisabled={(s.step === 1 && !s.channel) || (s.step === 2 && s.cScreen === "chat") || (s.step === 3 && !s.registered)}
      nextHint={
        s.step === 1 ? "Scegli un canale di condivisione nel telefono di Paolo." : s.step === 2 ? "Apri il link nel telefono di Chiara." : "Fai giocare Chiara e falla entrare nella Sfida."
      }
      below={<EventLog events={events} />}
    >
      <div className="mx-auto mb-4 flex w-full max-w-[400px] rounded-full bg-paper-2 p-1" role="tablist" aria-label="Telefono">
        {(["paolo", "chiara"] as const).map((w) => (
          <button
            key={w}
            role="tab"
            aria-selected={s.view === w}
            onClick={() => setS((p) => ({ ...p, view: w }))}
            className={clsx("h-9 flex-1 rounded-full text-sm font-semibold transition-colors", s.view === w ? "bg-white text-navy shadow-sm" : "text-muted")}
          >
            {w === "paolo" ? "Paolo · invita" : "Chiara · invitata"}
          </button>
        ))}
      </div>
      <PhoneFrame time={s.view === "paolo" ? "08:31" : s.cScreen === "play2" || s.cScreen === "returned" ? "08:05" : "12:47"}>
        {hydrated ? (s.view === "paolo" ? paoloScreen : chiaraScreen) : null}
      </PhoneFrame>
    </ExperienceShell>
  );
}

function ShareCard() {
  return (
    <div className="rounded-2xl bg-navy p-5 text-white">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/70">Il Filo · Giovedì 3 dicembre</p>
      <div className="mt-3 flex gap-1.5" aria-label="4 indizi su 6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={clsx("h-3 w-3 rounded-full", i < 4 ? "bg-azure" : "bg-white/20")} />
        ))}
      </div>
      <p className="mt-3 font-serif text-lg font-semibold leading-snug">Ho fatto l&apos;Edizione di oggi: 3 su 3. Tocca a te.</p>
      <p className="mt-1 text-sm text-white/70">Tre minuti, niente registrazione. Nessuna risposta svelata.</p>
    </div>
  );
}

function ChatScreen({ onOpen, channel }: { onOpen: () => void; channel: string | null }) {
  return (
    <div className="min-h-[640px] bg-[#ece5dc]">
      <div className="flex h-12 items-center border-b border-black/5 bg-white/90 px-5 text-sm font-semibold text-ink">
        Paolo <span className="ml-2 text-xs font-normal text-muted">via {channel === "email" ? "email" : "messaggi"}</span>
      </div>
      <div className="space-y-2 px-4 py-5">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-3 text-[0.9rem] shadow-sm">
          <ShareCard />
          <button onClick={onOpen} className="mt-2 block w-full break-all text-left font-mono text-[0.72rem] text-azure-ink underline">
            {LINK}
          </button>
          <p className="mt-1 text-right text-[0.65rem] text-muted">08:32</p>
        </div>
        <p className="pt-2 text-center text-xs text-muted">Tocca il link per aprirlo</p>
      </div>
    </div>
  );
}

function Landing({ onPlay }: { onPlay: () => void }) {
  return (
    <div>
      <AppHeader />
      <div className="px-5 py-8">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-azure-ink">Un invito di Paolo</p>
        <h2 className="mt-3 font-serif text-[1.8rem] font-semibold leading-tight text-ink">Paolo ti sfida sull&apos;Edizione di oggi.</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">Tre giochi brevi sulle notizie e sulla storia. Circa tre minuti. Il suo risultato lo vedi dopo aver giocato.</p>
        <Button size="lg" className="mt-6 w-full" onClick={onPlay}>
          Gioca subito <Arrow />
        </Button>
        <p className="mt-2 text-center text-xs text-muted">Senza registrazione</p>
        <div className="mt-8 border-t border-rule pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Cos&apos;è il Filo</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">Ogni giorno un&apos;Edizione ti dà un indizio. La domenica li leghi tutti e sciogli il Nodo della settimana.</p>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ chiara, onJoin }: { chiara: FiloState; onJoin: () => void }) {
  const score = chiara.days[3]?.results.filter((r) => r?.correct).length ?? 0;
  const missed = recoverable(chiara).length;
  return (
    <div>
      <AppHeader />
      <div className="space-y-6 px-5 py-6">
        <ClueReveal edition={THU} state={chiara} />
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-azure-soft p-3">
            <p className="text-xs font-semibold text-muted">Tu</p>
            <p className="font-serif text-2xl font-semibold text-navy tabular">{score}/3</p>
          </div>
          <div className="rounded-xl bg-card p-3 ring-1 ring-rule">
            <p className="text-xs font-semibold text-muted">Paolo</p>
            <p className="font-serif text-2xl font-semibold text-ink tabular">3/3</p>
          </div>
        </div>
        <div className="rounded-2xl bg-navy p-5 text-white">
          <p className="font-serif text-lg font-semibold">Entra nella Sfida di Paolo</p>
          <p className="mt-1 text-sm text-white/75">Classifica settimanale con la sua famiglia. E puoi recuperare i {missed} indizi che ti mancano di questa settimana.</p>
          <Button variant="light" className="mt-4 w-full" onClick={onJoin}>
            Crea un account gratuito (simulato)
          </Button>
        </div>
      </div>
    </div>
  );
}

function Joined({ chiara }: { chiara: FiloState }) {
  return (
    <div>
      <AppHeader />
      <div className="space-y-5 px-5 py-6">
        <p className="rounded-xl bg-ok-soft p-4 text-sm text-ok">Sei nella Sfida «Famiglia». Domani alle 8 ti avvisiamo dell&apos;indizio, se lo vuoi.</p>
        <div className="rounded-2xl bg-card p-4 ring-1 ring-rule">
          <FiloBoard state={chiara} />
        </div>
        <div className="rounded-2xl bg-card p-4 ring-1 ring-rule">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy">Sfida Famiglia · settimana</p>
            <SimTag />
          </div>
          <ol className="mt-3 space-y-1.5 text-sm">
            {[
              ["Paolo", 8],
              ["Elena", 6],
              ["Chiara (tu)", 2],
            ].map(([n, p], i) => (
              <li key={n as string} className={clsx("flex gap-3 rounded-lg px-2 py-1.5", i === 2 && "bg-azure-soft font-semibold text-navy")}>
                <span className="w-4 text-xs text-muted">{i + 1}</span>
                <span className="flex-1">{n}</span>
                <span className="tabular">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function FunnelMini({ rows, rewarded }: { rows: { label: string; v: number }[]; rewarded: boolean }) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-rule">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Funnel di questa demo (n = 1)</p>
      <ol className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-3 text-sm">
            <span className={clsx("grid h-5 w-5 place-items-center rounded-full", r.v ? "bg-navy text-white" : "bg-paper-2 text-muted")}>
              {r.v ? <Check className="h-3 w-3" /> : null}
            </span>
            <span className={r.v ? "text-ink" : "text-muted"}>{r.label}</span>
          </li>
        ))}
        <li className="flex items-center gap-3 text-sm">
          <span className={clsx("grid h-5 w-5 place-items-center rounded-full", rewarded ? "bg-ok text-white" : "bg-paper-2")}>{rewarded ? <Check className="h-3 w-3" /> : null}</span>
          <span className={rewarded ? "text-ink" : "text-muted"}>Premio all&apos;invitante (2 giorni di gioco)</span>
        </li>
      </ol>
      <p className="mt-3 text-xs text-muted">Nel Growth Lab lo stesso funnel è modellato su scala, con le ipotesi esplicite.</p>
    </div>
  );
}

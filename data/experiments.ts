/** Piano degli esperimenti. Fonte unica per Growth Lab, presentazione e docs/EXPERIMENTS.md. */

export type Experiment = {
  id: "R1" | "R2" | "A1" | "A2" | "A3";
  case: "Retention" | "Acquisizione";
  name: string;
  hypothesis: string;
  control: string;
  treatment: string;
  population: string;
  unit: string;
  primary: string;
  secondary: string;
  guardrails: string;
  decision: string;
  limits: string;
  /** Parametri del simulatore: baseline e effetto relativo IPOTIZZATI (non dati reali). */
  sim: { p0: number; lift: number; n: number; metricShort: string };
};

export const EXPERIMENTS: Experiment[] = [
  {
    id: "R1",
    case: "Retention",
    name: "Il Filo contro l'esperienza attuale",
    hypothesis:
      "Se la home Giochi propone l'Edizione del giorno e il Filo della settimana, più giocatori occasionali diventano abituali, perché ogni giorno ha un compito chiaro e un motivo per tornare l'indomani.",
    control: "Home Giochi attuale: catalogo, statistiche, Sfide e classifiche.",
    treatment: "Home con Edizione e Filo in testa; catalogo invariato sotto. Nessun messaggio di lifecycle aggiuntivo, per isolare l'effetto del prodotto.",
    population: "Utenti registrati, abbonati e non, con ≥1 giorno di gioco negli ultimi 30 e <3 giorni a settimana nelle 4 settimane precedenti. Web e app. Esclusi gli account interni.",
    unit: "Utente (ID account), assegnato con hash stabile: stessa esperienza su tutti i dispositivi.",
    primary: "Quota di utenti abituali (≥4 giorni di gioco su 7) nelle settimane 3–6 dall'assegnazione, intention-to-treat.",
    secondary: "Giorni di gioco medi a settimana; ritorno D1; completamento dell'Edizione; risoluzione del Nodo.",
    guardrails: "Tempo sui giochi lunghi (cruciverba, sudoku): calo massimo −5%. Recensioni e segnalazioni sui progressi. Disiscrizioni. Churn degli abbonati, misurato sull'holdout.",
    decision:
      "Rilascio se il limite inferiore dell'IC 95% della differenza è > 0, l'effetto stimato raggiunge l'MDE pre-registrato e nessun guardrail supera la soglia. Holdout del 10% mantenuto per 6 mesi.",
    limits:
      "Effetto novità: per questo si escludono le settimane 1–2. Contaminazione tramite le Sfide, perché amici in bracci diversi si vedono: la stima risulta conservativa. L'ITT diluisce l'effetto su chi non apre Giochi.",
    sim: { p0: 0.08, lift: 0.25, n: 20000, metricShort: "Quota abituali, sett. 3–6" },
  },
  {
    id: "R2",
    case: "Retention",
    name: "Riattivazione basata sul progresso",
    hypothesis:
      "Un messaggio che nomina l'indizio recuperabile, inviato all'orario in cui l'utente di solito gioca o legge, fa rientrare più utenti di un promemoria generico, senza aumentare le disiscrizioni.",
    control: "B: promemoria generico all'orario standard. È presente anche un braccio A di holdout (10%) che non riceve nulla.",
    treatment: "C: messaggio di progresso («l'indizio di giovedì ti aspetta») all'orario personale, al massimo uno al giorno.",
    population: "Utenti del braccio Filo con consenso a push o email che hanno saltato ≥1 giorno nella settimana.",
    unit: "Utente.",
    primary: "Rientro con un'Edizione completata entro 24 ore dall'invio, intention-to-treat (chi non apre incluso). Confronto principale C contro B.",
    secondary: "Giorni di gioco nei 7 giorni successivi, per distinguere un ritorno anticipato da un ritorno in più; differenza B contro A, cioè il valore del messaggio in sé.",
    guardrails: "Opt-out delle push: massimo +0,5 punti. Disiscrizioni email. Segnalazioni di spam. Pressione complessiva del CRM Corriere.",
    decision: "C sostituisce B se l'IC 95% della differenza è > 0 e gli opt-out restano sotto la soglia. Se B non batte A, il canale va ripensato.",
    limits: "Interferenza con altri invii del Corriere. Una finestra di 24 ore può spostare il ritorno senza aumentarlo: per questo i giorni a 7 giorni sono la metrica secondaria vincolante.",
    sim: { p0: 0.12, lift: 0.2, n: 15000, metricShort: "Rientro entro 24h" },
  },
  {
    id: "A1",
    case: "Acquisizione",
    name: "«Gioca la notizia» contro il promo attuale",
    hypothesis:
      "Una domanda dentro l'articolo, legata a ciò che si sta leggendo, converte più lettori in giocatori di un rimando promozionale, senza ridurre la lettura.",
    control: "Rimando promozionale ai giochi nella stessa posizione dell'articolo.",
    treatment: "Modulo «Gioca la notizia»: domanda con risposta nella pagina e prosecuzione nell'Edizione da ospite.",
    population:
      "Lettori di web e app News su articoli selezionati dalla redazione, senza eventi di gioco negli ultimi 90 giorni. La fascia 35–55 è un segmento pre-registrato, ma l'età è nota solo per i registrati.",
    unit: "Utente: ID account se loggato, altrimenti ID first-party del browser o dell'app. Mai la singola pagina vista, perché la stessa persona vedrebbe entrambi i bracci.",
    primary: "Lettori con ≥1 Edizione completata entro 7 giorni, diviso lettori esposti.",
    secondary: "Ritorno D1 dei nuovi giocatori; registrazioni; tasso di risposta al modulo.",
    guardrails: "Profondità di scroll e completamento della lettura: calo massimo −2%. Tempo sull'articolo. Pagine per sessione. Ricavo pubblicitario per pagina vista. Performance (CLS).",
    decision: "Estensione se la conversione del trattamento supera il controllo con IC 95% > 0 e i guardrail di lettura restano entro −2%.",
    limits:
      "Sul web la cancellazione dei cookie sottostima i ritorni; chi usa più dispositivi non viene ricongiunto. L'effetto per età è osservabile solo sui registrati.",
    sim: { p0: 0.003, lift: 2.33, n: 60000, metricShort: "Lettore → giocatore (7 gg)" },
  },
  {
    id: "A2",
    case: "Acquisizione",
    name: "Prima esperienza: valore prima della richiesta",
    hypothesis:
      "Un primo accesso che offre l'Edizione da ospite, un indizio, la promessa di domani e la scelta del promemoria aumenta il ritorno del giorno dopo rispetto al flusso attuale.",
    control: "Primo gioco attuale: gioco singolo e invito a registrarsi secondo il flusso esistente.",
    treatment: "Edizione da ospite, indizio, richiesta di salvataggio dopo il valore con tre opzioni (account, calendario, nessuna).",
    population: "Nuovi giocatori al primo evento di gioco, da qualsiasi sorgente.",
    unit: "Utente o dispositivo al primo accesso.",
    primary: "Ritorno D1: gioco completato nel giorno di calendario successivo (Europe/Rome).",
    secondary: "Attivazione a 7 giorni (≥2 giorni di gioco nei primi 7); registrazione; consensi a un promemoria.",
    guardrails: "Tasso di registrazione: massimo −10% relativo, un compromesso dichiarato. Completamento del primo gioco.",
    decision: "Rilascio se il D1 migliora con IC 95% > 0 e la registrazione resta entro il guardrail. Conferma richiesta anche sull'attivazione a 7 giorni.",
    limits: "Il D1 degli ospiti dipende dalla persistenza dell'identificativo: lo si misura sugli identificabili e lo si conferma con l'attivazione a 7 giorni.",
    sim: { p0: 0.22, lift: 0.15, n: 12000, metricShort: "Ritorno D1" },
  },
  {
    id: "A3",
    case: "Acquisizione",
    name: "Un invito che si gioca subito",
    hypothesis:
      "Un invito contestuale a fine Edizione, una landing senza registrazione e un premio non monetario all'invitante aumentano i nuovi giocatori attivi portati da ciascun giocatore abituale.",
    control: "Sfida attuale: la registrazione è richiesta prima di giocare.",
    treatment: "Invito a fine Edizione, card senza spoiler, landing «gioca prima», premio (un indizio jolly) dopo due giorni di gioco dell'invitato.",
    population: "Giocatori abituali registrati (≥4 giorni di gioco in ciascuna delle ultime 2 settimane).",
    unit: "Invitante (cluster): tutti i suoi invitati vedono il flusso del suo braccio, così non c'è contaminazione.",
    primary: "Quota di invitanti che portano ≥1 nuovo giocatore attivo (≥2 giorni di gioco nei primi 7) entro 4 settimane.",
    secondary: "Inviti per invitante; landing → Edizione; registrazioni attribuite.",
    guardrails: "Segnalazioni di spam; account multipli o abusi del premio; disiscrizioni degli invitati.",
    decision: "Rilascio se l'IC 95% della differenza è > 0 e gli abusi restano sotto lo 0,5% degli inviti.",
    limits: "Gli invitanti attivi sono pochi, quindi la potenza è limitata: servono più settimane. L'attribuzione non misura chi sarebbe arrivato comunque; la randomizzazione per invitante sì.",
    sim: { p0: 0.04, lift: 0.5, n: 8000, metricShort: "Invitanti con ≥1 nuovo attivo" },
  },
];

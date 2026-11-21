/** Roadmap e matrice impatto/sforzo. Fonte unica per /roadmap, presentazione e docs/ROADMAP.md. */

export type Initiative = { id: string; name: string; impact: number; effort: number; phase: 1 | 2 | 3; note: string };

/** Punteggi 1–5 assegnati dal team (giudizio motivato in docs/ROADMAP.md, non misure). */
export const INITIATIVES: Initiative[] = [
  { id: "I1", name: "Affidabilità di login e progressi", impact: 4, effort: 3, phase: 1, note: "Prerequisito: è il primo tema delle recensioni negative" },
  { id: "I2", name: "Tassonomia eventi e baseline", impact: 4, effort: 2, phase: 1, note: "Senza questa non si verificano H1–H3" },
  { id: "I3", name: "«Gioca la notizia» su un campione di articoli", impact: 5, effort: 2, phase: 1, note: "Test A1 a basso costo" },
  { id: "I4", name: "Filo pilota via email", impact: 3, effort: 1, phase: 1, note: "Wizard of Oz: indizi via email, Nodo via form" },
  { id: "I5", name: "Edizione e Filo nella home Giochi", impact: 5, effort: 4, phase: 2, note: "Test R1, il cuore della proposta" },
  { id: "I6", name: "Lifecycle basato sul progresso", impact: 4, effort: 2, phase: 2, note: "Test R2" },
  { id: "I7", name: "Prima esperienza da ospite", impact: 4, effort: 3, phase: 2, note: "Test A2" },
  { id: "I8", name: "Strumenti redazionali per l'Edizione", impact: 3, effort: 3, phase: 2, note: "Abilitante: template e calendario" },
  { id: "I9", name: "Card del Filo nell'app News", impact: 4, effort: 3, phase: 3, note: "Dipende dal team app News" },
  { id: "I10", name: "Invito che si gioca subito", impact: 3, effort: 3, phase: 3, note: "Test A3" },
  { id: "I11", name: "Sfide con classifica settimanale", impact: 2, effort: 2, phase: 3, note: "Evoluzione delle Sfide esistenti" },
  { id: "I12", name: "Orario di invio personalizzato", impact: 3, effort: 3, phase: 3, note: "Dopo R2" },
  { id: "I13", name: "QR del Filo sul quotidiano cartaceo", impact: 2, effort: 2, phase: 3, note: "Test opzionale" },
];

export type Phase = {
  n: 1 | 2 | 3;
  name: string;
  when: string;
  goal: string;
  deliverables: string[];
  dependencies: string[];
  priority: string;
  teams: string[];
  complexity: "Bassa" | "Media" | "Media-alta";
  kpis: string[];
  gate: string[];
  risks: string[];
};

export const PHASES: Phase[] = [
  {
    n: 1,
    name: "Validate",
    when: "Dicembre 2026 – gennaio 2027 · 6–8 settimane",
    goal: "Verificare le ipotesi più critiche con il minimo investimento, senza ancora costruire il prodotto.",
    deliverables: [
      "Baseline e verifica di H1–H3 con i dati esistenti",
      "Tassonomia degli eventi condivisa tra web, app e fornitore della piattaforma di gioco",
      "Piano di correzione per la perdita di progressi e i problemi di login",
      "«Gioca la notizia» con domanda statica su un campione di articoli (A1 in forma ridotta)",
      "Filo pilota via email per 5–10 mila utenti volontari (indizi via email, Nodo via form)",
    ],
    dependencies: ["Accesso ad analytics, CRM e dati del fornitore", "Un redattore part-time", "Revisione privacy degli invii"],
    priority: "Massima: decide se proseguire",
    teams: ["PM", "Data analyst", "1 sviluppatore front-end", "Redattore part-time", "CRM"],
    complexity: "Bassa",
    kpis: ["Tasso di risposta al modulo e conversione lettore → giocatore", "Indizi raccolti a settimana nel pilota", "Quota di partecipanti con ≥4 giorni di gioco"],
    gate: [
      "Almeno una tra H1 e H2 confermata dai dati",
      "Conversione del modulo ≥ 2× il promo attuale (soglia fissata prima del test)",
      "≥ 30% dei partecipanti al pilota raccoglie ≥ 4 indizi in una settimana",
      "Nessun calo della lettura oltre il 2%",
    ],
    risks: [
      "Dati frammentati tra web, app e fornitore",
      "Il pilota email coinvolge volontari: è un segnale, non una prova causale",
      "Capacità redazionale",
    ],
  },
  {
    n: 2,
    name: "Pilot",
    when: "Febbraio – maggio 2027 · circa 14 settimane",
    goal: "MVP controllato sul 20% del target, con esperimenti randomizzati.",
    deliverables: [
      "Edizione, Filo e Nodo nella home Giochi, web e app (R1)",
      "Regole di lifecycle R1–R3 su push ed email (R2)",
      "Prima esperienza da ospite con salvataggio dopo il valore (A2)",
      "A1 esteso a web e app News",
      "Strumenti redazionali minimi: template delle domande e calendario degli indizi",
    ],
    dependencies: ["Esito positivo della fase Validate", "Roadmap del fornitore della piattaforma", "Team dell'app News", "Opt-in push esistenti"],
    priority: "Alta",
    teams: ["Squad: PM, designer, 3 sviluppatori, QA", "Data analyst", "Redazione: 1 FTE", "CRM"],
    complexity: "Media",
    kpis: ["Metriche primarie di R1, R2, A1, A2", "Guardrail su giochi lunghi, lettura e opt-out", "Ore redazionali al giorno"],
    gate: [
      "R1: limite inferiore dell'IC 95% > 0 ed effetto ≥ MDE",
      "Guardrail entro le soglie",
      "Costo redazionale sotto le 3 ore al giorno a regime",
      "Holdout di lungo periodo avviato",
    ],
    risks: ["Effetto novità", "Cannibalizzazione dei giochi lunghi", "Contaminazione tramite le Sfide", "Dipendenza dal fornitore"],
  },
  {
    n: 3,
    name: "Scale",
    when: "Giugno – dicembre 2027",
    goal: "Estendere solo ciò che ha mostrato effetti incrementali; misurare l'effetto su abbonamenti e churn.",
    deliverables: [
      "Rollout al 100% con holdout del 5–10% per 6 mesi",
      "Card del Filo nell'app News",
      "Invito che si gioca subito (A3)",
      "Sfide con classifica settimanale",
      "Orario di invio personalizzato",
      "Test opzionale del QR sul cartaceo",
      "Lettura dell'holdout: κ e churn",
    ],
    dependencies: ["Risultati del pilot", "Budget", "Integrazione con l'app News"],
    priority: "Condizionata ai risultati",
    teams: ["Squad", "Growth e CRM", "Data", "Redazione"],
    complexity: "Media-alta",
    kpis: ["North Star: giocatori abituali a settimana", "DAU", "Churn e abbonamenti nell'holdout"],
    gate: [
      "L'holdout mostra una riduzione del churn ≥ 1 punto o abbonamenti incrementali: si continua a investire",
      "Altrimenti si mantengono solo le leve con effetto sul DAU e si riducono i costi",
    ],
    risks: ["Affaticamento dopo mesi", "Costi redazionali", "Saturazione delle push"],
  },
];

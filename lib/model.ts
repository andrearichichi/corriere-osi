/**
 * Modello d'impatto parametrico — Il Filo.
 *
 * TUTTI I VALORI DI DEFAULT SONO IPOTESI ILLUSTRATIVE (non dati Corriere).
 * Il modello serve a rendere esplicite le leve e a capire quali ipotesi
 * vanno verificate per prime. Definizioni in docs/METRICS.md, formule in docs/STRATEGY.md §Modello.
 *
 * Vista annua a regime (run-rate). Sviluppo ammortizzato su 3 anni. Unità: utenti, euro.
 */

export type Inputs = {
  // — Retention (Case 1)
  eligible: number; // utenti registrati, ≥1 giorno di gioco negli ultimi 30, <3 giorni/settimana
  exposure: number; // quota esposta al Filo (home Giochi, News app, newsletter)
  adoption: number; // quota degli esposti che gioca almeno una settimana del Filo
  habitBase: number; // prob. che un occasionale diventi abituale (≥4 gg/7) in 12 settimane, senza intervento
  habitLift: number; // incremento ASSOLUTO di quella probabilità tra chi adotta (pp/100)
  extraDays: number; // giorni di gioco/settimana in più tra gli adottanti che NON diventano abituali

  // — Acquisizione (Case 2)
  readers: number; // lettori unici/mese 35–55 mai giocato, sulle pagine con il modulo
  moduleExposure: number; // quota di quei lettori che vede il modulo in un mese
  convControl: number; // lettore esposto → prima Edizione completata, con il promo attuale (controllo)
  convTreatment: number; // stessa conversione con "Gioca la notizia"
  newHabit: number; // quota dei nuovi giocatori che diventa abituale entro 4 settimane

  // — Referral
  invitesPerHabitual: number; // inviti inviati per giocatore abituale al mese
  inviteToPlay: number; // invito → prima Edizione completata
  newShare: number; // quota di invitati davvero nuovi (non già giocatori)
  referralIncrementality: number; // quota che non sarebbe arrivata comunque

  // — Monetizzazione
  existingHabitual: number; // giocatori abituali attuali (base per il referral)
  nonSubShare: number; // quota non abbonata tra i nuovi abituali
  subRateHabitual: number; // tasso annuo di abbonamento dei non abbonati abituali
  subRateOccasional: number; // tasso annuo di abbonamento dei non abbonati occasionali
  causalShare: number; // κ: quota della differenza abituali/occasionali che è causale
  subShare: number; // quota già abbonata tra gli adottanti del Filo
  churnReduction: number; // riduzione CAUSALE del churn annuo tra gli abbonati adottanti (pp/100)
  churnAnnual: number; // churn annuo medio degli abbonati (per l'LTV a 3 anni)
  valuePerSub: number; // ricavo netto annuo per nuovo abbonato Giochi (€)
  valuePerCorriereSub: number; // ricavo netto annuo per abbonato digitale Corriere trattenuto (€)
  adValuePerPlayDay: number; // ricavo pubblicitario per giorno-giocatore (€)
  registrationRate: number; // quota di nuovi giocatori che si registra
  valuePerRegistration: number; // valore annuo di un registrato (dati first-party, adv) (€)

  // — Costi
  buildCost: number; // una tantum (€)
  runCost: number; // annuo: curatela editoriale, CRM, infrastruttura (€)
};

export type Outputs = {
  adopters: number;
  incHabitualRetention: number;
  incPlayDaysRetention: number; // giorni-giocatore incrementali/anno
  incFirstPlays: number;
  incHabitualAcquisition: number;
  referralNewPlayers: number;
  referralHabitual: number;
  incHabitualTotal: number;
  incDAU: number;
  incSubscriptions: number;
  churnAvoided: number;
  incRegistrations: number;
  ltvYears: number;
  subscriptionValue: number;
  retentionValue: number;
  adValue: number;
  registrationValue: number;
  totalValue: number;
  annualCost: number;
  net: number;
  roi: number;
  paybackMonths: number | null;
  breakEvenPerHabitual: number; // € annui che ogni abituale incrementale deve generare per il pareggio
};

const WEEKS = 52;
const HABITUAL_DAYS_PER_WEEK = 4.5; // giorni medi di gioco di un abituale (assunzione)
const OCCASIONAL_DAYS_PER_WEEK = 1.3; // giorni medi di un occasionale nel target (assunzione)

export function compute(i: Inputs): Outputs {
  // Retention
  const adopters = i.eligible * i.exposure * i.adoption;
  const incHabitualRetention = adopters * i.habitLift;
  const nonHabitAdopters = adopters * (1 - i.habitBase - i.habitLift);
  const incPlayDaysRetention =
    incHabitualRetention * (HABITUAL_DAYS_PER_WEEK - OCCASIONAL_DAYS_PER_WEEK) * WEEKS +
    Math.max(0, nonHabitAdopters) * i.extraDays * WEEKS;

  // Acquisizione: solo la differenza trattamento − controllo è incrementale
  const exposedPerYear = i.readers * i.moduleExposure * 12;
  const incFirstPlays = exposedPerYear * Math.max(0, i.convTreatment - i.convControl);
  const incHabitualAcquisition = incFirstPlays * i.newHabit;

  // Referral: base = abituali esistenti + incrementali (media annua ≈ metà dei nuovi)
  const habitualBase = i.existingHabitual + (incHabitualRetention + incHabitualAcquisition) / 2;
  const referralNewPlayers =
    habitualBase * i.invitesPerHabitual * 12 * i.inviteToPlay * i.newShare * i.referralIncrementality;
  const referralHabitual = referralNewPlayers * i.newHabit;

  const incHabitualTotal = incHabitualRetention + incHabitualAcquisition + referralHabitual;
  // Nuovi giocatori (acquisizione + referral) partono da zero giorni di gioco
  const newPlayerDays =
    (incHabitualAcquisition + referralHabitual) * HABITUAL_DAYS_PER_WEEK * WEEKS * 0.5 + // metà anno medio
    (incFirstPlays + referralNewPlayers - incHabitualAcquisition - referralHabitual) * 3; // non abituali: ~3 giorni
  const totalPlayDays = incPlayDaysRetention + newPlayerDays;
  const incDAU = totalPlayDays / 365;

  // Abbonamenti: si applica κ, perché la correlazione abitudine→abbonamento non è tutta causale
  const incSubscriptionsRetention =
    incHabitualRetention * i.nonSubShare * (i.subRateHabitual - i.subRateOccasional) * i.causalShare;
  const incSubscriptionsNew =
    (incHabitualAcquisition + referralHabitual) * i.nonSubShare * i.subRateHabitual * i.causalShare;
  const incSubscriptions = Math.max(0, incSubscriptionsRetention + incSubscriptionsNew);
  // Churn: effetto causale misurato direttamente dall'holdout (non dedotto dalla correlazione)
  const churnAvoided = adopters * i.subShare * i.churnReduction;
  const incRegistrations = (incFirstPlays + referralNewPlayers) * i.registrationRate;

  // Valore annuo a regime: ogni anno di esercizio genera una coorte di nuovi abbonati,
  // valorizzata sull'LTV a 3 anni; il churn evitato vale un anno di ricavo.
  const ltvYears = 1 + (1 - i.churnAnnual) + (1 - i.churnAnnual) ** 2;
  const subscriptionValue = incSubscriptions * i.valuePerSub * ltvYears;
  const retentionValue = churnAvoided * i.valuePerCorriereSub;
  const adValue = totalPlayDays * i.adValuePerPlayDay;
  const registrationValue = incRegistrations * i.valuePerRegistration;
  const totalValue = subscriptionValue + retentionValue + adValue + registrationValue;
  const annualCost = i.runCost + i.buildCost / 3; // sviluppo ammortizzato su 3 anni
  const net = totalValue - annualCost;
  const roi = annualCost > 0 ? net / annualCost : 0;
  const monthlyMargin = (totalValue - i.runCost) / 12;
  const paybackMonths = monthlyMargin > 0 ? i.buildCost / monthlyMargin : null;
  const breakEvenPerHabitual = incHabitualTotal > 0 ? annualCost / incHabitualTotal : Infinity;

  return {
    adopters,
    incHabitualRetention,
    incPlayDaysRetention,
    incFirstPlays,
    incHabitualAcquisition,
    referralNewPlayers,
    referralHabitual,
    incHabitualTotal,
    incDAU,
    incSubscriptions,
    churnAvoided,
    incRegistrations,
    ltvYears,
    subscriptionValue,
    retentionValue,
    adValue,
    registrationValue,
    totalValue,
    annualCost,
    net,
    roi,
    paybackMonths,
    breakEvenPerHabitual,
  };
}

export type Scenario = "prudente" | "base" | "ottimistico";

export const BASE: Inputs = {
  eligible: 300_000,
  exposure: 0.7,
  adoption: 0.35,
  habitBase: 0.08,
  habitLift: 0.04,
  extraDays: 0.3,
  readers: 4_000_000,
  moduleExposure: 0.4,
  convControl: 0.003,
  convTreatment: 0.01,
  newHabit: 0.12,
  invitesPerHabitual: 0.15,
  inviteToPlay: 0.25,
  newShare: 0.6,
  referralIncrementality: 0.5,
  existingHabitual: 150_000,
  nonSubShare: 0.6,
  subRateHabitual: 0.12,
  subRateOccasional: 0.04,
  causalShare: 0.5,
  subShare: 0.4,
  churnReduction: 0.02,
  churnAnnual: 0.2,
  valuePerSub: 22,
  valuePerCorriereSub: 90,
  adValuePerPlayDay: 0.012,
  registrationRate: 0.35,
  valuePerRegistration: 2,
  buildCost: 280_000,
  runCost: 160_000,
};

export const SCENARIOS: Record<Scenario, Inputs> = {
  prudente: {
    ...BASE,
    adoption: 0.25,
    habitLift: 0.02,
    extraDays: 0.15,
    convTreatment: 0.006,
    newHabit: 0.08,
    invitesPerHabitual: 0.08,
    causalShare: 0.3,
    churnReduction: 0.01,
    referralIncrementality: 0.35,
  },
  base: BASE,
  ottimistico: {
    ...BASE,
    adoption: 0.45,
    habitLift: 0.06,
    extraDays: 0.45,
    convTreatment: 0.015,
    newHabit: 0.16,
    invitesPerHabitual: 0.25,
    causalShare: 0.7,
    churnReduction: 0.03,
    referralIncrementality: 0.6,
  },
};

export type ParamMeta = {
  key: keyof Inputs;
  label: string;
  group: "Retention" | "Acquisizione" | "Referral" | "Monetizzazione" | "Costi";
  kind: "count" | "pct" | "eur" | "num";
  min: number;
  max: number;
  step: number;
  why: string; // da dove viene / come si verifica
};

export const PARAMS: ParamMeta[] = [
  { key: "eligible", label: "Utenti eleggibili (target Case 1)", group: "Retention", kind: "count", min: 50_000, max: 1_000_000, step: 10_000, why: "Assunzione. Da misurare: registrati con ≥1 giorno di gioco negli ultimi 30 e <3 giorni/settimana." },
  { key: "exposure", label: "Quota esposta al Filo", group: "Retention", kind: "pct", min: 0.1, max: 1, step: 0.05, why: "Assunzione. Dipende da quante superfici (home Giochi, app News, newsletter) mostrano il Filo." },
  { key: "adoption", label: "Adozione tra gli esposti", group: "Retention", kind: "pct", min: 0.05, max: 0.8, step: 0.01, why: "Assunzione. Si misura nel Pilot: esposti che completano ≥1 Edizione del Filo." },
  { key: "habitBase", label: "Occasionale → abituale, baseline (12 sett.)", group: "Retention", kind: "pct", min: 0.01, max: 0.3, step: 0.005, why: "Assunzione. Si ricava dai dati storici nella fase Validate." },
  { key: "habitLift", label: "Incremento assoluto (pp) per gli adottanti", group: "Retention", kind: "pct", min: 0, max: 0.15, step: 0.005, why: "Ipotesi da testare: test R1 (Filo vs esperienza attuale)." },
  { key: "extraDays", label: "Giorni/settimana in più per chi non diventa abituale", group: "Retention", kind: "num", min: 0, max: 1.5, step: 0.05, why: "Ipotesi da testare: metrica secondaria del test R1." },
  { key: "readers", label: "Lettori 35–55 mai giocato, unici/mese, su pagine con modulo", group: "Acquisizione", kind: "count", min: 200_000, max: 8_000_000, step: 100_000, why: "Assunzione. La slide del case parla di «milioni di lettori al giorno»; serve il dato interno." },
  { key: "moduleExposure", label: "Quota che vede il modulo nel mese", group: "Acquisizione", kind: "pct", min: 0.05, max: 1, step: 0.05, why: "Dipende da quanti articoli ospitano il modulo e da dove è posizionato." },
  { key: "convControl", label: "Conversione con il promo attuale (controllo)", group: "Acquisizione", kind: "pct", min: 0, max: 0.03, step: 0.0005, why: "Da misurare: braccio di controllo del test A1." },
  { key: "convTreatment", label: "Conversione con «Gioca la notizia»", group: "Acquisizione", kind: "pct", min: 0, max: 0.05, step: 0.0005, why: "Ipotesi da testare: test A1." },
  { key: "newHabit", label: "Nuovi giocatori → abituali entro 4 settimane", group: "Acquisizione", kind: "pct", min: 0.01, max: 0.4, step: 0.01, why: "Ipotesi da testare: test A2 (prima esperienza)." },
  { key: "invitesPerHabitual", label: "Inviti al mese per giocatore abituale", group: "Referral", kind: "num", min: 0, max: 1, step: 0.01, why: "Ipotesi. Si misura con l'evento invite_shared." },
  { key: "inviteToPlay", label: "Invito → prima Edizione completata", group: "Referral", kind: "pct", min: 0.02, max: 0.6, step: 0.01, why: "Ipotesi. Eventi referral_landing_view → edition_completed." },
  { key: "newShare", label: "Invitati davvero nuovi", group: "Referral", kind: "pct", min: 0.1, max: 1, step: 0.05, why: "Si misura: invitati senza storico di gioco né account Giochi." },
  { key: "referralIncrementality", label: "Incrementalità del referral", group: "Referral", kind: "pct", min: 0.1, max: 1, step: 0.05, why: "Ipotesi da testare: test A3 con randomizzazione per invitante." },
  { key: "existingHabitual", label: "Giocatori abituali attuali", group: "Referral", kind: "count", min: 10_000, max: 1_000_000, step: 10_000, why: "Assunzione. Dato interno da recuperare in fase Validate." },
  { key: "nonSubShare", label: "Quota non abbonata tra i nuovi abituali", group: "Monetizzazione", kind: "pct", min: 0, max: 1, step: 0.05, why: "Assunzione." },
  { key: "subRateHabitual", label: "Tasso annuo di abbonamento, abituali", group: "Monetizzazione", kind: "pct", min: 0, max: 0.3, step: 0.005, why: "Assunzione. La slide afferma che i quotidiani si abbonano di più: serve il dato." },
  { key: "subRateOccasional", label: "Tasso annuo di abbonamento, occasionali", group: "Monetizzazione", kind: "pct", min: 0, max: 0.2, step: 0.005, why: "Assunzione." },
  { key: "causalShare", label: "κ · quota causale del legame abitudine→abbonamento", group: "Monetizzazione", kind: "pct", min: 0, max: 1, step: 0.05, why: "Il parametro più incerto. Si stima solo con l'holdout di lungo periodo del test R1." },
  { key: "subShare", label: "Quota di abbonati digitali Corriere tra gli adottanti", group: "Monetizzazione", kind: "pct", min: 0, max: 1, step: 0.05, why: "Assunzione. Il target del Case 1 include abbonati e non; Corriere dichiara 805 mila abbonamenti digitali (RCS, set. 2026)." },
  { key: "churnReduction", label: "Riduzione causale del churn (pp) tra gli abbonati adottanti", group: "Monetizzazione", kind: "pct", min: 0, max: 0.1, step: 0.005, why: "Ipotesi da testare con l'holdout di 6 mesi del test R1. La slide afferma che i quotidiani disdicono di meno: non dice di quanto, né se è causale." },
  { key: "churnAnnual", label: "Churn annuo medio degli abbonati (per LTV)", group: "Monetizzazione", kind: "pct", min: 0.05, max: 0.6, step: 0.01, why: "Assunzione. Da sostituire con il dato interno." },
  { key: "valuePerSub", label: "Ricavo netto annuo per nuovo abbonato Giochi", group: "Monetizzazione", kind: "eur", min: 1, max: 120, step: 1, why: "Assunzione ancorata ai listini pubblici: €24,99/anno in app iOS, €1 il primo anno sul web in promozione (PRODUCT_AUDIT.md). Netto di commissioni e promo." },
  { key: "valuePerCorriereSub", label: "Ricavo netto annuo per abbonato digitale Corriere trattenuto", group: "Monetizzazione", kind: "eur", min: 20, max: 250, step: 5, why: "Assunzione. Giochi è incluso in Naviga Premium e Tutto+: trattenere un abbonato digitale vale il suo ARPU, non il prezzo Giochi." },
  { key: "adValuePerPlayDay", label: "Ricavo pubblicitario per giorno-giocatore", group: "Monetizzazione", kind: "eur", min: 0, max: 0.05, step: 0.001, why: "Assunzione. Mettere 0 se le pagine Giochi non hanno pubblicità." },
  { key: "registrationRate", label: "Nuovi giocatori che si registrano", group: "Monetizzazione", kind: "pct", min: 0, max: 1, step: 0.01, why: "Ipotesi. Misurata nel test A2 (registrazione dopo il valore)." },
  { key: "valuePerRegistration", label: "Valore annuo di un utente registrato", group: "Monetizzazione", kind: "eur", min: 0, max: 20, step: 0.5, why: "Assunzione: dati first-party e resa pubblicitaria. Mettere 0 per una vista solo abbonamenti." },
  { key: "buildCost", label: "Costo di sviluppo una tantum", group: "Costi", kind: "eur", min: 50_000, max: 1_500_000, step: 10_000, why: "Stima: 1 squad (PM, designer, 3 sviluppatori, analista) per ~6 mesi. Assunzione." },
  { key: "runCost", label: "Costo annuo di esercizio", group: "Costi", kind: "eur", min: 0, max: 1_000_000, step: 10_000, why: "Stima: ~1,5 FTE di curatela editoriale + CRM + infrastruttura. Assunzione." },
];

/** Sensibilità: effetto sul valore netto di ±25% su ciascun parametro (ceteris paribus). */
export function sensitivity(i: Inputs, delta = 0.25) {
  const base = compute(i).net;
  return PARAMS.map((p) => {
    const clamp = (v: number) => (p.kind === "pct" ? Math.min(1, Math.max(0, v)) : Math.max(0, v));
    if (p.key === "habitBase") return null; // influisce solo in modo marginale e vincolato

    const lo = compute({ ...i, [p.key]: clamp(i[p.key] * (1 - delta)) }).net - base;
    const hi = compute({ ...i, [p.key]: clamp(i[p.key] * (1 + delta)) }).net - base;
    return { key: p.key, label: p.label, lo, hi, span: Math.abs(hi - lo) };
  })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.span - a.span);
}

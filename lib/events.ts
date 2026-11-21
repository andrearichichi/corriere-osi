/**
 * Tassonomia eventi (estratto). Definizione completa in docs/METRICS.md §Eventi.
 * Nel prototipo gli eventi sono registrati localmente per mostrare cosa misureremmo.
 */
export type EventName =
  | "article_view"
  | "inline_question_impression"
  | "inline_question_answered"
  | "edition_started"
  | "game_completed"
  | "edition_completed"
  | "clue_unlocked"
  | "clue_recovered"
  | "save_progress_prompt_view"
  | "registration_completed"
  | "reminder_opt_in"
  | "reactivation_sent"
  | "reactivation_opened"
  | "nodo_attempted"
  | "nodo_solved"
  | "invite_link_created"
  | "invite_shared"
  | "referral_landing_view"
  | "sfida_joined"
  | "return_visit";

export type TrackedEvent = {
  id: number;
  name: EventName;
  at: string; // etichetta del tempo simulato, es. "Lun 08:14"
  props: Record<string, string | number | boolean>;
};

export const EVENT_DOC: Record<EventName, string> = {
  article_view: "Pagina articolo vista (denominatore della conversione lettore→giocatore)",
  inline_question_impression: "Il modulo «Gioca la notizia» è entrato nel viewport per ≥1s",
  inline_question_answered: "Risposta data dentro l'articolo",
  edition_started: "Primo micro-gioco dell'Edizione iniziato",
  game_completed: "Un micro-gioco completato (corretto o no)",
  edition_completed: "Tutti e 3 i micro-giochi completati: evento di attivazione",
  clue_unlocked: "Indizio del giorno ottenuto lo stesso giorno",
  clue_recovered: "Indizio di un giorno passato recuperato",
  save_progress_prompt_view: "Richiesta di salvare il progresso mostrata (dopo il valore)",
  registration_completed: "Account creato, con attribuzione della sorgente",
  reminder_opt_in: "Consenso a un promemoria (push, email o calendario)",
  reactivation_sent: "Messaggio di lifecycle inviato (regola, canale, orario)",
  reactivation_opened: "Messaggio aperto e sessione avviata entro 24h",
  nodo_attempted: "Tentativo di sciogliere il Nodo della domenica",
  nodo_solved: "Nodo risolto",
  invite_link_created: "Link di sfida generato con codice invitante",
  invite_shared: "Condivisione completata (canale dichiarato dal sistema)",
  referral_landing_view: "Landing aperta da un link d'invito",
  sfida_joined: "L'invitato entra nella Sfida dell'invitante",
  return_visit: "Sessione in un giorno di calendario successivo (Europe/Rome)",
};

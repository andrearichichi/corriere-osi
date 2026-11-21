# Metriche e misurazione

> Convenzioni valide per tutte le metriche:
> - **Giorno di gioco:** giorno di calendario (fuso Europe/Rome) con almeno un evento `game_completed` dell'utente.
> - **Utente:** ID account se registrato. Per gli ospiti, l'ID first-party del browser o dell'app, unito all'account al momento della registrazione.
> - **Esclusi sempre:** account interni e di test, bot (filtro esistente), utenti senza consenso analytics dove la CMP lo richiede.
> - Le finestre «a N giorni» si contano da 00:00 del giorno successivo all'evento di riferimento.

## 1. North Star Metric

**Giocatori abituali settimanali (WHP)**
- **Definizione.** Numero di utenti registrati con ≥4 giorni di gioco distinti negli ultimi 7 giorni (finestra mobile, calcolata ogni giorno; il report ufficiale si fa la domenica).
- **Perché ≥4 e non 7.** Il brief parla di giocatori «quotidiani». Sette giorni su sette è una soglia rumorosa e punitiva (basta un viaggio); quattro su sette separa l'abitudine dall'uso occasionale (il target è <3) ed è robusta. Riportiamo sempre anche le soglie 5/7 e 7/7 come sensibilità.
- **Perché questa metrica.** Cattura la frequenza, cioè ciò che il brief lega ad abbonamento e churn, e non il volume: dieci partite in un giorno non contano più di una.

## 2. KPI primari

| KPI | Numeratore | Denominatore | Finestra | Eventi |
|---|---|---|---|---|
| **DAU** | Utenti con ≥1 giorno di gioco nel giorno | — | Giorno | `game_completed` |
| **WAU** | Utenti con ≥1 giorno di gioco | — | 7 giorni mobili | `game_completed` |
| **Frequenza settimanale** | Somma dei giorni di gioco | WAU | 7 giorni | `game_completed` |
| **Distribuzione della frequenza** | Utenti per numero di giorni di gioco (1…7) | WAU | 7 giorni | `game_completed` |
| **Ritorno D1** | Utenti con un giorno di gioco il giorno D+1 | Utenti con un giorno di gioco il giorno D (coorte del giorno) | D+1 | `game_completed` |
| **Ritorno D1 dei nuovi** | Nuovi giocatori con un giorno di gioco in D+1 | Nuovi giocatori del giorno D (primo `edition_completed` o `game_completed` di sempre) | D+1 | `return_visit` |
| **Attivazione** | Nuovi giocatori con ≥2 giorni di gioco nei primi 7 | Nuovi giocatori della coorte | 7 giorni | — |
| **Retention per coorte** | Utenti della coorte con ≥1 giorno di gioco nella settimana k | Dimensione della coorte (settimana del primo gioco o dell'assegnazione) | Settimana k = 1…12 | — |
| **Conversione lettore → giocatore** | Lettori esposti con ≥1 `edition_completed` entro 7 giorni | Lettori esposti al touchpoint (`inline_question_impression` o impression del promo), mai giocato nei 90 giorni precedenti | 7 giorni dalla prima esposizione | `inline_question_impression`, `edition_completed` |
| **Conversione referral** | Invitati nuovi con ≥2 giorni di gioco nei primi 7 | Invitati con `referral_landing_view` | 7 giorni | `referral_landing_view`, `return_visit` |
| **Nuovi attivi per invitante** | Invitati nuovi attivi (come sopra) | Invitanti assegnati (A3) | 4 settimane | — |

## 3. KPI secondari del Filo

| KPI | Definizione |
|---|---|
| Tasso di inizio dell'Edizione | Sessioni con `edition_started` / sessioni Giochi |
| Completamento dell'Edizione | `edition_completed` / `edition_started` (stesso giorno e utente) |
| Durata mediana dell'Edizione | Mediana di (`edition_completed` − `edition_started`), obiettivo ≤4 minuti |
| Indizi per adottante | Media di indizi (puntuali + recuperati) per utente con ≥1 indizio nella settimana |
| Quota puntuale | Indizi puntuali / indizi totali (controlla che il recupero non sostituisca il gioco quotidiano) |
| Tentativo e risoluzione del Nodo | `nodo_attempted` e `nodo_solved` / adottanti della settimana |
| Rientro dopo un messaggio | Utenti con `edition_completed` entro 24 ore da `reactivation_sent` / utenti a cui è stato inviato (ITT) |

## 4. Effetti su abbonamento e churn

| Metrica | Definizione | Come si legge causalmente |
|---|---|---|
| Conversione ad abbonamento | Non abbonati che si abbonano (add-on Giochi o digitale Corriere) entro 90 o 180 giorni / non abbonati della popolazione | Differenza tra trattamento e **holdout di lungo periodo**, mai tra abituali e occasionali |
| Churn | Abbonati che disdicono o non rinnovano nel periodo / abbonati attivi a inizio periodo | Come sopra; letto a 3 e a 6 mesi |
| κ (parametro del modello) | Effetto causale stimato / differenza osservazionale tra abituali e occasionali | Calibra il modello d'impatto |

**Correlazione ≠ causalità.** Che i giocatori quotidiani si abbonino di più (dal brief) può dipendere dal fatto che chi è già affezionato al Corriere gioca di più (*reverse causality*, autoselezione). Aumentare la frequenza non garantisce nuovi abbonamenti: solo il confronto randomizzato con l'holdout lo stima.

## 5. Guardrail

| Guardrail | Soglia indicativa | Dove |
|---|---|---|
| Tempo sui giochi lunghi (cruciverba, sudoku) | Calo massimo −5% | R1 |
| Lettura: scroll, completamento dell'articolo, tempo | Calo massimo −2% | A1 |
| Ricavo pubblicitario per pagina vista | Calo massimo −2% | A1 |
| Opt-out delle push | Massimo +0,5 pp | R2 |
| Disiscrizioni email | Massimo +0,3 pp | R2 |
| Tasso di registrazione dei nuovi | Massimo −10% relativo (compromesso dichiarato) | A2 |
| Abusi del referral | Sotto lo 0,5% degli inviti | A3 |
| Errori di sessione o progressi persi | Non superiori alla baseline | Tutti |

Le soglie sono proposte da validare con i team di prodotto, editoriali e commerciali prima della pre-registrazione.

## 6. Tassonomia degli eventi

Proprietà comuni a ogni evento: `user_id` (o `anon_id`), `session_id`, `platform` (web | app_giochi | app_news), `ts` (UTC), `local_date` (Europe/Rome), `experiment_assignments`.

| Evento | Proprietà specifiche | Note |
|---|---|---|
| `article_view` | `article_id`, `section`, `is_player_90d` | Denominatore A1 |
| `inline_question_impression` | `article_id`, `position`, `variant` | ≥50% del modulo visibile per ≥1 secondo |
| `inline_question_answered` | `article_id`, `correct` | |
| `edition_started` | `day`, `entry` (inline_article \| filo_home \| news_app_card \| push \| referral_landing), `guest`, `recovery` | |
| `game_completed` | `day`, `game` (quiz \| prima_o_dopo \| anagramma \| altro gioco), `correct`, `attempts` | Anche i giochi del catalogo |
| `edition_completed` | `day`, `score`, `first_ever`, `guest` | Evento di attivazione |
| `clue_unlocked` / `clue_recovered` | `clue_index`, `clues_total` | |
| `nodo_attempted` / `nodo_solved` | `clues`, `attempts` | |
| `save_progress_prompt_view` | `after`, `guest` | |
| `registration_completed` | `source`, `first_touch`, `invite_id`, `method` | Attribuzione al primo tocco, 7 giorni |
| `reminder_opt_in` | `channel` (push \| email \| calendar_ics), `time` | |
| `reactivation_sent` / `reactivation_opened` | `rule` (R1–R5), `channel`, `send_time` | `opened` = sessione entro 24 ore |
| `invite_link_created` / `invite_shared` | `invite_id`, `channel`, `context` | |
| `referral_landing_view` | `invite_id`, `utm_*`, `known_device`, `has_account` | |
| `sfida_joined` | `sfida`, `invite_id` | |
| `return_visit` | `days_since_last`, `source` | Derivato: prima sessione di un nuovo giorno di calendario |

Il prototipo registra questi eventi localmente e li mostra nel pannello «Eventi tracciati» di ogni esperienza.

## 7. Attribuzione e incrementalità dell'acquisizione

- **Nuovo giocatore:** nessun `game_completed` nei 90 giorni precedenti su account o dispositivo noto, e nessun account Giochi con storico.
- **Attribuzione:** primo tocco in una finestra di 7 giorni (articolo con modulo, card, newsletter, invito). Per gli inviti, il codice nel link prevale sugli altri tocchi.
- **Incrementalità:** si legge **solo** dagli esperimenti. A1 confronta il modulo con il promo attuale, randomizzando per lettore. A3 confronta i flussi d'invito, randomizzando per invitante. L'attribuzione serve all'ottimizzazione operativa, non alla stima dell'effetto.

## 8. Cruscotto settimanale (proposta)

1. North Star (WHP), con le soglie 4/7, 5/7 e 7/7 e la variazione settimanale
2. Distribuzione dei giorni di gioco del target del Case 1
3. Funnel lettore → giocatore per touchpoint
4. Ritorno D1 e attivazione a 7 giorni dei nuovi giocatori, per sorgente
5. Indicatori del Filo: inizio, completamento, quota puntuale, Nodo
6. Guardrail con semaforo
7. Esperimenti attivi: stato, giorni alla lettura, MDE raggiungibile

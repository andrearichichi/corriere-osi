# Il Filo — Corriere Giochi · Case study

Risposta al case study **«Più giocatori, ogni giorno»** di Corriere Giochi (novembre 2026): strategia, prototipo interattivo, Growth Lab e presentazione per il management.

> **Il Filo.** Ogni giorno un'Edizione di tre giochi brevi dà un indizio; sei indizi formano il Filo della settimana; domenica si scioglie il Nodo; un giorno perso si recupera. Si entra da un articolo («Gioca la notizia»), si torna con un promemoria che parla del proprio progresso, si invita con un link che si gioca subito.

Proposta indipendente: non usa dati interni né asset protetti di Corriere della Sera o RCS. Ogni numero non pubblico è etichettato come *simulato* o *ipotesi*.

## Avvio

Requisiti: Node.js ≥ 20.

```bash
npm install
npm run dev            # sviluppo: http://localhost:3000
# oppure, per presentare:
npm run build && npm start
```

Funziona **senza Internet**: font locali (Fontsource), nessuna API o CDN esterna, stato della demo salvato in `localStorage`.

## Navigazione

| Percorso | Cosa contiene |
|---|---|
| `/` | La proposta in una pagina e il sistema |
| `/strategy` | Presentazione di 16 slide. ← → per navigare, **N** note del relatore, **F** schermo intero, «Esporta PDF». Su mobile diventa lettura verticale |
| `/prototype/retention` | **Esperienza A** — Giulia, giocatrice occasionale: situazione iniziale → Edizione giocabile → Filo e recupero → notifica di riattivazione → venerdì e Nodo della domenica |
| `/prototype/acquisition` | **Esperienza B** — Stefano, lettore che non ha mai giocato: articolo → «Gioca la notizia» → Edizione da ospite → post-gioco con promemoria `.ics` reale → card del martedì nell'app News |
| `/prototype/referral` | **Esperienza C** — Paolo invita Chiara: invito a fine Edizione → card senza spoiler → landing «gioca prima» → ingresso nella Sfida → ritorno e attribuzione |
| `/growth-lab` | Modello d'impatto parametrico (3 scenari), funnel di acquisizione, coorti di retention, simulatore di esperimenti con IC e MDE, driver del risultato |
| `/roadmap` | Validate → Pilot → Scale, criteri go/no-go, matrice impatto/sforzo |

Ogni esperienza ha un pannello **«Eventi tracciati»** con la tassonomia di misura e un pulsante **«Ricomincia la demo»**.

**Soluzioni della settimana dimostrativa** (per presentare senza intoppi): anagrammi INVERNO, TEATRO, GIORNALE, MERCATO, NATALE, EUROPA (da lunedì a sabato); Nodo: *Sant'Ambrogio*.

## Presentare

1. `npm run build && npm start`
2. Apri `/strategy` a schermo intero; tieni le tre esperienze e il Growth Lab in altre schede
3. Segui `docs/PRESENTATION_SCRIPT.md` (20 minuti, con i passaggi della demo)
4. PDF di riserva: `docs/Il-Filo-presentazione.pdf`. Per rigenerarlo, con il server attivo: `BASE_URL=http://localhost:3000 npm run export:pdf`

## Documenti

| File | Contenuto |
|---|---|
| `docs/CASE_REQUIREMENTS.md` | Ogni richiesta delle 6 slide mappata su un deliverable |
| `docs/RESEARCH.md` | Sintesi della ricerca e insight comportamentali → scelte verificabili |
| `docs/PRODUCT_AUDIT.md` | Audit pubblico di Corriere Giochi, con fonti e date (confermato, osservazione, non verificabile) |
| `docs/BENCHMARK.md` | NYT, LinkedIn, Guardian, Washington Post, Atlantic, Puzzmo, Duolingo: principi trasferibili |
| `docs/STRATEGY.md` | Concept valutati, Case 1 e Case 2 completi, modello, rischi |
| `docs/METRICS.md` | North Star, KPI con denominatori e finestre, guardrail, tassonomia degli eventi, attribuzione |
| `docs/EXPERIMENTS.md` | 5 esperimenti pre-registrabili + holdout *(generato da `data/experiments.ts`)* |
| `docs/ROADMAP.md` | Fasi, dipendenze, team, go/no-go, matrice *(generato da `data/roadmap.ts`)* |
| `docs/PRESENTATION_SCRIPT.md` | Script orale e demo |
| `docs/PROGRESS.md` | Decisioni, attività e questioni aperte |

## Struttura

```text
app/
  (site)/              home, prototype/{retention,acquisition,referral}, growth-lab, roadmap
  strategy/            presentazione
components/
  games/               Quiz, Prima o Dopo (breve), Anagramma: micro-giochi funzionanti
  filo/                tabellone del Filo, player dell'Edizione, indizio, Nodo
  prototype/           cornice delle esperienze, telefono, schermate Giochi, registro eventi
  lab/                 Growth Lab
  deck/                slide e visualizzatore
data/                  settimana dimostrativa, esperimenti, roadmap (fonti uniche per app e docs)
lib/                   motore del Filo, modello d'impatto, statistica, eventi, persistenza
tests/                 test unitari (vitest)
scripts/               e2e (Playwright), export PDF, generazione docs
docs/                  documentazione
reference/             brief originale
```

## Verifica

```bash
npm run verify         # typecheck + lint + test unitari + build
npm run test:e2e       # con il server attivo (BASE_URL, default http://localhost:3000)
                       # percorre le 3 esperienze, controlla errori di console e scroll orizzontale a 390px
npm run docs           # rigenera EXPERIMENTS.md e ROADMAP.md dai dati
```

Al primo uso di Playwright: `npx playwright install chromium`.

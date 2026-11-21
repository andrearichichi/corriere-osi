# Requisiti del case → deliverable

**Fonte primaria:** «Corriere Giochi – Case study» (6 slide, novembre 2026). La repository non conteneva il file `.pptx` citato nelle istruzioni; abbiamo usato la versione PDF fornita, che contiene tutte e 6 le slide. Le slide non contengono immagini con informazioni aggiuntive oltre al logo e al titolo.

## Slide 1 — Copertina
«Corriere Giochi · Case study — Più giocatori, ogni giorno — Novembre 2026».
→ Titolo e posizionamento della proposta: presentazione, slide 1; home dell'app.

## Slide 2 — Un obiettivo, due direttrici
| Richiesta | Deliverable |
|---|---|
| Obiettivo: più giocatori quotidiani («si abbonano di più e disdicono di meno») | North Star in docs/METRICS.md §1; legame con abbonamento e churn trattato in modo causale (METRICS §4, holdout); slide 2 |
| Case 1 · Retention: far tornare i giocatori ogni giorno | STRATEGY §4; prototipo /prototype/retention; slide 7–9 |
| Case 2 · Acquisizione: portare nuovi giocatori dal mondo Corriere | STRATEGY §5; /prototype/acquisition e /prototype/referral; slide 10–12 |
| Strategia coerente tra i due case | Il Filo come sistema unico: STRATEGY §3; slide 5–6; componente SystemLoop |

## Slide 3 — Case 1: contesto, target, obiettivo
| Richiesta | Deliverable |
|---|---|
| Contesto: molti giocano 1–2 volte a settimana | Persona Giulia (1,4 giorni a settimana), esperienza A, passo 1 |
| Target: registrati, abbonati e non, ≥1 volta in 30 giorni, <3 giorni a settimana | Segmentazione: STRATEGY §4.1; popolazione di R1 in EXPERIMENTS.md; parametro «eleggibili» nel Growth Lab |
| Obiettivo: set di leve di **prodotto** e di **comunicazione** per l'abitudine quotidiana | Leve L1–L5 (STRATEGY §4.5) + piano lifecycle R1–R5 (§4.6) |

## Slide 4 — Case 1: deliverable richiesti
| # | Richiesta | Dove |
|---|---|---|
| 1 | Diagnosi: 2–3 ipotesi sul perché non tornano | H1–H3: STRATEGY §4.2; slide 7 |
| 1 | Dati per verificare ogni ipotesi | Colonna «Dati e metodo», STRATEGY §4.2; eventi in METRICS §6 |
| 2 | Leve di prodotto: come funziona | STRATEGY §4.5 (formato Problema → … → Rischi); prototipo A, passi 2–4 |
| 2 | Dove interviene nel percorso | Percorso attuale e futuro: STRATEGY §4.3–4.4; slide 4; ogni leva indica il punto |
| 2 | Quale metrica deve spostare | Campo «KPI» di ogni leva; campo «Metrica che deve muovere» in ogni passo del prototipo |
| 3 | Riattivazione: piano d'azione sui canali | STRATEGY §4.6 (R1–R5: canale, orario, messaggio, limiti); prototipo A, passo 5 (notifica, card nell'app News, email); slide 8 |
| 4 | Come misureresti l'effetto | Esperimenti R1, R2 e holdout: EXPERIMENTS.md; simulatore nel Growth Lab |
| 4 | Metriche di successo da monitorare | METRICS §1–5; slide 9 |

## Slide 5 — Case 2: contesto, target, obiettivo
| Richiesta | Deliverable |
|---|---|
| Milioni di lettori, pochi conoscono Giochi | Touchpoint negli articoli e nell'app News: STRATEGY §5.2 |
| Attirare anche chi gioca ma non legge il Corriere | Referral via WhatsApp: l'invitato (Chiara) non è una lettrice abituale; STRATEGY §5.4 |
| Target: lettori 35–55 (web e app News) mai giocato | Persona Stefano (41 anni, app News), esperienza B; segmento pre-registrato in A1 |
| Target: giocatori attivi come «ambasciatori» | Persona Paolo, esperienza C; A3 |
| Piano su due binari: lettori e passaparola | STRATEGY §5.2 (lettori) e §5.4 (passaparola) |

## Slide 6 — Case 2: deliverable richiesti
| # | Richiesta | Dove |
|---|---|---|
| 1 | Punti di contatto e logiche di acquisizione | STRATEGY §5.2 (tabella con meccanica, logica e metrica); slide 10 |
| 2 | Meccanica di ingaggio: piano d'azione e iniziative di comunicazione | STRATEGY §5.2–5.4: modulo, card, newsletter del lunedì, QR, inviti; prototipo B e C |
| 3 | Primo contatto: esperienza che fa tornare **il giorno dopo** | STRATEGY §5.3; prototipo B, passi 3–6 (indizio, promessa delle 7, promemoria .ics, card del martedì); A2 |
| 4 | KPI e logiche di misurazione | METRICS §2 e §7 (attribuzione e incrementalità); A1, A2, A3; funnel nel Growth Lab; slide 12 |

## Requisiti trasversali del brief di progetto
| Requisito | Dove |
|---|---|
| Ricerca, audit, benchmark con fonti e date | RESEARCH.md, PRODUCT_AUDIT.md, BENCHMARK.md |
| Fatti distinti da ipotesi | Legenda [F]/[O]/[A]/[NV] nei documenti; etichette «Simulato» e «Ipotesi» nell'app |
| Almeno 3 concept valutati | STRATEGY §3 (4 concept, 9 criteri); slide 6 |
| ≥2 A/B test per case | R1, R2 (Retention); A1, A2, A3 (Acquisizione) |
| Modello parametrico con scenari | lib/model.ts; Growth Lab; STRATEGY §7 |
| Prototipo con 3 esperienze funzionanti | /prototype/retention, /acquisition, /referral |
| Presentazione esportabile in PDF, funzionante offline | /strategy (pulsante «Esporta PDF»); docs/Il-Filo-presentazione.pdf; font locali, nessuna risorsa esterna |
| Script orale con demo | PRESENTATION_SCRIPT.md |
| Roadmap con matrice impatto/sforzo | /roadmap; ROADMAP.md |
| Quality gate: build, lint, test, e2e | README §Verifica; PROGRESS.md |

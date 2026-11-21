# Progress

_Ultimo aggiornamento: 21 novembre 2026_

## Decisioni

| # | Decisione | Motivo |
|---|---|---|
| D1 | Fonte primaria: il PDF del case, al posto della `.pptx` assente | Il PDF contiene tutte e 6 le slide; trascritte in CASE_REQUIREMENTS.md |
| D2 | Big idea: **Il Filo** (concept A) | Unico concept che lega retention e acquisizione con una meccanica editoriale; 37/40 su 8 criteri numerici (STRATEGY §3) |
| D3 | L'Edizione **riusa formati esistenti** (Quiz, Prima o Dopo in breve) più un anagramma | L'audit conferma che Prima o Dopo, Sfide, streak e classifiche esistono già: non li presentiamo come novità |
| D4 | Referral come **evoluzione delle Sfide** esistenti, non come nuovi «Circoli» | Le Sfide con link e classifica privata esistono già; cambiamo momento, landing, premio e misura |
| D5 | Recupero degli indizi al posto di una nuova streak | Il target ha la streak sempre a zero; un traguardo sempre raggiungibile |
| D6 | North Star: ≥4 giorni su 7 | Separa l'abitudine dall'uso occasionale (target <3), robusta; sensibilità a 5/7 e 7/7 |
| D7 | Parametro κ esplicito nel modello + holdout di 6 mesi | Correlazione abitudine–abbonamento ≠ causalità |
| D8 | Valore economico: retention degli abbonati digitali e registrazioni prima del prezzo Giochi | Add-on a €1 il primo anno sul web, €24,99 l'anno in app; 805 mila abbonamenti digitali |
| D9 | Caso base presentato in pareggio, non gonfiato | Credibilità: le ipotesi decisive si verificano in fase Validate |
| D10 | Stack: Next.js 15, TypeScript, Tailwind 4, Recharts, Motion, Fontsource; nessun backend | Demo locale e offline; stato in localStorage |
| D11 | Contenuti di gioco su fatti storici stabili, non notizie inventate | Evitare di simulare notizie false; il tema del Nodo (Sant'Ambrogio) è coerente con la settimana del 7 dicembre |
| D12 | Esperimenti e roadmap in `data/*.ts`, con la documentazione generata dagli stessi dati | Evitare divergenze tra app e documenti |
| D13 | Palette dei grafici validata con script (CVD, chroma, luminosità) | Il warning sul contrasto è compensato da etichette dirette e tabelle |

## Attività concluse

- [x] Analisi del brief e mappa dei requisiti (CASE_REQUIREMENTS.md)
- [x] Audit pubblico del prodotto (PRODUCT_AUDIT.md) e benchmark (BENCHMARK.md), con fonti datate
- [x] Sintesi della ricerca e insight comportamentali (RESEARCH.md)
- [x] 4 concept valutati, strategia completa per entrambi i case (STRATEGY.md)
- [x] Metriche con definizioni precise e tassonomia degli eventi (METRICS.md)
- [x] 5 esperimenti + holdout (EXPERIMENTS.md); roadmap a 3 fasi con matrice (ROADMAP.md)
- [x] Motore del Filo, modello d'impatto e statistica, con 17 test unitari
- [x] Esperienze A, B e C funzionanti end-to-end
- [x] Growth Lab: modello, funnel, coorti, simulatore di esperimenti, driver
- [x] Presentazione di 16 slide con note, export PDF (`docs/Il-Filo-presentazione.pdf`)
- [x] Script di presentazione con demo (PRESENTATION_SCRIPT.md)
- [x] Verifica: typecheck, lint, test unitari, build di produzione, e2e Playwright (3 esperienze + pagine a 1440 e 390 px, zero errori di console, nessuno scroll orizzontale)

## Problemi risolti durante la verifica

- Se si giocava l'Edizione dal passo 1, la narrazione della retention non avanzava: ora segue l'azione dell'utente.
- Scroll orizzontale su mobile nelle griglie con tabelle: corretto con `min-width: 0` sugli elementi delle griglie.
- Etichette sovrapposte alle barre nei grafici per scenario e a tornado: valori spostati in una colonna dedicata.
- Su mobile il telefono del prototipo compariva dopo il registro eventi: ora segue subito il testo del passo.
- Pulsante «indietro» senza azione nelle schermate di fine Edizione del referral: rimosso dove non serve.

## Questioni aperte

- **Dati interni.** Tutte le baseline del modello sono ipotesi: vanno sostituite in fase Validate (eleggibili, lettori esposti, conversioni, churn, ARPU).
- **Notifiche push e app News.** Le regole e l'integrazione reale non sono verificabili dall'esterno.
- **Fornitore della piattaforma di gioco.** La fattibilità di Edizione ed eventi dipende dall'accordo con il fornitore.
- **Soglie dei guardrail.** Sono proposte; vanno concordate con i team editoriali e commerciali.
- **Dark mode.** Non implementata: l'esperienza è pensata in tono carta, coerente con l'identità editoriale.

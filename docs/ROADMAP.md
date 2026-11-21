# Roadmap di esecuzione

> Le sezioni «Fasi» e «Matrice» sono generate da `data/roadmap.ts` con `npm run docs`.

Tre fasi con criteri di uscita espliciti: **Validate → Pilot → Scale**. Ogni fase può fermarsi. L'investimento cresce solo quando le ipotesi decisive sono dimostrate: conversione dal giornale, nascita dell'abitudine, legame causale con l'abbonamento.

## Fasi

### Fase 1 · Validate — Dicembre 2026 – gennaio 2027 · 6–8 settimane

**Obiettivo.** Verificare le ipotesi più critiche con il minimo investimento, senza ancora costruire il prodotto.

| | |
|---|---|
| Priorità | Massima: decide se proseguire |
| Complessità | Bassa |
| Team | PM · Data analyst · 1 sviluppatore front-end · Redattore part-time · CRM |

**Deliverable**
- Baseline e verifica di H1–H3 con i dati esistenti
- Tassonomia degli eventi condivisa tra web, app e fornitore della piattaforma di gioco
- Piano di correzione per la perdita di progressi e i problemi di login
- «Gioca la notizia» con domanda statica su un campione di articoli (A1 in forma ridotta)
- Filo pilota via email per 5–10 mila utenti volontari (indizi via email, Nodo via form)

**Dipendenze**
- Accesso ad analytics, CRM e dati del fornitore
- Un redattore part-time
- Revisione privacy degli invii

**KPI**
- Tasso di risposta al modulo e conversione lettore → giocatore
- Indizi raccolti a settimana nel pilota
- Quota di partecipanti con ≥4 giorni di gioco

**Criteri go / no-go**
- Almeno una tra H1 e H2 confermata dai dati
- Conversione del modulo ≥ 2× il promo attuale (soglia fissata prima del test)
- ≥ 30% dei partecipanti al pilota raccoglie ≥ 4 indizi in una settimana
- Nessun calo della lettura oltre il 2%

**Rischi principali**
- Dati frammentati tra web, app e fornitore
- Il pilota email coinvolge volontari: è un segnale, non una prova causale
- Capacità redazionale

### Fase 2 · Pilot — Febbraio – maggio 2027 · circa 14 settimane

**Obiettivo.** MVP controllato sul 20% del target, con esperimenti randomizzati.

| | |
|---|---|
| Priorità | Alta |
| Complessità | Media |
| Team | Squad: PM, designer, 3 sviluppatori, QA · Data analyst · Redazione: 1 FTE · CRM |

**Deliverable**
- Edizione, Filo e Nodo nella home Giochi, web e app (R1)
- Regole di lifecycle R1–R3 su push ed email (R2)
- Prima esperienza da ospite con salvataggio dopo il valore (A2)
- A1 esteso a web e app News
- Strumenti redazionali minimi: template delle domande e calendario degli indizi

**Dipendenze**
- Esito positivo della fase Validate
- Roadmap del fornitore della piattaforma
- Team dell'app News
- Opt-in push esistenti

**KPI**
- Metriche primarie di R1, R2, A1, A2
- Guardrail su giochi lunghi, lettura e opt-out
- Ore redazionali al giorno

**Criteri go / no-go**
- R1: limite inferiore dell'IC 95% > 0 ed effetto ≥ MDE
- Guardrail entro le soglie
- Costo redazionale sotto le 3 ore al giorno a regime
- Holdout di lungo periodo avviato

**Rischi principali**
- Effetto novità
- Cannibalizzazione dei giochi lunghi
- Contaminazione tramite le Sfide
- Dipendenza dal fornitore

### Fase 3 · Scale — Giugno – dicembre 2027

**Obiettivo.** Estendere solo ciò che ha mostrato effetti incrementali; misurare l'effetto su abbonamenti e churn.

| | |
|---|---|
| Priorità | Condizionata ai risultati |
| Complessità | Media-alta |
| Team | Squad · Growth e CRM · Data · Redazione |

**Deliverable**
- Rollout al 100% con holdout del 5–10% per 6 mesi
- Card del Filo nell'app News
- Invito che si gioca subito (A3)
- Sfide con classifica settimanale
- Orario di invio personalizzato
- Test opzionale del QR sul cartaceo
- Lettura dell'holdout: κ e churn

**Dipendenze**
- Risultati del pilot
- Budget
- Integrazione con l'app News

**KPI**
- North Star: giocatori abituali a settimana
- DAU
- Churn e abbonamenti nell'holdout

**Criteri go / no-go**
- L'holdout mostra una riduzione del churn ≥ 1 punto o abbonamenti incrementali: si continua a investire
- Altrimenti si mantengono solo le leve con effetto sul DAU e si riducono i costi

**Rischi principali**
- Affaticamento dopo mesi
- Costi redazionali
- Saturazione delle push

## Matrice impatto / sforzo

I punteggi da 1 a 5 sono giudizi del team, non misure. L'**impatto** considera l'effetto atteso sulla North Star e quanto la mossa sblocca le successive. Lo **sforzo** considera lo sviluppo, le dipendenze esterne (fornitore della piattaforma, app News) e il carico redazionale.

| ID | Iniziativa | Impatto | Sforzo | Fase | Motivazione |
|---|---|---|---|---|---|
| I1 | Affidabilità di login e progressi | 4 | 3 | 1 | Prerequisito: è il primo tema delle recensioni negative |
| I2 | Tassonomia eventi e baseline | 4 | 2 | 1 | Senza questa non si verificano H1–H3 |
| I3 | «Gioca la notizia» su un campione di articoli | 5 | 2 | 1 | Test A1 a basso costo |
| I4 | Filo pilota via email | 3 | 1 | 1 | Wizard of Oz: indizi via email, Nodo via form |
| I5 | Edizione e Filo nella home Giochi | 5 | 4 | 2 | Test R1, il cuore della proposta |
| I6 | Lifecycle basato sul progresso | 4 | 2 | 2 | Test R2 |
| I7 | Prima esperienza da ospite | 4 | 3 | 2 | Test A2 |
| I8 | Strumenti redazionali per l'Edizione | 3 | 3 | 2 | Abilitante: template e calendario |
| I9 | Card del Filo nell'app News | 4 | 3 | 3 | Dipende dal team app News |
| I10 | Invito che si gioca subito | 3 | 3 | 3 | Test A3 |
| I11 | Sfide con classifica settimanale | 2 | 2 | 3 | Evoluzione delle Sfide esistenti |
| I12 | Orario di invio personalizzato | 3 | 3 | 3 | Dopo R2 |
| I13 | QR del Filo sul quotidiano cartaceo | 2 | 2 | 3 | Test opzionale |

**Lettura.** In alto a sinistra (alto impatto, basso sforzo) ci sono I2, I3 e I4: tassonomia degli eventi, «Gioca la notizia» in forma ridotta e Filo pilota via email. Costano poco e decidono il resto. I1 (affidabilità) non è facile, ma è un prerequisito: un prodotto che promette «torna domani» non può perdere i progressi di ieri.

## Dipendenze critiche

- **Fornitore della piattaforma di gioco.** Il codice pubblico rimanda a un fornitore esterno (vedi PRODUCT_AUDIT.md). Edizione, Filo e tassonomia degli eventi richiedono un accordo con lui, da avviare nella settimana 1.
- **Team dell'app News.** Il modulo negli articoli e la card del Filo vivono nell'app News.
- **Redazione.** Circa 1–2 ore al giorno a regime. Soglia di sostenibilità nel pilot: 3 ore al giorno.
- **Privacy e consenso.** Promemoria e invii email solo con consenso; il tracciamento degli ospiti va fatto nel rispetto della CMP esistente.

## Cosa non facciamo

Niente nuovi giochi «grandi», niente seconda streak, niente classifiche pubbliche aggiuntive, niente premi economici o accessi premium regalati. Il catalogo e le funzioni esistenti restano: il Filo è la porta d'ingresso quotidiana.

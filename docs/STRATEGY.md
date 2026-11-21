# Strategia — Il Filo

> Risposta al case study «Più giocatori, ogni giorno» di Corriere Giochi (novembre 2026).
> **Legenda:** [F] fatto con fonte (in PRODUCT_AUDIT.md o BENCHMARK.md) · [O] nostra osservazione o inferenza · [A] assunzione da verificare. Nessun dato interno Corriere è stato usato.

---

## 0. In una pagina

**Domanda del management:** perché questa soluzione dovrebbe aumentare i giocatori quotidiani, come potremmo dimostrarlo e cosa dovremmo costruire per primo?

- **Perché.** Corriere Giochi ha già i giochi e la gamification: otto giochi, streak, trofei, classifiche e Sfide [F]. Gli manca un **motivo per tornare domani**: ogni partita si chiude in sé. Il Filo trasforma le partite isolate in un **arco settimanale** di micro-appuntamenti quotidiani. È costruito sul vantaggio che solo il Corriere ha, il giornale del giorno, e porta il gioco **dentro la notizia**, dove i lettori 35–55 passano già il loro tempo.
- **Come lo dimostriamo.** Con cinque esperimenti randomizzati e pre-registrati (R1, R2, A1, A2, A3) e un holdout di 6 mesi, che separa la correlazione abitudine–abbonamento dalla causalità.
- **Cosa costruiamo per primo.** Sei-otto settimane di validazione a basso costo: affidabilità dei progressi, tassonomia degli eventi, «Gioca la notizia» su un campione di articoli e un Filo pilota via email. Il prodotto completo arriva solo se i criteri di uscita sono superati.

**Il sistema in una frase:** *ogni giorno un'Edizione di tre giochi brevi dà un indizio; sei indizi formano il Filo della settimana; domenica si scioglie il Nodo; un giorno perso si recupera; si entra da un articolo, si torna con un promemoria che parla del proprio progresso, si invita con un link che si gioca subito.*

---

## 1. Il problema di business

- **Obiettivo del brief:** aumentare i giocatori quotidiani, che «si abbonano di più e disdicono di meno» (affermazione del brief, da quantificare con dati interni).
- **Due direttrici:** retention degli occasionali (Case 1) e acquisizione dal mondo Corriere (Case 2).
- **Contesto economico [F]:** Giochi è incluso in Naviga Premium e Tutto+; per gli altri abbonati digitali è un add-on (€1 il primo anno sul web in promozione; €2,49 al mese o €24,99 all'anno in app iOS). Corriere conta 805 mila abbonamenti digitali (settembre 2026).
- **Implicazione [O]:** il valore di un giocatore abituale passa più dalla **retention degli abbonati digitali Corriere** e dalla **registrazione dei lettori** che dal prezzo dell'add-on Giochi. Il modello (§7) lo rende esplicito.

## 2. Il vero insight

> **Chi gioca 1–2 volte a settimana non è disinteressato: arriva per caso, gioca una partita e chiude, perché niente lo lega al giorno dopo.**

Tre frizioni, che diventano le tre ipotesi diagnostiche (§4.2):

1. **Innesco.** L'ingresso nasce dalla lettura, non da Giochi. Ma negli articoli di attualità non abbiamo trovato rimandi ai giochi [O, audit sull'HTML statico].
2. **Continuità.** Ogni partita è completa in sé. La streak esistente premia chi è già abituale; per chi gioca due giorni su sette è sempre a zero, quindi punisce invece di attrarre [O]. Duolingo mostra che la *forma* della streak conta: rendere più facile mantenerla ha aumentato del 40% gli utenti con streak di 7+ giorni [F, BENCHMARK S23].
3. **Sforzo.** Otto giochi tra cui scegliere e formati lunghi (cruciverba, sudoku) mal si adattano a una pausa di tre minuti. La filosofia di NYT Games è esplicita: «We don't want 24/7 engagement» [F, S3].

E una frizione di **fiducia**: il primo tema delle recensioni negative è la perdita di progressi e i problemi di login [F, 271 recensioni App Store lette]. Un prodotto che chiede «torna domani» non può perdere ciò che hai fatto ieri.

## 3. Concept strategici valutati

Abbiamo generato quattro concept realmente diversi e li abbiamo valutati su nove criteri (punteggi da 1 a 5, giudizio del team; per la complessità, 5 = più semplice).

| Concept | Idea | Impatto | Originalità | Fit brand | Chiarezza 35–55 | Abitudine | Integrazione Corriere | Complessità | Misurabilità | Totale |
|---|---|---|---|---|---|---|---|---|---|---|
| **A · Il Filo** | Edizione quotidiana di 3 micro-giochi → indizio → Nodo settimanale; recupero dei giorni persi | 5 | 5 | 5 | 4 | 5 | 5 | 3 | 5 | **37** |
| B · Gioca la notizia (da solo) | Micro-giochi dentro gli articoli come prodotto autonomo | 4 | 4 | 5 | 5 | 2 | 5 | 4 | 5 | 34 |
| C · Circoli sociali | Gruppi privati con classifiche e chat | 3 | 2 | 3 | 3 | 4 | 2 | 2 | 4 | 23 |
| D · Percorso personale | Livelli, missioni e raccomandazioni personalizzate | 3 | 2 | 3 | 3 | 3 | 2 | 3 | 4 | 23 |

Il potenziale di sviluppo, nono criterio, è valutato a parte: è alto per A (stagioni tematiche, Filo speciali per eventi come Sanremo o le elezioni, sponsorizzazioni editoriali), medio per B, basso per C e D.

**Perché A.**
- B porta lettori ma non crea un motivo per tornare: è un ottimo *canale*, non un *sistema*. Per questo diventa l'ingresso del Filo.
- C duplica funzioni esistenti: le Sfide tra amici, con link d'invito e classifica privata, ci sono già [F]. Inoltre parte a freddo.
- D è indistinguibile da qualsiasi app di gioco e non sfrutta il vantaggio editoriale.
- A è l'unico concept che lega retention e acquisizione con una sola meccanica, che solo un quotidiano può alimentare (indizi e domande scritti dalla redazione), e che si misura con un A/B pulito.

**Perché il Filo non è un clone di Wordle e non dipende dalle streak.** Il Filo non è un nuovo gioco: riusa formati esistenti (Quiz, Prima o Dopo) in versione breve e aggiunge un **arco narrativo settimanale** con un finale, il Nodo. Il traguardo è settimanale e **sempre raggiungibile** grazie al recupero; la streak esistente resta invariata. Le notifiche sono una leva tra le altre, con limiti rigidi (§4.6).

## 4. Case 1 — Retention

### 4.1 Segmentazione del target

Target del brief: utenti registrati, abbonati e non, con ≥1 giorno di gioco negli ultimi 30 e <3 giorni a settimana.

| Segmento [A] | Riconoscibile da | Leva prioritaria |
|---|---|---|
| **Occasionali da notizia** | ≥50% delle sessioni con referrer da articolo o homepage | «Gioca la notizia» + card nell'app News: il gioco va dove leggono |
| **Giocatori del weekend** | ≥60% dei giorni di gioco tra sabato e domenica | Il Nodo della domenica dà senso ai giorni feriali; email del sabato |
| **Abituali in calo** | Erano ≥3 giorni/settimana nei 60 giorni precedenti, ora <3 | Riattivazione R2/R4, recupero degli indizi, nessun messaggio di colpa |
| **Nuovi non ancorati** | Registrati da <30 giorni | Prima settimana guidata: obiettivo 3 giorni su 7 (Twipe [F, S19]) |

Trasversalmente: **abbonati digitali con Giochi incluso** (priorità economica: churn), **abbonati senza add-on** (possibile upsell, mai accesso premium regalato), **registrati non abbonati**.

### 4.2 Tre ipotesi diagnostiche e dati per verificarle

| Ipotesi | Segnale atteso se vera | Dati e metodo | Leva se confermata |
|---|---|---|---|
| **H1 · Nessun appuntamento.** Gli occasionali non hanno un innesco ricorrente: arrivano per caso | Sessioni prevalentemente da articoli o homepage, orari dispersi; a parità di frequenza passata, chi gioca a orario stabile ha un ritorno a 7 giorni più alto | Sorgente di ogni sessione (referrer, parametri `intcmp` già usati [F]); deviazione standard dell'ora di gioco per utente; regressione del ritorno a 7 giorni su sorgente e regolarità oraria, con controllo per frequenza passata | Edizione in home, card nell'app News, promemoria all'orario abituale |
| **H2 · Nessun motivo per domani.** La partita si chiude in sé | Il D1 non dipende dall'esito della partita; dopo un'interruzione della streak la frequenza cala per ≥2 settimane; clic quasi nulli sulla schermata di fine partita | D1 per gioco e per esito; event study sulla frequenza dopo una streak interrotta (lunghezza ≥3); clic a fine partita | Il Filo: indizi, recupero, Nodo |
| **H3 · Attrito e fiducia.** Scelta, durata e affidabilità | Basso completamento dei giochi lunghi tra gli occasionali; ritorno più basso dopo errori di login o perdita di progressi; tempo al primo gesto alto | Completamento per gioco e dispositivo; tempo al primo gesto; log degli errori di sessione e del vincolo «un solo dispositivo» [F]; classificazione delle recensioni | Fix di affidabilità (prerequisito), Edizione da 3 minuti, ingresso da ospite |

Tempi: 2–3 settimane nella fase Validate, con dati esistenti. Basta confermarne una tra H1 e H2 per proseguire (go/no-go).

### 4.3 Percorso attuale ipotizzato e punti di frizione [O]

1. Legge un articolo → (nessun rimando al gioco nella pagina)
2. Vede la fascia giochi in homepage o apre l'app → **scelta tra 8 giochi**
3. Gioca, magari un gioco lungo → **abbandono** se il tempo è poco
4. Finisce → statistiche, streak a 1 → **nessun motivo per domani**
5. Domani → **nessun innesco personale** (newsletter giochi non trovata; push non verificabili [F, audit])
6. Se ha perso progressi o si è sloggato → **perdita di fiducia**

### 4.4 Esperienza futura

1. Legge un articolo → «Gioca la notizia» oppure la card del Filo nell'app News
2. Apre Giochi → **l'Edizione di oggi** è la prima cosa che vede (il catalogo resta sotto)
3. Tre minuti → **indizio** (arriva anche sbagliando)
4. Il **Filo** mostra 2 indizi su 6 e domani ne esce un altro; se ha saltato martedì, lo **recupera**
5. Domani, all'ora in cui legge il Corriere, un promemoria **parla del suo progresso** (solo con consenso)
6. Domenica scioglie il **Nodo** e vede la **Sfida settimanale** con familiari e amici
7. Lunedì: **nuovo Filo**, si riparte da zero, senza debiti

### 4.5 Leve di prodotto

Formato: **Problema → Insight → Soluzione → Meccanismo comportamentale → Esperimento → KPI → Rischi** (con il punto del percorso in cui interviene).

#### L1 · L'Edizione del giorno *(home Giochi; ingresso da articolo, app News, push)*
- **Problema.** Otto giochi equivalenti e formati lunghi: l'occasionale non sa cosa fare in tre minuti.
- **Insight.** «Non mi perdo mai Prima o Dopo e il Quiz» (recensione [F]): i formati brevi sono già rituali per alcuni utenti.
- **Soluzione.** Un percorso curato di 3 micro-giochi (una domanda del Quiz legata al giornale, Prima o Dopo con 4 eventi, un anagramma). Circa 3 minuti, con uno stato «fatto».
- **Meccanismo.** Riduzione dello sforzo e della scelta; *completion*: un compito chiuso e finito.
- **Esperimento.** R1.
- **KPI.** Completamento dell'Edizione; durata mediana ≤4 minuti; giorni di gioco a settimana.
- **Rischi.** Cannibalizzazione dei giochi lunghi (guardrail −5%); carico redazionale (template e calendario, soglia di 3 ore al giorno).

#### L2 · Gli indizi recuperabili *(fine Edizione, home)*
- **Problema.** La streak si azzera: per l'occasionale il traguardo è sempre perso.
- **Insight.** Le streak con protezione o recupero trattengono di più di quelle punitive [F, Duolingo S22–S23]; un traguardo sempre raggiungibile sostiene la motivazione (*goal gradient*).
- **Soluzione.** Ogni Edizione completata dà l'indizio del giorno. Un giorno perso si recupera entro la settimana: si ottiene l'indizio, ma vale 1 punto invece di 2.
- **Meccanismo.** Progresso accumulato (*endowed progress*), avversione alla perdita senza punizione, *fresh start* il lunedì.
- **Esperimento.** R1 (componente del trattamento). Variante successiva da testare: con e senza recupero.
- **KPI.** Giorni di gioco a settimana; quota di utenti con ≥4 giorni su 7; indizi per settimana.
- **Rischi.** Il recupero può sostituire il gioco puntuale: si misura la quota di indizi puntuali rispetto a quelli recuperati.

#### L3 · Il Nodo della domenica *(domenica; email del sabato)*
- **Problema.** Nessuna attesa: niente collega lunedì a domenica.
- **Insight.** Un arco narrativo con un finale crea anticipazione (effetto Zeigarnik: i compiti aperti restano in mente).
- **Soluzione.** Domenica si indovina chi o che cosa lega i sei indizi. Più indizi si hanno, più è facile.
- **Meccanismo.** Curiosità e attesa, compito aperto, ricompensa variabile.
- **Esperimento.** R1; secondarie: risoluzione del Nodo, giorni di gioco nei feriali.
- **KPI.** Quota di adottanti che tenta il Nodo; giorni feriali di gioco.
- **Rischi.** Nodo troppo difficile o troppo facile: si calibra con il tasso di soluzione (obiettivo 50–70% tra chi ha ≥4 indizi).

#### L4 · La Sfida settimanale *(Sfide esistenti)*
- **Problema.** Le classifiche sono mensili o generali e percepite come ingiuste [F, recensioni]; il confronto è lontano.
- **Insight.** Il confronto con persone vicine (famiglia, colleghi) è più motivante di una classifica anonima [F, LinkedIn S15–S16].
- **Soluzione.** Le Sfide tra amici, già esistenti, ricevono una vista settimanale sui punti del Filo (2 puntuale, 1 recuperato, 4 Nodo). Si azzerano il lunedì.
- **Meccanismo.** *Social accountability* e confronto sociale tra pari.
- **Esperimento.** Incluso in R1; valutato separatamente nella fase Scale.
- **KPI.** Ritorno a 7 giorni dei membri delle Sfide; inviti per membro.
- **Rischi.** Pressione sociale indesiderata: le Sfide restano opzionali e private.

#### L5 · Affidabilità di login e progressi *(trasversale, prerequisito)*
- **Problema.** Perdita di progressi, sessione su un solo dispositivo, abbonamento non riconosciuto [F].
- **Insight.** Nessuna leva di ritorno funziona se il ritorno trova i progressi persi.
- **Soluzione.** Piano di correzione con il fornitore della piattaforma; salvataggio lato server dello stato dell'Edizione; per gli ospiti, migrazione dello stato locale al momento della registrazione.
- **Meccanismo.** Fiducia, riduzione dell'attrito.
- **Esperimento.** Nessun A/B (è un difetto da correggere); monitoraggio prima e dopo.
- **KPI.** Errori di sessione per 1.000 sessioni; quota di recensioni 1–2★ su login e progressi; ritorno dopo un errore.
- **Rischi.** Dipendenza dal fornitore.

### 4.6 Riattivazione: piano d'azione sui canali

| Regola | Segmento / condizione | Canale | Quando | Messaggio (tono di progresso) | Limite |
|---|---|---|---|---|---|
| **R1** Promemoria | Utenti con consenso, Edizione di oggi non fatta | Push app Giochi | All'orario abituale (mediana degli ultimi 14 giorni di gioco o lettura) | «Il nuovo indizio è uscito. Sei a 3 su 6.» | Max 1 al giorno su tutti i canali |
| **R2** Giorno saltato | Ieri niente Edizione, indizio recuperabile | Push oppure **card nell'app News** (senza invio) | Il mattino dopo | «L'indizio di giovedì ti aspetta. Oggi ne esce un altro.» | Stop dopo 2 messaggi ignorati di fila |
| **R3** Nodo | ≥1 indizio raccolto, Nodo non risolto | Email del sabato + push la domenica | Sabato 9:00, domenica all'orario abituale | «Il Nodo si scioglie domani: hai 4 indizi su 6.» | 1 email a settimana |
| **R4** Nuovo inizio | ≥7 giorni senza giocare | Email | Lunedì mattina | «Comincia un nuovo Filo. Nessun debito dalla settimana scorsa.» | 1 volta per pausa |
| **R5** Inattivo | ≥21 giorni senza giocare | Email | Una volta | Il Nodo della settimana scorsa e il primo indizio della nuova | Poi silenzio fino a una nuova visita |

In più c'è un **blocco del Filo nelle newsletter editoriali esistenti** (il lunedì): non è un invio aggiuntivo.

**Gestione delle interruzioni.** L'abitudine si interrompe per motivi normali (viaggi, lavoro). Il design non la punisce: recupero nella settimana, ripartenza pulita il lunedì (*fresh start*), messaggi che non colpevolizzano, silenzio dopo i messaggi ignorati.

**Esperimento:** R2 (progresso contro generico contro holdout). **Guardrail:** opt-out delle push, disiscrizioni, pressione CRM complessiva.

### 4.7 Misurazione del Case 1

North Star e definizioni in METRICS.md; esperimenti R1, R2 e holdout in EXPERIMENTS.md. Metrica primaria di R1: quota di utenti abituali (≥4 giorni su 7) nelle settimane 3–6, intention-to-treat.

## 5. Case 2 — Acquisizione

### 5.1 Differenze tra tipi di utente

| Tipo | Cosa può fare oggi [F] | Cosa proponiamo | Cosa NON assumiamo |
|---|---|---|---|
| Lettore anonimo | Giocare il gioco del giorno senza login | Edizione da ospite dal modulo; stato salvato sul dispositivo per 7 giorni | Nessun accesso all'archivio o ai formati premium |
| Registrato non abbonato | Salvare i progressi, le Sfide | Filo completo, recupero, Sfide | Il cruciverba completo resta limitato come oggi |
| Abbonato digitale senza add-on | Giochi gratuiti + add-on a pagamento | Filo completo; upsell contestuale all'archivio, mai forzato | Non regaliamo l'add-on |
| Abbonato con Giochi incluso | Tutto | Filo completo + archivio dei Fili passati | — |

**L'Edizione usa solo formati e contenuti gratuiti**, quindi non tocca il modello di pricing.

### 5.2 Punti di contatto e logiche di acquisizione

| Punto di contatto | Meccanica | Logica | Metrica |
|---|---|---|---|
| **Articoli, web e app News** | «Gioca la notizia»: domanda in pagina dopo il 2° paragrafo, poi l'Edizione da ospite | Articoli scelti dalla redazione (5–20 al giorno); esclusi i giocatori attivi; max 1 al giorno per lettore; non su articoli sensibili (cronaca nera, lutti) | Lettore → giocatore attivato a 7 giorni |
| **Feed dell'app News** | Card del Filo con l'indizio del giorno | Mostrata a chi ha giocato o interagito col modulo; persistente, non invasiva | D1 e D7 dei nuovi giocatori |
| **Homepage Corriere.it** | La fascia giochi esistente porta all'Edizione di oggi | Un ingresso al posto di otto | Clic → Edizione completata |
| **Newsletter Corriere** | Blocco «Il Filo di questa settimana» | Lunedì: è il giorno migliore per iniziare | Clic → prima Edizione |
| **Cartaceo** | QR con la domanda del giorno (test opzionale) | Ponte verso il digitale per i lettori di carta 35–55 | Scansioni → registrazioni |
| **Giocatori ambasciatori** | Invito che si gioca subito | §5.4 | Nuovi attivi per invitante |

**Il ritmo settimanale come leva di acquisizione [O].** Gli sforzi promozionali si concentrano il lunedì, quando comincia un nuovo Filo: chi entra parte da 1 su 6 e non da indietro.

### 5.3 Meccanica di conversione lettore → giocatore e prima esperienza

- **Time-to-value sotto i 3 minuti.** La risposta nell'articolo conta già come primo gioco (*endowed progress*): si parte da 1 su 3.
- **Prima il valore, poi l'account.** Si gioca da ospite e il salvataggio viene chiesto *dopo* l'indizio, con tre opzioni legittime: account, promemoria nel calendario (.ics, senza account) o nessuna.
- **Un motivo concreto per tornare domani.** «Il prossimo indizio esce domani alle 7»: un orario preciso e un arco iniziato.
- **Integrazione lettura–gioco–ritorno.** Il mattino dopo, la card nell'app News ritrova il nuovo giocatore dove legge già, anche senza consenso alle push.
- **Guardrail di lettura.** Il modulo non deve ridurre la lettura: scroll, completamento e ricavo per pagina vista sono monitorati (A1).

### 5.4 Referral: evoluzione delle Sfide esistenti

Le Sfide tra amici esistono già, con link d'invito e classifica privata, ma richiedono la registrazione per sfidare [F]. Cambiamo quattro cose:

1. **Momento.** L'invito compare a fine Edizione, quando il giocatore è soddisfatto.
2. **Oggetto.** «Fai anche tu l'Edizione di oggi», con una card senza spoiler pensata per WhatsApp.
3. **Landing.** L'invitato **gioca prima**, poi vede il confronto, poi crea l'account per entrare nella Sfida e recuperare gli indizi.
4. **Premio di qualità.** Un indizio jolly all'invitante, solo quando l'invitato gioca in due giorni diversi. Nessun valore economico.

**Misurazione incrementale.** L'attribuzione (codice d'invito, finestra di 7 giorni, esclusione di chi ha già un account o uno storico di gioco) dice *da dove* arriva un giocatore. La randomizzazione per invitante (A3) dice se *non sarebbe arrivato comunque*.

### 5.5 Misurazione del Case 2

KPI principale: lettori 35–55 mai giocato con ≥1 Edizione completata entro 7 giorni, diviso lettori esposti. A seguire: D1, abituali a 4 settimane, registrazioni attribuite. Esperimenti A1, A2 e A3 in EXPERIMENTS.md.

## 6. Principi comportamentali → scelte di design verificabili

| Principio | Scelta di design | Come si verifica |
|---|---|---|
| Innesco esterno in un contesto già abituale | Modulo nell'articolo; card nell'app News; push all'orario abituale | A1; R2 (orario personale contro standard) |
| Riduzione dello sforzo (motivazione × abilità × innesco) | Edizione da 3 minuti; ingresso da ospite | Completamento dell'Edizione; A2 |
| Progresso avviato | La risposta nell'articolo conta come 1 su 3 | Edizioni iniziate dopo la risposta (A1) |
| Gradiente dell'obiettivo | Filo da 6 indizi con barra di progresso | Probabilità di giocare in funzione degli indizi già raccolti |
| Avversione alla perdita senza punizione | Recupero degli indizi, nessun azzeramento | Ritorno dopo un giorno saltato (R1, braccio di trattamento) |
| Fresh start | Nuovo Filo ogni lunedì; R4 | Riattivazione degli inattivi il lunedì contro gli altri giorni |
| Compito aperto e attesa | Nodo della domenica | Giorni feriali di gioco; tentativi del Nodo |
| Accountability sociale | Sfida settimanale; invito a fine Edizione | Ritorno a 7 giorni dei membri; A3 |
| Reciprocità e curiosità | Il risultato dell'amico si vede dopo aver giocato | Landing → Edizione (A3) |
| Fiducia | Progressi affidabili, prima di tutto | Errori di sessione; recensioni |

## 7. Modello d'impatto

Il modello è implementato in `lib/model.ts`, coperto dai test in `tests/model.test.ts` ed esplorabile nel Growth Lab. **Tutti i valori sono ipotesi illustrative [A].**

### 7.1 Formule

- Adottanti = eleggibili × esposizione × adozione
- Abituali incrementali (retention) = adottanti × incremento assoluto della probabilità di diventare abituali
- Prime Edizioni incrementali (acquisizione) = lettori/mese × esposizione al modulo × 12 × (conv. trattamento − conv. controllo)
- Abituali incrementali (acquisizione) = prime Edizioni incrementali × quota di abituali a 4 settimane
- Nuovi giocatori da referral = base di abituali × inviti/mese × 12 × invito→gioco × quota di nuovi × incrementalità
- Abbonamenti incrementali = abituali incrementali × quota non abbonata × Δ tasso di abbonamento × **κ**
- Abbonati trattenuti = adottanti × quota di abbonati digitali × riduzione causale del churn
- Valore = abbonamenti × €/anno × LTV a 3 anni + trattenuti × ARPU digitale + giorni di gioco × €/giorno adv + registrazioni × €/registrato
- Costo annuo = esercizio + sviluppo / 3

**κ** rende esplicito che la correlazione abitudine → abbonamento non è tutta causale. Si stima solo con l'holdout di lungo periodo.

### 7.2 Scenari (vista annua a regime)

| | Prudente | Base | Ottimistico |
|---|---|---|---|
| Giocatori abituali in più | ≈6.300 | ≈21.700 | ≈49.900 |
| DAU medi in più | ≈3.700 | ≈11.200 | ≈23.900 |
| Abbonamenti incrementali | ≈130 | ≈740 | ≈2.400 |
| Abbonati digitali trattenuti | ≈210 | ≈590 | ≈1.130 |
| Valore annuo | ≈€87k | ≈€251k | ≈€530k |
| Costo annuo | ≈€253k | ≈€253k | ≈€253k |
| **Valore netto** | **≈ −€166k** | **≈ −€2k (pareggio)** | **≈ +€277k** |

**Lettura onesta.** Nel caso base il progetto è in pareggio. Il valore dipende soprattutto da tre ipotesi: la conversione di «Gioca la notizia», il volume di lettori esposti e la quota causale κ. Sono esattamente le cose che la fase Validate e il pilot misurano spendendo poco. Pareggio significa che ogni giocatore abituale incrementale deve valere almeno ≈€12 l'anno.

## 8. Rischi principali e mitigazioni

| Rischio | Mitigazione |
|---|---|
| Effetto novità che svanisce | Metrica primaria sulle settimane 3–6; holdout |
| Cannibalizzazione dei giochi lunghi | Guardrail −5%; il catalogo resta in home |
| Carico redazionale | Template, calendario degli indizi pianificato con una settimana d'anticipo, soglia di 3 ore al giorno |
| Dipendenza dal fornitore della piattaforma | Accordo nella settimana 1; il pilota email non dipende dal fornitore |
| Affaticamento da notifiche | Max 1 al giorno, stop dopo 2 ignorate, holdout in R2 |
| Modulo negli articoli percepito come intrusivo | Selezione redazionale, esclusione dei temi sensibili, guardrail di lettura |
| Privacy degli ospiti | Identificativi first-party nel rispetto della CMP; nessun dato personale prima della registrazione |
| Domande «da esame» che mettono a disagio | L'indizio arriva completando, non indovinando; tono leggero |

## 9. Cosa è nuovo e cosa esiste già

| Esiste già [F] | Nuovo nella proposta |
|---|---|
| 8 giochi, tra cui Quiz e Prima o Dopo | L'Edizione: percorso curato di 3 formati brevi |
| Streak, trofei, statistiche | Il Filo: indizi recuperabili e Nodo settimanale |
| Classifiche mensili e generali | Vista settimanale delle Sfide sui punti del Filo |
| Sfide tra amici con link (registrazione richiesta) | Invito a fine Edizione, landing «gioca prima», premio dopo 2 giorni, attribuzione |
| Fascia giochi in homepage, sezione nell'app News | «Gioca la notizia» negli articoli; card del Filo nel feed |
| — (newsletter giochi non trovata) | Lifecycle basato sul progresso (R1–R5); blocco del Filo nelle newsletter |

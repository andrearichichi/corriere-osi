# Piano degli esperimenti

> Generato da `data/experiments.ts` con `npm run docs`. Non modificare a mano: modifica la fonte dati.

Cinque esperimenti randomizzati: due per la Retention (R1, R2) e tre per l'Acquisizione (A1, A2, A3). In più, un **holdout di lungo periodo**: il 10% del target resta fuori dal Filo per 6 mesi.

## Principi comuni

- **Pre-registrazione.** Prima del lancio si fissano ipotesi, metrica primaria, guardrail con soglie, MDE, durata e criterio decisionale. Nessuna analisi «a sorpresa» decide il rilascio.
- **Intention-to-treat.** Si analizza chi è stato *assegnato*, non chi ha *usato* la funzione, per evitare l'autoselezione.
- **Numerosità.** Non indichiamo numerosità arbitrarie. L'MDE si calcola dalla baseline reale (misurata nella fase Validate) e dal traffico disponibile:
  `MDE = (z₁₋α/₂ + z₁₋β) · √(2·p₀·(1−p₀)/n)`, con α = 5% e potenza dell'80%. Il calcolatore è nel Growth Lab (tab Esperimenti). Se l'MDE è più grande dell'effetto plausibile, si allunga il test o si sceglie una metrica più sensibile; non si abbassa l'asticella.
- **Durata minima.** Due cicli settimanali completi del Filo (14 giorni) più la finestra di misura; per R1 si leggono le settimane 3–6, per escludere l'effetto novità.
- **Test multipli.** Una sola metrica primaria per test; le secondarie sono esplorative. Se si leggono più varianti (R2: A/B/C), si applica la correzione di Holm.
- **Interferenze.** R1 e A1 coinvolgono popolazioni diverse (giocatori occasionali e lettori che non hanno mai giocato). R2 vive dentro il braccio di trattamento di R1. A3 randomizza per invitante.
- **Holdout di lungo periodo.** È l'unico modo per stimare l'effetto causale su abbonamenti e churn (il parametro κ del modello). Si legge a 3 e a 6 mesi.

## Riepilogo

| ID | Case | Esperimento | Unità | Metrica primaria |
|---|---|---|---|---|
| R1 | Retention | Il Filo contro l'esperienza attuale | Utente (ID account), assegnato con hash stabile | Quota di utenti abituali (≥4 giorni di gioco su 7) nelle settimane 3–6 dall'assegnazione, intention-to-treat. |
| R2 | Retention | Riattivazione basata sul progresso | Utente | Rientro con un'Edizione completata entro 24 ore dall'invio, intention-to-treat (chi non apre incluso). Confronto principale C contro B. |
| A1 | Acquisizione | «Gioca la notizia» contro il promo attuale | Utente | Lettori con ≥1 Edizione completata entro 7 giorni, diviso lettori esposti. |
| A2 | Acquisizione | Prima esperienza: valore prima della richiesta | Utente o dispositivo al primo accesso | Ritorno D1: gioco completato nel giorno di calendario successivo (Europe/Rome). |
| A3 | Acquisizione | Un invito che si gioca subito | Invitante (cluster) | Quota di invitanti che portano ≥1 nuovo giocatore attivo (≥2 giorni di gioco nei primi 7) entro 4 settimane. |

## R1 · Il Filo contro l'esperienza attuale

- **Ipotesi.** Se la home Giochi propone l'Edizione del giorno e il Filo della settimana, più giocatori occasionali diventano abituali, perché ogni giorno ha un compito chiaro e un motivo per tornare l'indomani.
- **Controllo.** Home Giochi attuale: catalogo, statistiche, Sfide e classifiche.
- **Trattamento.** Home con Edizione e Filo in testa; catalogo invariato sotto. Nessun messaggio di lifecycle aggiuntivo, per isolare l'effetto del prodotto.
- **Popolazione.** Utenti registrati, abbonati e non, con ≥1 giorno di gioco negli ultimi 30 e <3 giorni a settimana nelle 4 settimane precedenti. Web e app. Esclusi gli account interni.
- **Unità di randomizzazione.** Utente (ID account), assegnato con hash stabile: stessa esperienza su tutti i dispositivi.
- **Metrica primaria.** Quota di utenti abituali (≥4 giorni di gioco su 7) nelle settimane 3–6 dall'assegnazione, intention-to-treat.
- **Metriche secondarie.** Giorni di gioco medi a settimana; ritorno D1; completamento dell'Edizione; risoluzione del Nodo.
- **Guardrail.** Tempo sui giochi lunghi (cruciverba, sudoku): calo massimo −5%. Recensioni e segnalazioni sui progressi. Disiscrizioni. Churn degli abbonati, misurato sull'holdout.
- **Criterio decisionale.** Rilascio se il limite inferiore dell'IC 95% della differenza è > 0, l'effetto stimato raggiunge l'MDE pre-registrato e nessun guardrail supera la soglia. Holdout del 10% mantenuto per 6 mesi.
- **Limiti interpretativi.** Effetto novità: per questo si escludono le settimane 1–2. Contaminazione tramite le Sfide, perché amici in bracci diversi si vedono: la stima risulta conservativa. L'ITT diluisce l'effetto su chi non apre Giochi.
- **Parametri del simulatore** (*ipotesi illustrative, non dati*): baseline 8%, effetto relativo ipotizzato +25%, 20.000 utenti per braccio come punto di partenza.

## R2 · Riattivazione basata sul progresso

- **Ipotesi.** Un messaggio che nomina l'indizio recuperabile, inviato all'orario in cui l'utente di solito gioca o legge, fa rientrare più utenti di un promemoria generico, senza aumentare le disiscrizioni.
- **Controllo.** B: promemoria generico all'orario standard. È presente anche un braccio A di holdout (10%) che non riceve nulla.
- **Trattamento.** C: messaggio di progresso («l'indizio di giovedì ti aspetta») all'orario personale, al massimo uno al giorno.
- **Popolazione.** Utenti del braccio Filo con consenso a push o email che hanno saltato ≥1 giorno nella settimana.
- **Unità di randomizzazione.** Utente.
- **Metrica primaria.** Rientro con un'Edizione completata entro 24 ore dall'invio, intention-to-treat (chi non apre incluso). Confronto principale C contro B.
- **Metriche secondarie.** Giorni di gioco nei 7 giorni successivi, per distinguere un ritorno anticipato da un ritorno in più; differenza B contro A, cioè il valore del messaggio in sé.
- **Guardrail.** Opt-out delle push: massimo +0,5 punti. Disiscrizioni email. Segnalazioni di spam. Pressione complessiva del CRM Corriere.
- **Criterio decisionale.** C sostituisce B se l'IC 95% della differenza è > 0 e gli opt-out restano sotto la soglia. Se B non batte A, il canale va ripensato.
- **Limiti interpretativi.** Interferenza con altri invii del Corriere. Una finestra di 24 ore può spostare il ritorno senza aumentarlo: per questo i giorni a 7 giorni sono la metrica secondaria vincolante.
- **Parametri del simulatore** (*ipotesi illustrative, non dati*): baseline 12%, effetto relativo ipotizzato +20%, 15.000 utenti per braccio come punto di partenza.

## A1 · «Gioca la notizia» contro il promo attuale

- **Ipotesi.** Una domanda dentro l'articolo, legata a ciò che si sta leggendo, converte più lettori in giocatori di un rimando promozionale, senza ridurre la lettura.
- **Controllo.** Rimando promozionale ai giochi nella stessa posizione dell'articolo.
- **Trattamento.** Modulo «Gioca la notizia»: domanda con risposta nella pagina e prosecuzione nell'Edizione da ospite.
- **Popolazione.** Lettori di web e app News su articoli selezionati dalla redazione, senza eventi di gioco negli ultimi 90 giorni. La fascia 35–55 è un segmento pre-registrato, ma l'età è nota solo per i registrati.
- **Unità di randomizzazione.** Utente: ID account se loggato, altrimenti ID first-party del browser o dell'app. Mai la singola pagina vista, perché la stessa persona vedrebbe entrambi i bracci.
- **Metrica primaria.** Lettori con ≥1 Edizione completata entro 7 giorni, diviso lettori esposti.
- **Metriche secondarie.** Ritorno D1 dei nuovi giocatori; registrazioni; tasso di risposta al modulo.
- **Guardrail.** Profondità di scroll e completamento della lettura: calo massimo −2%. Tempo sull'articolo. Pagine per sessione. Ricavo pubblicitario per pagina vista. Performance (CLS).
- **Criterio decisionale.** Estensione se la conversione del trattamento supera il controllo con IC 95% > 0 e i guardrail di lettura restano entro −2%.
- **Limiti interpretativi.** Sul web la cancellazione dei cookie sottostima i ritorni; chi usa più dispositivi non viene ricongiunto. L'effetto per età è osservabile solo sui registrati.
- **Parametri del simulatore** (*ipotesi illustrative, non dati*): baseline 0,3%, effetto relativo ipotizzato +233%, 60.000 utenti per braccio come punto di partenza.

## A2 · Prima esperienza: valore prima della richiesta

- **Ipotesi.** Un primo accesso che offre l'Edizione da ospite, un indizio, la promessa di domani e la scelta del promemoria aumenta il ritorno del giorno dopo rispetto al flusso attuale.
- **Controllo.** Primo gioco attuale: gioco singolo e invito a registrarsi secondo il flusso esistente.
- **Trattamento.** Edizione da ospite, indizio, richiesta di salvataggio dopo il valore con tre opzioni (account, calendario, nessuna).
- **Popolazione.** Nuovi giocatori al primo evento di gioco, da qualsiasi sorgente.
- **Unità di randomizzazione.** Utente o dispositivo al primo accesso.
- **Metrica primaria.** Ritorno D1: gioco completato nel giorno di calendario successivo (Europe/Rome).
- **Metriche secondarie.** Attivazione a 7 giorni (≥2 giorni di gioco nei primi 7); registrazione; consensi a un promemoria.
- **Guardrail.** Tasso di registrazione: massimo −10% relativo, un compromesso dichiarato. Completamento del primo gioco.
- **Criterio decisionale.** Rilascio se il D1 migliora con IC 95% > 0 e la registrazione resta entro il guardrail. Conferma richiesta anche sull'attivazione a 7 giorni.
- **Limiti interpretativi.** Il D1 degli ospiti dipende dalla persistenza dell'identificativo: lo si misura sugli identificabili e lo si conferma con l'attivazione a 7 giorni.
- **Parametri del simulatore** (*ipotesi illustrative, non dati*): baseline 22%, effetto relativo ipotizzato +15%, 12.000 utenti per braccio come punto di partenza.

## A3 · Un invito che si gioca subito

- **Ipotesi.** Un invito contestuale a fine Edizione, una landing senza registrazione e un premio non monetario all'invitante aumentano i nuovi giocatori attivi portati da ciascun giocatore abituale.
- **Controllo.** Sfida attuale: la registrazione è richiesta prima di giocare.
- **Trattamento.** Invito a fine Edizione, card senza spoiler, landing «gioca prima», premio (un indizio jolly) dopo due giorni di gioco dell'invitato.
- **Popolazione.** Giocatori abituali registrati (≥4 giorni di gioco in ciascuna delle ultime 2 settimane).
- **Unità di randomizzazione.** Invitante (cluster): tutti i suoi invitati vedono il flusso del suo braccio, così non c'è contaminazione.
- **Metrica primaria.** Quota di invitanti che portano ≥1 nuovo giocatore attivo (≥2 giorni di gioco nei primi 7) entro 4 settimane.
- **Metriche secondarie.** Inviti per invitante; landing → Edizione; registrazioni attribuite.
- **Guardrail.** Segnalazioni di spam; account multipli o abusi del premio; disiscrizioni degli invitati.
- **Criterio decisionale.** Rilascio se l'IC 95% della differenza è > 0 e gli abusi restano sotto lo 0,5% degli inviti.
- **Limiti interpretativi.** Gli invitanti attivi sono pochi, quindi la potenza è limitata: servono più settimane. L'attribuzione non misura chi sarebbe arrivato comunque; la randomizzazione per invitante sì.
- **Parametri del simulatore** (*ipotesi illustrative, non dati*): baseline 4%, effetto relativo ipotizzato +50%, 8000 utenti per braccio come punto di partenza.


# Ricerca — sintesi

> Sintesi delle tre ricerche che fondano la strategia. Dettagli e fonti in:
> - **PRODUCT_AUDIT.md** — audit pubblico di Corriere Giochi (consultato il 21/11/2026)
> - **BENCHMARK.md** — NYT Games, LinkedIn Games, Guardian, Washington Post, The Atlantic, Puzzmo, Duolingo (consultato il 21/11/2026)
>
> **Legenda:** [F] fatto con fonte · [O] osservazione o inferenza · [NV] non verificabile (dietro login o paywall, o non raggiungibile).

## 1. Metodo e limiti

- **Fonti pubbliche.** Pagine corriere.it/giochi e /app-giochi, materiali RCS MediaGroup, schede App Store e Google Play (con le recensioni), stampa di settore, comunicazioni e report pubblici dei concorrenti.
- **Nessun accesso autenticato.** Non abbiamo giocato da utenti loggati né visto checkout, profili o archivio: ciò che sta dietro login è marcato [NV].
- **Codice pubblico.** Alcune funzioni sono confermate solo dal codice JavaScript pubblico della piattaforma di gioco: dimostra che la funzione esiste nel codice, non come appare né se è attiva per tutti.
- **Nessun dato interno.** Ogni numero del Corriere riportato qui è pubblico. Tutto il resto, nel modello e nel prototipo, è etichettato come ipotesi o simulazione.

## 2. Product audit: cosa conta per la strategia

**Confermato [F]**
- Otto giochi: Il Quiz del Corriere, In altre parole, Apegramma, Prima o Dopo, Cruciverba, Mini Cruciverba, Sudoku, Crucipuzzle.
- Il gioco del giorno è gratuito per quasi tutti; archivio e varianti per abbonati.
- Esistono streak, statistiche, trofei, punti e livelli; classifiche mensili e generali dal 25/06/2026; Sfide tra amici con link d'invito e classifica privata.
- Giochi è incluso in Naviga Premium e Tutto+; add-on per gli altri abbonati (€1 il primo anno sul web; in app iOS €2,49 al mese o €24,99 all'anno).
- Corriere ha 805 mila abbonamenti digitali (settembre 2026).
- App Store: 4,6 con 3.559 valutazioni; Google Play: 4,4 con 1,28 mila recensioni e oltre 100 mila download.

**Cosa dicono le recensioni [F, 271 lette su App Store]:** problemi di login e abbonamento non riconosciuto; perdita di progressi (soprattutto Apegramma); classifiche percepite come ingiuste e notifiche dei punti invasive; paywall vissuto come un cambio di regole (novembre 2025). Tra i commenti positivi, il gioco come «appuntamento quotidiano» e il fatto che alcuni utenti non saltano mai Quiz e Prima o Dopo.

**Osservazioni [O]:** negli articoli di attualità non risultano rimandi ai giochi; non c'è una newsletter giochi; il gioco è un catalogo senza un percorso suggerito.

**Non verificabile [NV]:** esistenza e regole delle notifiche push, esperienza dopo il login, integrazione reale nell'app News, numero di giocatori e retention.

**Implicazione:** non proponiamo come novità giochi, streak, classifiche o Sfide. Lavoriamo su **continuità, innesco nel giornale e affidabilità**.

## 3. Benchmark: principi trasferibili

| Principio | Evidenza pubblica | Come lo trasferiamo |
|---|---|---|
| Breve, una volta al giorno, uguale per tutti | NYT: «We don't want 24/7 engagement» [F]; LinkedIn: 84–86% ritorno al giorno dopo, dato aziendale non scomposto [F] | Edizione da 3 minuti, la stessa per tutti |
| Streak indulgente | Duolingo: mantenere la streak con un'azione minima → +40% di utenti con streak di 7+ giorni [F] | Recupero degli indizi; nessuna seconda streak |
| Trigger in un canale già abitudinario | Washington Post: Game Break è la seconda newsletter per click-through [F] | Blocco del Filo nelle newsletter; card nell'app News |
| Abitudine nella prima settimana | Twipe/Digiday: ≥3 sessioni nella prima settimana → 50% di probabilità in meno di disdire [F] | Prima settimana guidata; obiettivo 3 giorni su 7 |
| Gruppi privati prima delle classifiche pubbliche | LinkedIn: confronto con connessioni e azienda [F] | Sfida settimanale (le Sfide esistono già) |
| Condivisione senza spoiler | Wordle e NYT [F] | Card senza risposte, pensata per WhatsApp |
| I giochi come ponte verso il giornalismo | NYT e WaPo: bundle e newsletter [F] | «Gioca la notizia»: il gioco nasce dall'articolo |

**Anti-pattern da evitare:** streak che si azzerano senza recupero, paywall sul gioco del giorno (blocca il referral), sole classifiche pubbliche anonime, troppi giochi, notifiche manipolative, quiz che sembrano un esame, contare le partite invece dei giocatori.

## 4. Insight comportamentali → scelte progettuali verificabili

| Concetto | Ipotesi per Corriere | Scelta di design | Verifica |
|---|---|---|---|
| **Abitudine** = innesco + routine + ricompensa ripetuti in un contesto stabile | Il contesto stabile del target esiste già: la lettura mattutina | Agganciare Giochi alla lettura (modulo, card, push all'orario abituale) | R2 (orario personale contro standard); A1 |
| **Motivazione × abilità × innesco** | La motivazione c'è (giocano 1–2 volte), l'abilità percepita (tempo, scelta) è bassa | Edizione da 3 minuti, un solo percorso | Completamento e durata dell'Edizione |
| **Ricompensa e progresso** | Senza progresso cumulativo, ogni partita è isolata | Indizi, Filo, Nodo | Indizi per adottante; R1 |
| **Avversione alla perdita** | La streak punisce gli occasionali | Recupero con penalità lieve | Ritorno dopo un giorno saltato |
| **Fresh start** | Le date di inizio (lunedì) aiutano a ricominciare | Nuovo Filo ogni lunedì; R4 | Riattivazioni il lunedì contro gli altri giorni |
| **Accountability sociale** | Famiglie e colleghi 35–55 giocano insieme | Sfida settimanale; invito a fine Edizione | A3; ritorno dei membri |
| **Personalizzazione** | L'orario di lettura è individuale | Orario di invio personale | R2 |
| **Product-led growth** | Il prodotto genera acquisizione (inviti, condivisione) | Landing «gioca prima» | A3 |
| **Lifecycle marketing** | Messaggi diversi per stato: nuovo, attivo, in pausa, inattivo | Regole R1–R5 con limiti di frequenza | R2; guardrail di opt-out |

Ogni principio ha una scelta di design e un modo di verificarla: niente teoria fine a se stessa.

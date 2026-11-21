# Product Audit — Corriere Giochi (Corriere della Sera / RCS MediaGroup)

Audit basato solo su fonti pubbliche. Data di redazione e di accesso a tutte le fonti: **21/11/2026**.

**Legenda etichette**
- **[CONFERMATO]**: visto su una fonte pubblica, con URL citato.
- **[CONFERMATO-CODICE]**: visto nel codice client pubblico (HTML/JS) servito a utenti anonimi. La funzione esiste nel prodotto, ma l'esperienza effettiva dopo il login non è stata osservata.
- **[OSSERVAZIONE]**: nostra inferenza o interpretazione.
- **[NON VERIFICABILE]**: dietro login/paywall, non raggiungibile, oppure non trovato.

---

## 1. Metodologia e fonti

Metodo: download delle pagine con `curl` (user-agent browser) ed estrazione del testo, perché lo strumento WebFetch è stato **bloccato** sui domini `corriere.it` e `rcsmediagroup.it`. Abbiamo letto gli endpoint pubblici delle recensioni Apple (RSS e lookup iTunes) e la pagina pubblica di Google Play. Abbiamo letto il bundle JS pubblico della piattaforma giochi, il cui testo UI è stato estratto per stringhe. **Nessun login. Nessun gioco giocato in un browser reale con JavaScript.** I giochi sono una SPA e l'HTML statico contiene solo la shell.

| # | Fonte | URL | Accesso | Esito |
|---|---|---|---|---|
| F1 | Hub Corriere Giochi | https://www.corriere.it/giochi/ | 21/11/2026 | OK via curl (shell SPA + config). WebFetch bloccato |
| F2 | Landing app | https://www.corriere.it/app-giochi/ | 21/11/2026 | OK via curl (testo completo + FAQ) |
| F3 | Landing promo abbonamento | https://www.corriere.it/promo-giochi/ | 21/11/2026 | OK via curl |
| F4 | Pagine singoli giochi (/quiz/, /in-altre-parole/, /apegramma/, /cruciverba/, /sudoku/, /crucipuzzle/, /sfida/, /statistics/, /classifiche/, /abbonati/) | https://www.corriere.it/giochi/… | 21/11/2026 | HTTP 200, ma sono solo la shell SPA: contenuto di gioco non leggibile senza JS |
| F5 | Codice client di gioco (config dei permessi inline in F1/F4) | https://www.corriere.it/giochi/quiz/ (script inline `getUserGameSettings`) | 21/11/2026 | OK |
| F6 | Bundle piattaforma giochi (fornitore "smartgames.media") | https://cdn-corriere.smartgames.media/smartgames-front-platform.iife.js | 21/11/2026 | OK (3,5 MB, stringhe UI in IT ed ES) |
| F7 | Feed news sezione giochi | https://appservice.corriere.it/pages/sections/giochi/news/sezione_1.json | 21/11/2026 | OK |
| F8 | Homepage Corriere.it (punti d'ingresso) | https://www.corriere.it/ | 21/11/2026 | OK via curl |
| F9 | Articolo quiz (es. 20/11/2026) | https://www.corriere.it/giochi/news/26_novembre_20/il-quiz-del-corriere-del-20-novembre-quanti-sono-i-paesi-che-hanno-annunciato-di-avere-l-arma-atomica-82ad3f98-36c0-4b44-84cc-9a1680caexlk.shtml | 21/11/2026 | OK |
| F10 | Pagina newsletter Corriere | https://www.corriere.it/newsletter/ | 21/11/2026 | OK, ma nessuna newsletter giochi nell'HTML statico |
| F11 | App Store — Corriere Giochi | https://apps.apple.com/it/app/corriere-giochi/id6744399739 + `itunes.apple.com/lookup?id=6744399739&country=it` | 21/11/2026 | OK |
| F12 | Recensioni App Store IT (RSS, 10 pagine, 271 recensioni da 07/2025 a 11/2026) | `https://itunes.apple.com/it/rss/customerreviews/page=N/id=6744399739/sortby=mostrecent/json` | 21/11/2026 | OK |
| F13 | Google Play — Corriere Giochi | https://play.google.com/store/apps/details?id=it.rcs.corriere.giochi&hl=it&gl=IT | 21/11/2026 | OK (solo le 3 recensioni in evidenza) |
| F14 | App Store — Corriere della Sera Online (News) | https://apps.apple.com/app/id326634016 (lookup IT) | 21/11/2026 | OK |
| F15 | Google Play — Corriere della Sera (News) | https://play.google.com/store/apps/details?id=it.rcs.corriere&hl=it&gl=IT | 21/11/2026 | OK |
| F16 | Il Post, "Charlie", 20/07/2025 — lancio | https://www.ilpost.it/charlie/il-corriere-della-sera-si-prende-wordle-una-specie/ | 21/11/2026 | OK |
| F17 | RCS — Comunicato risultati 9M 2026 (11/11/2026) | https://www.rcsmediagroup.it/comunicati-corporate/comunicato-stampa-approvati-i-risultati-al-30-settembre-2026-3327 | 21/11/2026 | OK via curl (WebFetch bloccato) |
| F18 | Teleborsa/Borsa Italiana — risultati 9M 2026 | https://www.borsaitaliana.it/borsa/notizie/teleborsa/finanza/rcs-ricavi-stabili-nei-primi-nove-mesi-del-2026-185_2026-11-11_TLB.html | 21/11/2026 | OK |
| F19 | PDF comunicati RCS su eMarketStorage (FY2025, H1 2026, 9M 2025) | emarketstorage.it/…/20260324_179757.pdf ecc. | 21/11/2026 | Scaricati ma **non leggibili**: testo compresso, senza strumenti di estrazione |
| F20 | rcsmediagroup.it homepage | https://www.rcsmediagroup.it/ | 21/11/2026 | WebFetch bloccato. curl OK: nessuna menzione "Giochi" in homepage |

---

## 2. Inventario giochi

Fonti: F2, F3, F5, F6, F8, F11, F13, F14. Regole di accesso da F5 (config client) e dalla FAQ F2.

| Gioco | Formato | Autore/curatore | Accesso gioco del giorno | Archivio | Salvataggio stato | Sfide | Etichetta |
|---|---|---|---|---|---|---|---|
| **Il Quiz del Corriere** | Quiz di attualità e cultura | Paolo Virtuani | Gratuito per tutti | Solo abbonati | Utenti loggati | Sì | [CONFERMATO] F2, F5. Nota: F2 dice "dieci domande", gli store (F11, F13) dicono "sei domande": incoerenza nelle descrizioni |
| **In altre parole** | Word game tipo Wordle: 5 lettere, 6 tentativi. Varianti 6 e 7 lettere | Massimo Gramellini | 5 lettere gratuito. **6 e 7 lettere solo abbonati** | Solo abbonati | 5 lettere: loggati; 6/7: abbonati | Sì | [CONFERMATO] F2, F11. Varianti 6/7: [CONFERMATO-CODICE] F5, F6. F2 parla di "tre parole del giorno" |
| **Apegramma** | Alveare di 7 lettere, lettera centrale obbligatoria (formula tipo Spelling Bee) | Redazione | Gratuito. Config `levelAccess:2` | Solo abbonati. Soluzioni dei giorni precedenti in archivio | Loggati | Sì | [CONFERMATO] F2, F3 ("Con anche le soluzioni dell'apegramma"), F5, F6. Significato di `levelAccess:2`: [NON VERIFICABILE] |
| **Cruciverba** | Parole crociate | Redazione | **A consumo: 1 partita ogni 7 giorni per i non abbonati** (`meteredLimit:1, intervalDays:7`) | Solo abbonati | n.d. | Sì | [CONFERMATO-CODICE] F5. Funzioni "Rivela lettera/parola", "Risolvi cruciverba": F6 |
| **Cruciverba Mini** | Mini crossword | Redazione | Gratuito | Solo abbonati | Loggati | No (non in elenco) | [CONFERMATO] F2, F5, F11 |
| **Sudoku** | Sudoku 9x9 giornaliero | — | Gratuito | Solo abbonati | Loggati | No | [CONFERMATO] F2, F5 |
| **Crucipuzzle** | Cerca-parole | — | Gratuito | Solo abbonati | Loggati | No | [CONFERMATO] F2, F5. Funzioni "Ottieni un indizio", "Risolvi Crucipuzzle": F6 |
| **Prima o Dopo** | Timeline: ordinare 10 eventi storici in cronologia (drag & drop) | Antonio Carioti (firma articoli) | Gratuito | Solo abbonati | Loggati | n.d. | [CONFERMATO] F3, F7, F8, F14, F6. **Assente dalla FAQ di F2 e dalle descrizioni store di Giochi** (F11, F13) |
| **Giochi speciali** | Giochi tematici legati a eventi e ricorrenze | Redazione | n.d. | n.d. | n.d. | n.d. | [CONFERMATO] esistenza F2. Dettagli [NON VERIFICABILE] |
| **Quiz della settimana** (articolo) | Quiz sulle notizie della settimana, in formato articolo | Paolo Virtuani | Free (`price_type: FR`) | — | — | — | [CONFERMATO] F7 |

[OSSERVAZIONE] Il modello di accesso è "giorno gratis, profondità a pagamento". Il gioco del giorno è aperto per quasi tutti i titoli. Sono a pagamento l'archivio, le varianti più difficili di In altre parole e il cruciverba oltre la prima partita a settimana. Il salvataggio dei progressi richiede la registrazione.

---

## 3. Funzionalità esistenti

| Funzionalità | Dettaglio | Chi ne ha accesso | Etichetta / fonte |
|---|---|---|---|
| Hub web Giochi + app dedicata iOS/Android | App "Corriere Giochi" (bundle `it.rcs.corriere.giochi`), lanciata il 10/07/2025 | Tutti (download gratuito) | [CONFERMATO] F11, F13, F16 |
| Sezione Giochi dentro l'app News | "Tutti i giochi del Corriere riuniti in un'unica sezione" (app ridisegnata) | Utenti app News | [CONFERMATO] F14, F15, F17 ("il catalogo di Corriere Giochi" nella nuova App) |
| Navigazione hub | Menu: GIOCHI / STATISTICHE / SFIDE / CLASSIFICHE / NEWS | Tutti | [CONFERMATO] F9 (header sezione) |
| Statistiche personali | "Giorni consecutivi", "Serie Record", "Giochi completati", "Partite vinte", "Tempo medio", "Media giocatori", "Distribuzione tentativi" | Registrati (F16, 2025). Abbonati secondo i paywall nel codice ("Abbonati per… vedere le tue statistiche") | [CONFERMATO] esistenza F2, F3. Voci: [CONFERMATO-CODICE] F6. Regola d'accesso attuale [NON VERIFICABILE]: le fonti divergono |
| **Streak** (giorni consecutivi, serie record) | Presente nelle statistiche e nei trofei | Registrati/abbonati | [CONFERMATO-CODICE] F6 |
| **Trofei/badge** | Inarrestabile (ogni giorno), Maratoneta (10 giorni consecutivi, 300 pt), Collezionista (tutti i giochi del giorno, 200 pt), Stacanovista (50 partite, 200 pt), Smart (prima partita da app, 5.000 pt), Agonista (sfida altri, 50 pt), Abbonato (abbonati e gioca, 5.000 pt) | Profilo giocatore | [CONFERMATO-CODICE] F6 |
| Punti, livelli, "Fuoriclasse" | Punteggi per gioco (es. In altre parole: punti per tentativo, bonus tempo). Livelli in base al punteggio. Bonus "Fuoriclasse" | Profilo giocatore | [CONFERMATO-CODICE] F6 |
| **Classifiche** | Mensili (si azzerano ogni mese, 5 livelli di posizione) e generali (non si azzerano mai), per singolo gioco e complessive. **Lancio: 25 giugno 2026** | Registrati/abbonati con nickname + avatar | [CONFERMATO-CODICE] F6. Indirettamente confermato dalle recensioni di luglio–agosto 2026 su "introdurre le classifiche" (F12, F13) |
| **Sfide tra amici** | Inviti con token/link, lista amici, classifica condivisa. Su Quiz, In altre parole, Apegramma, Cruciverba | Abbonati ("Abbonati per… sfidare gli amici") / registrati ("Registrati per sfidare i tuoi amici") | [CONFERMATO] F2, F3. Meccanica: [CONFERMATO-CODICE] F6 |
| Profilo giocatore | Nickname (min 3 caratteri, unico), avatar, "I tuoi trofei" | Registrati | [CONFERMATO-CODICE] F6 |
| Archivio | Libreria dei giochi passati e soluzioni dei giorni precedenti. Punti anche giocando l'archivio (giochi dal 25/06/2026 in poi) | **Solo abbonati** | [CONFERMATO] F2, F3. Punti: F6 |
| Aiuti/soluzioni | Rivela lettera/parola, risolvi, indizio. Soluzioni Apegramma solo per i giorni passati | Tutti (le soluzioni in archivio solo per gli abbonati) | [CONFERMATO-CODICE] F6. [OSSERVAZIONE] Risponde alla richiesta frequente nelle recensioni 2025 "mettete le soluzioni" |
| Condivisione risultati | "CONDIVIDI RISULTATI" / social share nativo in app | Tutti | [CONFERMATO-CODICE] F5, F6 |
| Preferenze | Dark mode, "Rimuovi tempo" (timer nascondibile) | Tutti | [CONFERMATO-CODICE] F6 |
| Limite dispositivi | "puoi giocare a Corriere Giochi su 1 dispositivo alla volta" | Account | [CONFERMATO] F1 |
| Sezione News giochi | Articoli (quiz, Prima o Dopo) con titoli che rimandano al gioco: "Cruciverba e sudoku: gioca subito" | Free | [CONFERMATO] F7, F9 |
| Rating prompt in app | Pop-up di valutazione introdotti nel 2026 | App | [CONFERMATO] da recensione Play 12/10/2026 (F13) |
| Notifiche in-game dei punti in classifica | Toast con i punti "in mezzo ai giochi" | App | [CONFERMATO] da recensione Play 01/07/2026 (F13) |
| Push notification promemoria | — | — | [NON VERIFICABILE]: nessuna evidenza pubblica di push "gioca oggi" |
| Newsletter dedicata ai giochi | — | — | [NON VERIFICABILE] / non trovata in F10. [OSSERVAZIONE] Il parametro `intcmp=dem_landing_seo` sulla promo suggerisce campagne email (DEM) promozionali, non una newsletter editoriale |
| Pubblicità | Play Store: "Contiene annunci" | Non abbonati (presumibilmente) | [CONFERMATO] F13. A chi si applica: [OSSERVAZIONE] |

---

## 4. Modello di abbonamento e prezzi

| Elemento | Dettaglio | Etichetta / fonte |
|---|---|---|
| Natura | "Corriere Giochi è un servizio in abbonamento. Alcuni contenuti possono essere disponibili gratuitamente…" | [CONFERMATO] F2 |
| Incluso in | Abbonamenti **Naviga Premium** e **Tutto+** | [CONFERMATO] F2 |
| Non incluso in | **Naviga** (non Premium) e **Digita**: solo giochi gratuiti, con add-on Giochi "ad un prezzo dedicato" | [CONFERMATO] F2 |
| Offerta standalone (web, oggi) | **1 € per il primo anno** ("disdici online quando vuoi"), offerta OFF-00137795 | [CONFERMATO] F3 |
| Offerta per abbonati digitali | **1 € al mese per 12 mesi** ("promozione esclusiva riservata agli abbonati digitali"), OFF-00138247 | [CONFERMATO] F3 |
| Prezzi in-app iOS | Mensile **2,49 €**, Annuale **24,99 €** (più varianti con lo stesso prezzo) | [CONFERMATO] F11 |
| Prezzo al lancio (luglio 2025) | 5 € il primo anno. Incluso negli abbonamenti digitali completi. Per i solo-sito incluso il primo anno | [CONFERMATO] F16 (storico) |
| Prezzo a regime dopo la promo web | — | [NON VERIFICABILE]: la pagina checkout richiede login |
| Pagamenti | Carta, PayPal, Apple Pay, Klarna. Rinnovo automatico | [CONFERMATO] F3 |
| Abbonati totali Corriere | **805 mila** abbonamenti digitali attivi a fine settembre 2026 (in crescita da 754k a fine 2025) | [CONFERMATO] F17, F18 |
| Abbonati Giochi | Il Post (2025): gli abbonamenti solo-Giochi sarebbero conteggiati nei totali | [CONFERMATO] F16. **Numero specifico: [NON VERIFICABILE]**, non pubblicato da RCS |

[OSSERVAZIONE] Il prezzo d'ingresso è sceso nel tempo: 5 €/primo anno (2025), poi 1 €/primo anno (web, 2026). In app il prezzo pieno resta 24,99 €/anno. È un forte segnale di acquisizione a bassissimo prezzo, con rischio di churn al rinnovo (vedi recensione 03/08/2026: "non penso rinnoverò").

---

## 5. Percorso utente osservato (da fonti statiche)

1. **Scoperta**
   - Homepage Corriere.it: "fascia giochi" (intcmp `fascia-giochi-hpcor`) con Quiz, Prima o Dopo, In altre parole, Apegramma, Cruciverba. "Pastigliette" (intcmp `pastigliette_HP_giochi…`) con call-to-action per gioco ("Una parola, sei tentativi", "10 quiz: sai rispondere?").
   - Voce "Corriere Giochi" nel menu e nel burger menu.
   - Link all'app Giochi (onelink + App Store) in homepage.
   - [CONFERMATO] F8.
2. **Articoli news giochi** (Quiz, Prima o Dopo): rimandano a tutti i giochi, con titoli SEO "Cruciverba e sudoku: gioca subito". [CONFERMATO] F7, F9. [OSSERVAZIONE] Le news "normali" (non della sezione giochi) non contengono rimandi ai giochi nell'HTML osservato: non verificato in modo sistematico.
3. **App News**: sezione unica Giochi nell'app ridisegnata. [CONFERMATO] F14, F17. Come si apre (webview o deep link all'app Giochi) e dove è posizionata: [NON VERIFICABILE]. Il codice prevede `appEnum: giochi | corriere` e messaggi nativi `OPEN_NATIVE_ARTICLE` [CONFERMATO-CODICE] F5.
4. **Primo gioco da anonimo**: gioco del giorno giocabile senza login (tranne le varianti 6/7 lettere e il cruciverba oltre il limite settimanale). [CONFERMATO-CODICE] F5. Onboarding: "Come si gioca", tutorial (es. Prima o Dopo) [CONFERMATO-CODICE] F6. Resa visiva effettiva: [NON VERIFICABILE].
5. **Muri di conversione**, testi nel codice F6 [CONFERMATO-CODICE]:
   - "Registrati per vedere le tue statistiche"
   - "Registrati per sfidare i tuoi amici!"
   - "Abbonati per giocare senza limiti a tutti i Giochi Corriere, vedere le tue statistiche e sfidare gli amici in classifica"
   - "Hai già un account? Accedi"
   - "Accedi/Abbonati per creare il tuo profilo giocatore, entrare in classifica…"
6. **Registrazione**: credenziali RCS ("Serve un account… credenziali RCS") [CONFERMATO] F2. Flusso effettivo: [NON VERIFICABILE].
7. **Abbonamento**: web con landing F3 e checkout su abbonamenti.corriere.it. In app con IAP Apple/Google. [CONFERMATO] F3, F11.
8. **Post-login**: profilo (nickname + avatar obbligatori per la classifica), statistiche, trofei, archivio. [CONFERMATO-CODICE] F6. Esperienza reale: [NON VERIFICABILE].

---

## 6. Punti di abbandono ipotizzati

Tutti **[OSSERVAZIONE]**, con l'evidenza a supporto indicata.

1. **Login/accesso in app**: il principale motivo di 1 stella. "servizio non disponibile", impossibile accedere pur avendo pagato, richieste ripetute di login (F12: 08/2025, 12/2025, 01/2026, 02/2026, 03/2026, 06/2026, 08/2026). Si perde l'utente già convertito.
2. **Perdita di progressi/punteggi** (soprattutto Apegramma: parole trovate cancellate, reset dopo ore). F12 09/2025, 03/2026, 09/2026; F13 10/2026. Questo rompe streak e classifiche, cioè proprio la leva di ritorno.
3. **Passaggio da "tutto gratis" a paywall** (novembre 2025): "da un giorno all'altro ha iniziato a bloccarsi obbligando a pagare… contrariamente a quanto detto" (F12 17/11/2025, 16/11/2025). Il Post (luglio 2025) riportava che tutti i giochi del giorno erano gratis. Questo genera un'aspettativa tradita.
4. **Cruciverba a consumo (1 ogni 7 giorni)**: è il gioco "classico" con la base storica più solida (F16), quindi il muro tocca gli utenti più fedeli al formato carta.
5. **Dizionario Apegramma percepito come arbitrario**: tema ricorrente 2025–2026 (F11, F12, F13). Frustrazione sul gioco più amato.
6. **Bug di layout e font dopo gli aggiornamenti** (10/2026), schermata bianca (08/2025, 02/2026), home Android che non scorre (09/2026).
7. **Limite di 1 dispositivo alla volta** (F1): attrito per chi gioca su telefono + desktop o in famiglia ("da fare con amici e in famiglia", F2).
8. **Rinnovo dopo la promo 1 €/5 €**: il salto a 24,99 € (o al prezzo pieno web, non verificato) è un punto di churn atteso.
9. **Classifiche percepite come ingiuste o intrusive** (F12 07–08/2026, F13 07/2026), con toast dei punti che interrompono il gioco.

---

## 7. Temi dalle recensioni negli store

**Valutazioni [CONFERMATO] (21/11/2026)**

| App | Store | Rating | N. valutazioni | Altro |
|---|---|---|---|---|
| Corriere Giochi | App Store IT | **4,6** (4,596) | **3.559** | v1.0.8 dell'08/06/2026. Rilascio 10/07/2025 (F11) |
| Corriere Giochi | Google Play | **4,4** (telefono 4,3 su 1,12K) | **1,28K recensioni** | 100K+ download, "Contiene annunci", ultimo aggiornamento 24/09/2026, "#8 più redditizie notizie e riviste" (F13) |
| Corriere Giochi | Landing promo | 4,6 | "1738 valutazioni" | Dato non aggiornato sulla landing (F3) |
| Corriere della Sera (News) | App Store IT | 4,48 | 26.637 | v8.0.13 del 19/11/2026 (F14) |
| Corriere della Sera (News) | Google Play | 4,2 | 27,5K | 1 Mln+ download (F15) |

**Campione App Store IT (F12, 271 recensioni)**: 5★ 160, 4★ 72, 3★ 14, 2★ 9, 1★ 16. Google Play: solo le 3 recensioni in evidenza.

**Temi positivi [CONFERMATO]**
- "appuntamento quotidiano" / ginnastica mentale ("Non mi perdo mai prima o dopo e il quiz")
- Varietà in un'unica app
- Quiz e parola di Gramellini apprezzati
- Uso in famiglia
- Confronto esplicito con NYT (Wordle, Spelling Bee)

**Temi negativi ricorrenti [CONFERMATO]**
1. Login/abbonamento non riconosciuto dopo il pagamento (circa 10 recensioni con "abbonament", diverse a 1★)
2. Bug: progressi persi, parole che "saltano", app bloccata o pagina bianca, layout e font
3. Dizionario Apegramma (parole comuni rifiutate, parole inesistenti accettate). Punteggio non proporzionale alle parole possibili
4. Richiesta di soluzioni dell'Apegramma (2025). [OSSERVAZIONE] Oggi in parte risolta: soluzioni in archivio per gli abbonati (F3, F6)
5. Classifiche: punti assegnati male, "si poteva evitare", notifiche invadenti, sospetto di risultati irrealistici
6. UX del cruciverba e del sudoku "macchinosa" (sovrascrittura lettere, note da cancellare a mano)
7. Paywall percepito come cambio di regole (nov. 2025). Addebito di 2,49 € contestato
8. Pop-up di richiesta valutazione (2026)
9. Quiz "troppo difficile/datato" (singola recensione)

---

## 8. Cosa NON proporre come novità

Esistono già, quindi non vanno presentati come nuove idee:

- App dedicata Corriere Giochi (iOS + Android) **e** sezione giochi dentro l'app News
- Gioco del giorno gratuito per quasi tutti i titoli
- Wordle italiano firmato (In altre parole, Gramellini), con **varianti 5/6/7 lettere**
- Spelling Bee italiano (Apegramma) con livelli
- Gioco di storia a timeline (Prima o Dopo)
- Quiz di attualità quotidiano + quiz della settimana in formato articolo
- Mini crossword
- Giochi speciali tematici/eventi
- **Statistiche personali**: giorni consecutivi, serie record, distribuzione tentativi, tempo medio vs media giocatori
- **Streak** e **trofei/badge** (Maratoneta, Collezionista, Stacanovista, Agonista, Smart, Abbonato)
- Punti, livelli, "Fuoriclasse"
- **Classifiche** mensili e generali, per gioco e complessive (dal 25/06/2026)
- **Sfide tra amici** con link d'invito e classifica privata
- Profilo giocatore con nickname e avatar
- **Archivio** completo dei giochi passati (abbonati), con soluzioni dell'Apegramma
- Aiuti: rivela lettera/parola, indizio, risolvi
- Condivisione dei risultati
- Dark mode, timer nascondibile
- Paywall a consumo sul cruciverba (1/settimana)
- Bundle con gli abbonamenti Premium/Tutto+, add-on per Naviga/Digita, standalone a 1 €
- Entry point in homepage (fascia giochi + pillole per gioco)
- Articoli editoriali agganciati ai giochi (Quiz, Prima o Dopo)
- Trofeo che incentiva il passaggio all'app (5.000 punti per la prima partita da app)

---

## 9. Opportunità

Tutte **[OSSERVAZIONE]**, da validare.

1. **Affidabilità prima delle nuove funzioni**: account, sessione e salvataggio dei progressi. Streak e classifiche valgono solo se i dati non si perdono. Possibile metrica: % di recensioni 1–2★ legate a login e progressi.
2. **Protezione della streak** (es. "salva-serie", recupero dall'archivio che conta per la serie). Oggi i trofei puniscono il giorno saltato ("si riparte da capo"). Non risulta un meccanismo di freeze pubblico ([NON VERIFICABILE] se esista).
3. **Trigger di ritorno quotidiano espliciti**: non abbiamo trovato evidenza di una newsletter giochi né di push "il gioco di oggi è pronto". Opzioni: un modulo giochi nelle newsletter esistenti (Il Punto, ecc.) e push opt-in dall'app Giochi/News.
4. **Ponte news ↔ giochi**: il Quiz e Prima o Dopo sono già editoriali. Si può portare la risposta del quiz all'articolo di approfondimento (il codice ha già `OPEN_NATIVE_ARTICLE`), e da articoli di cronaca/storia al gioco collegato.
5. **Ripensare il muro sul cruciverba**: è il formato con la base storica più forte. Si possono testare limiti diversi, oppure una registrazione gratuita che sblocca più partite (oggi il limite non distingue anonimo e registrato).
6. **Gestire il rinnovo dopo le promo da 1 €/5 €**: comunicare il valore accumulato (statistiche, trofei, archivio) prima della scadenza, e offrire un piano famiglia o più dispositivi (oggi il limite è 1).
7. **Qualità del dizionario Apegramma**: lista parole curata dalla redazione, segnalazione parola mancante, trasparenza sulle regole (plurali, femminili).
8. **Classifiche più eque**: segmenti tra pari, classifiche tra amici in primo piano rispetto a quella globale, toast meno invasivi.
9. **Allineare le comunicazioni**: numero di domande del quiz (6 vs 10), Prima o Dopo assente dalla FAQ e dalle schede store di Giochi, rating vecchio sulla landing, FAQ che cita solo l'App Store.
10. **Misurazione**: RCS non pubblica abbonati o utenti Giochi. Per il case study serve un'ipotesi esplicita sul peso di Giochi in acquisizione vs retention. Il Post (2025) dice che l'obiettivo iniziale era l'engagement degli abbonati esistenti.

---

## 10. Limiti dell'audit

- **Nessun login, nessun abbonamento, nessuna sessione di gioco reale.** Tutto ciò che accade dopo l'accesso è [NON VERIFICABILE] come esperienza: profilo, statistiche reali, archivio, checkout, prezzo pieno web, push, posizionamento dei giochi nell'app News.
- Le funzionalità marcate **[CONFERMATO-CODICE]** provengono da configurazione e stringhe UI nel JS pubblico. Il codice dimostra che la funzione è implementata, **non** che sia visibile a tutti oggi o come appaia. Il bundle è condiviso con versioni in spagnolo (piattaforma "smartgames.media" usata presumibilmente anche da testate spagnole del gruppo [OSSERVAZIONE]), quindi alcune stringhe potrebbero non essere attive su Corriere.
- La regola d'accesso derivata dalla config (`canPlayPastGames: subscribed`, `meteredLimit`) può essere sovrascritta lato server o in app: [NON VERIFICABILE].
- WebFetch era bloccato su corriere.it e rcsmediagroup.it. Abbiamo usato curl: il contenuto è stato letto in prima persona, ma senza rendering JS.
- PDF dei comunicati RCS (FY2025, H1 2026) non estratti per mancanza di strumenti. I dati sugli abbonati vengono dal comunicato HTML 9M 2026 e da Teleborsa.
- Google Play: lette solo 3 recensioni (quelle in evidenza). App Store: 271 recensioni dal feed RSS IT, che non rappresentano tutte le 3.559 valutazioni (molte sono senza testo).
- Nessun dato pubblico su DAU/MAU, abbonati solo-Giochi, conversione o retention.
- Nessun articolo stampa trovato sull'introduzione del paywall (nov. 2025) o delle classifiche (giu. 2026). Le date vengono dalle recensioni e dal codice.

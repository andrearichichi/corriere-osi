# Script di presentazione

**Durata:** 20 minuti (13 di narrazione + 7 di demo) + domande.
**Setup:** `npm run build && npm start`, poi apri `http://localhost:3000/strategy` a schermo intero (tasto **F**). In una seconda scheda tieni aperti `/prototype/retention`, `/prototype/acquisition`, `/prototype/referral` e `/growth-lab`. Funziona senza Internet.
**Prima di iniziare:** in ogni esperienza premi «Ricomincia la demo», così lo stato è pulito.
**Comandi:** ← → per le slide, **N** per le note, **F** per lo schermo intero. Il PDF di riserva è `docs/Il-Filo-presentazione.pdf`.

---

### 1 · Copertina (0:30)
«Il brief chiede più giocatori quotidiani. Rispondiamo a tre domande: perché questa soluzione dovrebbe funzionare, come lo dimostriamo e cosa costruiamo per primo.»

### 2 · Il problema (1:00)
«Corriere Giochi non ha bisogno di nuovi giochi né di altra gamification: streak, trofei, classifiche e Sfide ci sono già. Gli manca un motivo per tornare domani. E il primo tema delle recensioni negative è la perdita di progressi, cioè proprio ciò che dovrebbe far tornare.»

### 3 · Il vero insight (1:00)
«Chi gioca due volte a settimana non è disinteressato. Arriva per caso, di solito da un articolo, gioca una partita e chiude. Tre frizioni: innesco, continuità, sforzo. Il benchmark conferma la direzione: NYT non vuole un coinvolgimento 24 ore su 24; tre sessioni nella prima settimana dimezzano la probabilità di disdetta.»

### 4 · Opportunità nel percorso (0:45)
«Ci sono tre momenti che nessuno presidia: durante la lettura, a fine partita e il mattino dopo. Il primo è l'acquisizione, il terzo è la retention, il secondo serve a entrambe.»

### 5 · La grande idea (1:15)
«Il Filo: ogni giorno un indizio, ogni domenica la storia della settimana. Un'Edizione da tre minuti dà un indizio; sei indizi fanno un Filo; domenica si scioglie il Nodo. Un giorno perso si recupera. E solo il Corriere può farlo, perché le domande e gli indizi nascono dal lavoro della redazione.»

### 6 · Come funziona (0:45)
«Abbiamo valutato quattro concept. "Gioca la notizia" da solo porta lettori ma non li trattiene; i Circoli duplicano le Sfide esistenti. Il Filo è l'unico che lega i due case.»

### 7 · Case 1 — Diagnosi (1:00)
«Tre ipotesi, ognuna con il segnale che ci aspettiamo nei dati e la fonte per verificarla. Si verificano in due o tre settimane, con dati che il Corriere ha già.»

### 8 · Case 1 — Soluzione e riattivazione (0:45) → **DEMO A (2:30)**
Passa a `/prototype/retention`:
1. **Passo 1.** «Giulia, 46 anni, 1,4 giorni a settimana: 4 sessioni su 6 partono da un articolo. Questo è l'hub attuale, ricostruito dall'audit.»
2. **Passo 2.** «Mercoledì apre Giochi: in cima c'è l'Edizione di oggi. Lunedì e martedì li ha saltati, ma sono recuperabili.»
3. Tocca **Gioca l'Edizione**: rispondi al Quiz, ordina Prima o Dopo, digita GIORNALE. «L'indizio arriva completando, non indovinando.»
4. **Torna al Filo** e tocca il cerchio tratteggiato di **lunedì**: gioca il recupero (anagramma: INVERNO). «Recuperato, con 1 punto invece di 2: non si perde nulla.»
5. **Passo 5.** «Giovedì salta. Venerdì alle 8:12, all'ora in cui legge il Corriere, la notifica parla del suo progresso.» Tocca la notifica.
6. **Passo 6.** Gioca venerdì (NATALE), poi **Vai a domenica** e scrivi «Sant'Ambrogio». «Patrono di Milano: il 7 dicembre c'è la Prima della Scala e la fiera degli Oh bej! Oh bej!.»
7. Mostra il **registro eventi**: «Ogni gesto è un evento con un nome e delle proprietà: è così che lo misureremmo.»

### 9 · Case 1 — Misurazione (0:45)
«La North Star è chi gioca almeno 4 giorni su 7. Il test R1 legge le settimane 3–6, per escludere l'effetto novità. E, soprattutto, un holdout di 6 mesi: che i giocatori quotidiani si abbonino di più non dimostra che farli giocare di più crei abbonamenti.»

### 10 · Case 2 — Punti di contatto (0:45) → **DEMO B (2:00)**
Passa a `/prototype/acquisition`:
1. «Stefano, 41 anni, legge l'app News e non ha mai giocato.» Vai al **passo 2**: la domanda è dentro l'articolo. Rispondi **2006**.
2. «Ha già fatto 1 su 3.» **Continua l'Edizione** da ospite: Prima o Dopo, poi INVERNO.
3. «Primo indizio, il Filo spiegato in una riga, e solo ora la richiesta di salvare.» Scegli **promemoria al calendario**: «È un vero file .ics, senza account.»
4. **Passo 6.** «Martedì, nel feed dell'app News, la card del secondo indizio.» Toccala.

### 11 · Case 2 — Primo contatto e referral (0:30) → **DEMO C (1:30)**
Passa a `/prototype/referral`:
1. «Paolo ha finito l'Edizione: l'invito compare adesso.» **Sfida qualcuno**, poi **WhatsApp**.
2. Telefono di Chiara: apri il link, **Gioca subito**, completa l'Edizione (MERCATO), **Crea un account**.
3. **Passo 5:** **Venerdì: Chiara torna**, gioca (NATALE). «Paolo riceve il premio solo ora, al secondo giorno di gioco. E l'incrementalità si misura randomizzando per invitante.»

### 12 · Case 2 — Analisi dei risultati (0:45)
«Contiamo solo chi non sarebbe arrivato comunque. A1 randomizza per lettore, non per pagina vista; A3 per invitante. L'attribuzione serve a ottimizzare, la randomizzazione a decidere.»

### 13 · Growth model (1:15) → *opzionale: Growth Lab dal vivo (1:00)*
«Nel caso base il progetto è in pareggio. È un'informazione, non un problema: il valore dipende da poche ipotesi che misuriamo spendendo poco.» Se c'è tempo: apri `/growth-lab`, scegli **Prudente** e poi **Ottimistico**; nel tab **Driver** mostra quali ipotesi pesano di più; nel tab **Esperimenti** premi «Nuova estrazione casuale» per mostrare la variabilità.

### 14 · Esperimenti e roadmap (0:45)
«Tre fasi, ognuna con un criterio per fermarsi. Le prime quattro mosse sono in alto a sinistra nella matrice: costano poco e decidono il resto.»

### 15 · Decisioni richieste (1:00)
«Per partire a dicembre servono tre decisioni: approvare la fase Validate, aprire dati e piattaforma, concedere spazio editoriale. Se le ipotesi non reggono, ci fermiamo dopo sei settimane, con dati che oggi non abbiamo.»

### 16 · Visione (0:20)
«Ogni mattina, un appuntamento con il Corriere che si vuole completare e condividere. Grazie.»

---

## Domande probabili

- **«Non è un clone di Wordle?»** No. Il Filo non è un gioco: è un arco settimanale che riusa formati esistenti e li lega al giornale. Il valore è editoriale.
- **«Perché non puntare sulle streak?»** La streak esiste già e premia chi è già abituale. Il nostro target ha la streak sempre a zero: gli serve un traguardo raggiungibile.
- **«Quanto costa alla redazione?»** Circa 1–2 ore al giorno a regime. La soglia nel pilot è 3 ore; il Filo si pianifica con una settimana d'anticipo.
- **«Il modulo negli articoli non disturba la lettura?»** È il primo guardrail di A1 (−2%). Niente modulo sugli articoli sensibili; massimo uno al giorno per lettore.
- **«E se κ fosse zero?»** Allora restano DAU, registrazioni e valore pubblicitario. Lo sapremo dall'holdout, e la fase Scale ha un criterio esplicito per ridimensionare.
- **«Regalate contenuti premium?»** No. L'Edizione usa solo formati e contenuti gratuiti.

/**
 * Genera docs/EXPERIMENTS.md e docs/ROADMAP.md dalle stesse fonti dati usate dall'app
 * (data/experiments.ts, data/roadmap.ts), così documenti e interfaccia non divergono.
 * Uso: node --experimental-strip-types scripts/gen-docs.mjs
 */
import fs from "node:fs";
import { EXPERIMENTS } from "../data/experiments.ts";
import { INITIATIVES, PHASES } from "../data/roadmap.ts";

const pct = (v) => `${(v * 100).toLocaleString("it-IT", { maximumFractionDigits: 2 })}%`;

let ex = `# Piano degli esperimenti

> Generato da \`data/experiments.ts\` con \`npm run docs\`. Non modificare a mano: modifica la fonte dati.

Cinque esperimenti randomizzati: due per la Retention (R1, R2) e tre per l'Acquisizione (A1, A2, A3). In più, un **holdout di lungo periodo**: il 10% del target resta fuori dal Filo per 6 mesi.

## Principi comuni

- **Pre-registrazione.** Prima del lancio si fissano ipotesi, metrica primaria, guardrail con soglie, MDE, durata e criterio decisionale. Nessuna analisi «a sorpresa» decide il rilascio.
- **Intention-to-treat.** Si analizza chi è stato *assegnato*, non chi ha *usato* la funzione, per evitare l'autoselezione.
- **Numerosità.** Non indichiamo numerosità arbitrarie. L'MDE si calcola dalla baseline reale (misurata nella fase Validate) e dal traffico disponibile:
  \`MDE = (z₁₋α/₂ + z₁₋β) · √(2·p₀·(1−p₀)/n)\`, con α = 5% e potenza dell'80%. Il calcolatore è nel Growth Lab (tab Esperimenti). Se l'MDE è più grande dell'effetto plausibile, si allunga il test o si sceglie una metrica più sensibile; non si abbassa l'asticella.
- **Durata minima.** Due cicli settimanali completi del Filo (14 giorni) più la finestra di misura; per R1 si leggono le settimane 3–6, per escludere l'effetto novità.
- **Test multipli.** Una sola metrica primaria per test; le secondarie sono esplorative. Se si leggono più varianti (R2: A/B/C), si applica la correzione di Holm.
- **Interferenze.** R1 e A1 coinvolgono popolazioni diverse (giocatori occasionali e lettori che non hanno mai giocato). R2 vive dentro il braccio di trattamento di R1. A3 randomizza per invitante.
- **Holdout di lungo periodo.** È l'unico modo per stimare l'effetto causale su abbonamenti e churn (il parametro κ del modello). Si legge a 3 e a 6 mesi.

## Riepilogo

| ID | Case | Esperimento | Unità | Metrica primaria |
|---|---|---|---|---|
${EXPERIMENTS.map((e) => `| ${e.id} | ${e.case} | ${e.name} | ${e.unit.split(":")[0].split(".")[0]} | ${e.primary} |`).join("\n")}

`;
for (const e of EXPERIMENTS) {
  ex += `## ${e.id} · ${e.name}

- **Ipotesi.** ${e.hypothesis}
- **Controllo.** ${e.control}
- **Trattamento.** ${e.treatment}
- **Popolazione.** ${e.population}
- **Unità di randomizzazione.** ${e.unit}
- **Metrica primaria.** ${e.primary}
- **Metriche secondarie.** ${e.secondary}
- **Guardrail.** ${e.guardrails}
- **Criterio decisionale.** ${e.decision}
- **Limiti interpretativi.** ${e.limits}
- **Parametri del simulatore** (*ipotesi illustrative, non dati*): baseline ${pct(e.sim.p0)}, effetto relativo ipotizzato +${pct(e.sim.lift)}, ${e.sim.n.toLocaleString("it-IT")} utenti per braccio come punto di partenza.

`;
}
fs.writeFileSync("docs/EXPERIMENTS.md", ex);

let rm = `# Roadmap di esecuzione

> Le sezioni «Fasi» e «Matrice» sono generate da \`data/roadmap.ts\` con \`npm run docs\`.

Tre fasi con criteri di uscita espliciti: **Validate → Pilot → Scale**. Ogni fase può fermarsi. L'investimento cresce solo quando le ipotesi decisive sono dimostrate: conversione dal giornale, nascita dell'abitudine, legame causale con l'abbonamento.

## Fasi

`;
for (const p of PHASES) {
  rm += `### Fase ${p.n} · ${p.name} — ${p.when}

**Obiettivo.** ${p.goal}

| | |
|---|---|
| Priorità | ${p.priority} |
| Complessità | ${p.complexity} |
| Team | ${p.teams.join(" · ")} |

**Deliverable**
${p.deliverables.map((d) => `- ${d}`).join("\n")}

**Dipendenze**
${p.dependencies.map((d) => `- ${d}`).join("\n")}

**KPI**
${p.kpis.map((d) => `- ${d}`).join("\n")}

**Criteri go / no-go**
${p.gate.map((d) => `- ${d}`).join("\n")}

**Rischi principali**
${p.risks.map((d) => `- ${d}`).join("\n")}

`;
}
rm += `## Matrice impatto / sforzo

I punteggi da 1 a 5 sono giudizi del team, non misure. L'**impatto** considera l'effetto atteso sulla North Star e quanto la mossa sblocca le successive. Lo **sforzo** considera lo sviluppo, le dipendenze esterne (fornitore della piattaforma, app News) e il carico redazionale.

| ID | Iniziativa | Impatto | Sforzo | Fase | Motivazione |
|---|---|---|---|---|---|
${INITIATIVES.map((i) => `| ${i.id} | ${i.name} | ${i.impact} | ${i.effort} | ${i.phase} | ${i.note} |`).join("\n")}

**Lettura.** In alto a sinistra (alto impatto, basso sforzo) ci sono I2, I3 e I4: tassonomia degli eventi, «Gioca la notizia» in forma ridotta e Filo pilota via email. Costano poco e decidono il resto. I1 (affidabilità) non è facile, ma è un prerequisito: un prodotto che promette «torna domani» non può perdere i progressi di ieri.

## Dipendenze critiche

- **Fornitore della piattaforma di gioco.** Il codice pubblico rimanda a un fornitore esterno (vedi PRODUCT_AUDIT.md). Edizione, Filo e tassonomia degli eventi richiedono un accordo con lui, da avviare nella settimana 1.
- **Team dell'app News.** Il modulo negli articoli e la card del Filo vivono nell'app News.
- **Redazione.** Circa 1–2 ore al giorno a regime. Soglia di sostenibilità nel pilot: 3 ore al giorno.
- **Privacy e consenso.** Promemoria e invii email solo con consenso; il tracciamento degli ospiti va fatto nel rispetto della CMP esistente.

## Cosa non facciamo

Niente nuovi giochi «grandi», niente seconda streak, niente classifiche pubbliche aggiuntive, niente premi economici o accessi premium regalati. Il catalogo e le funzioni esistenti restano: il Filo è la porta d'ingresso quotidiana.
`;
fs.writeFileSync("docs/ROADMAP.md", rm);
console.log("docs/EXPERIMENTS.md e docs/ROADMAP.md generati");

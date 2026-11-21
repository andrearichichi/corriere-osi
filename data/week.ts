/**
 * Settimana dimostrativa del prototipo "Il Filo".
 *
 * CONTENUTO ORIGINALE A FINI DI PROTOTIPO.
 * Le domande usano fatti storici/geografici stabili e verificabili, non notizie
 * di attualità inventate. In produzione la "Domanda" e "Prima o dopo" sarebbero
 * scritte ogni giorno dalla redazione a partire dagli articoli del giorno.
 *
 * Il filo della settimana (soluzione del Nodo di domenica): Sant'Ambrogio.
 * Patrono di Milano, vescovo, festa il 7 dicembre: giorno della Prima della Scala
 * e della fiera degli "Oh bej! Oh bej!"; la basilica porta il suo nome.
 */

export type QuestionGame = {
  kind: "domanda";
  source: string; // contesto "dal giornale"
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export type OrderGame = {
  kind: "ordine";
  prompt: string;
  events: { label: string; year: number }[]; // in ordine corretto
};

export type WordGame = {
  kind: "parola";
  prompt: string;
  hint: string;
  answer: string; // maiuscolo, senza spazi
};

export type MiniGame = QuestionGame | OrderGame | WordGame;

export type Edition = {
  dayIndex: number; // 0 = lunedì
  dayName: string;
  dateLabel: string;
  isoDate: string;
  games: [QuestionGame, OrderGame, WordGame];
  clue: { word: string; note: string };
};

export const WEEK_LABEL = "Settimana dimostrativa · 30 novembre – 6 dicembre 2026";

export const EDITIONS: Edition[] = [
  {
    dayIndex: 0,
    dayName: "Lunedì",
    dateLabel: "30 novembre",
    isoDate: "2026-11-30",
    games: [
      {
        kind: "domanda",
        source: "Sport · Vent'anni dopo Torino, l'eredità dei Giochi invernali",
        prompt: "Prima di Milano Cortina 2026, in quale anno l'Italia aveva ospitato le Olimpiadi invernali?",
        options: ["1994", "2002", "2006", "2010"],
        answer: 2,
        explain: "Torino 2006: la seconda Olimpiade invernale italiana dopo Cortina d'Ampezzo 1956.",
      },
      {
        kind: "ordine",
        prompt: "Metti in ordine, dal più antico al più recente.",
        events: [
          { label: "Proclamazione del Regno d'Italia", year: 1861 },
          { label: "Roma diventa capitale", year: 1871 },
          { label: "Referendum istituzionale: nasce la Repubblica", year: 1946 },
          { label: "Firma dei Trattati di Roma", year: 1957 },
        ],
      },
      {
        kind: "parola",
        prompt: "Riordina le lettere.",
        hint: "La stagione che comincia con il solstizio di dicembre.",
        answer: "INVERNO",
      },
    ],
    clue: { word: "7 dicembre", note: "Una data che a Milano non è come le altre." },
  },
  {
    dayIndex: 1,
    dayName: "Martedì",
    dateLabel: "1 dicembre",
    isoDate: "2026-12-01",
    games: [
      {
        kind: "domanda",
        source: "Cultura · Il cartellone della nuova stagione lirica",
        prompt: "In quale anno è stato inaugurato il Teatro alla Scala?",
        options: ["1778", "1813", "1861", "1901"],
        answer: 0,
        explain: "La Scala fu inaugurata il 3 agosto 1778 con l'Europa riconosciuta di Antonio Salieri.",
      },
      {
        kind: "ordine",
        prompt: "Metti in ordine, dal più antico al più recente.",
        events: [
          { label: "Prima ferrovia italiana, Napoli–Portici", year: 1839 },
          { label: "Segnale radio di Marconi attraverso l'Atlantico", year: 1901 },
          { label: "Iniziano le trasmissioni televisive regolari della RAI", year: 1954 },
          { label: "Inaugurata l'Autostrada del Sole completa", year: 1964 },
        ],
      },
      {
        kind: "parola",
        prompt: "Riordina le lettere.",
        hint: "Palcoscenico, platea, loggione.",
        answer: "TEATRO",
      },
    ],
    clue: { word: "Patrono", note: "Ogni città ne ha uno." },
  },
  {
    dayIndex: 2,
    dayName: "Mercoledì",
    dateLabel: "2 dicembre",
    isoDate: "2026-12-02",
    games: [
      {
        kind: "domanda",
        source: "Italia · Autonomie, cosa cambia per i territori",
        prompt: "Quante sono le regioni italiane?",
        options: ["18", "19", "20", "21"],
        answer: 2,
        explain: "Venti regioni, cinque delle quali a statuto speciale.",
      },
      {
        kind: "ordine",
        prompt: "Metti in ordine, dal più antico al più recente.",
        events: [
          { label: "Esce il primo numero del Corriere della Sera", year: 1876 },
          { label: "Si corre il primo Giro d'Italia", year: 1909 },
          { label: "Prima edizione della Mille Miglia", year: 1927 },
          { label: "L'Italia vince il Mondiale di Spagna", year: 1982 },
        ],
      },
      {
        kind: "parola",
        prompt: "Riordina le lettere.",
        hint: "Esce ogni mattina, anche in digitale.",
        answer: "GIORNALE",
      },
    ],
    clue: { word: "La Prima", note: "Tutta la città la aspetta, in platea e in piazza." },
  },
  {
    dayIndex: 3,
    dayName: "Giovedì",
    dateLabel: "3 dicembre",
    isoDate: "2026-12-03",
    games: [
      {
        kind: "domanda",
        source: "Ambiente · Ghiacciai alpini, la campagna di misurazione",
        prompt: "Qual è la montagna più alta delle Alpi?",
        options: ["Monte Rosa", "Cervino", "Monte Bianco", "Gran Paradiso"],
        answer: 2,
        explain: "Il Monte Bianco supera i 4.800 metri ed è la vetta più alta dell'Europa occidentale.",
      },
      {
        kind: "ordine",
        prompt: "Metti in ordine, dal più antico al più recente.",
        events: [
          { label: "Muore Dante Alighieri a Ravenna", year: 1321 },
          { label: "Colombo raggiunge le Americhe", year: 1492 },
          { label: "Galileo pubblica il Sidereus Nuncius", year: 1610 },
          { label: "Manzoni avvia l'edizione definitiva dei Promessi sposi", year: 1840 },
        ],
      },
      {
        kind: "parola",
        prompt: "Riordina le lettere.",
        hint: "Bancarelle, voci, contrattazioni.",
        answer: "MERCATO",
      },
    ],
    clue: { word: "Oh bej! Oh bej!", note: "Un'esclamazione che dà il nome a una fiera." },
  },
  {
    dayIndex: 4,
    dayName: "Venerdì",
    dateLabel: "4 dicembre",
    isoDate: "2026-12-04",
    games: [
      {
        kind: "domanda",
        source: "Viaggi · Le città d'arte nella stagione invernale",
        prompt: "Quale fiume attraversa Firenze?",
        options: ["Tevere", "Arno", "Adige", "Po"],
        answer: 1,
        explain: "L'Arno, attraversato tra gli altri dal Ponte Vecchio.",
      },
      {
        kind: "ordine",
        prompt: "Metti in ordine, dal più antico al più recente.",
        events: [
          { label: "Lancio dello Sputnik 1", year: 1957 },
          { label: "Gagarin è il primo uomo nello spazio", year: 1961 },
          { label: "Lo sbarco sulla Luna", year: 1969 },
          { label: "Samantha Cristoforetti parte per la sua prima missione", year: 2014 },
        ],
      },
      {
        kind: "parola",
        prompt: "Riordina le lettere.",
        hint: "Festa di fine dicembre.",
        answer: "NATALE",
      },
    ],
    clue: { word: "Basilica", note: "Romanica, in mattoni, con due campanili diversi." },
  },
  {
    dayIndex: 5,
    dayName: "Sabato",
    dateLabel: "5 dicembre",
    isoDate: "2026-12-05",
    games: [
      {
        kind: "domanda",
        source: "Economia · Venticinque anni di moneta unica",
        prompt: "In quale anno l'euro è entrato in circolazione in banconote e monete?",
        options: ["1992", "1999", "2002", "2008"],
        answer: 2,
        explain: "Il 1° gennaio 2002. Dal 1999 esisteva già come moneta scritturale.",
      },
      {
        kind: "ordine",
        prompt: "Metti in ordine, dal più antico al più recente.",
        events: [
          { label: "Cade il Muro di Berlino", year: 1989 },
          { label: "Firma del Trattato di Maastricht", year: 1992 },
          { label: "L'euro entra nelle tasche degli europei", year: 2002 },
          { label: "Il Regno Unito vota per lasciare l'Ue", year: 2016 },
        ],
      },
      {
        kind: "parola",
        prompt: "Riordina le lettere.",
        hint: "Un continente, e un'Unione.",
        answer: "EUROPA",
      },
    ],
    clue: { word: "Vescovo", note: "Lo fu, acclamato dal popolo nel IV secolo." },
  },
];

export const NODO = {
  dayIndex: 6,
  dayName: "Domenica",
  dateLabel: "6 dicembre",
  prompt: "Chi, o che cosa, lega i sei indizi della settimana?",
  accepted: ["SANTAMBROGIO", "AMBROGIO", "SANTOAMBROGIO", "SAMBROGIO"],
  solution: "Sant'Ambrogio",
  explain:
    "Vescovo di Milano nel IV secolo e patrono della città. Il 7 dicembre, sua festa, si inaugura la stagione della Scala con la Prima e si tiene la fiera degli Oh bej! Oh bej!. La basilica romanica a lui dedicata è uno dei simboli di Milano.",
};

export const DAY_NAMES = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
export const DAY_SHORT = ["L", "M", "M", "G", "V", "S", "D"];

export function normalizeAnswer(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

export function isNodoCorrect(guess: string): boolean {
  return NODO.accepted.includes(normalizeAnswer(guess));
}

/** Rimescolamento deterministico delle lettere (mai uguale alla parola). */
export function scramble(word: string, seed: number): string[] {
  const letters = word.split("");
  let s = seed + 7;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let attempt = 0; attempt < 10; attempt++) {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    if (letters.join("") !== word) break;
  }
  return letters;
}

/** Ordine iniziale deterministico degli eventi (mai già corretto). */
export function shuffledOrder(n: number, seed: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  let s = seed + 3;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let attempt = 0; attempt < 10; attempt++) {
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    if (idx.some((v, i) => v !== i)) break;
  }
  return idx;
}

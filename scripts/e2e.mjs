/**
 * Verifica end-to-end delle tre esperienze del prototipo, della presentazione e del Growth Lab.
 * Uso: BASE_URL=http://localhost:3000 node scripts/e2e.mjs [cartella-screenshot]
 * Fallisce (exit 1) se un passo non è raggiungibile o se la pagina produce errori di console.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.argv[2] ?? "e2e-screens";
fs.mkdirSync(OUT, { recursive: true });

const WORDS = ["INVERNO", "TEATRO", "GIORNALE", "MERCATO", "NATALE", "EUROPA"];
const errors = [];
const log = (m) => console.log(`  ✓ ${m}`);

async function newPage(browser, viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport, acceptDownloads: true });
  const page = await ctx.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`${page.url()} :: ${msg.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`${page.url()} :: ${e.message}`));
  return page;
}

const phone = (page) => page.locator("[data-phone-scroll]");

async function playEdition(page, day, { quizDone = false } = {}) {
  const p = phone(page);
  if (!quizDone) {
    await p.getByRole("group", { name: "Opzioni di risposta" }).getByRole("button").first().click();
    await p.getByRole("button", { name: /Avanti/ }).click();
  }
  // Prima o Dopo: verifica, eventuale secondo tentativo, avanti
  await p.getByRole("button", { name: "Verifica l'ordine" }).click();
  if (!(await p.getByRole("button", { name: /^Avanti/ }).isVisible())) {
    await p.getByRole("button", { name: /in giù/ }).first().click();
    await p.getByRole("button", { name: "Verifica l'ordine" }).click();
  }
  await p.getByRole("button", { name: /^Avanti/ }).click();
  // Anagramma: digita la parola
  await page.waitForTimeout(300);
  await page.keyboard.type(WORDS[day], { delay: 20 });
  await p.getByRole("button", { name: /Completa l'Edizione/ }).click();
}

async function next(page) {
  await page.getByRole("button", { name: /Passo successivo/ }).click();
  await page.waitForTimeout(250);
}

async function retention(browser) {
  console.log("Esperienza A · Retention");
  const page = await newPage(browser);
  await page.goto(`${BASE}/prototype/retention`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByText("Il punto di partenza", { exact: false }).first().waitFor();
  await page.screenshot({ path: `${OUT}/A1-partenza.png` });
  await next(page);
  await phone(page).getByRole("button", { name: /Gioca l'Edizione/ }).click();
  await playEdition(page, 2);
  await phone(page).getByText("La Prima").waitFor();
  log("Edizione di mercoledì completata, indizio «La Prima»");
  await page.screenshot({ path: `${OUT}/A2-indizio.png` });
  await phone(page).getByRole("button", { name: "Torna al Filo" }).click();
  await phone(page).getByRole("button", { name: /Lunedì: indizio da recuperare/ }).click();
  await playEdition(page, 0);
  await phone(page).getByText("Indizio recuperato").waitFor();
  log("Indizio di lunedì recuperato");
  await phone(page).getByRole("button", { name: "Torna al Filo" }).click();
  await page.screenshot({ path: `${OUT}/A3-meccanismo.png` });
  await next(page);
  await phone(page).getByText("L'indizio di giovedì ti aspetta").waitFor();
  await page.screenshot({ path: `${OUT}/A4-riattivazione.png` });
  await phone(page).getByRole("button", { name: /giovedì ti aspetta/ }).click();
  log("Notifica di riattivazione aperta");
  await phone(page).getByRole("button", { name: /Gioca l'Edizione/ }).click();
  await playEdition(page, 4);
  await phone(page).getByRole("button", { name: "Torna al Filo" }).click();
  await page.getByRole("button", { name: "Vai a domenica" }).click();
  await phone(page).getByPlaceholder("Chi o che cosa?").fill("Sant'Ambrogio");
  await phone(page).getByRole("button", { name: "Prova" }).click();
  await phone(page).getByText("Nodo sciolto").waitFor();
  log("Nodo della domenica risolto");
  await page.screenshot({ path: `${OUT}/A5-nodo.png` });
  await page.context().close();
}

async function acquisition(browser) {
  console.log("Esperienza B · Acquisizione");
  const page = await newPage(browser);
  await page.goto(`${BASE}/prototype/acquisition`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByText("Vent'anni dopo Torino 2006").first().waitFor();
  await page.screenshot({ path: `${OUT}/B1-articolo.png` });
  await next(page);
  await phone(page).getByRole("button", { name: "2006" }).click();
  await phone(page).getByRole("button", { name: /Conferma/ }).click();
  await page.screenshot({ path: `${OUT}/B2-touchpoint.png` });
  await phone(page).getByRole("button", { name: "Continua l'Edizione" }).click();
  log("Domanda nell'articolo e ingresso da ospite");
  await playEdition(page, 0, { quizDone: true });
  await phone(page).getByText("Salva il tuo indizio").waitFor();
  await page.screenshot({ path: `${OUT}/B3-postgioco.png` });
  const dl = page.waitForEvent("download");
  await phone(page).getByRole("button", { name: /promemoria al calendario/ }).click();
  const d = await dl;
  if (!d.suggestedFilename().endsWith(".ics")) throw new Error("ICS non scaricato");
  log("Promemoria .ics scaricato");
  await next(page);
  await phone(page).getByRole("button", { name: /secondo indizio/ }).click();
  await playEdition(page, 1);
  await phone(page).getByText("Patrono").first().waitFor();
  log("Ritorno di martedì e secondo indizio");
  await page.screenshot({ path: `${OUT}/B4-martedi.png` });
  await page.context().close();
}

async function referral(browser) {
  console.log("Esperienza C · Referral");
  const page = await newPage(browser);
  await page.goto(`${BASE}/prototype/referral`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await phone(page).getByRole("button", { name: /Sfida qualcuno/ }).click();
  await phone(page).getByRole("button", { name: "WhatsApp" }).click();
  await page.screenshot({ path: `${OUT}/C1-invito.png` });
  await next(page);
  await phone(page).getByRole("button", { name: /corriere\.it\/giochi/ }).click();
  await phone(page).getByRole("button", { name: /Gioca subito/ }).click();
  log("Landing aperta, gioco da ospite");
  await next(page);
  await playEdition(page, 3);
  await phone(page).getByRole("button", { name: /Crea un account/ }).click();
  await phone(page).getByText("Sei nella Sfida").waitFor();
  await page.screenshot({ path: `${OUT}/C2-sfida.png` });
  await next(page);
  await page.getByRole("button", { name: "Venerdì: Chiara torna" }).click();
  await playEdition(page, 4);
  await phone(page).getByText("nuova giocatrice attiva").waitFor();
  log("Ritorno attribuito e premio all'invitante");
  await page.screenshot({ path: `${OUT}/C3-misurazione.png`, fullPage: true });
  await page.context().close();
}

async function pages(browser) {
  console.log("Pagine");
  for (const [path, name, vp] of [
    ["/", "home", { width: 1440, height: 900 }],
    ["/", "home-mobile", { width: 390, height: 844 }],
    ["/strategy", "strategy", { width: 1440, height: 900 }],
    ["/strategy", "strategy-mobile", { width: 390, height: 844 }],
    ["/growth-lab", "growth-lab", { width: 1440, height: 900 }],
    ["/growth-lab", "growth-lab-mobile", { width: 390, height: 844 }],
    ["/roadmap", "roadmap", { width: 1440, height: 900 }],
    ["/prototype/retention", "retention-mobile", { width: 390, height: 844 }],
  ]) {
    const page = await newPage(browser, vp);
    const res = await page.goto(`${BASE}${path}`);
    if (!res || res.status() !== 200) throw new Error(`${path} → ${res?.status()}`);
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) errors.push(`${path} (${vp.width}px) :: scroll orizzontale di ${overflow}px`);
    await page.screenshot({ path: `${OUT}/P-${name}.png`, fullPage: name !== "strategy" });
    log(`${path} @${vp.width}px`);
    await page.context().close();
  }
}

const browser = await chromium.launch();
try {
  await retention(browser);
  await acquisition(browser);
  await referral(browser);
  await pages(browser);
} catch (e) {
  console.error("\n✗ FALLITO:", e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
if (errors.length) {
  console.error("\nErrori di console / layout:");
  for (const e of errors) console.error("  -", e);
  process.exitCode = 1;
} else if (!process.exitCode) console.log("\nTutto verde.");

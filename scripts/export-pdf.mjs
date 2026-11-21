/**
 * Esporta la presentazione in PDF (16:9, una slide per pagina).
 * Uso: con il server avviato, BASE_URL=http://localhost:3000 node scripts/export-pdf.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.argv[2] ?? "docs/Il-Filo-presentazione.pdf";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(`${BASE}/strategy`, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: OUT, preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log(`PDF salvato in ${OUT}`);

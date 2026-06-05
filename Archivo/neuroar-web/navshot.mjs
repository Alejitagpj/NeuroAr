import { setTimeout as sleep } from "node:timers/promises";
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const BASE = "http://localhost:3000";
const OUT = "/home/user/shots";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  args: [...chromium.args, "--no-sandbox", "--disable-dev-shm-usage", "--single-process", "--use-gl=swiftshader"],
  executablePath: await chromium.executablePath(),
  headless: true,
  protocolTimeout: 60000,
});
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
const log = (...a) => console.log(...a);
const shot = async (n) => { await sleep(1000); await page.screenshot({ path: `${OUT}/${n}.png` }); log("shot:", n); };

try {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await sleep(2500); // hero shader
  await shot("nw-01-landing");

  await page.goto(`${BASE}/reports`, { waitUntil: "domcontentloaded" });
  await sleep(1500);
  await shot("nw-02-reports");
  const cards = await page.evaluate(() => document.querySelectorAll('a[href^="/reports/NA"]').length);
  log("report cards/links:", cards);

  // open first report wizard
  const href = await page.evaluate(() => {
    const a = document.querySelector('a[href^="/reports/NA"]');
    return a ? a.getAttribute("href") : null;
  });
  log("opening:", href);
  await page.goto(`${BASE}${href}`, { waitUntil: "domcontentloaded" });
  await sleep(1500);
  await shot("nw-03-wizard-welcome");

  // wizard controls present?
  const wz = await page.evaluate(() => ({
    salir: [...document.querySelectorAll("a")].some(a => /salir/i.test(a.textContent||"") && a.getAttribute("href")==="/reports"),
    siguiente: [...document.querySelectorAll("button")].some(b => /siguiente/i.test(b.textContent||"")),
    anterior: [...document.querySelectorAll("button")].some(b => /anterior/i.test(b.textContent||"")),
  }));
  log("WIZARD CONTROLS:", JSON.stringify(wz));

  // click Siguiente a few times
  for (let i=0;i<2;i++){
    await page.evaluate(() => {
      const b=[...document.querySelectorAll("button")].find(x=>/siguiente/i.test(x.textContent||""));
      b?.click();
    });
    await sleep(900);
  }
  await shot("nw-04-wizard-domain");

  // chat dock present?
  const chat = await page.evaluate(() => [...document.querySelectorAll("button")].some(b=>/pregunta al asistente/i.test(b.textContent||"")));
  log("CHAT DOCK visible:", chat);

  // try the chat (will hit /api/chat -> needs key)
  await page.evaluate(() => {
    const b=[...document.querySelectorAll("button")].find(x=>/pregunta al asistente/i.test(x.textContent||""));
    b?.click();
  });
  await sleep(800);
  await page.evaluate(() => {
    const inp=document.querySelector('input[placeholder*="pregunta" i]');
    if(inp){ inp.value="¿Qué significa este percentil?"; inp.dispatchEvent(new Event('input',{bubbles:true})); }
  });
  // capture network result of /api/chat
  let chatStatus = "n/a";
  page.on("response", (r)=>{ if(r.url().includes("/api/chat")) chatStatus = r.status(); });
  await page.evaluate(() => {
    const f=document.querySelector("form"); f?.requestSubmit?.();
  });
  await sleep(3000);
  await shot("nw-05-chat");
  log("CHAT /api/chat status:", chatStatus);

  // compare page
  await page.goto(`${BASE}/compare`, { waitUntil: "domcontentloaded" });
  await sleep(1500);
  await shot("nw-06-compare");

  log("EXIT ok");
} catch(e){ log("ERROR:", e.message); }
finally { await browser.close(); }

import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const PORT = 4179;
const BASE = `http://localhost:${PORT}`;

const srv = spawn("node_modules/.bin/serve", ["-s", "dist", "-l", String(PORT)], {
  cwd: "/home/user/NeuroAr/NeuroAr",
  stdio: "ignore",
});
await sleep(1500);

const browser = await puppeteer.launch({
  args: [...chromium.args, "--no-sandbox", "--disable-dev-shm-usage", "--single-process"],
  executablePath: await chromium.executablePath(),
  headless: true,
  protocolTimeout: 60000,
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

const log = (...a) => console.log(...a);

try {
  // DASHBOARD
  await page.goto(`${BASE}/app`, { waitUntil: "domcontentloaded" });
  await sleep(800);
  const dash = await page.evaluate(() => ({
    rows: document.querySelectorAll("table tbody tr").length,
    openBtns: [...document.querySelectorAll("a")].filter((a) => /abrir paciente/i.test(a.textContent || "")).length,
    importBtn: [...document.querySelectorAll("button")].some((b) => /importar/i.test(b.textContent || "")),
    audienceSwitch: [...document.querySelectorAll("button")].some((b) => /familia|cl[ií]nica/i.test(b.textContent || "")),
  }));
  log("DASHBOARD:", JSON.stringify(dash));

  // CLICK INTO PATIENT
  const href = await page.evaluate(() => {
    const a = [...document.querySelectorAll("a")].find((el) => /abrir paciente/i.test(el.textContent || ""));
    if (a) { a.click(); return a.getAttribute("href"); }
    return null;
  });
  await sleep(1500);
  log("CLICKED patient →", href, "| now at:", new URL(page.url()).pathname);

  // BACK CONTROL PRESENT?
  const back = await page.evaluate(() => {
    const el = [...document.querySelectorAll("a,button")].find((e) => /volver|atr[aá]s/i.test(e.textContent || ""));
    const logo = document.querySelector('a[href="/app"]');
    return {
      backLink: el ? { text: el.textContent.trim(), href: el.getAttribute("href") } : null,
      logoToApp: Boolean(logo),
    };
  });
  log("BACK CONTROLS:", JSON.stringify(back));

  // CLICK BACK
  await page.evaluate(() => {
    const el = [...document.querySelectorAll("a,button")].find((e) => /volver/i.test(e.textContent || ""));
    el?.click();
  });
  await sleep(1000);
  log("AFTER BACK → path:", new URL(page.url()).pathname);

  // AUDIENCE SWITCH → familia, then check back still works
  await page.evaluate(() => {
    const a = [...document.querySelectorAll("a")].find((el) => /abrir paciente/i.test(el.textContent || ""));
    a?.click();
  });
  await sleep(1200);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((el) => /familia/i.test(el.textContent || ""));
    b?.click();
  });
  await sleep(1200);
  const familia = await page.evaluate(() => {
    const back = [...document.querySelectorAll("a,button")].find((e) => /volver/i.test(e.textContent || ""));
    return {
      heading: document.querySelector("h1,h2")?.textContent?.trim()?.slice(0, 60) || null,
      hasBack: Boolean(back),
    };
  });
  log("FAMILIA VIEW:", JSON.stringify(familia));

  log("EXIT: ok");
} catch (e) {
  log("ERROR:", e.message);
} finally {
  await browser.close();
  srv.kill();
}

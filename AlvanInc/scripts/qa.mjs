/**
 * Browser check for the real, rendered site.
 *
 *   one-time:   npm i -D playwright && npx playwright install chromium
 *   every time: npm run dev            (in one terminal)
 *               npm run qa             (in another)
 *   against a build:  npm run build && npm run preview, then  npm run qa -- --url=http://localhost:4173
 *
 * Visits every route at 375 / 768 / 1440 px, scrolls to trigger reveal animations, saves a full-page
 * screenshot of each into qa-output/ (look at them!), and reports:
 *   - console errors, uncaught exceptions, failed requests
 *   - horizontal overflow (page wider than the screen)
 *   - h1 count (should be exactly 1), images without alt, canonical + title present
 *   - text whose contrast is below WCAG AA (4.5:1, or 3:1 for large text)
 * Exits with code 1 if anything is found, so it can run in CI.
 *
 * Options: --url=http://localhost:5173   --routes=/,/work   --no-shots
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { prerenderRoutes } from "../src/lib/seo.js";

const arg = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") ?? fallback;
const BASE = arg("url", "http://localhost:5173").replace(/\/$/, "");
const ROUTES = arg("routes", null)?.split(",") ?? [...prerenderRoutes().map((r) => r.path), "/no-such-page"];
const SHOTS = !process.argv.includes("--no-shots");
const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];
const OUT = path.resolve(import.meta.dirname, "..", "qa-output");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. Run:  npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

/** Runs inside the page. Returns text elements below WCAG AA contrast. */
function contrastScan() {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  // Chrome reports modern colour spaces (oklch...), so let the canvas convert anything to sRGB RGBA.
  const toRGBA = (css) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255];
  };
  const over = (top, bottom) => {
    const a = top[3] + bottom[3] * (1 - top[3]);
    if (a === 0) return [0, 0, 0, 0];
    return [0, 1, 2].map((i) => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / a).concat(a);
  };
  const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (x, y) => {
    const [hi, lo] = [lum(x), lum(y)].sort((p, q) => q - p);
    return (hi + 0.05) / (lo + 0.05);
  };
  const bgOf = (el) => {
    // Composite backgrounds from the element up to the root. null = can't know (image/gradient behind).
    let acc = [0, 0, 0, 0];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== "none") return null;
      acc = over(acc, toRGBA(cs.backgroundColor));
      if (acc[3] >= 0.99) return acc;
    }
    return over(acc, [255, 255, 255, 1]);
  };
  const opacityOf = (el) => {
    let o = 1;
    for (let n = el; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
    return o;
  };
  const found = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    const text = t.textContent.trim();
    const el = t.parentElement;
    if (!text || !el || seen.has(el) || el.closest("[aria-hidden='true'], noscript, script, style, svg")) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    seen.add(el);
    const bg = bgOf(el);
    if (!bg) continue;
    const fg0 = toRGBA(cs.color);
    const fg = over([fg0[0], fg0[1], fg0[2], fg0[3] * opacityOf(el)], bg);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
    const need = large ? 3 : 4.5;
    const r = ratio(fg, bg);
    if (r < need) {
      found.push({ text: text.slice(0, 48), ratio: Math.round(r * 100) / 100, need, size: Math.round(size) });
    }
  }
  return found;
}

const browser = await chromium.launch();
const problems = [];
const report = (route, vp, msg) => problems.push(`${route} @${vp}  ${msg}`);
if (SHOTS) await fs.mkdir(OUT, { recursive: true });

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const route of ROUTES) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text().slice(0, 160)}`));
    page.on("pageerror", (e) => errors.push(`exception: ${String(e.message).slice(0, 160)}`));
    page.on("requestfailed", (r) => errors.push(`request failed: ${r.url().slice(0, 100)}`));
    try {
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    } catch (e) {
      report(route, vp.name, `could not load: ${e.message.split("\n")[0]}`);
      await page.close();
      continue;
    }
    // Scroll through so IntersectionObserver reveals fire, then come back to the top
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += vp.height * 0.8) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(900);

    const facts = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll("h1").length,
      noAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).map((i) => i.currentSrc || i.src).slice(0, 3),
      title: document.title,
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      robots: document.querySelector('meta[name="robots"]')?.content ?? null,
    }));
    const is404 = route === "/no-such-page";
    if (facts.overflow > 0) report(route, vp.name, `horizontal overflow by ${facts.overflow}px`);
    if (!is404 && facts.h1 !== 1) report(route, vp.name, `${facts.h1} <h1> elements (want 1)`);
    if (facts.noAlt.length) report(route, vp.name, `images without alt: ${facts.noAlt.join(", ")}`);
    if (!facts.title || facts.title === "AlvanInc") report(route, vp.name, `title looks like the default: "${facts.title}"`);
    if (!is404 && !facts.canonical && !/noindex/.test(facts.robots ?? "")) report(route, vp.name, "no canonical URL");
    for (const e of errors) report(route, vp.name, e);
    for (const c of await page.evaluate(contrastScan)) {
      report(route, vp.name, `contrast ${c.ratio}:1 (needs ${c.need}) ${c.size}px "${c.text}"`);
    }
    if (SHOTS) {
      const name = `${route === "/" ? "home" : route.slice(1).replace(/\//g, "_")}-${vp.name}.png`;
      await page.screenshot({ path: path.join(OUT, name), fullPage: true });
    }
    await page.close();
  }
  await context.close();
}
await browser.close();

// Collapse identical findings across viewports for readability
const grouped = new Map();
for (const p of problems) {
  const [head, ...rest] = p.split("  ");
  const route = head.split(" @")[0];
  const key = `${route}  ${rest.join("  ")}`;
  grouped.set(key, [...(grouped.get(key) ?? []), head.split(" @")[1]]);
}
if (grouped.size === 0) {
  console.log(`QA passed: ${ROUTES.length} routes x ${VIEWPORTS.length} widths, no problems found.`);
} else {
  console.log(`QA found ${grouped.size} issue(s):\n`);
  for (const [key, vps] of grouped) console.log(`  [${vps.join(", ")}px]  ${key}`);
}
if (SHOTS) console.log(`\nScreenshots: ${path.relative(process.cwd(), OUT)}/  (open them and look; this script cannot judge design)`);
process.exit(grouped.size ? 1 : 0);

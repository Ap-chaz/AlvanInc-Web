/**
 * Post-build step: static HTML per route, so link previews and crawlers work without JavaScript.
 *
 *   npm run build   (runs `vite build` and then this script)
 *
 * What it does, using dist/index.html (Vite's output) as the template:
 *   - writes dist/<route>/index.html for every route in src/lib/seo.js (home overwrites dist/index.html)
 *     with that route's <title>, description, robots, canonical, Open Graph, Twitter tags and JSON-LD
 *   - adds a <noscript> block (heading, description, links) for crawlers/visitors without JavaScript
 *   - writes dist/sitemap.xml and dist/robots.txt from the same route list and SITE.url
 *
 * The page BODY is still rendered in the browser by React. This is "head prerendering": it fixes
 * WhatsApp / LinkedIn / X previews and gives search engines correct metadata, but it is not full
 * server-side rendering of the page content.
 *
 * Change the domain in src/lib/site.js (SITE.url) and rebuild; everything here follows it.
 */
import { PROJECTS } from "../src/lib/alvan-data.js";
import { promises as fs } from "node:fs";
import path from "node:path";
import { prerenderRoutes, buildHead, absoluteUrl, OG_IMAGE } from "../src/lib/seo.js";
import { SITE } from "../src/lib/site.js";
import { NAV_ALL } from "../src/lib/nav.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");

const escAttr = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escText = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// "<" inside JSON-LD would let a value close the script tag early
const jsonForScript = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

function headBlock(route) {
  const head = buildHead(route);
  const lines = [`<title>${escText(head.title)}</title>`];
  for (const [attr, key, content] of head.metas) {
    lines.push(`<meta ${attr}="${escAttr(key)}" content="${escAttr(content)}" />`);
  }
  if (head.canonical) lines.push(`<link rel="canonical" href="${escAttr(head.canonical)}" />`);
  if (head.jsonLd) {
    lines.push(`<script id="ld-json" type="application/ld+json">${jsonForScript(head.jsonLd)}</script>`);
  }
  return lines.map((l) => `    ${l}`).join("\n");
}

function noscriptBlock(route) {
  const links = [{ label: "Home", to: "/" }, ...NAV_ALL]
    .map((l) => `<li><a href="${escAttr(l.to)}">${escText(l.label)}</a></li>`)
    .join("");
  return `<noscript id="prerender-fallback"><h1>${escText(route.title)}</h1><p>${escText(route.description)}</p><nav><ul>${links}</ul></nav></noscript>`;
}

/** Remove head tags this script owns (whole lines), so the template's defaults are not duplicated. */
function stripManagedHead(html) {
  const line = (re) => new RegExp(`[ \\t]*${re}[ \\t]*\\r?\\n?`, "gi");
  return html
    .replace(line("<title>[\\s\\S]*?</title>"), "")
    .replace(line('<meta\\s+[^>]*?(?:name|property)="(?:description|robots|og:[^"]*|twitter:[^"]*)"[^>]*>'), "")
    .replace(line('<link\\s+[^>]*?rel="canonical"[^>]*>'), "")
    .replace(line('<script\\s+[^>]*?id="ld-json"[^>]*>[\\s\\S]*?</script>'), "")
    .replace(line('<noscript id="prerender-fallback">[\\s\\S]*?</noscript>'), "");
}

function render(template, route) {
  if (!/<\/head>/i.test(template)) throw new Error("dist/index.html has no </head>");
  if (!/<div id="root"><\/div>/.test(template)) throw new Error('dist/index.html has no <div id="root"></div>');
  let html = stripManagedHead(template);
  html = html.replace(/[ \t]*<\/head>/i, `${headBlock(route)}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscriptBlock(route)}`);
  return html;
}

function check(file, html, route) {
  const count = (re) => (html.match(re) || []).length;
  const problems = [];
  if (count(/<title>/gi) !== 1) problems.push("expected exactly one <title>");
  if (count(/name="description"/gi) !== 1) problems.push("expected exactly one description");
  if (count(/property="og:image"/gi) !== 1) problems.push("expected exactly one og:image");
  const wantCanonical = route.noindex ? 0 : 1;
  if (count(/rel="canonical"/gi) !== wantCanonical) problems.push(`expected ${wantCanonical} canonical`);
  if (!html.includes('type="module"')) problems.push("Vite script tag missing");
  if (problems.length) throw new Error(`${file}: ${problems.join("; ")}`);
}

function sitemapXml(routes) {
  const urls = routes
    .filter((r) => !r.noindex)
    .map(
      (r) =>
        `  <url>\n    <loc>${escText(absoluteUrl(r.path))}</loc>\n    <changefreq>${r.changefreq ?? "monthly"}</changefreq>\n    <priority>${r.priority ?? "0.5"}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Projects for the build: from the live API when SEO_API_URL is set, otherwise the static file. */
async function loadProjects() {
  const api = process.env.SEO_API_URL;
  if (!api) return PROJECTS;
  try {
    const res = await fetch(`${api.replace(/\/+$/, "")}/api/projects`, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { projects } = await res.json();
    if (!Array.isArray(projects) || projects.length === 0) throw new Error("no projects returned");
    console.log(`Using ${projects.length} projects from ${api}`);
    return projects;
  } catch (err) {
    console.warn(`WARNING: could not load projects from ${api} (${err.message}). Using the static data file.`);
    return PROJECTS;
  }
}

async function main() {
  const templatePath = path.join(DIST, "index.html");
  let template;
  try {
    template = await fs.readFile(templatePath, "utf8");
  } catch {
    console.error("dist/index.html not found. Run `vite build` first (npm run build does both).");
    process.exit(1);
  }

  const routes = prerenderRoutes(await loadProjects());
  for (const route of routes) {
    const html = render(template, route);
    const out = route.path === "/" ? templatePath : path.join(DIST, route.path.replace(/^\//, ""), "index.html");
    check(path.relative(ROOT, out), html, route);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, html);
  }

  await fs.writeFile(path.join(DIST, "sitemap.xml"), sitemapXml(routes));
  await fs.writeFile(
    path.join(DIST, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`,
  );

  const ogFile = path.join(DIST, OG_IMAGE.path.replace(/^\//, ""));
  const ogOk = await fs.access(ogFile).then(() => true, () => false);
  console.log(`Prerendered ${routes.length} routes for ${SITE.url}`);
  for (const r of routes) console.log(`  ${r.path}`);
  console.log("Wrote sitemap.xml and robots.txt");
  if (!ogOk) console.warn(`WARNING: ${OG_IMAGE.path} is missing from dist/ (put it in public/). Link previews will have no image.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

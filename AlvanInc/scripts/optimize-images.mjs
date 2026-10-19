/**
 * Image pipeline: assets-src/** → public/img/*.{avif,webp} + src/data/image-manifest.json
 *
 *   npm run images
 *
 * For every source photo (jpg, png, webp, tiff) it writes AVIF + WebP at
 * 480 / 768 / 1200 / 1920 px wide (never upscaled), a ~20 px blur placeholder
 * (inline data URL) and a dominant colour. The manifest is keyed by the source
 * file's name without extension, e.g. "zuno-hero". <ResponsiveImage src="/zuno-hero.webp" />
 * looks itself up by that key, so data files can keep pointing at the original name.
 *
 * Budgets (design.md Phase 6): hero ≤ 250 KB, gallery ≤ 150 KB at display size.
 * The script warns when the 1200 px WebP is larger than 250 KB.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "assets-src");
const OUT = path.join(ROOT, "public", "img");
const MANIFEST = path.join(ROOT, "src", "data", "image-manifest.json");
const WIDTHS = [480, 768, 1200, 1920];
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);
const BUDGET_BYTES = 250 * 1024;

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out.sort();
}

const toHex = ({ r, g, b }) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });

  let files;
  try {
    files = await walk(SRC);
  } catch {
    console.error(`No ${path.relative(ROOT, SRC)}/ folder. Put originals in assets-src/<project>/ and re-run.`);
    process.exit(1);
  }

  const manifest = {};
  const seen = new Set();
  for (const file of files) {
    const key = path.basename(file, path.extname(file));
    if (seen.has(key)) {
      console.error(`Duplicate image name "${key}" (${path.relative(ROOT, file)}). Names must be unique.`);
      process.exit(1);
    }
    seen.add(key);

    const img = sharp(file).rotate();
    const meta = await img.metadata();
    const stats = await img.clone().stats();
    const widths = [...new Set(WIDTHS.filter((w) => w < meta.width).concat(Math.min(meta.width, WIDTHS.at(-1))))].sort(
      (a, b) => a - b,
    );

    let warn = "";
    for (const w of widths) {
      const resized = img.clone().resize({ width: w, withoutEnlargement: true });
      await resized.clone().avif({ quality: 55, effort: 4 }).toFile(path.join(OUT, `${key}-${w}.avif`));
      const info = await resized.clone().webp({ quality: 78 }).toFile(path.join(OUT, `${key}-${w}.webp`));
      if (w === 1200 && info.size > BUDGET_BYTES) warn = `  ⚠ 1200px WebP is ${(info.size / 1024).toFixed(0)} KB (budget 250 KB)`;
    }

    const blur = await img
      .clone()
      .resize({ width: 20 })
      .webp({ quality: 40 })
      .toBuffer();

    manifest[key] = {
      width: meta.width,
      height: meta.height,
      widths,
      color: toHex(stats.dominant),
      blur: `data:image/webp;base64,${blur.toString("base64")}`,
    };
    console.log(`${key}: ${meta.width}×${meta.height} → ${widths.join(", ")}${warn}`);
  }

  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nWrote ${Object.keys(manifest).length} images → public/img and ${path.relative(ROOT, MANIFEST)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

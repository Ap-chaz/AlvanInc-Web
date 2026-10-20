# AlvanInc

Personal portfolio site. See `design.md` for the phased build plan and the handoff log.

Plain JavaScript + React (JSX) + Vite + Tailwind CSS v4 + React Router.

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # vite build + static prerender, outputs to dist/
npm run preview
npm run fonts     # one-time: self-host Satoshi + IBM Plex Mono (needs internet, see below)
npm run qa        # browser check of every route (needs Playwright, see below)
```

## Structure

- `index.html` – entry HTML, fonts and default meta tags
- `src/main.jsx` – React entry, mounts `<BrowserRouter>`
- `src/App.jsx` – all routes (every route except home is lazy-loaded)
- `src/pages/` – one file per page
- `src/components/alvan/` – site components
- `src/lib/seo.js` – **all page titles, descriptions, Open Graph/Twitter tags, JSON-LD and the route list for the sitemap**
- `src/lib/site.js` – brand and contact details (domain, email, phone, WhatsApp, socials)
- `src/lib/use-head.js` – applies the SEO tags to the page while the visitor navigates
- `src/index.css` – Tailwind + brand tokens/styles
- `scripts/` – `prerender.mjs` (runs after every build), `fetch-fonts.mjs`, `qa.mjs`
- `public/` – favicon, `og-image.png` (the 1200×630 link-preview image), `_redirects`

## SEO and link previews

`npm run build` runs `vite build` and then `scripts/prerender.mjs`, which writes a static HTML file for
every route (`dist/about/index.html`, `dist/work/zuno/index.html`, ...) with that page's title,
description, canonical URL, Open Graph and Twitter tags and JSON-LD, plus `dist/sitemap.xml` and
`dist/robots.txt`. WhatsApp, LinkedIn and X read these files because they do not run JavaScript.

- It prerenders the `<head>` (and a `<noscript>` fallback). The page body is still drawn by React in
  the browser; this is not full server-side rendering.
- To change a page's title or description, edit `src/lib/seo.js` only.
- The domain comes from `SITE.url` in `src/lib/site.js`. Set the real one before launch and rebuild.
- Template projects (`placeholder: true` in `alvan-data.js`) are `noindex` and left out of the sitemap.
- `public/og-image.png` was drawn with a stand-in font. Replace it with a 1200×630 export in Satoshi
  when you have one; keep the file name.

## Fonts

Fonts load from Fontshare and Google until you run `npm run fonts` once (needs internet). It downloads
the woff2 files to `public/fonts/`, writes `src/fonts.css`, and swaps the CDN links in `index.html` for
preloads. Run `npm run build`, check the site, then commit those files. Check the Fontshare licence
for your use of the Satoshi files.

## Browser check

```sh
npm i -D playwright && npx playwright install chromium   # once
npm run dev                                              # terminal 1
npm run qa                                               # terminal 2
```

Visits every route at 375 / 768 / 1440 px, saves full-page screenshots to `qa-output/`, and reports
console errors, horizontal overflow, h1 and alt problems, and any text below WCAG AA contrast.
It cannot judge design: open the screenshots.

## Contrast

Brass on the bone surfaces is only 2.1:1, so brass *text* inside `.surface-light` / `.surface-light-deep`
automatically uses `--brass-deep` (5.8:1). Buttons, borders and brass on dark surfaces are unchanged.
Use `text-black/65` or darker for small text on light sections.

## Deploying

`vercel.json` (Vercel) and `public/_redirects` (Netlify/Cloudflare Pages) serve the prerendered files
first and send every other path to `index.html`, so deep links like `/work/zuno` work on refresh.

# AlvanInc — Design & Build Plan

> **Purpose of this file:** a self-contained brief so any AI (or human) can pick up the AlvanInc portfolio build mid-stream. Read it top to bottom before touching code. Update the **Status Board** (section 12) and **Handoff Log** (section 13) after every working session.

---

## 1. Project summary

| | |
|---|---|
| **Project name** | **AlvanInc** (the owner's personal brand / portfolio site) |
| **Goal** | A premium portfolio that showcases the owner's work, which is **photo-heavy**, and converts visitors into project enquiries |
| **Starting point** | An existing Vite + React site (zip: `alvan-crafted-sites-vite-animated.zip`, previously titled "PrimeWeb Studios" / "Alvan Crafted Sites") |
| **Visual/structural reference** | https://mathengeinc.com/ (Mathenge Inc., Nairobi/Dubai digital studio) |
| **Reference capture** | Screen recording `Build_Tomorrow__Today_-_Google_Chrome_2026-10-18_23-18-00.mp4` (1920×1008, ~61 s scroll of the reference home page) |
| **Owner's instruction** | *"Maintain my branding only. Implement everything else you see there — animations and everything. My website has lots and lots of photos; modify all that. Make something premium."* |
| **Owner location** | Nairobi, Kenya (copy and contact flow should suit the Kenyan market: M-Pesa, WhatsApp) |

### The one rule that governs everything
**Keep AlvanInc's brand identity. Adopt the reference's structure, layout patterns, motion and polish.**
Borrow *patterns*, never *content*: no Mathenge copy, logos, product names, client names, images or code verbatim. Everything on screen must be AlvanInc's own.

---

## 2. What "my branding" means (the part to preserve)

Taken from the existing codebase (`src/index.css`, `index.html`). Treat as locked unless the owner says otherwise.

| Token | Value | Notes |
|---|---|---|
| Ink (dark) | `oklch(0.196 0.008 254)` | primary dark surface |
| Ink soft | `oklch(0.248 0.008 254)` | cards on dark |
| Bone (light) | `oklch(0.955 0.011 92)` | primary light surface |
| Bone deep | `oklch(0.917 0.011 92)` | alt light surface |
| Graphite | `oklch(0.63 0.011 260)` | muted text |
| **Brass (accent)** | `oklch(0.735 0.117 84)` | the signature accent |
| Display/body font | **Satoshi** (Fontshare) 400/500/700/900 | |
| Mono font | **IBM Plex Mono** 400/500 | labels/eyebrows/code |
| Voice | short, confident, specific | see existing `alvan-data.js` copy |
| Name | **AlvanInc** | replaces "PrimeWeb / PrimeWeb Studios" everywhere |

> **Assumption to confirm with owner:** the colour palette and fonts above are "my branding". If the owner has a separate logo, wordmark or palette, replace these tokens in Phase 1 only (everything else reads from tokens, so nothing else changes).

**Still needed from owner:** logo file(s) (SVG preferred), preferred tagline, real bio, real project list + photos, social links, WhatsApp number, email.

---

## 3. Reference analysis (mathengeinc.com)

### 3.1 Visual language
- **Light-dominant** page with **dark sections as punctuation** (e.g. the "Gov" band and the Process section).
- One grotesque sans in a **very large, tight** hero headline; a **mono face** for small labels.
- **Mono eyebrow labels** with a short horizontal rule before them (`— Our company`, `01 / Culture & commerce`).
- **Floating pill navbar**: inset from the edges, blurred/translucent, pinned while scrolling. Logo left, ~5 links centre-left, quiet "Contact" text link, solid **"Start a project"** pill on the right.
- **Pill buttons**: filled primary + outlined secondary, each with a small arrow icon.
- **Hairline-border grids** for cards (1px lines, no drop shadows).
- Generous whitespace; sections separated by thin rules rather than colour blocks.

### 3.2 Motion & interaction
| Pattern | Description |
|---|---|
| Hero backdrop | Slowly drifting **pixelated/dotted ring** behind the headline |
| Hero headline | Rotating/animated headline (video shows "Build what lasts"; scraped text says "Build what scales") |
| Marquee | Horizontal looping strip under hero: a big word + small caption + "BRAND" micro-label |
| Capabilities list | Numbered `01–04` rows, each with a **small line-art diagram** on the right (A→B nodes, network, bar chart) |
| **Process (signature)** | **Sticky, scroll-driven section.** Steps "We listen / We align / You grow" highlight one at a time with a progress line; a **fake code editor** on the right swaps its content per step (typing/blur-in effect) and ends on a green "Ready" status |
| Testimonials | Auto-rotating quote with **pause control** and `01 / 03` counter |
| Logo wall | Infinite marquee of client logos |
| FAQ | +/− accordion |
| Footer | 4-column sitemap, socials, WhatsApp, location line with green status dot |

### 3.3 Home page section order (reference)
1. Navbar → 2. Hero (headline, sub, 2 CTAs) → 3. Marquee → 4. Company intro + "Where we work" card → 5. Capabilities 01–04 → 6. Featured product band (dark) → 7. Selected work (3 cards) → 8. Process (dark, sticky) → 9. Products/initiatives (3-col) → 10. Testimonials → 11. Logo wall → 12. Insights (3 articles) → 13. FAQ → 14. Final CTA → 15. Footer.

### 3.4 Site map (reference)
`/` · `/solutions` (+4 sub-pages) · `/work` · `/about` · `/insights` (+articles) · `/careers` · `/contact` · `/consultation` · product pages.
**Not yet reviewed:** inner pages. Only the home page was studied. Review `/work`, `/about`, `/contact` before Phases 8–9.

### 3.5 Technical notes about the reference
Next.js (App Router, `next/image`), canonical + full OG/Twitter meta with a 1200×630 image, sitemap-friendly server rendering.

---

## 4. Mapping: reference → AlvanInc

| Reference section | AlvanInc equivalent | Keep / change |
|---|---|---|
| Solutions / products | **Services** (what Alvan builds) — short list, no product pitch | Simplify |
| Selected work (3 logos) | **Selected work** — **large photo-led cards** | Heavily expanded (photo-heavy) |
| Where we work (Nairobi/Dubai) | **Based in** card (Nairobi + availability) | Adapt |
| NIA / Gov / products bands | Replace with **Featured project** band and optional **"Currently building"** band | Replace |
| Careers / partner program | **Omit** | Drop |
| Insights | **Journal** (optional, Phase 7) | Optional |
| Process | **Process** (same sticky + code-panel mechanic, AlvanInc steps) | Keep mechanic, new copy |
| Testimonials / logo wall | Same, using real clients | Keep |
| Footer | Same structure, AlvanInc links | Keep |

---

## 5. Tech stack & decisions

**Keep the existing stack** (don't migrate without owner approval):

- React 19 + JSX (no TypeScript), Vite 7, Tailwind CSS v4 (`@theme inline` tokens in `src/index.css`, no tailwind config), React Router 7, `lucide-react`, `clsx` + `tailwind-merge`.
- Path alias `@` → `src`.

**Decisions**

| Topic | Decision | Reason |
|---|---|---|
| Framework | Stay on Vite SPA | Already built; Next.js not required for a portfolio |
| SEO | Add **static prerender** (e.g. `vite-plugin-ssg` / `react-snap`-style or per-route HTML) in Phase 10 | SPA meta tags are weak for link previews |
| Animation | **Hand-rolled** (CSS + IntersectionObserver + rAF), as already done in `motion.jsx`/`use-reveal.js`; add `motion` (Framer Motion) **only** if the sticky Process or lightbox proves too complex | Keeps bundle small |
| Hero pixel ring | `<canvas>` component, rAF, pauses off-screen and under `prefers-reduced-motion` | Performance |
| Images | Build-time pipeline → AVIF/WebP + multiple widths + blur placeholders | The site is photo-heavy |
| Theme | **DECIDED by owner (2026-10-18): keep the current dark-dominant look.** Ink is the default surface; bone (light) sections are the contrast bands. This is the *inverse* of the reference (light page, dark bands). Wherever the reference uses a dark band, use a bone band here, and vice-versa. | Owner preference; brand unchanged |
| Image build | ~~`sharp`~~ **removed 2026-10-19** | The site no longer shows photos; the pipeline, `sharp` and the photo components were deleted. If photos return, rebuild it (see Phase 6 notes) |
| CMS | None yet. Data stays in `src/lib/*.js` | Revisit if owner wants self-editing |

**Theme/button mapping on brand tokens (implemented in `components/alvan/button.jsx`):** on ink surfaces → primary button = **brass pill**; on bone surfaces → primary = **ink pill** (hover brass); secondary = outlined pill on both. `tone="dark"|"light"` describes the *surface* the button sits on.

---

## 6. Existing codebase map (as received)

```
src/
  App.jsx                 routes: / /about /contact /faq /pricing /process /services /work /work/:slug *
  main.jsx                BrowserRouter + StrictMode
  index.css               tokens + custom @utility classes + keyframes
  lib/alvan-data.js       ALL content: PROJECTS, TIERS, SERVICES, PRINCIPLES, TEAM, FAQ_GROUPS, PROCESS_STEPS…
  lib/use-head.js         per-route title/meta (client-side only)
  hooks/use-reveal.js     useReveal (IntersectionObserver), useScrollParallax
  components/alvan/
    chrome.jsx            SiteNav, CookieBar, CornerBadge, CursorRing
    hero.jsx              Hero + HeroWire (CSS 3D rings)
    motion.jsx            <Words> word-mask reveal, <CountUp>
    reveal.jsx            <Reveal>
    ui.jsx                PageHeader, ProjectCard, StatRow, Tag, Brass/Ghost buttons
    work.jsx              TiltedShowcase, PairedWork, SplitWork, PricingTeaser
    mock-ui.jsx           placeholder "screenshots"
    about.jsx, site-footer.jsx, page-shell.jsx
  pages/                  one file per route
public/                   webp/jpg images, logos/, sitemap.xml, robots.txt, _redirects
```

### Known issues inherited (fix in the phase noted)
1. Contact form **does not submit anything** (`setSent(true)` only) → Phase 9
2. ~~`sitemap.xml` points at `alvan-crafted-sites.lovable.app`; `robots.txt` has no Sitemap line~~ **fixed 2026-10-19**: both are generated at build
3. ~~No `og:image`, no canonical~~ **fixed 2026-10-19** (`src/lib/seo.js`, prerender)
4. Brand leftovers: "PrimeWeb", `studio@alvanstudios.co.ke`, "Est. 2019", slugs that don't match names (`northside-roasters` = "Tulia Coffee Co.", `ledger-and-co` = "Kilimani Homes") → Phase 0
5. Several case studies use `MockUI` placeholders and what looks like template testimonials/stats → replace with owner's real work (Phase 6) or remove
6. Fonts loaded from two CDNs → `npm run fonts` is ready, **still to be run once** (Phase 10)
7. Cookie bar's Accept/Decline do the same thing → Phase 2
8. Duplicate `.jpg` files in `public/` alongside `.webp` → Phase 6 clean-up
9. Cursor ring re-renders on every mousemove → rewrite with a ref + `transform` (Phase 2)

---

## 7. Target architecture (end state)

```
src/
  components/
    layout/        FloatingNav, Footer, PageShell, CookieBar, MobileMenu
    motion/        Reveal, Words, CountUp, Marquee, PixelRing (canvas), StickySteps, TypeLines
    sections/      Hero, Intro, Capabilities, FeaturedWork, Process, Testimonials, LogoWall, Journal, Faq, FinalCta
    media/         ResponsiveImage, Gallery, Lightbox, MasonryGrid, BlurUp
    ui/            Button (primary/secondary/ghost), Eyebrow, Tag, Accordion, LineArt (SVG set)
  data/            site.js, work.js, services.js, process.js, faq.js, testimonials.js, journal.js
  hooks/           use-reveal, use-scroll-progress, use-in-view, use-reduced-motion
  pages/           (as today + journal if added)
scripts/           optimize-images.mjs
public/            optimized images, og image, fonts (self-hosted)
```

> **Update 2026-10-19:** `components/media/` (ResponsiveImage, Gallery, Lightbox), `scripts/optimize-images.mjs`, `assets-src/`, `public/img/` and `src/data/image-manifest.json` no longer exist. `work.jsx` became `pricing-teaser.jsx` (the tilted/paired/split showcases were removed).

Conventions:
- Colours **only** via tokens (`bg-ink`, `text-brass`…). No hard-coded hex in components.
- Every animation has a **`prefers-reduced-motion`** fallback.
- Every image: explicit width/height (or aspect-ratio), `alt`, `loading="lazy"` (except LCP image), `decoding="async"`.
- Content lives in `src/data`, never inline in JSX.
- Keep components small; one responsibility each.

---

## 8. Motion spec (shared constants)

| Token | Value |
|---|---|
| Ease out expo | `cubic-bezier(0.16, 1, 0.3, 1)` (already used) |
| Reveal | 600 ms, translateY 22px → 0, opacity 0 → 1 |
| Word reveal | 900 ms, step 55–90 ms |
| Marquee | linear, 32–55 s, pause on hover |
| Pixel ring | slow rotation/drift, ~60 s cycle, ≤ 30 fps cap on low-power, paused when off-screen |
| Sticky Process | each step owns ~100vh of scroll; progress line fills per step; code panel swaps text with a 300–400 ms blur-in/typing |
| Testimonials | 6 s auto-advance, pause button, `aria-live="polite"` |
| Reduced motion | all of the above → static final state |

---

## 9. Phases

Each phase ends with a **Definition of done**. Do not start a phase until the previous one builds cleanly (`npm run build`).

### Phase 0 — Foundation & rebrand clean-up
- [ ] `npm install`, confirm `npm run dev` and `npm run build` succeed — **NOT VERIFIED**: the sandbox used so far has no network. Owner/next AI must run this locally first.
- [x] Rename to **AlvanInc** (page titles/descriptions, nav wordmark `ALVAN`+`INC`, footer, `index.html`, README, `package.json`, CSS comment)
- [x] Central brand/contact config added: `src/lib/site.js` (`SITE`), used by footer and contact page. Placeholders marked `TODO(owner)`
- [x] Removed `PrimeWeb`, `alvanstudios.co.ke`, `Est. 2019`, lovable.app sitemap domain (now placeholder `https://alvaninc.com`)
- [x] Slugs now match names (e.g. `northside-roasters` → `tulia-coffee`); `work.jsx` and `sitemap.xml` updated
- [x] 10 template projects tagged `placeholder: true` in `alvan-data.js` (only BizSquare, Zuno Escrow, Sharks Clinic look real)
- [x] All `src/` files parse cleanly (TypeScript transpile check)
- [ ] Deferred: split `alvan-data.js` into `src/data/*` (do at start of Phase 1)
- [ ] Deferred: ESLint config (needs `npm install`)
- [ ] Deferred: delete unused files such as duplicate `.jpg`s (Phase 6)
**Done when:** site runs, no "PrimeWeb" string remains (`grep -ri primeweb src public index.html`).

### Phase 1 — Design system  *(code complete; unverified in a browser)*
- [x] Brand tokens **unchanged** (owner confirmed current look)
- [x] Surfaces: existing `surface-light` / `surface-light-deep` (bone) on an ink default; no new theming needed
- [x] `Button` — `components/alvan/button.jsx` (variants `primary | secondary | brass`, `tone`, `icon`, renders Link/a/button). `BrassButton`/`GhostButton` in `ui.jsx` are now thin wrappers so existing pages keep working
- [x] `Eyebrow` upgraded: mono (IBM Plex Mono) label with leading rule, optional `index` (`01 /`), `rule={false}` opt-out. New CSS utilities `label-code`, `eyebrow-rule`
- [x] `HairlineGrid` — `components/alvan/hairline.jsx` + `hairline-grid` utility (1px-gap cells, no shadows)
- [x] Type scale utilities in `index.css`: `type-hero`, `type-h1`, `type-h2`, `type-h3`, `type-lead`, `type-body`
- [x] `LineArt` — 9 SVG diagrams (`nodes, network, bars, browser, flow, layers, device, chart, chat`), `components/alvan/line-art.jsx`
- [x] `/styleguide` page (`pages/styleguide.jsx`), **registered only when `import.meta.env.DEV`**. It shows colours, type, eyebrows, buttons (dark + bone), tags, hairline grids, line art, motion primitives
- [x] `src/data/index.js` barrel (real per-topic split deferred to Phases 6–7 when content is real)
- [ ] **Visual check in a browser** (nobody has run the site yet — do `npm run dev` → `/styleguide`) and fix anything off
- Notes: old components still use `label-mono`/`display-tight`; migrate to the new utilities opportunistically, not as a big-bang rewrite. Brass-on-bone contrast is low for small text; audit in Phase 10.
**Done when:** `/styleguide` renders every primitive correctly on ink and bone at 375 / 768 / 1440 px.

### Phase 2 — Global chrome  *(code complete; unverified in a browser)*
- [x] **Floating pill navbar** (`chrome.jsx`): inset from the edges, blurred, fixed; condenses and darkens after 24px scroll; active link in brass (`NavLink`); primary links Work/Services/Pricing/Process/About, quiet "Contact" link, brass "Start a project" pill (`Button size="sm"`)
- [x] **Mobile menu**: full-screen dialog (`role="dialog"`, `aria-modal`), numbered links with staggered `rise-in`, closes on Escape / route change, locks body scroll, moves focus in and returns it to the trigger. *Focus trap added 2026-10-19.*
- [x] **Footer** (`site-footer.jsx`): CTA band (+ WhatsApp button), wordmark + tagline + socials, columns Work (real projects only, `placeholder` filtered out) / Studio / Contact, bottom bar with © and green pulsing status dot + city
- [x] **Cookie bar**: Accept → `"accepted"`, Decline → `"declined"` (`lib/consent.js`, `getConsent()` for future analytics gating)
- [x] **Cursor ring** rewritten: DOM updates via ref + rAF easing, zero React re-renders; fine-pointer devices only; no easing under reduced motion
- [x] **Skip link** + `<main id="main-content">`; all pages now go through `PageShell` (home page migrated; `badge` prop shows the corner badge)
- [x] Shared data: `lib/nav.js` (nav structure), `lib/site.js` (+ `whatsappHref`, `socials`, `city`), `components/alvan/wordmark.jsx` (**the single place to swap in a logo**)
- [x] Removed the "®" next to the wordmark (it was a leftover claiming a registered trademark)
- [ ] **Visual check in a browser** at 375 / 768 / 1440 px (menu, scroll condense, footer, cookie bar)
- Placeholders still to replace (`TODO(owner)`): WhatsApp number, Instagram and LinkedIn URLs, phone, email.
**Done when:** chrome works on all routes at 375 px, 768 px, 1440 px.

### Phase 3 — Hero & marquee
**Owner decision (2026-10-19): keep the ORIGINAL hero** (headline "Built to be trusted. Built to sell.", rotating 3D wire rings, underlined "Start a project" link, sector line). The pixel-ring, rotating word, two-button CTA and marquee were tried and rejected. Do not re-add them unless the owner asks.
- [x] Hero restored to original; no marquee under it

### Phase 4 — Home content sections
- [x] **Intro** (`intro.jsx`) + "Based in" card with live-status dot (text from `SITE.availability`, TODO(owner))
- [x] **Capabilities 01–04** (`capabilities.jsx`): the four real `SERVICES`, hairline rows, line-art on the right
- [x] **Featured band** (`featured.jsx`, DARK surface, no photo): Zuno Escrow name + summary + the project's three approach points
- [x] **Selected work** (`selected-work.jsx`, light surface, text-led cards, no photos): Rommie + Sharks Clinic (real projects only) + a dark "your project next" card
- **Owner rule (2026-10-19): no photos scattered through the site, and keep the light/dark mixture.** Home surfaces: Hero dark → Intro light → Capabilities light-deep → Featured dark → Selected work light → Process dark → Live sites light-deep → Pricing light → Footer dark. Photos only appear on `/work` (one per project card) and inside case-study galleries.
- **Live sites section** (`live-sites.jsx`, data in `lib/live-sites.js`, added 2026-10-19): tap a row to open a built site in a new tab. URLs come from the owner's notes; TODO(owner) confirm them and add BizSquare.
- Home order now: Hero → Intro → Capabilities → Featured → Selected work → Process → Pricing teaser. Removed from home (still in `about.jsx`/`work.jsx`, unused): Key facts and partner marquee (invented stats and partner names), tilted/paired/split showcases (template projects).
**Done when:** home page matches section order in 3.3 (minus omitted items). ✅

### Phase 5 — Signature "Process" section
**Owner decision (2026-10-19): the section advances by itself, not by scrolling.**
- [x] `process-steps.jsx`: steps left, fake editor right. Each step runs 3.5 s (`STEP_MS`), its progress line fills, then the next step takes over; after step 4 it loops to step 1
- [x] Timer is the progress line's CSS animation (`animationend`), so pausing it pauses the step; no drift
- [x] Click a step to jump; Pause/Play button (WCAG pause control); also pauses off-screen and in a hidden tab
- [x] Editor swaps with a blur-in per line; final step shows green "Ready"
- [x] Uses the real four `PROCESS_STEPS`; editor lines summarise each step's own text
- [x] Reduced motion: all steps stacked, no animation
**Done when:** steps change by themselves and stay in sync with the editor. ✅ (timed in headless Chromium, loops)

### Phase 6 — Photo-heavy work system *(SUPERSEDED 2026-10-19: all photo code and assets were removed; kept below for history)*
- [x] **Intake:** originals live in `assets-src/<project>/` (the 12 existing project photos moved there)
- [x] `scripts/optimize-images.mjs` (`npm run images`): AVIF + WebP at 480/768/1200/1920 (never upscaled), blur placeholder, dominant colour → `public/img/` and `src/data/image-manifest.json`. Warns if a 1200 px WebP > 250 KB. Currently 1.7 MB for all 12 photos.
- [x] `ResponsiveImage` (`components/media/`): `<picture>` AVIF/WebP + srcset, aspect-ratio, blur-up fade-in, lazy (eager + high priority for the case-study hero). Looks images up by file name, so data files still say `/zuno-hero.webp`.
- [x] `/work`: back to the original light layout (header, filter chips, project card grid); the project cards use `ResponsiveImage` when a project has a real image. Template projects hidden via `SHOW_PLACEHOLDERS = false` in `work-index.jsx`. (A masonry of every photo was built, then rejected by the owner.)
- [x] Case studies: ResponsiveImage hero, first gallery photo as a full-width row then masonry, **Lightbox** (← → Esc, swipe, focus trap, focus restored, scroll lock, counter, caption)
- [x] Removed 4 duplicate `.jpg` files. Left in place: `MockUI` for template projects only (reachable by direct URL, hidden from lists).
- [ ] Not measured: Lighthouse on `/work`
**To add photos:** drop files in `assets-src/<project>/`, run `npm run images`, then reference them in `alvan-data.js` as `image: "/<file-name>.webp"` (name must be unique).
**Done when:** every image is optimised, has alt text, and `/work` scores ≥ 90 Lighthouse on mobile (alt text and optimisation done; Lighthouse pending).

### Phase 7 — Social proof, journal & FAQ  *(mostly done; content-gated)*
- [x] **Accordion** (`accordion.jsx`): +/− icons, animated open/close, `aria-expanded` + `aria-controls` + region, collapsed content `inert`, reduced-motion safe. Used on `/faq` (replaced the old local `Item`) and the home FAQ
- [x] **Home FAQ** (`home-faq.jsx`, eyebrow 08): 5 picked questions (matched by text) + "All questions" link
- [x] **Testimonials** (`testimonials.jsx`, eyebrow 07, dark band): 6.5 s auto-advance, pause/play, prev/next, `01 / 03` counter, pauses on hover/focus, no auto-advance under reduced motion, `aria-live` off while auto-rotating. **Renders nothing while `TESTIMONIALS` is empty** (`alvan-data.js`), so no invented quotes appear. Sample-data preview lives on `/styleguide` (dev only)
- [x] **Final CTA band**: already provided by the footer CTA (`cta` prop, default on)
- [x] Removed the invented FAQ claim "in six years no project has needed more than two"
- [ ] **TODO(owner):** add real quotes to `TESTIMONIALS` (shape in the file). Until then the section is hidden
- [ ] Logo wall: **skipped**, no client logos/permission. Journal: **skipped**, no content (optional per plan)
- [ ] FAQ answers still contain template commercial terms (50/50 payments, KES 15,000 retainers, "four hours of your time", "three rounds"). **TODO(owner): confirm or edit** in `FAQ_GROUPS`
**Done when:** every section has real content or is removed.

### Phase 8 — Inner pages
- [ ] `/about` (story, portrait photo, principles, timeline) — review reference `/about` first
- [ ] `/services` (reuse capabilities pattern)
- [ ] `/process` (full version of Phase 5)
- [ ] `/pricing` (keep if owner wants public prices)
- [ ] `/faq`, 404 page in new style
**Done when:** all pages use shared chrome/sections and share one visual language.

### Phase 9 — Contact & conversion  *(built; delivery needs one setting)*
- [x] Contact form rewritten (`pages/contact.jsx`) with real states: `idle → sending → sent | error`, and `fallback`
- [x] **If `SITE.formEndpoint` is set** (e.g. a free Formspree URL `https://formspree.io/f/xxxx`): POSTs JSON, shows success, or an error panel that keeps the visitor's details and offers email/WhatsApp
- [x] **If it is empty (current state):** opens the visitor's email app with the brief prefilled and says plainly "Nothing has been sent yet", plus a "Send on WhatsApp" button. It never claims "sent" when nothing was sent (the old form did)
- [x] Honeypot field (`_gotcha`), field errors announced (`role="alert"`, `aria-invalid`), direct-contact + social list now read from `SITE` (no more hard-coded phone / fake social links)
- [x] `whatsappLink(text)` helper in `lib/site.js`
- [ ] **TODO(owner):** create the form service and paste its URL into `SITE.formEndpoint`; replace placeholder email / phone / WhatsApp / socials in `lib/site.js`
- [ ] Optional, not built: `?type=` pre-selection, `/consultation` booking embed
**Done when:** a test submission arrives in the owner's inbox.

### Phase 10 — SEO, performance, accessibility, launch  *(code complete; see what is left)*
- [x] **Link previews / prerender:** `scripts/prerender.mjs` runs after `vite build` and writes static HTML for all 11 routes (8 pages + the 3 real case studies) with title, description, robots, canonical, Open Graph, Twitter and JSON-LD, plus a `<noscript>` fallback. All tag data is in `src/lib/seo.js` and is shared with `useHead`, so static and live tags cannot drift. **This is head prerendering, not full SSR:** the body is still client-rendered. Tested against a stand-in `dist/` (one title and canonical per file, idempotent); **the real `vite build` has not been run** (no network in the authoring sandbox)
- [x] **`og:image`:** `public/og-image.png`, 1200×630, 38 KB, brand colours. Drawn with a stand-in sans font because Satoshi was not available; replace with a Satoshi export when possible (same file name)
- [x] **JSON-LD:** `ProfessionalService` + `WebSite` on home, `CreativeWork` on real case studies. Deliberately contains **no** phone, email or social links, because those are placeholders in `site.js`. Add them to `homeJsonLd()` when real
- [x] **Sitemap + robots:** generated at build from the route list and `SITE.url` (the static files in `public/` were deleted). **TODO(owner): set the real domain in `SITE.url`**; it is still the placeholder `https://alvaninc.com`
- [x] **Route-level code splitting:** every route except home is `React.lazy` in `App.jsx`; `ErrorBoundary` reloads once if a chunk is missing after a redeploy
- [~] **Self-host fonts:** `npm run fonts` (`scripts/fetch-fonts.mjs`) is written and its CSS parsing is unit-tested on provider-style fixtures, but **it has not been run** (needs internet). Until then the site uses the two CDNs. After running: build, check, commit `public/fonts/`, `src/fonts.css`, `index.html`
- [x] **Contrast:** measured, not guessed. Brass on bone was 2.08:1 (bone-deep 1.85:1). Brass *text* on light surfaces now uses `--brass-deep` (5.79 / 5.16:1) through one scoped rule in `index.css` that skips dark cards nested in light sections (tested in Chromium). Faint grey text on light sections (`text-black/35|40|50|60`, 2.2 to 4.5:1) is now `text-black/65` (5.0+). Eyebrow index numerals are no longer faded; inactive Process steps are `opacity-55` (5.2:1 instead of 3.4:1). Brass on dark surfaces was already 6.8 to 7.7:1. **Visual effect on light sections is unreviewed: brass accents are now darker gold-brown there**
- [x] **Mobile menu focus trap** (Tab/Shift+Tab wrap, recovers from outside; handler tested in Chromium)
- [ ] A11y still open: focus order, heading outline per page, screen-reader pass. `/about` still contains invented copy (see Phase 8)
- [ ] Lighthouse ≥ 90 on all four categories (mobile): **not run**
- [ ] Deploy and connect domain
- [x] **Browser check tooling:** `npm run qa` (`scripts/qa.mjs`, needs `npm i -D playwright`) visits every route at 375/768/1440, saves screenshots, reports console errors, overflow, h1/alt problems and sub-AA contrast on the real rendered text. Tested against a stub site with known defects. **It has not been run on the real site**
**Done when:** link previews render correctly on WhatsApp, LinkedIn and X (check with a real deployed URL), and Lighthouse targets are met.

---

## 10. Open questions for the owner (blockers marked ⛔)

1. ~~Palette/typography~~ **Resolved: keep current.** Logo: **deferred by owner** (text wordmark `ALVAN`+`INC` stays until a logo is supplied; swap lives in `SiteNav` in `chrome.jsx`).
2. ⛔ Real content: bio, services you offer, 3–6 projects with photos, testimonials, contact details, social links.
3. ⛔ Domain name (for sitemap/canonical/OG).
4. Which form backend do you prefer (Formspree, Netlify Forms, other)?
5. Should prices be public (`/pricing`)?
6. Do you want a Journal/Insights blog?
7. Keep Vite SPA + prerender, or migrate to Next.js like the reference?
8. ~~Theme~~ **Resolved: keep dark-dominant.**
9. Which photo categories (for filter chips on `/work`)?

---

## 11. Rules for any AI continuing this work

1. Read this whole file, then `src/index.css` and `src/lib/alvan-data.js` before editing.
2. Work **one phase at a time**; tick the checkboxes; run `npm run build` before finishing.
3. Never copy Mathenge Inc. text, logos, images or product names. Patterns only.
4. Never invent testimonials, stats, clients or prices. Use placeholders clearly marked `TODO(owner)` and list them in the Handoff Log.
5. Don't change brand tokens outside Phase 1.
6. Keep every animation reduced-motion safe.
7. Don't add dependencies without recording why in section 5.
8. If a decision isn't covered here, choose the simplest option, and log it.

---

## 12. Status board

| Phase | Title | Status |
|---|---|---|
| 0 | Foundation & rebrand clean-up | 🟨 Mostly done (see log: build not yet verified, 3 items deferred) |
| 1 | Design system | 🟨 Code done, needs browser check |
| 2 | Global chrome | 🟨 Code done, needs browser check |
| 3 | Hero & marquee | ✅ Closed: original hero kept by owner choice |
| 4 | Home content sections | ✅ Done (screenshot-checked) |
| 5 | Process (auto-advancing) | ✅ Done (timed and screenshot-checked) |
| 6 | Photo-heavy work system | ⬛ Removed 2026-10-19 (owner: no photos; all photo code deleted) |
| 7 | Social proof, journal, FAQ | 🟨 FAQ + testimonials built; testimonials need real quotes; logo wall/journal skipped |
| 8 | Inner pages | ⬜ Not started |
| 9 | Contact & conversion | 🟨 Built; needs `SITE.formEndpoint` + real contact details |
| 10 | SEO, perf, a11y, launch | 🟨 Code done (prerender, JSON-LD, sitemap, lazy routes, contrast, focus trap); fonts script not run, Lighthouse/deploy pending |

Legend: ⬜ not started · 🟨 in progress · ✅ done · ⛔ blocked · ⬛ removed

---

## 13. Handoff log

*Append newest entries at the bottom. Format: date · who/which AI · what changed · what's next · TODOs left.*

- **2026-10-18** · Claude · Studied the uploaded Vite zip (audit in section 6) and the Mathenge Inc. home page + screen recording (section 3). Wrote this plan. No code changed yet. **Next:** answer open questions (section 10), then begin Phase 0.
- **2026-10-18** · Claude · **Phase 0 (partial).** Rebranded to AlvanInc, added `src/lib/site.js`, fixed slugs, fixed sitemap domain, tagged 10 template projects `placeholder: true`. Verified only by parse-check; **`npm run build` has not been run** (no network in sandbox). Fabricated copy still present and flagged `TODO(owner)`: About story (founding year, team size, project count), `PRESS` list, `TEAM`, FAQ line "in six years no project has needed more than two", placeholder phone `+254 700 123 456`, placeholder email `hello@alvaninc.com`, domain `alvaninc.com`. **Next:** owner runs `npm install && npm run build`, answers open questions (section 10), then Phase 1.
- **2026-10-18** · Claude · **Phase 1 (code complete).** Owner decisions: keep dark-dominant look; logo later. Added Button, HairlineGrid, LineArt (9), type-scale + `label-code`/`eyebrow-rule`/`hairline-grid` CSS, upgraded `Eyebrow`, `/styleguide` (DEV only), `src/data/index.js` barrel. Verification so far: all `src` files parse and all imports resolve (scripted check). **Not run:** `npm install`, `npm run dev`, `npm run build` (sandbox has no network), so Tailwind output and visuals are unchecked. **Next:** owner runs the dev server and reviews `/styleguide`; then Phase 2 (floating pill nav, footer, cookie bar, cursor ring).
- **2026-10-18** · Claude · **Phase 2 (code complete).** New: floating pill nav + mobile dialog menu, footer redesign, working cookie consent, ref-based cursor ring, skip link, `Wordmark`, `lib/nav.js`, `lib/consent.js`; home page now uses `PageShell`; `Button` gained `size="sm"`. Verified by scripted parse + import + named-export check over 36 files only. **Not run:** dev server or build in this sandbox. Owner had just started `npm install` / `npm run dev` locally; results of that were not yet reported. **Next:** Phase 3 (hero headline, pixel-ring canvas backdrop, marquee).
- **2026-10-18** · Claude · **Phase 2 hotfix.** Owner ran the site for the first time (it works; navbar renders). Found and fixed a bug: the nav "Contact" link passed a *function* className through `cn()` (clsx drops functions), so it lost its styling. Now wraps the call: `className={(state) => cn(desktopLink(state), ...)}`. **Rule for future code:** never pass a `NavLink` className function directly into `cn()`.
- **2026-10-19** · Claude · **Phase 3 (code complete).** Owner's credits ran out at the start of Phase 3, so it was rebuilt from scratch. Ran `npm install` and `npm run build` (both succeed) and checked the home page in headless Chromium at 1440 px, 375 px and reduced-motion: no horizontal overflow, no console errors other than blocked CDN fonts in the sandbox. New: `pixel-ring.jsx`, `marquee.jsx`, rewritten `hero.jsx` (removed the old CSS-3D `HeroWire`), `.hero-rot` and reduced-motion marquee rules in `index.css`. Marquee words/captions are AlvanInc's own placeholder-level copy (no stats or client claims); edit `MARQUEE_ITEMS` in `hero.jsx`. **Not done:** Lighthouse / LCP / device FPS. **Next:** Phase 4 (intro + Based-in card, capabilities 01–04, featured band, selected work).
- **2026-10-19** · Claude · **Phase 3 reverted.** Owner preferred the original hero. Restored `hero.jsx` to the original, deleted `pixel-ring.jsx` and `marquee.jsx`, removed `.hero-rot` and the marquee reduced-motion CSS. **Next:** Phase 4.
- **2026-10-19** · Claude · **Phases 4–6 built** (owner approved a visual preview first). Verified: `npm run build` succeeds; headless Chromium at 1440 px, 375 px and reduced-motion: no horizontal overflow, no console errors, pinned Process correct at 4 scroll positions, lightbox keys/focus/close work, AVIF served. Deviations from the preview: Process uses the real 4 steps; capabilities use the real 4 `SERVICES`; featured/selected images use native 16:9 so screenshots are not cropped; third selected-work slot is a CTA card because only 3 real projects exist. **Removed from home** because invented: Key facts (120+, 92%, 35+) and partner names. **Still to confirm as real, TODO(owner):** `SITE.availability`, the Sharks Clinic summary stat ("10K+ patients, 98%") and its testimonial, plus the Phase 0 list. **Not done:** Lighthouse/LCP, real photos beyond the 12. **Next:** Phase 7 (testimonials, logo wall, FAQ accordion, final CTA).
- **2026-10-19** · Claude · **Surface and photo revert.** Owner: remove the photos from the home page and bring back the light/dark mixture. Intro, Capabilities and Selected work are light again; Featured and Process stay dark; Featured and Selected work have no images; `/work` restored to the original light card grid. Structure of Phases 4–5 unchanged. Kept: image pipeline, `ResponsiveImage`, gallery and lightbox on case studies.
- **2026-10-19** · Claude · **No photos on `/work` or case studies (owner request).** `ProjectCard` is now a text card; case-study pages no longer show a hero image or gallery (order: header → brief/approach → results → next project). Unused but kept for when photos return: `components/media/*` (ResponsiveImage, Gallery, Lightbox), `npm run images`, `assets-src/`, `public/img/`. To bring a gallery back, render `<Gallery items={project.gallery} label={project.name} />` in `case-study.jsx`.
- **2026-10-19** · Claude · **Process now auto-advances** (was scroll-pinned). Renamed `process-sticky.jsx` → `process-steps.jsx` (`ProcessSteps`). Verified 01→02→03→04→01 at ~6.4 s intervals, pause holds, click jumps, off-screen holds.
- **2026-10-19** · Claude · Process step time cut from 6 s to 3.5 s (owner: faster). Change `STEP_MS` in `process-steps.jsx` (and the CSS fallback in `index.css`) to retune.
- **2026-10-19** · Claude · Added **Live sites** home section (Zuno Escrow, Sharks Clinic, Rommie), external links open in a new tab. **TODO(owner):** confirm the three URLs; BizSquare has no known URL yet.
- **2026-10-19** · Claude · **BizSquare replaced by Rommie** in `alvan-data.js` (slug `rommie`; brief/approach written only from facts the owner has stated; no results, quote or timeline yet, TODO(owner)). BizSquare photos removed from `assets-src/` and `public/img/`. Zuno Escrow live link is now https://escrowzuno.vercel.app. Sitemap updated.
- **2026-10-19** · Claude · **"View site" links on projects.** New field `liveUrl` in `alvan-data.js` is now the single source for a project's live link: `"https://..."` opens in a new tab, `null` shows "Link coming soon", field absent shows nothing. Set: Zuno Escrow `https://escrowzuno.vercel.app`, Rommie `https://rommieweb.vercel.app`, Sharks Clinic `null` (placeholder at owner's request; the earlier `ap-chaz.github.io/SharksClinic` URL was removed, noted in a comment). New component `components/alvan/view-site.jsx` (`ViewSiteLink`, variants `link`/`button`). Shown on: `/work` cards (`ProjectCard`), home Selected work cards, home Featured band, case-study header. `lib/live-sites.js` now derives from projects (order Zuno Escrow, Rommie, Sharks) and the Live sites row renders non-clickable "Link coming soon" when `url` is null. Cards are now a `div` with an overlay link so "View site" can be its own link without nesting anchors. Verified: parse + import + named-export check over 48 files, data check of the three values. **Not run:** browser/build (sandbox has no network). **TODO(owner):** Sharks Clinic URL.
- **2026-10-19** · Claude · **Phases 7 and 9 built** (owner chose both; has no real contact details yet). Contact form rewritten with honest states and a no-backend fallback (email app + WhatsApp) until `SITE.formEndpoint` is set. New: `accordion.jsx`, `home-faq.jsx`, `testimonials.jsx` (hidden while `TESTIMONIALS = []`), `whatsappLink()`. Home order now: Hero, Intro, Capabilities, Featured, Selected work, Process, Live sites, [Testimonials], Pricing, FAQ, footer CTA. Removed invented FAQ claim and fabricated placeholder names in the form. Verified: parse/import/export check over 51 files, **plus a server-render smoke test** of Index/Contact/Faq/Work/accordion/testimonials in Node with stubbed router+icons (no errors; link counts, empty-testimonials and `inert` behaviour confirmed). **Not run:** `npm run build`, browser. **TODO(owner):** real quotes, form endpoint, email/phone/WhatsApp/socials/domain, confirm FAQ commercial terms. **Next:** Phase 8 (inner pages: About rewrite with true facts, Services, Process, Pricing) once the owner supplies facts, then Phase 10 (SEO/perf/a11y/launch).
- **2026-10-19** · Claude · **`/process` now uses the home Process section.** The static 4-row list on `/process` was replaced by `<ProcessSteps showHeading={false} />` (the auto-advancing steps + code panel, same component as home). Added a `showHeading` prop to `ProcessSteps` (default `true`, so home is unchanged) because the page header already supplies "How it works / Four steps. No surprises." The 6-week schedule and "What we need from you" sections remain below. No data lost: the home component already shows each step's number, name, body and duration. Verified: parse check + Node server-render of home and `/process`. **Not run:** browser.
- **2026-10-19** · Claude · **Visual fixes after owner screenshot of `/process`.** (1) Navbar pill was `bg-ink/50` unscrolled, which read as muddy grey over light pages; now `bg-ink/90` (and `/95` scrolled), so it is a clean dark pill on every surface. (2) `ProcessSteps` with `showHeading={false}` kept full `py-36` top padding, leaving a large empty gap under the page header; now `pt-14 sm:pt-20` in that mode (home unchanged). Verified only by parse + Node server-render; **owner should re-check visually**. **Lesson:** translucent chrome must be judged over both ink and bone surfaces, and I cannot see rendered output in this sandbox, so ask for a screenshot after any layout change.

- **2026-10-19** · Claude · **`/process` header now matches the section below.** `PageHeader` gained `tone="soft"` (background `bg-ink-soft`, same as `ProcessSteps`); `/process` uses it, so the header and the steps form one continuous dark band. Default tones unchanged. **Not run:** browser/build; owner should re-check visually.
- **2026-10-19** · Claude · **Photo code removed; Phase 10 built.** *Removed:* `components/media/*` (ResponsiveImage, Gallery, Lightbox), unused `components/alvan/about.jsx` (KeyFacts with photos), the tilted/paired/split showcases (`work.jsx` is now `pricing-teaser.jsx`), `useScrollParallax`, `scripts/optimize-images.mjs`, `assets-src/`, `public/img/`, `image-manifest.json`, 4 unused root images and `public/logos/`, `image` / `gallery` / `variant` / `headline` fields on `PROJECTS` (data verified identical otherwise), and `sharp` plus the `images` script (lockfile pruned by reachability: only sharp's 28 entries went). *Added:* `src/lib/seo.js`, rewritten `use-head.js`, `scripts/prerender.mjs`, `public/og-image.png`, lazy routes, chunk-reload recovery, brass-deep contrast rule, grey-text fixes, mobile-menu focus trap, `scripts/fetch-fonts.mjs` + `src/fonts.css`, `scripts/qa.mjs`, new README. `sitemap.xml` and `robots.txt` are now generated (static copies deleted). **Verified here:** all 51 source files parse, every import and named export resolves, no orphan files; seo.js in Node (11 routes); prerender against a stand-in `dist/`; the contrast CSS rule and the focus-trap handler in real Chromium; font-CSS parser on fixtures; QA script on a stub site. **NOT verified:** `npm install`, `npm run build`, the running site, Tailwind output, Lighthouse, any real screenshot (no network in this sandbox). **Owner next:** run `npm install && npm run build`, then `npm run qa` and look at `qa-output/`; run `npm run fonts` once; set the real `SITE.url`, email, phone, WhatsApp and socials in `site.js`; confirm the Sharks Clinic stat in `PROJECTS[...].summary`, which now appears in its link-preview text and JSON-LD.
- **2026-10-19** · Claude · **Logo installed.** Owner supplied the A mark and the AlvanInC lockup (black on white rasters; a third file was solid black and unused). Traced to vector (`components/alvan/logo-paths.js`, generated, do not hand-edit). `Wordmark` is now an inline SVG using `currentColor` (`variant="full"|"mark"`, size with `h-*`); used in nav, mobile menu and footer. New in `public/`: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` (brass mark on ink), and a new `og-image.png` (lockup on ink). `index.html` links the icons; JSON-LD gains `logo`. Verified: build passes, no console errors, screenshots of nav, menu, footer at 1440 and 390 px. **TODO(owner):** supply original vector or high-res files if they exist (trace is from ~1000px rasters).

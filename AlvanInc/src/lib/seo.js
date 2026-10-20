/**
 * SEO single source of truth.
 *
 * Used in two places, so they can never drift apart:
 *   1. the browser: `useHead()` (src/lib/use-head.js) syncs these tags into <head> on navigation
 *   2. the build:   `scripts/prerender.mjs` writes them into static HTML for every route, which is
 *                   what WhatsApp, LinkedIn, X and search crawlers read (they do not run JavaScript)
 *
 * Keep this file free of JSX, `@/` aliases and browser globals: Node imports it directly.
 */
import { SITE } from "./site.js";
import { PROJECTS } from "./alvan-data.js";

export const OG_IMAGE = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "AlvanInc logo",
};

export const DEFAULT_DESCRIPTION =
  "AlvanInc designs and builds websites that build trust and win customers for SMEs, fintechs, law firms, and real estate brands across Kenya and East Africa.";

/** Absolute URL for a site path. SITE.url comes from src/lib/site.js (no trailing slash). */
export function absoluteUrl(path = "/") {
  const base = SITE.url.replace(/\/+$/, "");
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return base + clean;
}

/** Static pages. `changefreq` / `priority` only feed sitemap.xml. */
export const PAGES = [
  {
    path: "/",
    title: "AlvanInc — Websites that sell, built for Kenyan businesses",
    description:
      "AlvanInc designs and builds websites that build trust and win customers for SMEs, fintechs, law firms, and real estate brands across Kenya and East Africa. Fixed-price packages, live in weeks.",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/work",
    title: "Selected work — AlvanInc",
    description:
      "Shipped projects across e-commerce, SaaS, and brand — each one opens into a full case study.",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/services",
    title: "What we build — AlvanInc services",
    description:
      "Storefront, Studio, Launch, and Custom: four ways AlvanInc builds websites for founders, with what each one is for and where it starts.",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/pricing",
    title: "Pricing — fixed-price websites from KES 45,000 | AlvanInc",
    description:
      "Three fixed packages: Launch from KES 45,000, Studio from KES 150,000, and Custom scoped after a call. What's included, what isn't, and how M-Pesa payment works.",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/process",
    title: "How it works — the AlvanInc process",
    description:
      "Four steps, no surprises: Discover, Design, Build, Launch. The week-by-week schedule for a Studio-tier project and exactly what we need from you.",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/about",
    title: "About AlvanInc — an independent web studio in Nairobi",
    description:
      "AlvanInc is a studio in Nairobi building websites that convert, for founders who'd rather ship than fiddle with templates. Our story and principles.",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/faq",
    title: "FAQ — scope, timelines, and ownership | AlvanInc",
    description:
      "Direct answers on extra pages, payment plans, revisions, platforms, and who owns the finished website when an AlvanInc project ships.",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/contact",
    title: "Contact — start a fixed-price project | AlvanInc",
    description:
      "Tell us what you're selling and we'll build the site for it. Share your package, budget, and timeline and we reply within one business day.",
    changefreq: "yearly",
    priority: "0.7",
  },
];

/** Head data for each static page, keyed by path, e.g. SEO["/about"]. */
export const SEO = Object.fromEntries(
  PAGES.map((p) => [p.path, { ...p, jsonLd: p.path === "/" ? homeJsonLd() : null }]),
);

export const NOT_FOUND_SEO = {
  title: "Page not found — AlvanInc",
  description: DEFAULT_DESCRIPTION,
  noindex: true,
};

/** Template projects (placeholder: true) are never indexed or prerendered. */
export const isIndexable = (project) => !project.placeholder;

const projectCache = new Map(); // stable object per project so useHead's effect does not re-run
export function projectSeo(project) {
  if (!projectCache.has(project.slug)) {
    projectCache.set(project.slug, {
      path: `/work/${project.slug}`,
      title: `${project.name} — AlvanInc case study`,
      description: project.summary,
      type: "article",
      noindex: !isIndexable(project),
      jsonLd: projectJsonLd(project),
    });
  }
  return projectCache.get(project.slug);
}

function ORG_ID() {
  return `${absoluteUrl("/")}#organization`;
}

/** Home page: the studio (no phone/email/social links until SITE has real ones). */
export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ORG_ID(),
        name: SITE.name,
        url: absoluteUrl("/"),
        description: DEFAULT_DESCRIPTION,
        image: absoluteUrl(OG_IMAGE.path),
        logo: absoluteUrl("/icon-512.png"),
        address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
        areaServed: [
          { "@type": "Country", name: "Kenya" },
          { "@type": "Place", name: "East Africa" },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: SITE.name,
        url: absoluteUrl("/"),
        publisher: { "@id": ORG_ID() },
      },
    ],
  };
}

export function projectJsonLd(project) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.summary,
    url: absoluteUrl(`/work/${project.slug}`),
    genre: project.category,
    keywords: (project.tags || []).join(", "),
    creator: { "@id": ORG_ID() },
  };
  if (typeof project.liveUrl === "string") ld.sameAs = project.liveUrl;
  return ld;
}

/** Every route that gets static HTML and a sitemap entry. */
export function prerenderRoutes() {
  const routes = PAGES.map((p) => SEO[p.path]);
  for (const project of PROJECTS.filter(isIndexable)) {
    routes.push({ ...projectSeo(project), changefreq: "monthly", priority: "0.7" });
  }
  return routes;
}

/**
 * Everything that belongs in <head> for one page, as plain data.
 * `useHead` applies it to the DOM; `scripts/prerender.mjs` serialises it to HTML.
 */
export function buildHead({
  title,
  description = DEFAULT_DESCRIPTION,
  type = "website",
  path = "/",
  noindex = false,
  jsonLd = null,
}) {
  const url = absoluteUrl(path);
  const image = absoluteUrl(OG_IMAGE.path);
  const metas = [
    ["name", "description", description],
    ["name", "robots", noindex ? "noindex, nofollow" : "index, follow"],
    ["property", "og:type", type],
    ["property", "og:site_name", SITE.name],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["property", "og:image", image],
    ["property", "og:image:width", String(OG_IMAGE.width)],
    ["property", "og:image:height", String(OG_IMAGE.height)],
    ["property", "og:image:alt", OG_IMAGE.alt],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", title],
    ["name", "twitter:description", description],
    ["name", "twitter:image", image],
    ["name", "twitter:image:alt", OG_IMAGE.alt],
  ];
  // A noindex page (404, template projects) must not claim a canonical URL.
  if (!noindex) metas.push(["property", "og:url", url]);
  return { title, metas, canonical: noindex ? null : url, jsonLd };
}

/** Keys the client manages, so stale ones can be removed when a page does not set them. */
export const MANAGED_META = buildHead({ title: "x" }).metas.map(([attr, key]) => `${attr}|${key}`);

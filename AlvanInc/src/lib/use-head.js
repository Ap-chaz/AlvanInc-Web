import { useEffect } from "react";
import { buildHead, MANAGED_META } from "@/lib/seo";

const LD_ID = "ld-json";

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(data) {
  let el = document.getElementById(LD_ID);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.id = LD_ID;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Syncs the document title and all SEO tags (description, robots, canonical, Open Graph, Twitter,
 * JSON-LD) for the current page. The same tags are written into static HTML at build time by
 * scripts/prerender.mjs, so link previews work without JavaScript; this keeps them correct while
 * the visitor navigates client-side.
 *
 * `path` defaults to the current URL path. `noindex` pages get no canonical.
 */
export function useHead({ title, description, type, path, noindex, jsonLd }) {
  useEffect(() => {
    const head = buildHead({
      title,
      description,
      type,
      path: path ?? window.location.pathname,
      noindex,
      jsonLd,
    });
    document.title = head.title;
    const present = new Set(head.metas.map(([attr, key]) => `${attr}|${key}`));
    for (const [attr, key, content] of head.metas) setMeta(attr, key, content);
    for (const id of MANAGED_META) {
      if (present.has(id)) continue;
      const [attr, key] = id.split("|");
      document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
    }
    setCanonical(head.canonical);
    setJsonLd(head.jsonLd);
  }, [title, description, type, path, noindex, jsonLd]);
}

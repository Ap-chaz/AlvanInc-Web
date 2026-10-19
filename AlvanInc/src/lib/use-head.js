import { useEffect } from "react";

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Sets the document title and SEO meta tags for the current page. */
export function useHead({ title, description, type = "website" }) {
  useEffect(() => {
    if (title) document.title = title;
    if (title) setMeta("property", "og:title", title);
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
    }
    setMeta("property", "og:type", type);
    setMeta("name", "twitter:card", "summary_large_image");
  }, [title, description, type]);
}

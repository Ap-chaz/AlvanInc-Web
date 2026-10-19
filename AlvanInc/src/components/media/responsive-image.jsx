import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Optimised image with blur-up.
 *
 * The build script (npm run images) writes AVIF/WebP at several widths into
 * public/img and records them in src/data/image-manifest.json. This component
 * finds an image's entry by file name ("/zuno-hero.webp" → "zuno-hero"), so
 * data files keep pointing at the original name. Without a manifest entry it
 * falls back to a plain <img src>.
 */
const manifestFiles = import.meta.glob("/src/data/image-manifest.json", {
  eager: true,
  import: "default",
});
const MANIFEST = Object.values(manifestFiles)[0] ?? {};

const keyOf = (src) =>
  String(src ?? "")
    .split("/")
    .pop()
    .replace(/\.[a-z0-9]+$/i, "");

function getImage(src) {
  return MANIFEST[keyOf(src)] ?? null;
}

/** srcset strings for one format, e.g. imageSources("/zuno-hero.webp").avif */
function imageSources(src) {
  const key = keyOf(src);
  const m = MANIFEST[key];
  if (!m) return null;
  const set = (ext) => m.widths.map((w) => `/img/${key}-${w}.${ext} ${w}w`).join(", ");
  const largest = m.widths[m.widths.length - 1];
  return {
    avif: set("avif"),
    webp: set("webp"),
    fallback: `/img/${key}-${largest}.webp`,
    width: m.width,
    height: m.height,
  };
}

function ResponsiveImage({
  src,
  alt,
  sizes = "100vw",
  aspect, // CSS aspect-ratio, e.g. "16 / 11". Default: the image's own ratio.
  fit = "cover",
  priority = false,
  className,
  imgClassName,
  width,
  height,
}) {
  const m = getImage(src);
  const sources = imageSources(src);
  const ratio = aspect ?? (m ? `${m.width} / ${m.height}` : width && height ? `${width} / ${height}` : "16 / 9");
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio: ratio,
        backgroundColor: m?.color ?? "var(--ink-soft)",
        backgroundImage: m?.blur ? `url(${m.blur})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <picture>
        {sources ? <source type="image/avif" srcSet={sources.avif} sizes={sizes} /> : null}
        {sources ? <source type="image/webp" srcSet={sources.webp} sizes={sizes} /> : null}
        <img
          ref={imgRef}
          src={sources ? sources.fallback : src}
          alt={alt}
          width={m?.width ?? width}
          height={m?.height ?? height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 size-full transition-opacity duration-700",
            fit === "contain" ? "object-contain" : "object-cover",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      </picture>
    </div>
  );
}

export { ResponsiveImage, getImage, imageSources };

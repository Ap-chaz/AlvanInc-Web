import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { imageSources } from "./responsive-image";

/**
 * Full-screen photo viewer.
 *
 * items: [{ src, alt, caption?, meta? }]
 * index: number to open at, or null when closed
 * Keys: ← → browse, Esc closes. Swipe left/right on touch. Tab stays inside.
 * Focus returns to whatever opened it. Page scroll is locked while open.
 */
const btn =
  "inline-flex size-12 items-center justify-center rounded-full border border-white/25 text-bone transition-colors hover:border-brass hover:text-brass";

function Lightbox({ items, index, onClose, onIndex }) {
  const open = index !== null && index !== undefined && items[index];
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const count = items.length;

  const go = useCallback(
    (delta) => onIndex((index + delta + count) % count),
    [index, count, onIndex],
  );

  // Lock scroll, move focus in, restore it on close
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (previous && typeof previous.focus === "function") previous.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll("button:not([disabled])");
        if (!nodes?.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  if (!open) return null;
  const item = items[index];
  const sources = imageSources(item.src);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[100] flex flex-col bg-[oklch(0.14_0.006_254/0.96)] backdrop-blur-sm"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between px-5 py-5 sm:px-10">
        <p className="label-code text-graphite" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={btn}>
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-5 sm:px-24">
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className={`${btn} absolute left-3 top-1/2 z-10 -translate-y-1/2 bg-ink/60 sm:left-8`}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
        )}
        <picture key={item.src} className="contents">
          {sources ? <source type="image/avif" srcSet={sources.avif} sizes="90vw" /> : null}
          {sources ? <source type="image/webp" srcSet={sources.webp} sizes="90vw" /> : null}
          <img
            src={sources ? sources.fallback : item.src}
            alt={item.alt}
            className="rise-in h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          />
        </picture>
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className={`${btn} absolute right-3 top-1/2 z-10 -translate-y-1/2 bg-ink/60 sm:right-8`}
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 px-5 py-6 sm:px-24">
        <div>
          <p className="text-lg font-bold tracking-tight text-bone">{item.caption ?? item.alt}</p>
          {item.meta ? <p className="mt-1 text-sm text-graphite">{item.meta}</p> : null}
        </div>
        <p className="label-code hidden text-graphite sm:block">← → browse · Esc close</p>
      </div>
    </div>,
    document.body,
  );
}

export { Lightbox };

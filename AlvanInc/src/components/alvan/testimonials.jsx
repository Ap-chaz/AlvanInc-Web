import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Eyebrow } from "./ui";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { TESTIMONIALS } from "@/lib/alvan-data";

const INTERVAL = 6500;
const pad = (n) => String(n).padStart(2, "0");

/**
 * Home: rotating client quotes on a dark band. Renders nothing while there are no quotes,
 * so it never shows invented ones. Auto-advances every 6.5 s, pauses on hover/focus or via the
 * pause button, and never auto-advances for visitors who prefer reduced motion.
 */
function Testimonials({ items = TESTIMONIALS }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false); // pointer over or focus inside
  const count = items.length;
  const auto = count > 1 && !paused && !engaged && !reduced;

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setI((n) => (n + 1) % count), INTERVAL);
    return () => clearTimeout(t);
  }, [auto, i, count]);

  if (count === 0) return null;
  const current = items[i % count];
  const go = (d) => setI((n) => (n + d + count) % count);

  return (
    <section
      id="testimonials"
      className="bg-ink px-5 py-24 sm:px-8 sm:py-36"
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
    >
      <Eyebrow index="07">Kind words</Eyebrow>

      <div className="mt-12 min-h-[16rem]" aria-live={auto ? "off" : "polite"} aria-atomic="true">
        <figure key={i} className="rise-in max-w-4xl">
          <blockquote className="display-tight text-3xl leading-[1.1] sm:text-5xl">
            “{current.text}”
          </blockquote>
          <figcaption className="mt-10">
            <span className="block text-base font-bold">{current.name}</span>
            <span className="label-code mt-2 block text-graphite">{current.role}</span>
          </figcaption>
        </figure>
      </div>

      {count > 1 && (
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <span className="label-code text-graphite" aria-label={`Quote ${i + 1} of ${count}`}>
            {pad(i + 1)} / {pad(count)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous quote"
              className="grid size-10 place-items-center rounded-full border border-white/20 transition-colors hover:border-brass hover:text-brass"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next quote"
              className="grid size-10 place-items-center rounded-full border border-white/20 transition-colors hover:border-brass hover:text-brass"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Resume automatic rotation" : "Pause automatic rotation"}
                aria-pressed={paused}
                className="grid size-10 place-items-center rounded-full border border-white/20 transition-colors hover:border-brass hover:text-brass"
              >
                {paused ? (
                  <Play className="size-4" aria-hidden="true" />
                ) : (
                  <Pause className="size-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export { Testimonials };

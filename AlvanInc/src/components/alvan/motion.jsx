import { useEffect, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Staggered word-by-word headline reveal.
 * Each word slides up out of a mask when the heading scrolls into view.
 *
 * Wrap a word in *asterisks* to colour it brass. Punctuation right after the
 * closing asterisk stays in the normal colour:
 *   <Words text="Built to be *trusted*." />
 *
 * start = ms before the first word, step = ms between words.
 */
function Words({ text, start = 0, step = 70, className, as: As = "span" }) {
  const { ref, shown } = useReveal();
  const words = text.split(" ");
  return (
    <As ref={ref} data-shown={shown} className={cn("words", className)}>
      {words.map((w, i) => {
        const m = w.match(/^\*(.+?)\*(.*)$/);
        return (
          <span key={`${w}-${i}`}>
            {i > 0 ? " " : null}
            <span className="word-mask">
              <span className="word-inner" style={{ transitionDelay: `${start + i * step}ms` }}>
                {m ? (
                  <>
                    <span className="text-brass">{m[1]}</span>
                    {m[2]}
                  </>
                ) : (
                  w
                )}
              </span>
            </span>
          </span>
        );
      })}
    </As>
  );
}

/** Splits "+41%", "1,400", "3.2×", "10K+" into prefix / number / suffix.
 *  Returns null for values that shouldn't animate ("2m 40s", "24/7", "Real"). */
function parseStat(value) {
  const str = String(value);
  const runs = str.match(/\d[\d,]*\.?\d*/g);
  if (!runs || runs.length !== 1) return null;
  const idx = str.search(/\d/);
  const numMatch = str.slice(idx).match(/^[\d,]*\.?\d+/);
  if (!numMatch) return null;
  const raw = numMatch[0];
  return {
    prefix: str.slice(0, idx),
    suffix: str.slice(idx + raw.length),
    target: parseFloat(raw.replace(/,/g, "")),
    decimals: raw.includes(".") ? raw.split(".")[1].length : 0,
    grouped: raw.includes(","),
  };
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Number that counts up from 0 when scrolled into view. */
function CountUp({ value, duration = 1600, className }) {
  const parsed = parseStat(value);
  const { ref, shown } = useReveal();
  const [n, setN] = useState(() => (parsed && prefersReducedMotion() ? parsed.target : 0));

  useEffect(() => {
    if (!parsed || !shown) return;
    if (prefersReducedMotion()) {
      setN(parsed.target);
      return;
    }
    let raf = 0;
    let t0 = 0;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // ease-out expo
      setN(parsed.target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, value, duration]);

  if (!parsed) return <span className={className}>{value}</span>;

  const formatted = n.toLocaleString("en-US", {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
    useGrouping: parsed.grouped,
  });

  return (
    <span ref={ref} className={cn("tabular-nums", className)} aria-label={String(value)}>
      <span aria-hidden="true">
        {parsed.prefix}
        {formatted}
        {parsed.suffix}
      </span>
    </span>
  );
}

export { CountUp, Words };

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "./reveal";
import { Eyebrow } from "./ui";
import { PROCESS_STEPS } from "@/lib/alvan-data";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Home: the sticky, scroll-driven Process section.
 *
 * Desktop (≥1024px, motion allowed): steps on the left, a fake editor on the
 * right, pinned for N screens of scroll. The active step lights up, a progress
 * line fills per step, and the editor swaps its content with a blur-in.
 * Phones, or reduced motion: every step stacked, each with its own editor
 * panel, no pinning and no animation.
 *
 * Steps come from PROCESS_STEPS; the editor lines below are a short, factual
 * summary of each step's own text.
 */
const EDITOR = {
  "01": {
    file: "brief.md",
    lines: [
      ["# Discover", "head"],
      ["call: 45 minutes"],
      ["format: Zoom or WhatsApp voice note"],
      ["agree: the goal, the pages"],
      ["agree: what counts as done"],
    ],
    status: "Listening…",
  },
  "02": {
    file: "design.md",
    lines: [
      ["# Design", "head"],
      ["first: direction"],
      ["then: full page designs"],
      ["copy: real copy, no grey boxes"],
      ["when: weeks 2–3"],
    ],
    status: "Designing…",
  },
  "03": {
    file: "build.md",
    lines: [
      ["# Build", "head"],
      ["built: responsive, fast, accessible"],
      ["tested: on ordinary 4G"],
      ["content: loaded as we go"],
      ["you get: a staging link"],
    ],
    status: "Building…",
  },
  "04": {
    file: "launch.md",
    lines: [
      ["# Launch", "head"],
      ["domain: connected"],
      ["analytics + SEO basics: wired up"],
      ["handover: walkthrough recording"],
      ["support: 30 days from go-live"],
    ],
    status: "Ready",
  },
};

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

function EditorPanel({ step, animate = false, isLast }) {
  const e = EDITOR[step.n];
  if (!e) return null;
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-border bg-ink shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="label-code ml-3 text-graphite">your-project / {e.file}</span>
      </div>
      <div className="min-h-[15rem] px-5 py-6 font-mono text-sm leading-[2] text-bone/80 sm:px-6">
        {e.lines.map(([text, kind], i) => (
          <div
            key={text}
            className={cn("flex gap-5", animate && "blur-in")}
            style={animate ? { animationDelay: `${i * 90}ms` } : undefined}
          >
            <span className="w-4 shrink-0 text-right text-white/25">{i + 1}</span>
            <span className={kind === "head" ? "text-brass" : undefined}>{text}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-border px-5 py-4 font-mono text-xs">
        <span
          className={cn(
            "size-2 rounded-full",
            isLast ? "bg-emerald-400" : "bg-brass motion-safe:animate-pulse",
          )}
        />
        <span className={isLast ? "text-emerald-400" : "text-graphite"}>{e.status}</span>
      </div>
    </div>
  );
}

function StepText({ step, active = true }) {
  return (
    <div className={cn("transition-opacity duration-500", active ? "opacity-100" : "opacity-35")}>
      <p className={cn("label-code", active ? "text-brass" : "text-graphite")}>{step.n}</p>
      <h3 className="type-h2 mt-3 sm:text-5xl">{step.name}</h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-bone/75">{step.body}</p>
      <p className="label-code mt-5 text-graphite">{step.duration}</p>
    </div>
  );
}

function PinnedSteps() {
  const outerRef = useRef(null);
  const barRefs = useRef([]);
  const [active, setActive] = useState(0);
  const n = PROCESS_STEPS.length;

  useEffect(() => {
    let frame = 0;
    let current = 0;
    const update = () => {
      frame = 0;
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const p = clamp(-rect.top / total, 0, 0.9999);
      const raw = p * n;
      const idx = Math.floor(raw);
      if (idx !== current) {
        current = idx;
        setActive(idx);
      }
      barRefs.current.forEach((bar, i) => {
        if (!bar) return;
        const fill = i < idx ? 1 : i === idx ? raw - idx : 0;
        bar.style.transform = `scaleY(${fill})`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [n]);

  return (
    <div ref={outerRef} style={{ height: `${n * 100}svh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="grid w-full items-center gap-16 pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <ol className="space-y-2">
            {PROCESS_STEPS.map((s, i) => (
              <li
                key={s.n}
                aria-current={i === active ? "step" : undefined}
                className="flex gap-6 py-3"
              >
                <span className="relative w-0.5 shrink-0 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
                  <span
                    ref={(el) => (barRefs.current[i] = el)}
                    className="absolute inset-0 origin-top bg-brass"
                    style={{ transform: "scaleY(0)" }}
                  />
                </span>
                <div className={i === active ? undefined : "[&_p:not(:first-child)]:hidden [&_h3]:text-[2rem]"}>
                  <StepText step={s} active={i === active} />
                </div>
              </li>
            ))}
          </ol>
          <div key={active}>
            <EditorPanel step={PROCESS_STEPS[active]} animate isLast={active === n - 1} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedSteps() {
  return (
    <ol className="space-y-16">
      {PROCESS_STEPS.map((s, i) => (
        <li key={s.n} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          <StepText step={s} />
          <EditorPanel step={s} isLast={i === PROCESS_STEPS.length - 1} />
        </li>
      ))}
    </ol>
  );
}

function ProcessSticky() {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <section id="process" className="bg-ink-soft px-5 pt-24 sm:px-8 sm:pt-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <Eyebrow index="05">Process</Eyebrow>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <h2 className="type-h1 sm:text-6xl">
              Four steps. <span className="text-brass">No surprises.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={160}>
          <Link to="/process" className="link-underline text-bone">
            Full process <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>

      <div className={wide && !reduced ? "mt-4" : "mt-16 pb-24 sm:pb-36"}>
        {wide && !reduced ? <PinnedSteps /> : <StackedSteps />}
      </div>
    </section>
  );
}

export { ProcessSticky };

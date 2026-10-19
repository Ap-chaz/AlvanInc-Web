import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { Reveal } from "./reveal";
import { Eyebrow } from "./ui";
import { PROCESS_STEPS } from "@/lib/alvan-data";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Home: the Process section, advancing by itself.
 *
 * Each step runs for STEP_MS while its progress line fills; when the line is
 * full the next step takes over, and after the last it loops to the first.
 * The editor swaps its content with a blur-in. Visitors can click a step to
 * jump to it, or use the Pause button. It also pauses while off-screen or
 * when the tab is hidden. Reduced motion: every step stacked, no animation.
 *
 * Timing is driven by the progress line's own CSS animation (animationend),
 * so pausing it pauses the step timer and the two can never drift apart.
 */
const STEP_MS = 3500;

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

function StepText({ step }) {
  return (
    <>
      <p className="label-code text-brass">{step.n}</p>
      <h3 className="type-h2 mt-3 sm:text-5xl">{step.name}</h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-bone/75">{step.body}</p>
      <p className="label-code mt-5 text-graphite">{step.duration}</p>
    </>
  );
}

function AutoSteps() {
  const n = PROCESS_STEPS.length;
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0); // bumps on every change so the bar animation restarts
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const paused = userPaused || !inView || !tabVisible;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const goTo = (i) => {
    setActive(i);
    setRun((r) => r + 1);
  };
  const next = () => goTo((active + 1) % n);

  return (
    <div ref={rootRef} data-paused={paused} className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
      <div>
        <ol>
          {PROCESS_STEPS.map((s, i) => {
            const isActive = i === active;
            return (
              <li key={s.n} className="flex gap-6">
                <span
                  className="relative my-1 w-0.5 shrink-0 overflow-hidden rounded-full bg-white/15"
                  aria-hidden="true"
                >
                  {i < active && <span className="absolute inset-0 bg-brass" />}
                  {isActive && (
                    <span
                      key={`${i}-${run}`}
                      className="process-bar absolute inset-0 bg-brass"
                      style={{ animationDuration: `${STEP_MS}ms` }}
                      onAnimationEnd={next}
                    />
                  )}
                </span>
                <div className="min-w-0 flex-1 py-3">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Step ${s.n}: ${s.name}`}
                    className={cn(
                      "block w-full text-left transition-opacity duration-500",
                      isActive ? "opacity-100" : "opacity-55 hover:opacity-80",
                    )}
                  >
                    <span className="label-code text-brass">{s.n}</span>
                    <span className="type-h2 mt-2 block text-[2rem] sm:text-5xl">{s.name}</span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                    aria-hidden={!isActive}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-4 max-w-md text-base leading-relaxed text-bone/75">{s.body}</p>
                      <p className="label-code mt-5 pb-2 text-graphite">{s.duration}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-pressed={userPaused}
          className="label-display mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-bone transition-colors hover:border-brass hover:text-brass"
        >
          {userPaused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
          {userPaused ? "Play" : "Pause"}
        </button>
      </div>

      <div key={active} className="lg:sticky lg:top-28">
        <EditorPanel step={PROCESS_STEPS[active]} animate isLast={active === n - 1} />
      </div>
    </div>
  );
}

function StackedSteps() {
  return (
    <ol className="space-y-16">
      {PROCESS_STEPS.map((s, i) => (
        <li key={s.n} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          <div>
            <StepText step={s} />
          </div>
          <EditorPanel step={s} isLast={i === PROCESS_STEPS.length - 1} />
        </li>
      ))}
    </ol>
  );
}

/**
 * showHeading: the home page shows the "05 Process" heading row; the /process page already has
 * its own page header, so it passes showHeading={false} to avoid repeating it.
 */
function ProcessSteps({ showHeading = true }) {
  const reduced = useReducedMotion();
  return (
    <section
      id="process"
      className={cn(
        "bg-ink-soft px-5 sm:px-8",
        showHeading ? "py-24 sm:py-36" : "pb-24 pt-14 sm:pb-32 sm:pt-20",
      )}
    >
      {showHeading && (
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
      )}

      <div className={showHeading ? "mt-14 sm:mt-16" : undefined}>
        {reduced ? <StackedSteps /> : <AutoSteps />}
      </div>
    </section>
  );
}

export { ProcessSteps };

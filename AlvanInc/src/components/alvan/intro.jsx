import { Reveal } from "./reveal";
import { Button } from "./button";
import { Eyebrow } from "./ui";
import { SITE } from "@/lib/site";

/** Home: studio statement + "Based in" card (dark). */
function Intro() {
  return (
    <section id="about" className="surface-light px-5 py-24 sm:px-8 sm:py-36">
      <div className="flex flex-wrap items-start gap-14 lg:flex-nowrap lg:gap-20">
        <div className="min-w-0 flex-1">
          <Reveal>
            <Eyebrow index="01">About</Eyebrow>
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <h2 className="type-h2 max-w-4xl sm:text-5xl lg:text-6xl">
              AlvanInc is an independent studio building websites that{" "}
              <span className="text-brass">convert</span>, for African businesses who&apos;d rather
              look <span className="text-brass">credible</span> online than fight a template.
            </h2>
          </Reveal>
          <Reveal delay={220} className="mt-10 max-w-xl">
            <p className="type-lead text-black/65">
              We make good design available on a founder&apos;s timeline: fixed packages, fixed
              prices, no open-ended retainers. Every project ships with a system your team can run,
              from your phone if that&apos;s where you work.
            </p>
          </Reveal>
          <Reveal delay={300} className="mt-10 flex flex-wrap gap-3">
            <Button to="/contact" tone="light" icon="arrow">
              Start a project
            </Button>
            <Button to="/process" variant="secondary" tone="light" icon="up-right">
              Our process
            </Button>
          </Reveal>
        </div>

        <Reveal delay={200} className="w-full shrink-0 lg:w-[22rem]">
          <aside
            aria-label="Where we are based"
            className="rounded-3xl border border-black/10 bg-bone-deep p-7 sm:p-8"
          >
            <p className="label-code text-black/65">Based in</p>
            <p className="display-tight mt-4 text-4xl">{SITE.city}</p>
            <p className="mt-4 text-sm leading-relaxed text-black/65">{SITE.location.split(" · ")[1] ?? SITE.location}.</p>
            <p className="mt-7 flex items-center gap-3 border-t border-black/10 pt-5 text-sm text-black">
              <span className="relative flex size-2.5" aria-hidden="true">
                <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
              </span>
              {SITE.availability}
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

export { Intro };

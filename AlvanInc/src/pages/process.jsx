import { useHead } from "@/lib/use-head";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { PageHeader, Eyebrow } from "@/components/alvan/ui";
import { ProcessSteps } from "@/components/alvan/process-steps";
import { CLIENT_INPUTS } from "@/lib/alvan-data";
const title = "How it works — the AlvanInc process";
const description =
  "Four steps, no surprises: Discover, Design, Build, Launch. The week-by-week schedule for a Studio-tier project and exactly what we need from you.";
const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
const BARS = [
  { name: "Discover", start: 0, span: 1 },
  { name: "Design", start: 1, span: 2 },
  { name: "Build", start: 3, span: 2 },
  { name: "Launch", start: 5, span: 1 },
];
export default function Process() {
  useHead({ title, description });
  return (
    <PageShell>
      <PageHeader
        tone="soft"
        eyebrow="Process"
        title="How it works"
        intro={
          <>
            Four steps. <span className="text-brass">No surprises.</span>
          </>
        }
      />

      <ProcessSteps showHeading={false} />

      <section className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Eyebrow>Studio-tier schedule</Eyebrow>
        </Reveal>
        <Reveal delay={110} className="mt-8">
          <h2 className="display-tight max-w-2xl text-[2rem] leading-[1] sm:text-4xl">
            Six weeks, kickoff to <span className="text-brass">live</span>.
          </h2>
        </Reveal>

        <Reveal delay={200} className="mt-14 overflow-x-auto">
          <div className="min-w-[40rem]">
            <div className="grid grid-cols-6 gap-2">
              {WEEKS.map((w) => (
                <span key={w} className="label-mono text-black/40">
                  {w}
                </span>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {BARS.map((b, i) => (
                <div key={b.name} className="grid grid-cols-6 gap-2">
                  <div
                    className="label-mono flex items-center rounded-full px-4 py-3 text-ink"
                    style={{
                      gridColumn: `${b.start + 1} / span ${b.span}`,
                      backgroundColor: i % 2 === 0 ? "#CBA135" : "rgba(21,22,26,0.85)",
                      color: i % 2 === 0 ? "#15161A" : "#F2F0EA",
                    }}
                  >
                    {b.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="surface-light px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Eyebrow>What we need from you</Eyebrow>
        </Reveal>
        <ul className="mt-12 max-w-3xl border-t border-black/10">
          {CLIENT_INPUTS.map((c, i) => (
            <Reveal as="li" key={c} delay={i * 100}>
              <p className="border-b border-black/10 py-7 text-lg leading-relaxed text-black/75">
                {c}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

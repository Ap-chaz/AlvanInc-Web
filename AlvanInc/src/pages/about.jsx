// TODO(owner) Phase 8: story copy below (founding year, team size, project count, PRESS list) is template text, replace with true facts.
import { useHead } from "@/lib/use-head";
import { SEO } from "@/lib/seo";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { MockUI } from "@/components/alvan/mock-ui";
import { PageHeader, Eyebrow } from "@/components/alvan/ui";
import { PRINCIPLES, TEAM } from "@/lib/alvan-data";
const PRESS = [
  "Nairobi Business Review",
  "Founder Weekly Africa",
  "East African Trade Journal",
  "Commerce Report",
  "Design Kenya",
];
export default function About() {
  useHead(SEO["/about"]);
  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title={
          <>
            AlvanInc is an independent studio building websites that{" "}
            <span className="text-brass">convert</span>, for African businesses who&apos;d rather
            look <span className="text-brass">credible</span> online than fight a template.
          </>
        }
      />

      <section className="surface-light px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="grid gap-10 border-t border-black/10 pt-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="text-base leading-relaxed text-black/70">
              AlvanInc started in 2019 out of a simple frustration: business owners in Nairobi were
              being quoted six figures and four months for a site that needed neither. The first
              project was a one-page launch for a friend&apos;s coffee subscription, built in a week
              for a fixed fee. It doubled her signups, and the model has not changed since.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-base leading-relaxed text-black/70">
              Six years on we are three people who have shipped over a hundred and twenty projects
              across retail, fintech, property, and hospitality — across Kenya and beyond. We take a
              small number of builds at a time so each one gets the whole studio, and we publish our
              prices because arguing about a quote is nobody&apos;s idea of a good first meeting.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Eyebrow>Principles</Eyebrow>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 120}>
              <article className="h-full rounded-2xl border border-black/10 bg-bone p-8 transition-all duration-[250ms] ease-out hover:-translate-y-1.5 hover:border-black/30">
                <h2 className="display-tight text-2xl">{p.name}</h2>
                <p className="mt-4 text-sm leading-relaxed text-black/65">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="surface-light px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Eyebrow>The studio</Eyebrow>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 110}>
              <article>
                <div
                  className="overflow-hidden rounded-2xl border border-black/10"
                  style={{ aspectRatio: "4 / 5" }}
                  role="img"
                  aria-label={`Portrait of ${m.name}, ${m.role}`}
                >
                  <MockUI variant={m.variant} headline={m.name} className="h-full w-full" />
                </div>
                <h3 className="display-tight mt-6 text-2xl">{m.name}</h3>
                <p className="label-mono mt-3 text-black/65">{m.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-black/65">{m.specialty}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="surface-light-deep px-5 py-20 sm:px-8 sm:py-24">
        <Reveal className="text-center">
          <p className="label-mono text-black/65">Written about in</p>
        </Reveal>
        <Reveal delay={120} className="mt-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-16">
            {PRESS.map((p) => (
              <li
                key={p}
                className="display-tight text-lg tracking-tight text-black/65 transition-colors hover:text-black/85 sm:text-xl"
              >
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </PageShell>
  );
}

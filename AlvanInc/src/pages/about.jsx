import { useHead } from "@/lib/use-head";
import { SEO } from "@/lib/seo";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { Button } from "@/components/alvan/button";
import { PageHeader, Eyebrow } from "@/components/alvan/ui";
import { PRINCIPLES } from "@/lib/alvan-data";

// To show your real photo: put the file in /public (e.g. /public/alvan.webp) and set PORTRAIT = "/alvan.webp".
// While it is null, a clean "AN" monogram is shown instead.
const PORTRAIT = null;

export default function About() {
  useHead(SEO["/about"]);
  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title={
          <>
            AlvanInc is a one-person studio in Nairobi building websites that{" "}
            <span className="text-brass">convert</span>, for African businesses who&apos;d rather
            look <span className="text-brass">credible</span> online than fight a template.
          </>
        }
      />

      <section className="surface-light px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="grid gap-10 border-t border-black/10 pt-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="text-base leading-relaxed text-black/70">
              I&apos;m Alvan Peter Nyakundi, the person behind AlvanInc. Because it&apos;s a
              one-person studio, the person you brief on the first call is the person who designs,
              builds, and launches your site. No account managers, no handoffs, and no waiting for a
              message to travel between departments.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-base leading-relaxed text-black/70">
              So far I&apos;ve shipped three live sites: Rommie, a place to find and compare student
              rooms and hostels; Zuno Escrow, an escrow payment platform for online marketplace
              deals; and Sharks Clinic, a clinic website with online appointment booking. I take on
              a small number of projects at a time so each one gets my full attention, and I
              publish my prices because arguing about a quote is nobody&apos;s idea of a good first
              meeting.
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
          <Eyebrow>Who you&apos;ll work with</Eyebrow>
        </Reveal>
        <Reveal delay={110}>
          <article className="mt-12 grid items-center gap-8 md:grid-cols-[18rem_minmax(0,1fr)] md:gap-14">
            <div
              className="flex items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-ink"
              style={{ aspectRatio: "4 / 5" }}
              role="img"
              aria-label="Portrait of Alvan Peter Nyakundi, founder of AlvanInc"
            >
              {PORTRAIT ? (
                <img src={PORTRAIT} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="display-tight text-7xl text-brass">AN</span>
              )}
            </div>
            <div>
              <h3 className="display-tight text-3xl sm:text-4xl">Alvan Peter Nyakundi</h3>
              <p className="label-mono mt-3 text-black/65">Founder, designer &amp; developer</p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-black/70">
                I handle every step myself: the kickoff call, the design, the build, the launch, and
                the thirty days of support after you go live. You always know who is working on
                your site, and you can reach them directly on WhatsApp or email.
              </p>
              <Button to="/contact" tone="light" icon="arrow" className="mt-8">
                Start a project
              </Button>
            </div>
          </article>
        </Reveal>
      </section>
    </PageShell>
  );
}

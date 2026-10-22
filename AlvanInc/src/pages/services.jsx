import { useApi } from "@/lib/use-api";
import { useHead } from "@/lib/use-head";
import { SEO } from "@/lib/seo";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { PageHeader, Eyebrow } from "@/components/alvan/ui";
import { SERVICES, ALWAYS_INCLUDED } from "@/lib/alvan-data";
export default function Services() {
  useHead(SEO["/services"]);
  const { data: services } = useApi("/api/services", (json) => json.services, SERVICES);
  return (
    <PageShell>
      <PageHeader
        eyebrow="Services"
        title="What we build"
        intro={
          <>
            Four shapes of project. Pick the one that matches what you&apos;re{" "}
            <span className="text-brass">selling</span> — the price list follows from it.
          </>
        }
      />

      <section className="surface-light px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={(i % 2) * 120}>
              <article className="flex h-full flex-col rounded-2xl border border-black/10 p-8 transition-all duration-[250ms] ease-out hover:-translate-y-1.5 hover:border-black/30">
                <span className="label-mono text-brass">0{i + 1}</span>
                <h2 className="display-tight mt-8 text-3xl">{s.name}</h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-black/65">{s.body}</p>
                <Link to="/pricing" className="link-underline mt-10 self-start text-black">
                  {s.tier} pricing <span aria-hidden="true">→</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Eyebrow>Always included</Eyebrow>
        </Reveal>
        <Reveal delay={110} className="mt-8">
          <h2 className="display-tight max-w-2xl text-[2.2rem] leading-[1] sm:text-5xl">
            Every package ships with these, at no extra cost.
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2">
          {ALWAYS_INCLUDED.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 90} className="bg-bone-deep p-7">
              <p className="text-base text-black/75">{item}</p>
            </Reveal>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

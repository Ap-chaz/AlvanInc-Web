import { useApi } from "@/lib/use-api";
import { useHead } from "@/lib/use-head";
import { SEO } from "@/lib/seo";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { PageHeader, Eyebrow, Tag, BrassButton, GhostButton } from "@/components/alvan/ui";
import { TIERS } from "@/lib/alvan-data";
const PRICING_FAQ = [
  {
    q: "What's not included?",
    a: "Photography, video, licensed fonts or stock, and copywriting beyond one editing pass. We flag anything you'll need on the discovery call with a number attached.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes. 50% books your build slot and 50% is due at launch, paid via M-Pesa or bank transfer. Custom projects split across three or four milestones instead.",
  },
  {
    q: "What happens after the 3 revisions?",
    a: "Further rounds are billed hourly at KES 3,500, agreed before we start them. In practice this almost never happens — most projects sign off in two.",
  },
];
export default function Pricing() {
  useHead(SEO["/pricing"]);
    const { data: tiers } = useApi("/api/packages", (json) => json.packages, TIERS);
  return (
    <PageShell>
      <PageHeader
        eyebrow="Pricing"
        title={
          <>
            Pick a <span className="text-brass">shape</span>, not a quote.
          </>
        }
        intro="Fixed starting prices in Kenyan shillings. Final scope confirmed after a discovery call."
      />

      <section className="surface-light px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="grid gap-5 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <article
                className={`flex h-full flex-col rounded-2xl border p-8 transition-all duration-[250ms] ease-out hover:-translate-y-1.5 ${t.featured ? "border-brass/60 bg-bone-deep" : "border-black/10 hover:border-black/30"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="label-mono text-black/65">{t.name}</p>
                  {t.featured && <Tag>Most booked</Tag>}
                </div>
                <p className="display-tight mt-10 text-4xl sm:text-5xl">{t.price}</p>
                {t.priceNote && <p className="label-mono mt-3 text-black/65">{t.priceNote}</p>}
                <p className="mt-6 text-sm leading-relaxed text-black/65">{t.pitch}</p>

                <ul className="mt-8 space-y-3 border-t border-black/10 pt-8">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm leading-relaxed text-black/75">
                      <span aria-hidden="true" className="text-brass">
                        ·
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-2">
                  {t.featured ? (
                    <BrassButton to="/contact">
                      Start with {t.name} <span aria-hidden="true">→</span>
                    </BrassButton>
                  ) : (
                    <GhostButton to="/contact">
                      Start with {t.name} <span aria-hidden="true">→</span>
                    </GhostButton>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-14">
          <p className="max-w-2xl text-base leading-relaxed text-black/65">
            Not sure which one? Launch fits a single offer or event. Studio fits an ongoing business
            with more than one thing to say. Custom fits anything with logins, M-Pesa or card
            payments, or a database.
          </p>
        </Reveal>
      </section>

      <section className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Eyebrow>Before you ask</Eyebrow>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {PRICING_FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 110}>
              <h2 className="display-tight text-xl">{f.q}</h2>
              <p className="mt-4 text-sm leading-relaxed text-black/65">{f.a}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={280} className="mt-16">
          <Link to="/contact" className="link-underline text-black">
            Start with a discovery call <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>
    </PageShell>
  );
}

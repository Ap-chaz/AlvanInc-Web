import { useApi } from "@/lib/use-api";
import { Link } from "react-router-dom";
import { Reveal } from "./reveal";
import { Eyebrow, Tag } from "./ui";
import { TIERS } from "@/lib/alvan-data";
function PricingTeaser() {
    const { data: tiers } = useApi("/api/packages", (json) => json.packages, TIERS);
  return (
    <section className="surface-light px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <Eyebrow>Pricing</Eyebrow>
      </Reveal>
      <Reveal delay={100} className="mt-8">
        <h2 className="display-tight max-w-2xl text-[2.4rem] leading-[0.95] sm:text-5xl">
          Pick a <span className="text-brass">shape</span>, not a quote.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={140 + i * 110}>
            <article
              className={`flex h-full flex-col rounded-2xl border p-7 transition-all duration-[250ms] ease-out hover:-translate-y-1.5 ${t.featured ? "border-brass/60 bg-bone-deep" : "border-black/10 hover:border-black/30"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="label-mono text-black/65">{t.name}</p>
                {t.featured && <Tag>Most booked</Tag>}
              </div>
              <p className="display-tight mt-10 text-4xl">{t.price}</p>
              <p className="mt-4 text-sm leading-relaxed text-black/65">{t.pitch}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={220} className="mt-14">
        <Link to="/pricing" className="link-underline text-black">
          See full pricing <span aria-hidden="true">→</span>
        </Link>
      </Reveal>
    </section>
  );
}
export { PricingTeaser };

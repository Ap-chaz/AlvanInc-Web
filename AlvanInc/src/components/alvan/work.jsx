import { Link } from "react-router-dom";
import { useScrollParallax } from "@/hooks/use-reveal";
import { MockUI } from "./mock-ui";
import { Reveal } from "./reveal";
import { Eyebrow, Tag } from "./ui";
import { PROJECTS, TIERS } from "@/lib/alvan-data";
const RIBBON = [
  {
    slug: "zuno",
    tilt: 0,
    y: 0.9,
    logo: "/logos/zuno.webp",
    logoLabel: "ZUNO",
    logoDark: true,
    logoFill: true,
  },
  {
    slug: "sharks-clinic",
    tilt: -18,
    y: 0.6,
    logo: "/sharks-clinic.webp",
    logoLabel: "Sharks Clinic",
    logoDark: true,
    logoFill: true,
  },
];
const bySlug = (slug) => PROJECTS.find((p) => p.slug === slug);
function ExplorationCard({ c, tilt, progress }) {
  const style = {
    aspectRatio: "4 / 3",
    transform: tilt
      ? `rotateY(${c.tilt}deg) translateZ(${-Math.abs(c.tilt) * 2}px) translateY(${progress * c.y * 46}px)`
      : "none",
    transition: "transform 120ms linear",
    transformStyle: "preserve-3d",
  };
  if (c.logo) {
    const hasCaseStudy = PROJECTS.some((proj) => proj.slug === c.slug);
    const cardClass = `w-[85vw] shrink-0 overflow-hidden rounded-2xl border shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] sm:w-[55vw] lg:w-[42vw] ${c.logoDark ? "border-white/10 bg-ink" : "border-black/[0.06] bg-white"}`;
    const content = c.logoFill ? (
      <div className="relative h-full w-full">
        <img
          src={c.logo}
          alt={`${c.logoLabel} logo`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent p-[7%]">
          <span
            className="text-[0.55rem] tracking-[0.2em] text-white/80 uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {c.logoLabel}
          </span>
        </div>
      </div>
    ) : (
      <div className="flex h-full w-full flex-col p-[7%]">
        <div
          className={`flex items-center justify-between text-[0.55rem] tracking-[0.2em] uppercase ${c.logoDark ? "text-bone/40" : "text-black/40"}`}
        >
          <span style={{ fontFamily: "var(--font-mono)" }}>{c.logoLabel}</span>
        </div>
        <div className="flex flex-1 items-center justify-center px-[10%] py-[6%]">
          <img
            src={c.logo}
            alt={`${c.logoLabel} logo`}
            className="max-h-full max-w-[70%] object-contain"
          />
        </div>
      </div>
    );
    return hasCaseStudy ? (
      <Link
        to={`/work/${c.slug}`}
        aria-label={`${c.logoLabel} case study`}
        className={cardClass}
        style={style}
      >
        {content}
      </Link>
    ) : (
      <div aria-label={`${c.logoLabel} — client logo`} className={cardClass} style={style}>
        {content}
      </div>
    );
  }
  const p = bySlug(c.slug);
  return (
    <Link
      to={`/work/${c.slug}`}
      aria-label={`${p.name} case study`}
      className="w-[85vw] shrink-0 overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] sm:w-[55vw] lg:w-[42vw]"
      style={style}
    >
      <MockUI variant={p.variant} headline={p.headline} className="h-full w-full" />
    </Link>
  );
}
function TiltedShowcase() {
  const { ref, progress } = useScrollParallax();
  return (
    <section ref={ref} className="surface-light-deep overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <Eyebrow>Explorations</Eyebrow>
      </Reveal>

      {/* Auto-scrolling marquee, right to left, looping — same treatment at every screen size */}
      <div className="mt-14 -mx-5 overflow-hidden sm:-mx-8">
        <div className="marquee-track flex w-max items-center gap-4 sm:gap-6">
          {[...RIBBON, ...RIBBON].map((c, i) => (
            <ExplorationCard key={`${c.slug}-${i}`} c={c} tilt={false} progress={progress} />
          ))}
        </div>
      </div>

      <div className="mt-20 grid gap-8 sm:grid-cols-2 sm:items-end">
        <Reveal>
          <p className="max-w-sm text-sm leading-relaxed text-black/60">
            Concepts, explorations, and interface work shared as part of our process.
          </p>
        </Reveal>
        <Reveal delay={120} className="sm:justify-self-end">
          <Link to="/work" className="link-underline text-black">
            View more work <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
function PairedWork() {
  const pairs = [bySlug("tulia-coffee"), bySlug("kilimani-homes")];
  return (
    <section id="work" className="surface-light px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <Eyebrow>Selected work</Eyebrow>
      </Reveal>
      <div className="mt-14 grid gap-16 lg:grid-cols-2 lg:gap-10">
        {pairs.map((p, i) => (
          <Reveal key={p.slug} delay={i * 140}>
            <article className="group">
              <Link
                to={`/work/${p.slug}`}
                className="block overflow-hidden rounded-2xl border border-black/10 transition-all duration-[250ms] ease-out group-hover:-translate-y-1.5 group-hover:border-black/30"
              >
                <div style={{ aspectRatio: "16 / 11" }}>
                  <MockUI variant={p.variant} headline={p.headline} className="h-full w-full" />
                </div>
              </Link>
              <div className="mt-8 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div className="min-w-0">
                  <h3 className="display-tight text-3xl">{p.name}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-black/60">{p.summary}</p>
                </div>
                <Link to={`/work/${p.slug}`} className="link-underline text-black">
                  Explore project <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
function SplitWork() {
  const p = bySlug("amana-pay");
  return (
    <section className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>More work</Eyebrow>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <h2 className="display-tight text-[2.6rem] leading-[0.95] sm:text-6xl">
              Selected work
              <br />
              &amp; explorations
            </h2>
          </Reveal>
          <Reveal delay={180} className="mt-10">
            <Link to="/work" className="link-underline text-black">
              View all projects <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <Link
            to={`/work/${p.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-black/10 transition-all duration-[250ms] ease-out hover:-translate-y-1.5 hover:border-black/30"
            style={{ aspectRatio: "16 / 11" }}
          >
            <MockUI variant={p.variant} headline={p.headline} className="h-full w-full" />
            <p className="display-tight absolute bottom-4 left-5 right-5 text-[2rem] text-bone sm:text-5xl">
              Hi, I&apos;m Amana.
            </p>
          </Link>
          <div className="mt-8">
            <h3 className="display-tight text-2xl">{p.name}</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/60">{p.summary}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
function PricingTeaser() {
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
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={140 + i * 110}>
            <article
              className={`flex h-full flex-col rounded-2xl border p-7 transition-all duration-[250ms] ease-out hover:-translate-y-1.5 ${t.featured ? "border-brass/60 bg-bone-deep" : "border-black/10 hover:border-black/30"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="label-mono text-black/50">{t.name}</p>
                {t.featured && <Tag>Most booked</Tag>}
              </div>
              <p className="display-tight mt-10 text-4xl">{t.price}</p>
              <p className="mt-4 text-sm leading-relaxed text-black/60">{t.pitch}</p>
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
export { PairedWork, PricingTeaser, SplitWork, TiltedShowcase };

import { Link } from "react-router-dom";
import { Reveal } from "./reveal";
import { CountUp } from "./motion";
import { Eyebrow } from "./ui";
function About() {
  return (
    <section id="about" className="surface-light px-5 py-24 sm:px-8 sm:py-36">
      <Reveal>
        <Eyebrow>About</Eyebrow>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <h2 className="display-tight max-w-6xl text-[2rem] leading-[1.03] sm:text-5xl lg:text-6xl">
          AlvanInc is an independent studio building websites that{" "}
          <span className="text-brass">convert</span>, for African businesses who&apos;d rather look{" "}
          <span className="text-brass">credible</span> online than fight a template.
        </h2>
      </Reveal>

      <Reveal delay={220} className="mt-16">
        <hr className="border-t border-black/15" />
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <Reveal delay={280}>
          <p className="label-mono leading-[1.9] text-black/70">
            We design for trust.
            <br />
            Mobile-first, always,
            <br />
            built to launch.
          </p>
        </Reveal>
        <Reveal delay={360} className="lg:justify-self-end lg:max-w-md">
          <p className="text-base leading-relaxed text-black/70">
            Our mission is to make good design available on a founder&apos;s timeline — fixed
            packages, fixed prices, no open-ended retainers. Every project ships with a system your
            team can actually run, from your phone if that&apos;s where you work.
          </p>
          <Link to="/about" className="link-underline mt-10 text-black">
            More about us <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
const FACTS = [
  {
    label: "Projects shipped",
    stat: "120+",
    caption: "Launched across retail, fintech, real estate, and services.",
    dark: true,
    grad: "linear-gradient(135deg, rgba(203,161,53,0.35), rgba(242,240,234,0.06))",
    image: "/projects-shipped.webp",
  },
  {
    label: "Client retention",
    stat: "92%",
    caption: "Of clients return for a second engagement.",
    dark: false,
    grad: "linear-gradient(135deg, rgba(26,26,26,0.12), rgba(203,161,53,0.25))",
    image: "/client-retention.webp",
  },
  {
    label: "Sites live",
    stat: "35+",
    caption: "Currently maintained and shipping updates.",
    dark: true,
    grad: "linear-gradient(135deg, rgba(143,169,196,0.3), rgba(203,161,53,0.2))",
    image: "/sites-live.webp",
  },
];
const PARTNERS = ["KILELE", "JIKONI", "NGUVU", "TUMAINI", "KASKAZI"];
// Repeated so one half of the marquee is always wider than the screen
const PARTNER_SET = [...PARTNERS, ...PARTNERS, ...PARTNERS];
function KeyFacts() {
  return (
    <section id="facts" className="surface-light px-5 pb-28 sm:px-8 sm:pb-36">
      <div className="text-center">
        <Reveal>
          <h2 className="display-tight text-5xl sm:text-7xl">Key facts</h2>
        </Reveal>
        <Reveal delay={120} className="mt-5">
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-black/60">
            A snapshot of how we work and what it has added up to.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-5 md:grid-cols-3">
        {FACTS.map((f, i) => (
          <Reveal key={f.label} delay={180 + i * 110}>
            <article
              className={`group flex h-full min-h-[22rem] flex-col rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1.5 ${f.dark ? "bg-ink text-bone" : "bg-bone-deep text-ink"}`}
            >
              <p className={`label-mono text-center ${f.dark ? "text-bone/70" : "text-black/60"}`}>
                {f.label}
              </p>
              <div
                className="mt-6 flex-1 overflow-hidden rounded-xl"
                style={f.image ? void 0 : { background: f.grad }}
                aria-hidden="true"
              >
                {f.image ? (
                  <img
                    src={f.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="mt-6">
                <p className="display-tight mb-3 text-5xl">
                  <CountUp value={f.stat} />
                </p>
                <p
                  className={`text-xs leading-relaxed ${f.dark ? "text-bone/70" : "text-black/60"}`}
                >
                  {f.caption}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200} className="mt-24 text-center">
        <p className="label-mono text-black/50">Our partners</p>
      </Reveal>
      <Reveal delay={280} className="mt-8">
        <div className="fade-edges -mx-5 overflow-hidden sm:-mx-8">
          <div className="marquee-track-reverse flex w-max items-center">
            {[0, 1].map((half) => (
              <ul key={half} aria-hidden={half === 1} className="flex shrink-0 items-center">
                {PARTNER_SET.map((p, i) => (
                  <li
                    key={`${p}-${i}`}
                    className="display-tight px-8 text-lg tracking-tight text-black/35 transition-colors hover:text-black/70 sm:px-12 sm:text-xl"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
export { About, KeyFacts };

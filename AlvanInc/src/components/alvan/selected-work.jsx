import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { Eyebrow, Tag } from "./ui";
import { ViewSiteLink } from "./view-site";
import { PROJECTS } from "@/lib/alvan-data";

// Real projects only (template ones are flagged placeholder: true). The flagship
// is shown in <Featured />, so it is skipped here.
const FEATURED_SLUG = "zuno";

/** Home: text-led work cards on a light surface, then a "your project next" card. */
function SelectedWork() {
  const work = PROJECTS.filter((p) => !p.placeholder && p.slug !== FEATURED_SLUG).slice(0, 2);
  return (
    <section id="work" className="surface-light px-5 py-24 sm:px-8 sm:py-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <Eyebrow index="04">Selected work</Eyebrow>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <h2 className="type-h1 sm:text-6xl">
              Work you can <span className="text-brass">see</span>.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={160}>
          <Link to="/work" className="link-underline text-black">
            All work <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {work.map((p, i) => (
          <Reveal key={p.slug} delay={i * 110}>
            <div className="group relative flex h-full min-h-[22rem] flex-col justify-between rounded-3xl border border-black/10 p-8 transition-all duration-[250ms] ease-out hover:-translate-y-1.5 hover:border-black/30">
              <Link
                to={`/work/${p.slug}`}
                aria-label={`${p.name} case study`}
                className="absolute inset-0 rounded-3xl"
              />
              <span className="label-code text-black/65">{p.category}</span>
              <span>
                <span className="display-tight block text-4xl">{p.name}</span>
                <span className="mt-4 block max-w-xs text-sm leading-relaxed text-black/65">
                  {p.summary}
                </span>
                <span className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </span>
                <span className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <span className="label-display inline-flex items-center gap-2 text-black transition-colors group-hover:text-brass">
                    Explore project <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                  <ViewSiteLink project={p} className="relative z-10" />
                </span>
              </span>
            </div>
          </Reveal>
        ))}

        <Reveal delay={work.length * 110}>
          <Link
            to="/contact"
            className="group flex h-full min-h-[22rem] flex-col justify-between rounded-3xl bg-ink p-8 text-bone transition-transform duration-[250ms] ease-out hover:-translate-y-1.5"
          >
            <span className="label-code text-graphite">Next up</span>
            <span>
              <span className="display-tight block text-4xl">
                Your project could be <span className="text-brass">here</span>.
              </span>
              <span className="label-display mt-8 inline-flex items-center gap-2 transition-colors group-hover:text-brass">
                Start a project <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export { SelectedWork };

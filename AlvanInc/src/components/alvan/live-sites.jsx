import { useApi } from "@/lib/use-api";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { Eyebrow } from "./ui";
import { buildLiveSites } from "@/lib/live-sites";
import { PROJECTS } from "@/lib/alvan-data";

const host = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
const CARD =
  "flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-bone transition-all duration-[250ms] ease-out";

function Card({ s, i }) {
  const inner = (
    <>
      {/* Browser-style strip: gives each card a "site window" feel without needing screenshots */}
      <div className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-3.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-black/20" />
          <span className="size-2 rounded-full bg-black/20" />
          <span className="size-2 rounded-full bg-black/20" />
        </span>
        <span className="label-code truncate text-black/65">{s.url ? host(s.url) : "Link coming soon"}</span>
      </div>

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <span className="label-code text-black/65">{String(i + 1).padStart(2, "0")}</span>
        <h3 className="display-tight mt-6 text-3xl sm:text-4xl">{s.name}</h3>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-black/65">{s.blurb}</p>

        <div className="mt-8 border-t border-black/10 pt-5">
          {s.url ? (
            <span className="label-display inline-flex items-center gap-2 text-black transition-colors group-hover:text-brass">
              Visit site
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          ) : (
            <span className="label-code text-black/65">Coming soon</span>
          )}
        </div>
      </div>
    </>
  );

  if (!s.url) return <div className={CARD}>{inner}</div>;
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${s.name} (opens in a new tab)`}
      className={`group hover:-translate-y-1.5 hover:border-black/30 ${CARD}`}
    >
      {inner}
    </a>
  );
}

/** Home: three cards, one per live site we built (each opens in a new tab). Light-deep surface. */
function LiveSites() {
  const { data: projects } = useApi("/api/projects", (json) => json.projects, PROJECTS);
  const liveSites = buildLiveSites(projects);

  return (
    <section id="live-sites" className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <Eyebrow index="06">Live sites</Eyebrow>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <h2 className="type-h1 sm:text-6xl">
              See them <span className="text-brass">live</span>.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={160} className="max-w-xs">
          <p className="text-sm leading-relaxed text-black/65">
            Real sites, running now. Tap one to open it in a new tab.
          </p>
        </Reveal>
      </div>

      <ul className="mt-14 grid gap-5 lg:grid-cols-3">
        {liveSites.map((s, i) => (
          <Reveal as="li" key={s.slug} delay={i * 90} className="h-full">
            <Card s={s} i={i} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export { LiveSites };

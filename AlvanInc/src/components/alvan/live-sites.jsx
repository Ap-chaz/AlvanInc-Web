import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { Eyebrow } from "./ui";
import { LIVE_SITES } from "@/lib/live-sites";

const host = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
const ROW =
  "grid items-center gap-4 border-b border-black/15 py-8 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-8 sm:py-10";

function Row({ s, i }) {
  const body = (
    <>
      <span className="label-code text-black/65">{String(i + 1).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="display-tight block text-4xl sm:text-5xl">{s.name}</span>
        <span className="mt-3 block max-w-lg text-sm leading-relaxed text-black/65">{s.blurb}</span>
        {s.url ? <span className="label-code mt-3 block text-black/65">{host(s.url)}</span> : null}
      </span>
    </>
  );

  if (!s.url) {
    // Link not ready yet: same row, not clickable
    return (
      <div className={ROW}>
        {body}
        <span className="label-code text-black/65">Link coming soon</span>
      </div>
    );
  }
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${s.name} (opens in a new tab)`}
      className={`group transition-colors hover:bg-black/[0.03] ${ROW}`}
    >
      {body}
      <span className="label-display inline-flex items-center gap-2 text-black transition-colors group-hover:text-brass">
        Visit site
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}

/** Home: tap a row to open a live site we built (opens in a new tab). Light-deep surface. */
function LiveSites() {
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

      <ul className="mt-14 border-t border-black/15">
        {LIVE_SITES.map((s, i) => (
          <Reveal as="li" key={s.slug} delay={i * 90}>
            <Row s={s} i={i} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export { LiveSites };

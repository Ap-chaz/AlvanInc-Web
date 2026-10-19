import { Reveal } from "./reveal";
import { Button } from "./button";
import { Eyebrow, Tag } from "./ui";
import { ViewSiteLink } from "./view-site";
import { PROJECTS } from "@/lib/alvan-data";

const FEATURED_SLUG = "zuno";

/** Home: one flagship project on a dark band. Text only, no photo. */
function Featured() {
  const p = PROJECTS.find((x) => x.slug === FEATURED_SLUG);
  if (!p) return null;
  return (
    <section id="featured" className="bg-ink px-5 py-24 sm:px-8 sm:py-36">
      <Reveal>
        <Eyebrow index="03">Featured project</Eyebrow>
      </Reveal>

      <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <Reveal delay={100}>
            <h2 className="display-tight text-[3.5rem] leading-[0.95] sm:text-8xl">{p.name}</h2>
          </Reveal>
          <Reveal delay={180} className="mt-8">
            <p className="type-lead max-w-md text-bone/70">{p.summary}</p>
          </Reveal>
          <Reveal delay={240} className="mt-8 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Tag key={t} tone="dark">
                {t}
              </Tag>
            ))}
          </Reveal>
          <Reveal delay={300} className="mt-10 flex flex-wrap items-center gap-4">
            <Button to={`/work/${p.slug}`} icon="arrow">
              Read the case study
            </Button>
            <ViewSiteLink project={p} variant="button" tone="dark" />
          </Reveal>
        </div>

        <ol className="border-t border-border">
          {p.approach.map((a, i) => (
            <Reveal as="li" key={a.title} delay={120 + i * 100}>
              <div className="grid gap-4 border-b border-border py-8 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
                <span className="label-code text-brass">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{a.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/65">{a.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export { Featured };

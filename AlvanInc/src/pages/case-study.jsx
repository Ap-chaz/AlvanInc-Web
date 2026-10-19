import { Link, useParams } from "react-router-dom";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { Eyebrow, StatRow, Tag, BrassButton } from "@/components/alvan/ui";
import { ViewSiteLink } from "@/components/alvan/view-site";
import { PROJECTS } from "@/lib/alvan-data";
import NotFound from "@/pages/not-found";
import { useHead } from "@/lib/use-head";
import { projectSeo } from "@/lib/seo";

export default function CaseStudyPage() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return <NotFound />;
  return <CaseStudy key={project.slug} project={project} />;
}

function CaseStudy({ project }) {
  useHead(projectSeo(project));
  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  return (
    <PageShell cta={false}>
      <header className="surface-light px-5 pb-14 pt-36 sm:px-8 sm:pb-16 sm:pt-44">
        <Reveal>
          <Eyebrow>Case study</Eyebrow>
        </Reveal>
        <Reveal delay={110} className="mt-8">
          <h1 className="display-tight max-w-4xl text-[2.6rem] leading-[0.95] sm:text-6xl lg:text-7xl">
            {project.name}
          </h1>
        </Reveal>
        <Reveal delay={190} className="mt-8">
          <p className="max-w-xl text-base leading-relaxed text-black/65">{project.summary}</p>
        </Reveal>
        <Reveal delay={260} className="mt-8">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </Reveal>
        {project.liveUrl !== undefined && (
          <Reveal delay={320} className="mt-10">
            <ViewSiteLink project={project} variant="button" buttonVariant="primary" tone="light" />
          </Reveal>
        )}
      </header>

      <section className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <Reveal>
            <h2 className="display-tight text-3xl sm:text-4xl">The brief</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-2xl text-lg leading-relaxed text-black/70">{project.brief}</p>
          </Reveal>
        </div>

        <div className="mt-24 grid gap-14 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <Reveal>
            <h2 className="display-tight text-3xl sm:text-4xl">The approach</h2>
          </Reveal>
          <div className="max-w-2xl space-y-10">
            {project.approach.map((a, i) => (
              <Reveal key={a.title} delay={100 + i * 90}>
                <h3 className="label-mono text-black/65">{a.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-black/70">{a.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {(project.results && project.results.length > 0) || project.quote ? (
        <section className="surface-light px-5 py-24 sm:px-8 sm:py-32">
          {project.results && project.results.length > 0 && (
            <>
              <Reveal>
                <Eyebrow>The result</Eyebrow>
              </Reveal>
              <div className="mt-12">
                <StatRow stats={project.results} />
              </div>
            </>
          )}

          {project.quote && (
            <Reveal
              delay={200}
              className={project.results && project.results.length > 0 ? "mt-20" : ""}
            >
              <blockquote className="max-w-3xl">
                <p className="display-tight text-[1.75rem] leading-[1.15] sm:text-4xl">
                  “{project.quote.text}”
                </p>
                <footer className="label-mono mt-8 text-black/65">
                  {project.quote.name} — {project.quote.role}
                </footer>
              </blockquote>
            </Reveal>
          )}
        </section>
      ) : null}

      <section className="bg-ink px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-end">
          <Reveal>
            <p className="label-mono text-graphite">Next project</p>
            <Link
              to={`/work/${next.slug}`}
              className="display-tight mt-5 block text-4xl text-bone transition-colors hover:text-brass sm:text-6xl"
            >
              {next.name} <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <Reveal delay={140} className="sm:justify-self-end">
            <BrassButton to="/contact">
              Start your project <span aria-hidden="true">→</span>
            </BrassButton>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

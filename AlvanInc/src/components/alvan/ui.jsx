import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { Button } from "./button";
import { ViewSiteLink } from "./view-site";
import { CountUp, Words } from "./motion";
/** Mono eyebrow label with a short leading rule. index renders as "01 /". */
function Eyebrow({ children, index, rule = true, className }) {
  return (
    <p className={cn("label-code text-brass", rule && "eyebrow-rule", className)}>
      <span>
        {index ? <span className="opacity-60">{index} / </span> : null}
        {children}
      </span>
    </p>
  );
}
function PageHeader({ eyebrow, title, intro, tone = "light" }) {
  return (
    <header
      className={cn(
        "px-5 pb-16 pt-36 sm:px-8 sm:pb-20 sm:pt-44",
        tone === "light" ? "surface-light" : tone === "soft" ? "bg-ink-soft" : "bg-ink",
      )}
    >
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <div className="mt-8">
        <h1 className="display-tight max-w-4xl text-[2.6rem] leading-[0.95] sm:text-6xl lg:text-7xl">
          {typeof title === "string" ? <Words text={title} start={100} step={55} /> : title}
        </h1>
      </div>
      {intro ? (
        <Reveal delay={200} className="mt-8">
          <p
            className={cn(
              "max-w-xl text-base leading-relaxed",
              tone === "light" ? "text-black/60" : "text-graphite",
            )}
          >
            {intro}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
function BrassButton({ to, href, children, className }) {
  return (
    <Button
      variant="brass"
      to={href ? undefined : (to ?? "/contact")}
      href={href}
      className={className}
    >
      {children}
    </Button>
  );
}
function GhostButton({ to, children, className, tone = "light" }) {
  return (
    <Button variant="secondary" tone={tone} to={to} className={className}>
      {children}
    </Button>
  );
}
function Tag({ children, tone = "light" }) {
  return (
    <span
      className={cn(
        "label-mono rounded-full border px-3 py-1.5 text-[0.625rem]",
        tone === "light" ? "border-black/15 text-black/60" : "border-white/15 text-graphite",
      )}
    >
      {children}
    </span>
  );
}
function ProjectCard({ project, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="group relative flex h-full min-h-[22rem] flex-col justify-between rounded-3xl border border-black/10 p-8 transition-all duration-[250ms] ease-out hover:-translate-y-1.5 hover:border-black/30 sm:p-10">
        {/* Whole card opens the case study; "View site" sits above it (z-10) as its own link */}
        <Link
          to={`/work/${project.slug}`}
          aria-label={`${project.name} case study`}
          className="absolute inset-0 rounded-3xl"
        />
        <span className="label-code text-black/50">{project.category}</span>
        <span>
          <h3 className="display-tight text-3xl sm:text-5xl">{project.name}</h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-black/65">{project.summary}</p>
          <span className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </span>
          <span className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <span className="link-underline text-black group-hover:text-brass">
              Explore project <span aria-hidden="true">→</span>
            </span>
            <ViewSiteLink project={project} className="relative z-10" />
          </span>
        </span>
      </div>
    </Reveal>
  );
}
function StatRow({ stats, tone = "light" }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 110}>
          <article
            className={cn(
              "flex h-full flex-col rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1",
              tone === "light" ? "border-black/10 bg-bone-deep" : "border-white/10 bg-ink-soft",
            )}
          >
            <p className={cn("label-mono", tone === "light" ? "text-black/50" : "text-graphite")}>
              {s.label}
            </p>
            <p className="display-tight mt-8 text-5xl">
              <CountUp value={s.stat} />
            </p>
            <p
              className={cn(
                "mt-4 text-xs leading-relaxed",
                tone === "light" ? "text-black/60" : "text-graphite",
              )}
            >
              {s.caption}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
export { BrassButton, Eyebrow, GhostButton, PageHeader, ProjectCard, StatRow, Tag };

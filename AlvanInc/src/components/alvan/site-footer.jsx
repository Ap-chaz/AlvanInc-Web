import { Link } from "react-router-dom";
import { Reveal } from "./reveal";
import { Button } from "./button";
import { Wordmark } from "./wordmark";
import { SITE } from "@/lib/site";
import { NAV_ALL } from "@/lib/nav";
import { PROJECTS } from "@/lib/alvan-data";

const linkCls = "transition-colors hover:text-brass";

function Column({ title, children }) {
  return (
    <div>
      <p className="label-code text-graphite">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-bone/80">{children}</ul>
    </div>
  );
}

function SiteFooter({ cta = true }) {
  // Only real projects appear in the footer (template ones are flagged placeholder: true)
  const work = PROJECTS.filter((p) => !p.placeholder).slice(0, 4);
  const studio = NAV_ALL.filter((n) => ["Services", "Pricing", "Process", "About", "FAQ"].includes(n.label));

  return (
    <footer id="contact-cta" className="bg-ink px-5 pb-10 pt-24 sm:px-8 sm:pt-32">
      {cta && (
        <div className="mb-24 sm:mb-32">
          <Reveal className="text-center">
            <h2 className="type-h1 mx-auto max-w-4xl sm:text-7xl">
              Ready to build something that <span className="text-brass">sells</span>?
            </h2>
          </Reveal>
          <Reveal delay={140} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button to="/contact" icon="arrow">
              Start a project
            </Button>
            <Button variant="secondary" href={SITE.whatsappHref}>
              WhatsApp us
            </Button>
          </Reveal>
        </div>
      )}

      <div className="grid gap-14 border-t border-border pt-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Link to="/" aria-label={`${SITE.name} home`} className="inline-block text-lg">
            <Wordmark />
          </Link>
          <p className="mt-6 text-sm leading-relaxed text-bone/70">{SITE.tagline}</p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-bone/80">
            {SITE.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className={linkCls}>
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <Column title="Work">
          {work.map((p) => (
            <li key={p.slug}>
              <Link to={`/work/${p.slug}`} className={linkCls}>
                {p.name}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/work" className={linkCls}>
              All work
            </Link>
          </li>
        </Column>

        <Column title="Studio">
          {studio.map((n) => (
            <li key={n.to}>
              <Link to={n.to} className={linkCls}>
                {n.label}
              </Link>
            </li>
          ))}
        </Column>

        <Column title="Contact">
          <li>
            <Link to="/contact" className={linkCls}>
              Start a project
            </Link>
          </li>
          <li>
            <a href={`mailto:${SITE.email}`} className={linkCls}>
              {SITE.email}
            </a>
          </li>
          <li>
            <a href={SITE.phoneHref} className={linkCls}>
              {SITE.phone}
            </a>
          </li>
        </Column>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="label-code text-graphite">
          © {/* @__PURE__ */ new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
        <p className="label-code flex items-center gap-2.5 text-graphite">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          {SITE.city}
        </p>
      </div>
    </footer>
  );
}
export { SiteFooter };

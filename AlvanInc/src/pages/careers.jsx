import { useHead } from "@/lib/use-head";
import { SEO } from "@/lib/seo";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { Button } from "@/components/alvan/button";
import { PageHeader, Eyebrow, Tag } from "@/components/alvan/ui";
import { CAREERS } from "@/lib/alvan-data";
import { CareersForm } from "@/components/alvan/careers-form";
import { useState } from "react";
import { SITE } from "@/lib/site";

export default function Careers() {
  useHead(SEO["/careers"]);
  const [selectedRole, setSelectedRole] = useState("");
  return (
    <PageShell>
      <PageHeader
        eyebrow="Careers"
        title={
          <>
            Help us build sites that <span className="text-brass">sell</span>.
          </>
        }
        intro="We're a small studio in Nairobi. When we hire, we hire people who like shipping real work."
      />

      <section className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Eyebrow>Open roles</Eyebrow>
        </Reveal>

        {CAREERS.length === 0 ? (
          <Reveal delay={110} className="mt-12">
            <div className="max-w-2xl rounded-2xl border border-black/10 bg-bone p-8 sm:p-10">
              <h2 className="display-tight text-3xl">No open roles right now.</h2>
              <p className="mt-4 text-base leading-relaxed text-black/65">
                We're not hiring at the moment, but we'd still like to hear from you. Send a short
                note about what you do and we'll keep it on file.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent("Careers at AlvanInc")}`}
                  tone="light"
                >
                  Email us
                </Button>
                <Button href={SITE.whatsappHref} variant="secondary" tone="light">
                  WhatsApp
                </Button>
              </div>
            </div>
          </Reveal>
        ) : (
          <ul className="mt-12 border-t border-black/15">
            {CAREERS.map((role, i) => (
              <Reveal as="li" key={role.slug} delay={i * 80}>
                <div className="grid gap-6 border-b border-black/15 py-9 sm:py-11 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Tag>{role.type}</Tag>
                      <Tag>{role.location}</Tag>
                    </div>
                    <h2 className="type-h3 mt-5">{role.title}</h2>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-black/65">
                      {role.summary}
                    </p>
                  </div>
                  <div>
                    <Button
                      href="#apply"
                      tone="light"
                      icon="arrow"
                      onClick={() => setSelectedRole(role.title)}
                    >
                      Apply now
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      <section id="apply" className="surface-light px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Apply</Eyebrow>
            </Reveal>
            <Reveal delay={110} className="mt-8">
              <h2 className="type-h2">
                Tell us about <span className="text-brass">you</span>.
              </h2>
            </Reveal>
            <Reveal delay={180} className="mt-6">
              <p className="text-base leading-relaxed text-black/65">
                A degree is not required. Show us your work and tell us how you would bring
                customers to AlvanInc.
              </p>
            </Reveal>
            <ul className="mt-8 space-y-3 text-sm text-black/70">
              <li>· Real work over impressive titles</li>
              <li>· Comfortable with Canva and video editing</li>
              <li>· People who follow through</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-black/10 bg-bone-deep p-6 sm:p-10">
            <CareersForm selectedRole={selectedRole} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
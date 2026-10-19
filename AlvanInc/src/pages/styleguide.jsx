import { useHead } from "@/lib/use-head";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { CountUp, Words } from "@/components/alvan/motion";
import { Button } from "@/components/alvan/button";
import { AccordionItem } from "@/components/alvan/accordion";
import { Testimonials } from "@/components/alvan/testimonials";
import { HairlineGrid } from "@/components/alvan/hairline";
import { LINE_ART_NAMES, LineArt } from "@/components/alvan/line-art";
import { Eyebrow, Tag } from "@/components/alvan/ui";

/** DEV-ONLY visual reference for the design system (route is not registered in production). */
const SWATCHES = [
  ["ink", "var(--ink)", "text-bone"],
  ["ink-soft", "var(--ink-soft)", "text-bone"],
  ["bone", "var(--bone)", "text-black"],
  ["bone-deep", "var(--bone-deep)", "text-black"],
  ["graphite", "var(--graphite)", "text-black"],
  ["brass", "var(--brass)", "text-ink"],
];

const TYPE = [
  ["type-hero", "Built to be trusted."],
  ["type-h1", "Page headline"],
  ["type-h2", "Section headline"],
  ["type-h3", "Card headline"],
  ["type-lead", "Lead paragraph: a sentence that frames the section before the detail."],
  ["type-body", "Body copy: calm, readable, 1.7 line height for long reading."],
];

function Block({ title, children }) {
  return (
    <div className="mt-20 first:mt-0">
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function ButtonRow({ tone }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button tone={tone} icon="arrow">Start a project</Button>
      <Button variant="secondary" tone={tone}>Explore our work</Button>
      <Button tone={tone} icon="up-right" href="https://example.com">External</Button>
      <Button variant="brass" tone={tone}>Always brass</Button>
      <a href="#top" className="link-underline">
        Text link <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

function Cell({ label, children, tone }) {
  return (
    <div className="p-8">
      <p className={`label-code ${tone === "light" ? "text-black/50" : "text-graphite"}`}>{label}</p>
      <p className="type-h3 mt-6">{children}</p>
    </div>
  );
}

export default function Styleguide() {
  useHead({ title: "Styleguide — AlvanInc (dev only)" });
  return (
    <PageShell cta={false}>
      <section className="px-5 pb-24 pt-36 sm:px-8 sm:pt-44">
        <Eyebrow>Design system · dev only</Eyebrow>
        <h1 className="type-h1 mt-8 max-w-4xl">
          <Words text="One system, *two* surfaces." start={100} step={70} />
        </h1>
        <p className="type-lead mt-8 max-w-xl text-graphite">
          Every primitive below is used by the real pages. If something looks wrong here, it is
          wrong everywhere.
        </p>

        <div className="mt-20">
          <Block title="Colour tokens">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
              {SWATCHES.map(([name, bg, fg]) => (
                <div
                  key={name}
                  className={`flex aspect-square flex-col justify-end rounded-2xl border border-white/10 p-4 ${fg}`}
                  style={{ backgroundColor: bg }}
                >
                  <span className="label-code">{name}</span>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Type scale">
            <div className="space-y-8">
              {TYPE.map(([cls, sample]) => (
                <div key={cls} className="grid gap-3 border-t border-border pt-6 lg:grid-cols-[10rem_1fr]">
                  <span className="label-code text-graphite">{cls}</span>
                  <p className={cls}>{sample}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Eyebrows">
            <div className="flex flex-col gap-5">
              <Eyebrow>Our company</Eyebrow>
              <Eyebrow index="01">Capabilities</Eyebrow>
              <Eyebrow rule={false}>No rule variant</Eyebrow>
            </div>
          </Block>

          <Block title="Buttons · on dark">
            <ButtonRow tone="dark" />
          </Block>
        </div>
      </section>

      <section className="surface-light px-5 py-24 sm:px-8">
        <Block title="Buttons · on bone">
          <ButtonRow tone="light" />
        </Block>

        <Block title="Tags">
          <div className="flex flex-wrap gap-2">
            <Tag>Branding</Tag>
            <Tag>Web design</Tag>
            <Tag>Photography</Tag>
          </div>
        </Block>

        <Block title="Hairline grid · bone">
          <HairlineGrid tone="light" className="md:grid-cols-3">
            <Cell tone="light" label="01 / Discover">Listen first.</Cell>
            <Cell tone="light" label="02 / Design">Shape the idea.</Cell>
            <Cell tone="light" label="03 / Build">Ship it properly.</Cell>
          </HairlineGrid>
        </Block>

        <Block title="Line art · on bone">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {LINE_ART_NAMES.map((n) => (
              <div key={n} className="flex flex-col items-start gap-3 text-black">
                <LineArt name={n} />
                <span className="label-code text-black/50">{n}</span>
              </div>
            ))}
          </div>
        </Block>
      </section>

      <section className="bg-ink px-5 py-24 sm:px-8">
        <Block title="Hairline grid · dark">
          <HairlineGrid tone="dark" className="md:grid-cols-3">
            <Cell label="01 / Listen">We start with your goals.</Cell>
            <Cell label="02 / Align">Scope and timeline, agreed.</Cell>
            <Cell label="03 / Grow">Launch with a full handoff.</Cell>
          </HairlineGrid>
        </Block>

        <Block title="Line art · on dark">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {LINE_ART_NAMES.map((n) => (
              <div key={n} className="flex flex-col items-start gap-3 text-bone">
                <LineArt name={n} />
                <span className="label-code text-graphite">{n}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Accordion · dark">
          <div className="max-w-2xl border-t border-border">
            <AccordionItem tone="dark" defaultOpen q="Sample question one?" a="Sample answer for layout review only." />
            <AccordionItem tone="dark" q="Sample question two?" a="Another sample answer, hidden until opened." />
          </div>
        </Block>

        <Block title="Accordion · bone">
          <div className="surface-light -mx-5 rounded-2xl px-6 sm:-mx-8 sm:px-10">
            <AccordionItem q="Sample question on bone?" a="Sample answer for layout review only." />
          </div>
        </Block>

        <Block title="Testimonials (SAMPLE data, not real clients)">
          <div className="-mx-5 sm:-mx-8">
            <Testimonials
              items={[
                { text: "SAMPLE quote for layout review only.", name: "Sample Name", role: "Role, Company" },
                { text: "A second SAMPLE quote, to show the rotation controls.", name: "Sample Name Two", role: "Role, Company" },
              ]}
            />
          </div>
        </Block>

        <Block title="Motion primitives">
          <div className="grid gap-10 md:grid-cols-3">
            <Reveal>
              <p className="label-code text-graphite">Reveal</p>
              <p className="type-h3 mt-4">Fades up on scroll.</p>
            </Reveal>
            <div>
              <p className="label-code text-graphite">Words</p>
              <p className="type-h3 mt-4">
                <Words text="Word by *word*." />
              </p>
            </div>
            <div>
              <p className="label-code text-graphite">CountUp</p>
              <p className="type-h1 mt-4">
                <CountUp value="+41%" />
              </p>
            </div>
          </div>
        </Block>
      </section>
    </PageShell>
  );
}

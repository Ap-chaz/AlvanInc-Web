import { useHead } from "@/lib/use-head";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { AccordionItem } from "@/components/alvan/accordion";
import { PageHeader, Eyebrow } from "@/components/alvan/ui";
import { FAQ_GROUPS } from "@/lib/alvan-data";
const title = "FAQ — scope, timelines, and ownership | AlvanInc";
const description =
  "Direct answers on extra pages, payment plans, revisions, platforms, and who owns the finished website when a AlvanInc project ships.";
export default function Faq() {
  useHead({ title, description });
  return (
    <PageShell>
      <PageHeader
        eyebrow="FAQ"
        title="The questions that come up before every project"
        intro="If yours isn't here, email or WhatsApp the studio directly — we answer within one business day."
      />

      <section className="surface-light px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="space-y-20">
          {FAQ_GROUPS.map((g) => (
            <div key={g.group} className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
              <Reveal>
                <Eyebrow>{g.group}</Eyebrow>
              </Reveal>
              <Reveal delay={110}>
                <div className="border-t border-black/10">
                  {g.items.map((it) => (
                    <AccordionItem key={it.q} q={it.q} a={it.a} />
                  ))}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

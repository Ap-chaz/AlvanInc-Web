import { useApi } from "@/lib/use-api";
import { useHead } from "@/lib/use-head";
import { SEO } from "@/lib/seo";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { AccordionItem } from "@/components/alvan/accordion";
import { PageHeader, Eyebrow } from "@/components/alvan/ui";
import { FAQ_GROUPS } from "@/lib/alvan-data";
export default function Faq() {
  useHead(SEO["/faq"]);
  const { data: groups } = useApi("/api/faq", (json) => json.groups, FAQ_GROUPS);
  return (
    <PageShell>
      <PageHeader
        eyebrow="FAQ"
        title="The questions that come up before every project"
        intro="If yours isn't here, email or WhatsApp the studio directly — we answer within one business day."
      />

      <section className="surface-light px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="space-y-20">
          {groups.map((g) => (
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

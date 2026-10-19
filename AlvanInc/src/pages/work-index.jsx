import { useHead } from "@/lib/use-head";
import { SEO } from "@/lib/seo";
import { useState } from "react";
import { PageShell } from "@/components/alvan/page-shell";
import { PageHeader, ProjectCard } from "@/components/alvan/ui";
import { CATEGORIES, PROJECTS } from "@/lib/alvan-data";

// Template projects (placeholder: true) stay hidden until replaced with real work.
const SHOW_PLACEHOLDERS = false;
const visible = PROJECTS.filter((p) => SHOW_PLACEHOLDERS || !p.placeholder);
const categories = CATEGORIES.filter((c) => c === "All" || visible.some((p) => p.category === c));

export default function WorkIndex() {
  useHead(SEO["/work"]);
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? visible : visible.filter((p) => p.category === filter);
  return (
    <PageShell>
      <PageHeader
        eyebrow="Work"
        title="Selected work"
        intro={
          <>
            Every project below is live. Pick one to read the story behind it, what we{" "}
            <span className="text-brass">built</span> and why.
          </>
        }
      />

      <section className="surface-light px-5 pb-28 sm:px-8 sm:pb-36">
        <div
          role="group"
          aria-label="Filter projects by type"
          className="flex flex-wrap gap-2 border-b border-black/10 pb-10"
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={`label-display rounded-full border px-4 py-2.5 transition-colors ${filter === c ? "border-transparent bg-ink text-bone" : "border-black/15 text-black/65 hover:border-black/40 hover:text-black"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-24">
          {shown.map((p, i) => (
            <ProjectCard key={p.slug} project={p} delay={(i % 2) * 120} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}

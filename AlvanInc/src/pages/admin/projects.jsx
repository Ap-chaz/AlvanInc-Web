import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, Eye, ExternalLink, FolderKanban, Pencil, Plus, Trash2, X } from "lucide-react";
import { api, loadProjects, nextOrder, reorder, slugify } from "@/lib/admin";
import { Button } from "@/components/alvan/button";
import { useAdmin, useResource } from "@/components/admin/admin-context";
import {
  Badge,
  Card,
  ConfirmDialog,
  Drawer,
  EmptyState,
  ErrorState,
  IconButton,
  ListSkeleton,
  MoveButtons,
  PageHeading,
  SelectField,
  Spinner,
  Tabs,
  TagInput,
  TextField,
} from "@/components/admin/ui";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_STEPS = 10;

const payloadFor = (p, sort_order) => ({
  slug: p.slug,
  name: p.name,
  category_id: p.categoryId,
  summary: p.summary,
  brief: p.brief,
  live_url: p.liveUrl || null,
  tags: p.tags,
  approach: p.approach.map(({ title, body }) => ({ title, body })),
  sort_order,
});

function FormSection({ title, children }) {
  return (
    <section className="space-y-6 border-t border-white/10 pt-8 first:border-t-0 first:pt-0">
      <h3 className="label-mono text-brass">{title}</h3>
      {children}
    </section>
  );
}

/** Repeating "title + body" steps for the case study's approach section. */
function ApproachEditor({ steps, onChange, error }) {
  const set = (i, patch) => onChange(steps.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const move = (i, dir) => {
    const to = i + dir;
    if (to < 0 || to >= steps.length) return;
    const next = [...steps];
    [next[i], next[to]] = [next[to], next[i]];
    onChange(next);
  };
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="label-mono text-graphite">Approach steps</span>
        <span className="text-[0.6875rem] tabular-nums text-graphite">
          {steps.length}/{MAX_STEPS}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-graphite">
        How you tackled the project, one step at a time. Shown on the case study page.
      </p>
      <ol className="mt-4 space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="rounded-2xl border border-white/10 bg-ink p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="label-code text-graphite">Step {String(i + 1).padStart(2, "0")}</span>
              <div className="flex items-center gap-1.5">
                <IconButton label="Move step up" className="size-8" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                </IconButton>
                <IconButton
                  label="Move step down"
                  className="size-8"
                  disabled={i === steps.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown className="size-3.5" aria-hidden="true" />
                </IconButton>
                <IconButton
                  label="Remove step"
                  tone="danger"
                  className="size-8"
                  onClick={() => onChange(steps.filter((_, j) => j !== i))}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </IconButton>
              </div>
            </div>
            <div className="space-y-4">
              <TextField
                label="Title"
                value={s.title}
                onChange={(v) => set(i, { title: v })}
                max={200}
                placeholder="e.g. Mapped the buying journey"
              />
              <TextField label="Details" value={s.body} onChange={(v) => set(i, { body: v })} max={2000} multiline rows={3} />
            </div>
          </li>
        ))}
      </ol>
      {error ? (
        <p role="alert" className="mt-3 text-xs text-red-300">
          {error}
        </p>
      ) : null}
      <Button
        variant="secondary"
        size="sm"
        className="mt-4 disabled:pointer-events-none disabled:opacity-40"
        disabled={steps.length >= MAX_STEPS}
        onClick={() => onChange([...steps, { title: "", body: "" }])}
      >
        <Plus className="size-3.5" aria-hidden="true" /> Add step
      </Button>
    </div>
  );
}

function Editor({ item, items, categories, onClose, onSaved }) {
  const { act } = useAdmin();
  const formId = useId();
  const [v, setV] = useState(() => ({
    name: item?.name ?? "",
    slug: item?.slug ?? "",
    categoryId: String(item?.categoryId ?? categories[0]?.id ?? ""),
    summary: item?.summary ?? "",
    brief: item?.brief ?? "",
    liveUrl: item?.liveUrl ?? "",
    tags: item?.tags ?? [],
    approach: item?.approach?.map((a) => ({ ...a })) ?? [],
  }));
  const [slugTouched, setSlugTouched] = useState(Boolean(item));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (key) => (value) => setV((s) => ({ ...s, [key]: value }));

  const onName = (name) =>
    setV((s) => ({ ...s, name, slug: slugTouched ? s.slug : slugify(name) }));
  const onSlug = (raw) => {
    setSlugTouched(true);
    set("slug")(raw.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const submit = async (e) => {
    e.preventDefault();
    const name = v.name.trim();
    const slug = v.slug.trim();
    const summary = v.summary.trim();
    const brief = v.brief.trim();
    const liveUrl = v.liveUrl.trim();
    const approach = v.approach.map((a) => ({ title: a.title.trim(), body: a.body.trim() }));

    const next = {};
    if (!name) next.name = "Name is required.";
    else if (name.length > 150) next.name = "Keep the name under 150 characters.";
    if (!slug) next.slug = "A web address is required.";
    else if (!SLUG.test(slug)) next.slug = "Use lowercase letters, numbers and single hyphens, like my-project.";
    else if (slug.length > 100) next.slug = "Keep the web address under 100 characters.";
    if (!v.categoryId) next.category = "Pick a category.";
    if (!summary) next.summary = "A short summary is required.";
    else if (summary.length > 400) next.summary = "Keep the summary under 400 characters.";
    if (!brief) next.brief = "The brief is required.";
    else if (brief.length > 5000) next.brief = "Keep the brief under 5000 characters.";
    if (liveUrl && (!/^https?:\/\//i.test(liveUrl) || liveUrl.length > 300)) {
      next.liveUrl = "Start with https:// (or http://), up to 300 characters. Leave empty if there's no live site.";
    }
    if (approach.some((a) => !a.title || !a.body)) next.approach = "Every step needs a title and details. Fill them in or remove the step.";
    else if (approach.some((a) => a.title.length > 200 || a.body.length > 2000)) {
      next.approach = "A step title is limited to 200 characters and its details to 2000.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    const body = payloadFor(
      { slug, name, categoryId: Number(v.categoryId), summary, brief, liveUrl, tags: v.tags, approach },
      item ? item.sort_order : nextOrder(items),
    );
    setSaving(true);
    const ok = await act(
      () => (item ? api.projects.update(item.id, body) : api.projects.create(body)),
      item ? "Project saved" : "Project added",
    );
    setSaving(false);
    if (ok) onSaved();
  };

  const noCategories = categories.length === 0;

  return (
    <Drawer
      open
      onClose={onClose}
      eyebrow={item ? "Edit project" : "New project"}
      title={item ? item.name : "Add a project"}
      width="max-w-3xl"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="brass" size="sm" disabled={saving || noCategories}>
            {saving ? <Spinner className="size-3.5" /> : null}
            {item ? "Save changes" : "Add project"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="space-y-10">
        <FormSection title="Basics">
          <TextField label="Name" value={v.name} onChange={onName} max={150} error={errors.name} placeholder="Project name" />
          <TextField
            label="Web address"
            value={v.slug}
            onChange={onSlug}
            max={100}
            error={errors.slug}
            placeholder="project-name"
            hint={
              item
                ? `Shown as /work/${v.slug || "…"}. Changing it breaks links people already have to this project.`
                : `Shown as /work/${v.slug || "…"}. Made from the name until you edit it.`
            }
          />
          {noCategories ? (
            <div className="rounded-xl border border-brass/40 bg-brass/10 p-4 text-sm leading-relaxed text-bone">
              Projects need a category.{" "}
              <Link to="/admin/categories" className="underline decoration-brass underline-offset-4 hover:text-brass">
                Add one first
              </Link>
              , then come back.
            </div>
          ) : (
            <SelectField label="Category" value={v.categoryId} onChange={set("categoryId")} error={errors.category}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </SelectField>
          )}
          <TextField
            label="Live site"
            value={v.liveUrl}
            onChange={set("liveUrl")}
            error={errors.liveUrl}
            placeholder="https://example.com"
            inputMode="url"
            hint="Optional. Adds a “View site” link to the project."
          />
        </FormSection>

        <FormSection title="Story">
          <TextField
            label="Summary"
            value={v.summary}
            onChange={set("summary")}
            max={400}
            multiline
            rows={3}
            error={errors.summary}
            hint="The short line on the project card."
          />
          <TextField
            label="Brief"
            value={v.brief}
            onChange={set("brief")}
            max={5000}
            multiline
            rows={8}
            error={errors.brief}
            hint="The full description at the top of the case study."
          />
          <TagInput
            label="Tags"
            tags={v.tags}
            onChange={set("tags")}
            max={10}
            tagMax={60}
            placeholder="Type a tag, press Enter"
            hint="Up to 10. Things like Shopify, M-Pesa, Branding."
            error={errors.tags}
          />
        </FormSection>

        <FormSection title="Approach">
          <ApproachEditor steps={v.approach} onChange={set("approach")} error={errors.approach} />
        </FormSection>
      </form>
    </Drawer>
  );
}

export default function Projects() {
  const { act } = useAdmin();
  const { status, data, error, reload, retry } = useResource(loadProjects);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const projects = data?.projects ?? [];
  const categories = data?.categories ?? [];
  const visible = filter === "all" ? projects : projects.filter((p) => String(p.categoryId) === filter);

  const move = async (index, dir) => {
    const changes = reorder(projects, index, dir);
    if (!changes.length) return;
    setBusy(true);
    await act(async () => {
      for (const { item, sort_order } of changes) await api.projects.update(item.id, payloadFor(item, sort_order));
    });
    await reload();
    setBusy(false);
  };

  const confirmDelete = async () => {
    setBusy(true);
    const ok = await act(() => api.projects.remove(toDelete.id), "Project deleted");
    if (ok) {
      setToDelete(null);
      await reload();
    }
    setBusy(false);
  };

  return (
    <div className="space-y-8">
      <PageHeading
        eyebrow="Website content"
        title="Projects"
        description="Your portfolio. Each project has its own case study page on the website."
        actions={
          <Button variant="primary" size="sm" onClick={() => setEditing({ item: null })} disabled={status !== "ready"}>
            <Plus className="size-3.5" aria-hidden="true" /> Add project
          </Button>
        }
      />

      {status === "loading" ? <ListSkeleton rows={3} /> : null}
      {status === "error" ? <ErrorState title="Couldn't load projects" message={error} onRetry={retry} /> : null}

      {status === "ready" && projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          action={
            <Button variant="primary" size="sm" onClick={() => setEditing({ item: null })}>
              <Plus className="size-3.5" aria-hidden="true" /> Add the first project
            </Button>
          }
        >
          {categories.length === 0
            ? "Start by adding a category, then add your first project."
            : "Add a project and it appears on the Work page straight away."}
        </EmptyState>
      ) : null}

      {status === "ready" && projects.length > 0 ? (
        <>
          {categories.length > 1 ? (
            <div className="space-y-3">
              <Tabs
                label="Filter by category"
                value={filter}
                onChange={setFilter}
                items={[
                  { value: "all", label: "All", count: projects.length },
                  ...categories.map((c) => ({
                    value: String(c.id),
                    label: c.name,
                    count: projects.filter((p) => p.categoryId === c.id).length,
                  })),
                ]}
              />
              {filter !== "all" ? (
                <p className="text-xs text-graphite">Show “All” to change the order of projects.</p>
              ) : null}
            </div>
          ) : null}

          {visible.length === 0 ? (
            <Card className="px-6 py-12 text-center text-sm text-graphite">No projects in this category yet.</Card>
          ) : null}

          <ul className="grid gap-4 lg:grid-cols-2">
            {visible.map((p) => {
              const index = projects.indexOf(p);
              return (
                <li key={p.id}>
                  <Card className="flex h-full flex-col p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <span className="label-code text-graphite">{p.category}</span>
                      <span className="label-code text-graphite">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h2 className="display-tight mt-5 break-words text-3xl">{p.name}</h2>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-graphite">{p.summary}</p>
                    {p.tags.length ? (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {p.tags.slice(0, 5).map((t) => (
                          <li key={t}>
                            <Badge>{t}</Badge>
                          </li>
                        ))}
                        {p.tags.length > 5 ? (
                          <li>
                            <Badge>+{p.tags.length - 5}</Badge>
                          </li>
                        ) : null}
                      </ul>
                    ) : null}
                    <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-graphite">
                      <span>{p.approach.length === 1 ? "1 approach step" : `${p.approach.length} approach steps`}</span>
                      {p.liveUrl ? (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-bone underline decoration-white/20 underline-offset-4 transition-colors hover:text-brass hover:decoration-brass"
                        >
                          <ExternalLink className="size-3" aria-hidden="true" />
                          {p.liveUrl.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
                        </a>
                      ) : (
                        <span>No live site</span>
                      )}
                    </p>
                    <div className="mt-auto pt-8">
                      <div className="flex items-center justify-between gap-1.5 border-t border-white/10 pt-5">
                        <div className="flex items-center gap-1.5">
                          <MoveButtons
                            index={index}
                            count={projects.length}
                            onMove={move}
                            disabled={busy || filter !== "all"}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <IconButton label={`View ${p.name} on the site`} href={`/work/${p.slug}`}>
                            <Eye className="size-4" aria-hidden="true" />
                          </IconButton>
                          <IconButton label={`Edit ${p.name}`} onClick={() => setEditing({ item: p })}>
                            <Pencil className="size-4" aria-hidden="true" />
                          </IconButton>
                          <IconButton label={`Delete ${p.name}`} tone="danger" onClick={() => setToDelete(p)}>
                            <Trash2 className="size-4" aria-hidden="true" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      {editing ? (
        <Editor
          key={editing.item?.id ?? "new"}
          item={editing.item}
          items={projects}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this project?"
        confirmLabel="Delete project"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        <span className="text-bone">{toDelete?.name}</span> and its case study page are removed from the website. This
        can't be undone.
      </ConfirmDialog>
    </div>
  );
}

import { useId, useState } from "react";
import { ListOrdered, Pencil, Plus, Tags, Trash2, Wrench } from "lucide-react";
import {
  api,
  loadCategories,
  loadProcess,
  loadServices,
  nextOrder,
  reorder,
} from "@/lib/admin";
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
  Spinner,
  TextField,
} from "@/components/admin/ui";

/**
 * Services, process steps and categories are the same screen with different fields, so one
 * component renders all three from a config. Field `max` values mirror the backend's limits.
 */
const SERVICES = {
  noun: "service",
  icon: Wrench,
  title: "Services",
  description: "What you offer. These appear on the Services page and the home page, in this order.",
  load: loadServices,
  api: api.services,
  fields: [
    { key: "name", label: "Name", max: 100, placeholder: "Storefront" },
    { key: "tier", label: "Tier", max: 60, placeholder: "Studio", hint: "A short label shown beside the name." },
    { key: "body", label: "Description", max: 5000, multiline: true, rows: 6 },
  ],
};

const PROCESS = {
  noun: "process step",
  icon: ListOrdered,
  title: "Process",
  description: "The steps of how you work with a client. Shown on the home page and the Process page.",
  load: loadProcess,
  api: api.process,
  numbered: true,
  fields: [
    { key: "name", label: "Step name", max: 100, placeholder: "Discover" },
    { key: "duration", label: "Duration", max: 60, placeholder: "Weeks 2–3" },
    { key: "body", label: "Description", max: 5000, multiline: true, rows: 6 },
  ],
};

const CATEGORIES = {
  noun: "category",
  icon: Tags,
  title: "Categories",
  description: "Groups for your projects. A category can't be deleted while a project still uses it.",
  load: loadCategories,
  api: api.categories,
  fields: [{ key: "name", label: "Name", max: 100, placeholder: "E-commerce" }],
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** The body the API wants for a row: its text fields plus its position. */
const payloadFor = (config, item, sort_order) => ({
  ...Object.fromEntries(config.fields.map((f) => [f.key, item[f.key]])),
  sort_order,
});

function Editor({ config, item, items, onClose, onSaved }) {
  const { act } = useAdmin();
  const formId = useId();
  const [values, setValues] = useState(() =>
    Object.fromEntries(config.fields.map((f) => [f.key, item?.[f.key] ?? ""])),
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    const clean = {};
    for (const f of config.fields) {
      const v = values[f.key].trim();
      clean[f.key] = v;
      if (!v) next[f.key] = `${f.label} is required.`;
      else if (v.length > f.max) next[f.key] = `Keep ${f.label.toLowerCase()} under ${f.max} characters.`;
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    const body = { ...clean, sort_order: item ? item.sort_order : nextOrder(items) };
    setSaving(true);
    const ok = await act(
      () => (item ? config.api.update(item.id, body) : config.api.create(body)),
      item ? `${cap(config.noun)} saved` : `${cap(config.noun)} added`,
    );
    setSaving(false);
    if (ok) onSaved();
  };

  return (
    <Drawer
      open
      onClose={onClose}
      eyebrow={item ? "Edit" : "New"}
      title={item ? item[config.fields[0].key] : `Add a ${config.noun}`}
      width="max-w-xl"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="brass" size="sm" disabled={saving}>
            {saving ? <Spinner className="size-3.5" /> : null}
            {item ? "Save changes" : `Add ${config.noun}`}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="space-y-6">
        {config.fields.map((f) => (
          <TextField
            key={f.key}
            label={f.label}
            value={values[f.key]}
            onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))}
            max={f.max}
            hint={f.hint}
            error={errors[f.key]}
            multiline={f.multiline}
            rows={f.rows}
            placeholder={f.placeholder}
          />
        ))}
      </form>
    </Drawer>
  );
}

function SimpleResource({ config }) {
  const { act } = useAdmin();
  const { status, data, error, reload, retry } = useResource(config.load);
  const [editing, setEditing] = useState(null); // { item } — item is null for "new"
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const items = data ?? [];
  const [titleField, ...rest] = config.fields;
  const metaField = rest.find((f) => !f.multiline);
  const bodyField = rest.find((f) => f.multiline);
  const Icon = config.icon;

  const move = async (index, dir) => {
    const changes = reorder(items, index, dir);
    if (!changes.length) return;
    setBusy(true);
    await act(async () => {
      for (const { item, sort_order } of changes) {
        await config.api.update(item.id, payloadFor(config, item, sort_order));
      }
    });
    await reload();
    setBusy(false);
  };

  const confirmDelete = async () => {
    setBusy(true);
    const ok = await act(() => config.api.remove(toDelete.id), `${cap(config.noun)} deleted`);
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
        title={config.title}
        description={config.description}
        actions={
          <Button variant="primary" size="sm" onClick={() => setEditing({ item: null })} disabled={status !== "ready"}>
            <Plus className="size-3.5" aria-hidden="true" /> Add {config.noun}
          </Button>
        }
      />

      {status === "loading" ? <ListSkeleton rows={3} /> : null}
      {status === "error" ? (
        <ErrorState title={`Couldn't load ${config.title.toLowerCase()}`} message={error} onRetry={retry} />
      ) : null}

      {status === "ready" && items.length === 0 ? (
        <EmptyState
          icon={Icon}
          title={`No ${config.title.toLowerCase()} yet`}
          action={
            <Button variant="primary" size="sm" onClick={() => setEditing({ item: null })}>
              <Plus className="size-3.5" aria-hidden="true" /> Add the first {config.noun}
            </Button>
          }
        >
          Add one and it appears on the website straight away.
        </EmptyState>
      ) : null}

      {status === "ready" && items.length > 0 ? (
        <Card>
          <ul className="divide-y divide-white/10">
            {items.map((item, i) => (
              <li key={item.id} className="flex items-start gap-4 p-5 sm:gap-6 sm:p-6">
                <span className="label-code mt-1.5 w-7 shrink-0 text-graphite">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h2 className="display-tight break-words text-2xl">{item[titleField.key]}</h2>
                    {metaField && item[metaField.key] ? <Badge tone="brass">{item[metaField.key]}</Badge> : null}
                  </div>
                  {bodyField ? (
                    <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-graphite">
                      {item[bodyField.key]}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                  <MoveButtons index={i} count={items.length} onMove={move} disabled={busy} />
                  <IconButton label={`Edit ${item[titleField.key]}`} onClick={() => setEditing({ item })}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </IconButton>
                  <IconButton label={`Delete ${item[titleField.key]}`} tone="danger" onClick={() => setToDelete(item)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {editing ? (
        <Editor
          key={editing.item?.id ?? "new"}
          config={config}
          item={editing.item}
          items={items}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete this ${config.noun}?`}
        confirmLabel={`Delete ${config.noun}`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        <span className="text-bone">{toDelete?.[titleField.key]}</span> is removed from the database and from the
        website. This can't be undone.
      </ConfirmDialog>
    </div>
  );
}

export const ServicesPage = () => <SimpleResource config={SERVICES} />;
export const ProcessPage = () => <SimpleResource config={PROCESS} />;
export const CategoriesPage = () => <SimpleResource config={CATEGORIES} />;

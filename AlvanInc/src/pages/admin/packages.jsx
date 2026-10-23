import { useId, useState } from "react";
import { Check, Package, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, loadPackages, nextOrder, reorder } from "@/lib/admin";
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
  StringListEditor,
  TextField,
  Toggle,
} from "@/components/admin/ui";

const MAX_FEATURES = 20;

/** The body the API wants: the page's `price` / `priceNote` are the API's price_label / price_note. */
const payloadFor = (p, sort_order) => ({
  name: p.name,
  price_label: p.price,
  price_note: p.priceNote ?? "",
  pitch: p.pitch,
  featured: Boolean(p.featured),
  features: p.features,
  sort_order,
});

function Editor({ item, items, onClose, onSaved }) {
  const { act } = useAdmin();
  const formId = useId();
  const [v, setV] = useState(() => ({
    name: item?.name ?? "",
    price: item?.price ?? "",
    priceNote: item?.priceNote ?? "",
    pitch: item?.pitch ?? "",
    featured: item?.featured ?? false,
    features: item?.features?.length ? item.features : [""],
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (key) => (value) => setV((s) => ({ ...s, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const features = v.features.map((f) => f.trim());
    const next = {};
    if (!v.name.trim()) next.name = "Name is required.";
    else if (v.name.trim().length > 100) next.name = "Keep the name under 100 characters.";
    if (!v.price.trim()) next.price = "Price is required.";
    else if (v.price.trim().length > 60) next.price = "Keep the price under 60 characters.";
    if (v.priceNote.trim().length > 60) next.priceNote = "Keep the note under 60 characters.";
    if (!v.pitch.trim()) next.pitch = "A one-line pitch is required.";
    else if (v.pitch.trim().length > 300) next.pitch = "Keep the pitch under 300 characters.";
    if (features.length === 0) next.features = "Add at least one feature.";
    else if (features.some((f) => !f)) next.features = "Fill in or remove the empty feature.";
    else if (features.some((f) => f.length > 200)) next.features = "Keep each feature under 200 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const body = payloadFor(
      { ...v, name: v.name.trim(), price: v.price.trim(), priceNote: v.priceNote.trim(), pitch: v.pitch.trim(), features },
      item ? item.sort_order : nextOrder(items),
    );
    setSaving(true);
    const ok = await act(
      () => (item ? api.packages.update(item.id, body) : api.packages.create(body)),
      item ? "Package saved" : "Package added",
    );
    setSaving(false);
    if (ok) onSaved();
  };

  return (
    <Drawer
      open
      onClose={onClose}
      eyebrow={item ? "Edit package" : "New package"}
      title={item ? item.name : "Add a package"}
      width="max-w-xl"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="brass" size="sm" disabled={saving}>
            {saving ? <Spinner className="size-3.5" /> : null}
            {item ? "Save changes" : "Add package"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="space-y-6">
        <TextField label="Name" value={v.name} onChange={set("name")} max={100} error={errors.name} placeholder="Launch" />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Price"
            value={v.price}
            onChange={set("price")}
            max={60}
            error={errors.price}
            placeholder="KES 45,000"
          />
          <TextField
            label="Price note"
            value={v.priceNote}
            onChange={set("priceNote")}
            max={60}
            error={errors.priceNote}
            placeholder="starting"
            hint="Optional. Small text beside the price."
          />
        </div>
        <TextField
          label="Pitch"
          value={v.pitch}
          onChange={set("pitch")}
          max={300}
          multiline
          rows={3}
          error={errors.pitch}
          hint="One or two sentences on who this package is for."
        />
        <Toggle
          checked={v.featured}
          onChange={set("featured")}
          label="Featured"
          hint="Highlights this package on the pricing section."
        />
        <StringListEditor
          label="Features"
          items={v.features}
          onChange={set("features")}
          max={MAX_FEATURES}
          itemMax={200}
          addLabel="Add feature"
          placeholder="e.g. Five custom pages"
          error={errors.features}
        />
      </form>
    </Drawer>
  );
}

export default function Packages() {
  const { act } = useAdmin();
  const { status, data, error, reload, retry } = useResource(loadPackages);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const items = data ?? [];

  const move = async (index, dir) => {
    const changes = reorder(items, index, dir);
    if (!changes.length) return;
    setBusy(true);
    await act(async () => {
      for (const { item, sort_order } of changes) await api.packages.update(item.id, payloadFor(item, sort_order));
    });
    await reload();
    setBusy(false);
  };

  const confirmDelete = async () => {
    setBusy(true);
    const ok = await act(() => api.packages.remove(toDelete.id), "Package deleted");
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
        title="Packages"
        description="The pricing tiers on the Pricing page and the home page, in this order."
        actions={
          <Button variant="primary" size="sm" onClick={() => setEditing({ item: null })} disabled={status !== "ready"}>
            <Plus className="size-3.5" aria-hidden="true" /> Add package
          </Button>
        }
      />

      {status === "loading" ? <ListSkeleton rows={2} /> : null}
      {status === "error" ? <ErrorState title="Couldn't load packages" message={error} onRetry={retry} /> : null}

      {status === "ready" && items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No packages yet"
          action={
            <Button variant="primary" size="sm" onClick={() => setEditing({ item: null })}>
              <Plus className="size-3.5" aria-hidden="true" /> Add the first package
            </Button>
          }
        >
          Packages are the pricing tiers visitors compare before they get in touch.
        </EmptyState>
      ) : null}

      {status === "ready" && items.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p, i) => (
            <li key={p.id}>
              <Card className={cn("flex h-full flex-col p-6 sm:p-7", p.featured && "border-brass/50")}>
                <div className="flex items-center justify-between gap-3">
                  <span className="label-code text-graphite">{String(i + 1).padStart(2, "0")}</span>
                  {p.featured ? (
                    <Badge tone="brass" className="inline-flex items-center gap-1.5">
                      <Star className="size-3" aria-hidden="true" /> Featured
                    </Badge>
                  ) : null}
                </div>
                <h2 className="display-tight mt-5 break-words text-3xl">{p.name}</h2>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                  <span className="display-tight text-2xl text-brass">{p.price}</span>
                  {p.priceNote ? <span className="text-xs text-graphite">{p.priceNote}</span> : null}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-graphite">{p.pitch}</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.slice(0, 5).map((f, fi) => (
                    <li key={fi} className="flex gap-3 text-bone">
                      <Check className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {p.features.length > 5 ? (
                  <p className="mt-3 text-xs text-graphite">+ {p.features.length - 5} more</p>
                ) : null}
                <div className="mt-auto pt-8">
                  <div className="flex items-center justify-between gap-1.5 border-t border-white/10 pt-5">
                    <div className="flex items-center gap-1.5">
                      <MoveButtons index={i} count={items.length} onMove={move} disabled={busy} />
                    </div>
                    <div className="flex items-center gap-1.5">
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
          ))}
        </ul>
      ) : null}

      {editing ? (
        <Editor
          key={editing.item?.id ?? "new"}
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
        title="Delete this package?"
        confirmLabel="Delete package"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        <span className="text-bone">{toDelete?.name}</span> and its features are removed from the pricing section.
        This can't be undone.
      </ConfirmDialog>
    </div>
  );
}

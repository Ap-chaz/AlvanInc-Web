import { useId, useState } from "react";
import { CircleHelp, Pencil, Plus, Trash2 } from "lucide-react";
import { api, loadFaq, nextOrder, reorder } from "@/lib/admin";
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

function GroupEditor({ group, groups, onClose, onSaved }) {
  const { act } = useAdmin();
  const formId = useId();
  const [title, setTitle] = useState(group?.title ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) return setError("A title is required.");
    if (clean.length > 150) return setError("Keep the title under 150 characters.");
    setError("");
    const body = { title: clean, sort_order: group ? group.sort_order : nextOrder(groups) };
    setSaving(true);
    const ok = await act(
      () => (group ? api.faqGroups.update(group.id, body) : api.faqGroups.create(body)),
      group ? "Group saved" : "Group added",
    );
    setSaving(false);
    if (ok) onSaved();
  };

  return (
    <Drawer
      open
      onClose={onClose}
      eyebrow={group ? "Edit group" : "New group"}
      title={group ? group.title : "Add a group"}
      width="max-w-lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="brass" size="sm" disabled={saving}>
            {saving ? <Spinner className="size-3.5" /> : null}
            {group ? "Save changes" : "Add group"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate>
        <TextField
          label="Group title"
          value={title}
          onChange={setTitle}
          max={150}
          error={error}
          placeholder="e.g. Pricing & payment"
          hint="Questions are collected under this heading on the FAQ page."
        />
      </form>
    </Drawer>
  );
}

function ItemEditor({ group, item, onClose, onSaved }) {
  const { act } = useAdmin();
  const formId = useId();
  const [question, setQuestion] = useState(item?.question ?? "");
  const [answer, setAnswer] = useState(item?.answer ?? "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const q = question.trim();
    const a = answer.trim();
    const next = {};
    if (!q) next.question = "A question is required.";
    else if (q.length > 300) next.question = "Keep the question under 300 characters.";
    if (!a) next.answer = "An answer is required.";
    else if (a.length > 5000) next.answer = "Keep the answer under 5000 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    const ok = await act(
      () =>
        item
          ? api.faqItems.update(item.id, { question: q, answer: a, sort_order: item.sort_order })
          : api.faqItems.create({ group_id: group.id, question: q, answer: a, sort_order: nextOrder(group.items) }),
      item ? "Question saved" : "Question added",
    );
    setSaving(false);
    if (ok) onSaved();
  };

  return (
    <Drawer
      open
      onClose={onClose}
      eyebrow={`${item ? "Edit question" : "New question"} · ${group.title}`}
      title={item ? item.question : "Add a question"}
      width="max-w-xl"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="brass" size="sm" disabled={saving}>
            {saving ? <Spinner className="size-3.5" /> : null}
            {item ? "Save changes" : "Add question"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="space-y-6">
        <TextField label="Question" value={question} onChange={setQuestion} max={300} error={errors.question} />
        <TextField
          label="Answer"
          value={answer}
          onChange={setAnswer}
          max={5000}
          multiline
          rows={9}
          error={errors.answer}
        />
      </form>
    </Drawer>
  );
}

export default function Faq() {
  const { act } = useAdmin();
  const { status, data, error, reload, retry } = useResource(loadFaq);
  const [groupEditor, setGroupEditor] = useState(null); // { group }
  const [itemEditor, setItemEditor] = useState(null); // { group, item }
  const [toDelete, setToDelete] = useState(null); // { group } | { group, item }
  const [busy, setBusy] = useState(false);
  const groups = data ?? [];

  const moveGroup = async (index, dir) => {
    const changes = reorder(groups, index, dir);
    if (!changes.length) return;
    setBusy(true);
    await act(async () => {
      for (const { item, sort_order } of changes) await api.faqGroups.update(item.id, { title: item.title, sort_order });
    });
    await reload();
    setBusy(false);
  };

  const moveItem = (group) => async (index, dir) => {
    const changes = reorder(group.items, index, dir);
    if (!changes.length) return;
    setBusy(true);
    await act(async () => {
      for (const { item, sort_order } of changes) {
        await api.faqItems.update(item.id, { question: item.question, answer: item.answer, sort_order });
      }
    });
    await reload();
    setBusy(false);
  };

  const confirmDelete = async () => {
    setBusy(true);
    const { group, item } = toDelete;
    const ok = await act(
      async () => {
        if (item) return api.faqItems.remove(item.id);
        // Remove the questions first so the group can go even if the database doesn't cascade.
        for (const q of group.items) await api.faqItems.remove(q.id);
        return api.faqGroups.remove(group.id);
      },
      item ? "Question deleted" : "Group deleted",
    );
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
        title="FAQ"
        description="Questions grouped under headings, on the FAQ page and the home page."
        actions={
          <Button variant="primary" size="sm" onClick={() => setGroupEditor({ group: null })} disabled={status !== "ready"}>
            <Plus className="size-3.5" aria-hidden="true" /> Add group
          </Button>
        }
      />

      {status === "loading" ? <ListSkeleton rows={2} /> : null}
      {status === "error" ? <ErrorState title="Couldn't load the FAQ" message={error} onRetry={retry} /> : null}

      {status === "ready" && groups.length === 0 ? (
        <EmptyState
          icon={CircleHelp}
          title="No FAQ yet"
          action={
            <Button variant="primary" size="sm" onClick={() => setGroupEditor({ group: null })}>
              <Plus className="size-3.5" aria-hidden="true" /> Add the first group
            </Button>
          }
        >
          Start with a group such as “Pricing”, then add the questions people ask you most.
        </EmptyState>
      ) : null}

      {status === "ready" ? (
        <div className="space-y-6">
          {groups.map((g, gi) => (
            <Card key={g.id}>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 sm:px-7">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="label-code text-graphite">{String(gi + 1).padStart(2, "0")}</span>
                  <h2 className="display-tight break-words text-2xl">{g.title}</h2>
                  <Badge>{g.items.length === 1 ? "1 question" : `${g.items.length} questions`}</Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <MoveButtons index={gi} count={groups.length} onMove={moveGroup} disabled={busy} />
                  <IconButton label={`Rename ${g.title}`} onClick={() => setGroupEditor({ group: g })}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </IconButton>
                  <IconButton label={`Delete ${g.title}`} tone="danger" onClick={() => setToDelete({ group: g })}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </IconButton>
                </div>
              </div>

              {g.items.length === 0 ? (
                <p className="px-5 py-8 text-sm text-graphite sm:px-7">No questions in this group yet.</p>
              ) : (
                <ul className="divide-y divide-white/10">
                  {g.items.map((it, ii) => (
                    <li key={it.id} className="flex items-start gap-4 p-5 sm:gap-6 sm:px-7">
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-base font-bold text-bone">{it.question}</h3>
                        <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-graphite">{it.answer}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                        <MoveButtons index={ii} count={g.items.length} onMove={moveItem(g)} disabled={busy} />
                        <IconButton label="Edit question" onClick={() => setItemEditor({ group: g, item: it })}>
                          <Pencil className="size-4" aria-hidden="true" />
                        </IconButton>
                        <IconButton label="Delete question" tone="danger" onClick={() => setToDelete({ group: g, item: it })}>
                          <Trash2 className="size-4" aria-hidden="true" />
                        </IconButton>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="border-t border-white/10 p-4 sm:px-7">
                <Button variant="secondary" size="sm" onClick={() => setItemEditor({ group: g, item: null })}>
                  <Plus className="size-3.5" aria-hidden="true" /> Add question
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {groupEditor ? (
        <GroupEditor
          key={groupEditor.group?.id ?? "new"}
          group={groupEditor.group}
          groups={groups}
          onClose={() => setGroupEditor(null)}
          onSaved={() => {
            setGroupEditor(null);
            reload();
          }}
        />
      ) : null}

      {itemEditor ? (
        <ItemEditor
          key={itemEditor.item?.id ?? `new-${itemEditor.group.id}`}
          group={itemEditor.group}
          item={itemEditor.item}
          onClose={() => setItemEditor(null)}
          onSaved={() => {
            setItemEditor(null);
            reload();
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={toDelete?.item ? "Delete this question?" : "Delete this group?"}
        confirmLabel={toDelete?.item ? "Delete question" : "Delete group"}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        {toDelete?.item ? (
          <>
            <span className="text-bone">{toDelete.item.question}</span> is removed from the website. This can't be undone.
          </>
        ) : (
          <>
            <span className="text-bone">{toDelete?.group.title}</span>
            {toDelete?.group.items.length
              ? ` and its ${toDelete.group.items.length} question${toDelete.group.items.length === 1 ? "" : "s"} are`
              : " is"}{" "}
            removed from the website. This can't be undone.
          </>
        )}
      </ConfirmDialog>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Inbox, Mail, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUSES,
  adminApplications,
  deleteApplication,
  formatDateTime,
  setApplicationStatus,
  timeAgo,
} from "@/lib/admin";
import { Button } from "@/components/alvan/button";
import { useAdmin, useResource } from "@/components/admin/admin-context";
import {
  Avatar,
  Card,
  ConfirmDialog,
  DangerButton,
  Drawer,
  EmptyState,
  ErrorState,
  ListSkeleton,
  PageHeading,
  SearchInput,
  Spinner,
  StatusBadge,
  Tabs,
} from "@/components/admin/ui";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function Detail({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="label-mono text-graphite">{label}</dt>
      <dd className="mt-2 break-words text-sm text-bone">{children || <span className="text-graphite">—</span>}</dd>
    </div>
  );
}

function LinkOrText({ value }) {
  if (!value) return <span className="text-graphite">–</span>;
  if (/^https?:\/\//i.test(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-brass hover:decoration-brass"
      >
        {value}
      </a>
    );
  }
  return value;
}

export default function Applications() {
  const { act } = useAdmin();
  const { status, data, error, reload, retry } = useResource(adminApplications);
  const applications = data?.applications ?? [];

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const selected = applications.find((a) => a.id === openId) ?? null;

  const changeStatus = async (application, next) => {
    if (application.status === next) return;
    const ok = await act(() => setApplicationStatus(application.id, next));
    if (ok) await reload();
  };

  // Opening a new application marks it as "reviewing", like an inbox marks mail as read.
  useEffect(() => {
    if (selected?.status === "new") changeStatus(selected, "reviewing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const counts = useMemo(() => {
    const c = { all: applications.length };
    for (const s of APPLICATION_STATUSES) c[s] = applications.filter((a) => a.status === s).length;
    return c;
  }, [applications]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (!q) return true;
      return [a.name, a.email, a.city, a.role_title, a.intro].some((v) => v?.toLowerCase().includes(q));
    });
  }, [applications, filter, query]);

  const refresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    const ok = await act(() => deleteApplication(toDelete.id), "Application deleted");
    setDeleting(false);
    if (ok) {
      setToDelete(null);
      setOpenId(null);
      await reload();
    }
  };

  return (
    <div className="space-y-8">
      <PageHeading
        eyebrow="Inbox"
        title="Applications"
        description="Everyone who applied through the Careers page. Opening a new application marks it as reviewing."
        actions={
          <Button variant="secondary" size="sm" onClick={refresh} disabled={refreshing}>
            {refreshing ? <Spinner className="size-3.5" /> : <RefreshCw className="size-3.5" aria-hidden="true" />}
            Refresh
          </Button>
        }
      />

      {status === "loading" ? <ListSkeleton /> : null}
      {status === "error" ? <ErrorState title="Couldn't load applications" message={error} onRetry={retry} /> : null}

      {status === "ready" && applications.length === 0 ? (
        <EmptyState icon={Inbox} title="No applications yet">
          When someone applies on the Careers page, it shows up here.
        </EmptyState>
      ) : null}

      {status === "ready" && applications.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Tabs
              label="Filter by status"
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: "All", count: counts.all },
                ...APPLICATION_STATUSES.map((s) => ({ value: s, label: cap(s), count: counts[s] })),
              ]}
            />
            <SearchInput value={query} onChange={setQuery} placeholder="Search applications" className="w-full sm:w-72" />
          </div>

          {rows.length === 0 ? (
            <Card className="px-6 py-12 text-center text-sm text-graphite">
              No applications match{query ? ` “${query}”` : " this filter"}.
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div
                aria-hidden="true"
                className="label-mono hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_7rem_4.5rem] gap-x-6 border-b border-white/10 px-6 py-3.5 text-graphite md:grid"
              >
                <span>Applicant</span>
                <span>Role and city</span>
                <span>Status</span>
                <span className="text-right">Received</span>
              </div>
              <ul className="divide-y divide-white/10">
                {rows.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(a.id)}
                      aria-label={`Open application from ${a.name}`}
                      className={cn(
                        "grid w-full items-center gap-x-6 gap-y-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.04] sm:px-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_7rem_4.5rem]",
                        selected?.id === a.id && "bg-white/[0.06]",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-4">
                        <Avatar name={a.name} />
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            {a.status === "new" ? (
                              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brass" />
                            ) : null}
                            <span className={cn("truncate text-sm text-bone", a.status === "new" && "font-bold")}>
                              {a.name}
                            </span>
                          </span>
                          <span className="block truncate text-xs text-graphite">{a.email}</span>
                        </span>
                      </span>
                      <span className="hidden min-w-0 md:block">
                        <span className="line-clamp-1 text-sm text-bone">{a.role_title}</span>
                        <span className="line-clamp-1 text-xs text-graphite">{a.city || "—"}</span>
                      </span>
                      <span className="flex items-center justify-between md:contents">
                        <StatusBadge value={a.status} />
                        <span className="text-xs text-graphite md:text-right">{timeAgo(a.created_at)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      ) : null}

      <Drawer
        open={Boolean(selected)}
        onClose={() => setOpenId(null)}
        eyebrow="Application"
        title={selected?.name}
        width="max-w-xl"
        footer={
          selected ? (
            <>
              <DangerButton className="mr-auto" onClick={() => setToDelete(selected)}>
                <Trash2 className="size-3.5" aria-hidden="true" /> Delete
              </DangerButton>
              <Button
                variant="brass"
                size="sm"
                href={`mailto:${selected.email}?subject=${encodeURIComponent("Your application to AlvanInc")}`}
              >
                <Mail className="size-3.5" aria-hidden="true" /> Reply by email
              </Button>
            </>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-8">
            <div>
              <p className="label-mono text-graphite" id="application-status-label">
                Status
              </p>
              <div
                role="group"
                aria-labelledby="application-status-label"
                className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {APPLICATION_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={selected.status === s}
                    onClick={() => changeStatus(selected, s)}
                    className={cn(
                      "label-mono rounded-full border px-3 py-2.5 text-[0.625rem] transition-colors",
                      selected.status === s
                        ? "border-brass bg-brass text-ink"
                        : "border-white/15 text-graphite hover:border-white/35 hover:text-bone",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <dl className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
              <Detail label="Email">
                <a
                  href={`mailto:${selected.email}`}
                  className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-brass hover:decoration-brass"
                >
                  {selected.email}
                </a>
              </Detail>
              <Detail label="Phone">{selected.phone}</Detail>
              <Detail label="City">{selected.city}</Detail>
              <Detail label="Role">{selected.role_title}</Detail>
              <Detail label="Portfolio">
                <LinkOrText value={selected.portfolio} />
              </Detail>
              <Detail label="Social">
                <LinkOrText value={selected.social} />
              </Detail>
              <Detail label="Received">{formatDateTime(selected.created_at)}</Detail>
            </dl>

            <div>
              <p className="label-mono text-graphite">About them</p>
              <p className="mt-3 whitespace-pre-line rounded-2xl border border-white/10 bg-ink p-5 text-sm leading-relaxed text-bone">
                {selected.intro || <span className="text-graphite">They didn't say.</span>}
              </p>
            </div>
          </div>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this application?"
        confirmLabel="Delete application"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        The application from <span className="text-bone">{toDelete?.name}</span> is removed from the database for good.
        If you only want it out of the way, mark it as rejected instead.
      </ConfirmDialog>
    </div>
  );
}
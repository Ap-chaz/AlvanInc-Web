import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Copy, Inbox, Mail, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENQUIRY_STATUSES, deleteEnquiry, formatDateTime, setEnquiryStatus, timeAgo } from "@/lib/admin";
import { Button } from "@/components/alvan/button";
import { useAdmin } from "@/components/admin/admin-context";
import {
  Avatar,
  Badge,
  Card,
  ConfirmDialog,
  DangerButton,
  Drawer,
  EmptyState,
  ErrorState,
  IconButton,
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

export default function Enquiries() {
  const { enquiries, enquiryStatus, enquiryError, loadEnquiries, patchEnquiry, removeEnquiry, act, notify } = useAdmin();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filter and open enquiry live in the URL, so links from the overview land in the right place
  // and the browser's Back button closes the panel.
  const statusParam = params.get("status");
  const filter = ENQUIRY_STATUSES.includes(statusParam) ? statusParam : "all";
  const openId = Number(params.get("open")) || null;
  const selected = enquiries.find((e) => e.id === openId) ?? null;

  const setFilter = (value) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "all") next.delete("status");
        else next.set("status", value);
        return next;
      },
      { replace: true },
    );
  const open = (id) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("open", String(id));
      return next;
    });
  const close = () =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("open");
        return next;
      },
      { replace: true },
    );

  const changeStatus = async (enquiry, status) => {
    if (enquiry.status === status) return;
    const previous = enquiry.status;
    patchEnquiry(enquiry.id, { status });
    const ok = await act(() => setEnquiryStatus(enquiry.id, status));
    if (!ok) patchEnquiry(enquiry.id, { status: previous });
  };

  // Opening a new enquiry marks it as read, like any inbox.
  useEffect(() => {
    if (selected?.status === "new") changeStatus(selected, "read");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const counts = useMemo(() => {
    const c = { all: enquiries.length };
    for (const s of ENQUIRY_STATUSES) c[s] = enquiries.filter((e) => e.status === s).length;
    return c;
  }, [enquiries]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enquiries.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false;
      if (!q) return true;
      return [e.name, e.email, e.company, e.selling, e.package_interest].some((v) => v?.toLowerCase().includes(q));
    });
  }, [enquiries, filter, query]);

  const refresh = async () => {
    setRefreshing(true);
    await loadEnquiries();
    setRefreshing(false);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    const ok = await act(() => deleteEnquiry(toDelete.id), "Enquiry deleted");
    setDeleting(false);
    if (ok) {
      removeEnquiry(toDelete.id);
      setToDelete(null);
      close();
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      notify("Email address copied");
    } catch {
      notify("Couldn't copy automatically. Select the address and copy it.", "error");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeading
        eyebrow="Inbox"
        title="Enquiries"
        description="Everything submitted through the contact form. Opening a new enquiry marks it as read."
        actions={
          <Button variant="secondary" size="sm" onClick={refresh} disabled={refreshing}>
            {refreshing ? <Spinner className="size-3.5" /> : <RefreshCw className="size-3.5" aria-hidden="true" />}
            Refresh
          </Button>
        }
      />

      {enquiryStatus === "loading" ? <ListSkeleton /> : null}
      {enquiryStatus === "error" ? (
        <ErrorState title="Couldn't load enquiries" message={enquiryError} onRetry={loadEnquiries} />
      ) : null}

      {enquiryStatus === "ready" && enquiries.length === 0 ? (
        <EmptyState icon={Inbox} title="No enquiries yet">
          When someone fills in the contact form, it shows up here.
        </EmptyState>
      ) : null}

      {enquiryStatus === "ready" && enquiries.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Tabs
              label="Filter by status"
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: "All", count: counts.all },
                ...ENQUIRY_STATUSES.map((s) => ({ value: s, label: cap(s), count: counts[s] })),
              ]}
            />
            <SearchInput value={query} onChange={setQuery} placeholder="Search enquiries" className="w-full sm:w-72" />
          </div>

          {rows.length === 0 ? (
            <Card className="px-6 py-12 text-center text-sm text-graphite">
              No enquiries match{query ? ` “${query}”` : " this filter"}.
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div
                aria-hidden="true"
                className="label-mono hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_6rem_4.5rem] gap-x-6 border-b border-white/10 px-6 py-3.5 text-graphite md:grid"
              >
                <span>From</span>
                <span>Interested in</span>
                <span>Status</span>
                <span className="text-right">Received</span>
              </div>
              <ul className="divide-y divide-white/10">
                {rows.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => open(e.id)}
                      aria-label={`Open enquiry from ${e.name}`}
                      className={cn(
                        "grid w-full items-center gap-x-6 gap-y-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.04] sm:px-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_6rem_4.5rem]",
                        selected?.id === e.id && "bg-white/[0.06]",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-4">
                        <Avatar name={e.name} />
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            {e.status === "new" ? (
                              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brass" />
                            ) : null}
                            <span className={cn("truncate text-sm text-bone", e.status === "new" && "font-bold")}>
                              {e.name}
                            </span>
                          </span>
                          <span className="block truncate text-xs text-graphite">{e.company || e.email}</span>
                        </span>
                      </span>
                      <span className="hidden min-w-0 md:block">
                        <span className="line-clamp-1 text-sm text-graphite">{e.selling || "—"}</span>
                        {e.package_interest || e.budget ? (
                          <span className="mt-1.5 flex flex-wrap gap-1.5">
                            {e.package_interest ? <Badge>{e.package_interest}</Badge> : null}
                            {e.budget ? <Badge>{e.budget}</Badge> : null}
                          </span>
                        ) : null}
                      </span>
                      <span className="flex items-center justify-between md:contents">
                        <StatusBadge value={e.status} />
                        <span className="text-xs text-graphite md:text-right">{timeAgo(e.created_at)}</span>
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
        onClose={close}
        eyebrow="Enquiry"
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
                href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: your enquiry to AlvanInc")}`}
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
              <p className="label-mono text-graphite" id="enquiry-status-label">
                Status
              </p>
              <div role="group" aria-labelledby="enquiry-status-label" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ENQUIRY_STATUSES.map((s) => (
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
                <span className="flex items-center gap-2">
                  <a
                    href={`mailto:${selected.email}`}
                    className="min-w-0 truncate underline decoration-white/20 underline-offset-4 transition-colors hover:text-brass hover:decoration-brass"
                  >
                    {selected.email}
                  </a>
                  <IconButton label="Copy email address" className="size-7" onClick={() => copy(selected.email)}>
                    <Copy className="size-3.5" aria-hidden="true" />
                  </IconButton>
                </span>
              </Detail>
              <Detail label="Company">{selected.company}</Detail>
              <Detail label="Package">{selected.package_interest}</Detail>
              <Detail label="Budget">{selected.budget}</Detail>
              <Detail label="Timeline">{selected.timeline}</Detail>
              <Detail label="Received">{formatDateTime(selected.created_at)}</Detail>
            </dl>

            <div>
              <p className="label-mono text-graphite">What they're selling</p>
              <p className="mt-3 whitespace-pre-line rounded-2xl border border-white/10 bg-ink p-5 text-sm leading-relaxed text-bone">
                {selected.selling || <span className="text-graphite">They didn't say.</span>}
              </p>
            </div>
          </div>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this enquiry?"
        confirmLabel="Delete enquiry"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        The enquiry from <span className="text-bone">{toDelete?.name}</span> is removed from the database for good.
        If you only want it out of the way, mark it as archived instead.
      </ConfirmDialog>
    </div>
  );
}

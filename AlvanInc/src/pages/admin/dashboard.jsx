import { Link } from "react-router-dom";
import { ArrowRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadOverview, timeAgo } from "@/lib/admin";
import { Button } from "@/components/alvan/button";
import { useAdmin, useResource } from "@/components/admin/admin-context";
import {
  Avatar,
  Card,
  EmptyState,
  ErrorState,
  PageHeading,
  SectionTitle,
  StatusBadge,
} from "@/components/admin/ui";

const DAY = 24 * 60 * 60 * 1000;

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/** Enquiries per calendar day for the last `days` days, oldest first. */
function dailyCounts(enquiries, days = 14) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  const buckets = Array.from({ length: days }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return { date, count: 0 };
  });
  for (const e of enquiries) {
    const t = new Date(e.created_at);
    if (Number.isNaN(t.getTime())) continue;
    const day = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    const index = Math.round((day - start) / DAY);
    if (index >= 0 && index < days) buckets[index].count += 1;
  }
  return buckets;
}

function StatCard({ label, value, caption, accent = false, to }) {
  const body = (
    <Card
      className={cn(
        "h-full p-6 transition-colors",
        to && "hover:border-white/25",
        accent && "border-brass/40 bg-brass/[0.06]",
      )}
    >
      <p className="label-mono text-graphite">{label}</p>
      <p className={cn("display-tight mt-5 text-5xl tabular-nums", accent && "text-brass")}>{value}</p>
      <p className="mt-3 text-xs text-graphite">{caption}</p>
    </Card>
  );
  return to ? (
    <Link to={to} className="block rounded-2xl">
      {body}
    </Link>
  ) : (
    body
  );
}

function EnquiryChart({ enquiries }) {
  const days = dailyCounts(enquiries);
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((n, d) => n + d.count, 0);
  const fmt = (d) => d.toLocaleDateString(undefined, { day: "numeric", month: "short" });

  return (
    <Card className="h-full p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <SectionTitle>Enquiries · last 14 days</SectionTitle>
          <p className="display-tight mt-4 text-4xl tabular-nums">{total}</p>
        </div>
      </div>
      <div
        role="img"
        aria-label={`Enquiries per day over the last 14 days: ${days.map((d) => d.count).join(", ")}`}
        className="mt-8 flex h-40 items-end gap-1.5"
      >
        {days.map((d, i) => (
          <div key={i} className="flex h-full flex-1 items-end" title={`${fmt(d.date)}: ${d.count}`}>
            <div
              className={cn(
                "w-full rounded-t-md transition-[height]",
                d.count === 0 ? "bg-white/10" : i === days.length - 1 ? "bg-brass" : "bg-brass/60",
              )}
              style={{ height: `${d.count === 0 ? 2 : Math.max(8, (d.count / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="label-code mt-3 flex justify-between text-[0.625rem] text-graphite">
        <span>{fmt(days[0].date)}</span>
        <span>Today</span>
      </div>
    </Card>
  );
}

const PIPELINE = [
  { key: "new", label: "New", bar: "bg-brass" },
  { key: "read", label: "Read", bar: "bg-bone/60" },
  { key: "replied", label: "Replied", bar: "bg-emerald-400" },
  { key: "archived", label: "Archived", bar: "bg-white/25" },
];

function Pipeline({ enquiries }) {
  const total = enquiries.length;
  return (
    <Card className="h-full p-6 sm:p-8">
      <SectionTitle>Pipeline</SectionTitle>
      <ul className="mt-6 space-y-5">
        {PIPELINE.map(({ key, label, bar }) => {
          const count = enquiries.filter((e) => e.status === key).length;
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <li key={key}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-bone">{label}</span>
                <span className="tabular-nums text-graphite">
                  {count} <span className="text-graphite/60">· {pct}%</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className={cn("h-full rounded-full", bar)} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function LatestEnquiries({ enquiries }) {
  const latest = enquiries.slice(0, 5);
  return (
    <Card className="h-full p-6 sm:p-8">
      <SectionTitle
        aside={
          <Link
            to="/admin/enquiries"
            className="label-mono inline-flex items-center gap-1.5 text-brass transition-opacity hover:opacity-80"
          >
            View all <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        }
      >
        Latest enquiries
      </SectionTitle>
      {latest.length === 0 ? (
        <p className="mt-6 text-sm leading-relaxed text-graphite">
          Nothing yet. When someone submits the contact form, it lands here.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-white/10">
          {latest.map((e) => (
            <li key={e.id}>
              <Link
                to={`/admin/enquiries?open=${e.id}`}
                className="-mx-3 flex items-center gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-white/[0.04]"
              >
                <Avatar name={e.name} />
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate text-sm text-bone", e.status === "new" && "font-bold")}>
                    {e.name}
                  </span>
                  <span className="block truncate text-xs text-graphite">{e.company || e.email}</span>
                </span>
                <span className="hidden sm:block">
                  <StatusBadge value={e.status} />
                </span>
                <span className="w-16 shrink-0 text-right text-xs text-graphite">{timeAgo(e.created_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function ContentLinks({ counts }) {
  const rows = [
    ["Projects", counts.projects, "/admin/projects"],
    ["Services", counts.services, "/admin/services"],
    ["Process steps", counts.process, "/admin/process"],
    ["Packages", counts.packages, "/admin/packages"],
    ["FAQ questions", counts.faqQuestions, "/admin/faq"],
    ["Categories", counts.categories, "/admin/categories"],
  ];
  return (
    <Card className="h-full p-6 sm:p-8">
      <SectionTitle>Website content</SectionTitle>
      <ul className="mt-4 divide-y divide-white/10">
        {rows.map(([label, value, to]) => (
          <li key={to}>
            <Link
              to={to}
              className="group -mx-3 flex items-center justify-between rounded-xl px-3 py-3.5 text-sm transition-colors hover:bg-white/[0.04]"
            >
              <span className="text-bone">{label}</span>
              <span className="flex items-center gap-3 text-graphite">
                <span className="tabular-nums">{value}</span>
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:text-brass"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** /admin — the landing page: numbers, a chart and what needs attention. */
export default function AdminDashboard() {
  const { enquiries, enquiryStatus, enquiryError, loadEnquiries } = useAdmin();
  const content = useResource(loadOverview);

  const fresh = enquiries.filter((e) => e.status === "new").length;
  const replied = enquiries.filter((e) => e.status === "replied").length;
  const thisWeek = enquiries.filter((e) => Date.now() - new Date(e.created_at).getTime() < 7 * DAY).length;

  return (
    <div className="space-y-10">
      <PageHeading
        eyebrow="Overview"
        title={`${greeting()}.`}
        description="Here's what's happening on the site and what's waiting for you."
        actions={
          <Button to="/admin/enquiries" size="sm" icon="arrow">
            Open inbox
          </Button>
        }
      />

      {enquiryStatus === "error" ? (
        <ErrorState title="Couldn't load enquiries" message={enquiryError} onRetry={loadEnquiries} />
      ) : (
        <>
          <section aria-label="Enquiry numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Waiting on you"
              value={fresh}
              caption={fresh === 1 ? "1 new enquiry" : `${fresh} new enquiries`}
              accent={fresh > 0}
              to="/admin/enquiries?status=new"
            />
            <StatCard label="This week" value={thisWeek} caption="Received in the last 7 days" />
            <StatCard label="Replied" value={replied} caption="Marked as replied" />
            <StatCard label="Total" value={enquiries.length} caption="Most recent 100 in the database" />
          </section>

          {enquiryStatus === "loading" ? null : enquiries.length === 0 ? (
            <EmptyState icon={Inbox} title="No enquiries yet">
              Submit the contact form on the site and it appears here. That one row proves the whole chain works:
              form, API, database, this page.
            </EmptyState>
          ) : (
            <section className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <EnquiryChart enquiries={enquiries} />
              </div>
              <Pipeline enquiries={enquiries} />
            </section>
          )}
        </>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        {enquiries.length > 0 ? (
          <div className="lg:col-span-2">
            <LatestEnquiries enquiries={enquiries} />
          </div>
        ) : null}
        <div className={enquiries.length > 0 ? undefined : "lg:col-span-3"}>
          {content.status === "ready" ? (
            <ContentLinks counts={content.data} />
          ) : content.status === "error" ? (
            <ErrorState title="Couldn't load content" message={content.error} onRetry={content.retry} />
          ) : (
            <Card className="admin-pulse min-h-64" />
          )}
        </div>
      </section>
    </div>
  );
}

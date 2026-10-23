import { Suspense, useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  CircleHelp,
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Package,
  Tags,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHead } from "@/lib/use-head";
import { adminLogout, adminMe } from "@/lib/admin";
import { Wordmark } from "@/components/alvan/wordmark";
import { AdminProvider, useAdmin } from "@/components/admin/admin-context";
import { ErrorState, IconButton, ListSkeleton } from "@/components/admin/ui";

const NAV = [
  {
    group: "Inbox",
    items: [
      { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
      { to: "/admin/enquiries", label: "Enquiries", icon: Inbox, badge: true },
    ],
  },
  {
    group: "Website content",
    items: [
      { to: "/admin/projects", label: "Projects", icon: FolderKanban },
      { to: "/admin/services", label: "Services", icon: Wrench },
      { to: "/admin/process", label: "Process", icon: ListOrdered },
      { to: "/admin/packages", label: "Packages", icon: Package },
      { to: "/admin/faq", label: "FAQ", icon: CircleHelp },
      { to: "/admin/categories", label: "Categories", icon: Tags },
    ],
  },
];

function SidebarContent({ newCount, onSignOut }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-6">
        <Link to="/admin" aria-label="Admin home" className="rounded">
          <Wordmark className="h-5" />
        </Link>
        <span className="label-code rounded-full border border-brass/40 px-2 py-0.5 text-[0.5625rem] text-brass">
          Admin
        </span>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-6">
        {NAV.map((section) => (
          <div key={section.group} className="mb-8 last:mb-0">
            <p className="label-code px-3 text-[0.625rem] text-graphite">{section.group}</p>
            <ul className="mt-3 space-y-1">
              {section.items.map(({ to, label, icon: Icon, end, badge }) => (
                <li key={to}>
                  {/* Wrap cn() inside the function: NavLink needs a function, and cn() would drop it. */}
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                        isActive ? "bg-white/[0.07] text-bone" : "text-graphite hover:bg-white/[0.04] hover:text-bone",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? (
                          <span
                            aria-hidden="true"
                            className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brass"
                          />
                        ) : null}
                        <Icon className={cn("size-4", isActive && "text-brass")} aria-hidden="true" />
                        <span className="flex-1">{label}</span>
                        {badge && newCount > 0 ? (
                          <span
                            className="label-mono min-w-5 rounded-full bg-brass px-1.5 py-0.5 text-center text-[0.625rem] tabular-nums text-ink"
                            aria-label={`${newCount} new`}
                          >
                            {newCount}
                          </span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-graphite transition-colors hover:bg-white/[0.04] hover:text-bone"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          View site
        </a>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-graphite transition-colors hover:bg-white/[0.04] hover:text-bone"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function Shell() {
  useHead({ title: "Admin — AlvanInc", noindex: true });

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { handleAuth, enquiries, loadEnquiries } = useAdmin();
  const [session, setSession] = useState({ status: "checking", error: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  // The page itself is public JavaScript; the real guard is the 401 from the API. Ask before showing anything.
  const check = useCallback(async () => {
    setSession({ status: "checking", error: "" });
    try {
      await adminMe();
      setSession({ status: "ok", error: "" });
      loadEnquiries();
    } catch (err) {
      if (handleAuth(err)) return;
      setSession({ status: "error", error: err.message });
    }
  }, [handleAuth, loadEnquiries]);

  useEffect(() => {
    check();
  }, [check]);

  // Close the mobile menu after navigating, and on Escape.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const signOut = async () => {
    try {
      await adminLogout();
    } catch {
      // The cookie may survive a failed logout, but leaving the page still hides the data.
    }
    navigate("/admin/login", { replace: true });
  };

  if (session.status !== "ok") {
    return (
      <div className="grid min-h-screen place-items-center bg-ink px-5 [color-scheme:dark]">
        {session.status === "checking" ? (
          <p className="label-mono text-graphite" role="status">
            Checking your session…
          </p>
        ) : (
          <div className="w-full max-w-lg">
            <ErrorState title="Can't reach the admin API" message={session.error} onRetry={check} />
          </div>
        )}
      </div>
    );
  }

  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div className="min-h-screen bg-ink [color-scheme:dark]">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-brass focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/10 bg-ink-soft lg:block">
        <SidebarContent newCount={newCount} onSignOut={signOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-ink/90 px-4 backdrop-blur lg:hidden">
        <Link to="/admin" aria-label="Admin home">
          <Wordmark className="h-5" />
        </Link>
        <div className="flex items-center gap-2">
          {newCount > 0 ? (
            <Link
              to="/admin/enquiries?status=new"
              className="label-mono rounded-full bg-brass px-2.5 py-1 text-[0.625rem] text-ink"
            >
              {newCount} new
            </Link>
          ) : null}
          <IconButton label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu className="size-4" aria-hidden="true" />
          </IconButton>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="admin-fade absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <div className="admin-slide-left relative h-full w-72 max-w-[85vw] border-r border-white/10 bg-ink-soft">
            <IconButton label="Close menu" className="absolute right-3 top-3.5" onClick={() => setMenuOpen(false)}>
              <X className="size-4" aria-hidden="true" />
            </IconButton>
            <SidebarContent newCount={newCount} onSignOut={signOut} />
          </div>
        </div>
      ) : null}

      <main id="admin-main" tabIndex={-1} className="outline-none lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
          {/* Own Suspense so opening a page's code never blanks the sidebar. */}
          <Suspense fallback={<ListSkeleton rows={3} />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

/** /admin/* — everything behind the login. Pages render into the <Outlet /> above. */
export default function AdminLayout() {
  return (
    <AdminProvider>
      <Shell />
    </AdminProvider>
  );
}

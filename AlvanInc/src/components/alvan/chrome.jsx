import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ALL, NAV_PRIMARY } from "@/lib/nav";
import { SITE } from "@/lib/site";
import { getConsent, setConsent } from "@/lib/consent";
import { Button } from "./button";
import { Wordmark } from "./wordmark";

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="label-display sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-brass focus:px-5 focus:py-3 focus:text-ink"
    >
      Skip to main content
    </a>
  );
}

const desktopLink = ({ isActive }) =>
  cn(
    "label-display transition-colors hover:text-brass",
    isActive ? "text-brass" : "text-bone/80",
  );

function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: lock page scroll, close on Escape, keep Tab inside the dialog, move focus in and back out
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      // Focus trap: Tab / Shift+Tab wrap around inside the dialog instead of reaching the page behind it
      const dialog = dialogRef.current;
      const nodes = dialog?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const outside = !dialog.contains(active);
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div
          className={cn(
            "pointer-events-auto mx-auto flex max-w-[88rem] items-center justify-between gap-4 rounded-full border backdrop-blur-xl transition-[background-color,border-color,box-shadow,padding] duration-300",
            scrolled
              ? "border-white/15 bg-ink/95 px-4 py-2 shadow-[0_14px_40px_-20px_rgba(0,0,0,0.9)] sm:px-6"
              : "border-white/10 bg-ink/90 px-4 py-3 sm:px-7",
          )}
        >
          <Link to="/" aria-label={`${SITE.name} home`} className="min-w-0 text-[0.95rem]">
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV_PRIMARY.map((l) => (
              <NavLink key={l.to} to={l.to} className={desktopLink}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <NavLink
              to="/contact"
              className={(state) => cn(desktopLink(state), "hidden lg:inline")}
            >
              Contact
            </NavLink>
            <Button to="/contact" size="sm" icon="arrow" className="hidden sm:inline-flex">
              Start a project
            </Button>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="label-display flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-bone transition-colors hover:text-brass lg:hidden"
            >
              Menu <Menu className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink/95 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between p-5 sm:p-8">
            <Wordmark className="text-[0.95rem]" />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="label-display flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-bone transition-colors hover:text-brass"
            >
              Close <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Full site" className="flex flex-col gap-1 px-6 pb-10 pt-4 sm:px-16">
            {NAV_ALL.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${80 + i * 55}ms` }}
                className="rise-in flex items-baseline gap-4 py-1 text-bone transition-colors hover:text-brass"
              >
                <span className="label-code text-graphite">{String(i + 1).padStart(2, "0")}</span>
                <span className="type-h1">{l.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-6 px-6 pb-10 sm:px-16">
            <Button to="/contact" icon="arrow" className="self-start">
              Start a project
            </Button>
            <p className="label-code text-graphite">{SITE.city}</p>
          </div>
        </div>
      )}
    </>
  );
}

function CookieBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);
  const choose = (value) => {
    setConsent(value);
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,36rem)] -translate-x-1/2"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-full border border-border bg-ink/85 py-2.5 pl-6 pr-2.5 backdrop-blur-xl">
        <p className="text-xs text-bone/75">We use cookies to improve your experience.</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="label-display rounded-full px-4 py-2.5 text-graphite transition-colors hover:text-bone"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="label-display rounded-full bg-brass px-4 py-2.5 text-ink transition-transform hover:-translate-y-0.5"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

function CornerBadge() {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 hidden lg:block">
      <div className="flex items-stretch overflow-hidden rounded-2xl border border-border bg-ink/60 backdrop-blur-md">
        <div className="flex flex-col items-center justify-center gap-1 px-4 py-3">
          <Globe className="size-4 text-graphite" aria-hidden="true" />
          <span className="label-mono text-[0.6rem] text-graphite">Nairobi</span>
        </div>
        <div className="label-mono max-w-[11rem] border-l border-border px-4 py-3 leading-relaxed text-bone/80">
          {SITE.tagline}
        </div>
      </div>
    </div>
  );
}

const INTERACTIVE = "a,button,[role='button'],input,select,textarea,summary,label";

/** Decorative ring that follows the mouse. Pure DOM updates, so no re-render per mouse move. */
function CursorRing() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let first = true;

    const render = () => {
      raf = 0;
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(render);
    };
    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (first || reduce) {
        x = tx;
        y = ty;
        first = false;
        el.dataset.ready = "true";
      }
      el.dataset.active = String(e.target instanceof Element && Boolean(e.target.closest(INTERACTIVE)));
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onLeave = () => {
      el.dataset.ready = "false";
      first = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-ready="false"
      data-active="false"
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden size-[22px] rounded-full border border-brass/70 opacity-0 mix-blend-difference transition-[width,height,opacity] duration-200 data-[active=true]:size-11 data-[ready=true]:opacity-60 data-[active=true]:data-[ready=true]:opacity-100 lg:block"
    />
  );
}

export { CookieBar, CornerBadge, CursorRing, SiteNav, SkipLink };

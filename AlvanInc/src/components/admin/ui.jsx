import { useEffect, useId, useRef } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  LoaderCircle,
  Plus,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/alvan/button";
import { Eyebrow } from "@/components/alvan/ui";

/**
 * Small, shared building blocks for the admin screens. They use the site's own tokens
 * (ink / bone / graphite / brass) so the admin reads as part of the same brand.
 */

/* ---------- Layout ---------- */

export function Card({ className, ...rest }) {
  return <div className={cn("rounded-2xl border border-white/10 bg-ink-soft", className)} {...rest} />;
}

export function PageHeading({ eyebrow, title, description, actions }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
      <div className="min-w-0">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="display-tight mt-4 text-4xl leading-[0.95] sm:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-xl text-sm leading-relaxed text-graphite">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}

export function SectionTitle({ children, aside }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="label-mono text-graphite">{children}</h2>
      {aside}
    </div>
  );
}

/* ---------- Buttons ---------- */

export function IconButton({ label, tone = "default", className, children, href, ...rest }) {
  const cls = cn(
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-graphite transition-colors hover:border-white/30 hover:text-bone disabled:pointer-events-none disabled:opacity-30",
    tone === "danger" && "hover:border-red-400/50 hover:text-red-300",
    className,
  );
  // With `href` it is a link (opens in a new tab); otherwise a button.
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" aria-label={label} title={label} className={cls} {...rest}>
      {children}
    </button>
  );
}

/** Up / down arrows for lists that have a hand-set order. */
export function MoveButtons({ index, count, onMove, disabled }) {
  return (
    <>
      <IconButton label="Move up" disabled={disabled || index === 0} onClick={() => onMove(index, -1)}>
        <ArrowUp className="size-4" aria-hidden="true" />
      </IconButton>
      <IconButton label="Move down" disabled={disabled || index === count - 1} onClick={() => onMove(index, 1)}>
        <ArrowDown className="size-4" aria-hidden="true" />
      </IconButton>
    </>
  );
}

export function DangerButton({ className, ...rest }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={cn("border-red-400/40 text-red-300 hover:border-red-300 hover:text-red-200", className)}
      {...rest}
    />
  );
}

/* ---------- Form controls ---------- */

export const inputCls =
  "w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-bone placeholder:text-graphite/70 transition-colors focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/25 aria-[invalid=true]:border-red-400/70";

function FieldShell({ id, label, max, length, hint, error, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="label-mono text-graphite">
          {label}
        </label>
        {max ? (
          <span className={cn("text-[0.6875rem] tabular-nums", length > max ? "text-red-300" : "text-graphite")}>
            {length}/{max}
          </span>
        ) : null}
      </div>
      <div className="mt-2">{children}</div>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-xs leading-relaxed text-graphite">{hint}</p>
      ) : null}
    </div>
  );
}

/** Text input or textarea with its label, character counter and error line. `onChange` gets the string. */
export function TextField({ label, value, onChange, max, hint, error, multiline = false, rows = 4, className, ...rest }) {
  const id = useId();
  const Tag = multiline ? "textarea" : "input";
  return (
    <FieldShell id={id} label={label} max={max} length={value.length} hint={hint} error={error}>
      <Tag
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={multiline ? rows : undefined}
        aria-invalid={Boolean(error)}
        className={cn(inputCls, multiline && "resize-y leading-relaxed", className)}
        {...rest}
      />
    </FieldShell>
  );
}

export function SelectField({ label, value, onChange, hint, error, children }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(inputCls, "appearance-none pr-10")}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-graphite"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}

export function Toggle({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/15 bg-ink px-4 py-3 text-left transition-colors hover:border-white/30"
    >
      <span>
        <span className="block text-sm text-bone">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-graphite">{hint}</span> : null}
      </span>
      <span
        aria-hidden="true"
        className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-brass" : "bg-white/15")}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 size-5 rounded-full transition-all",
            checked ? "translate-x-5 bg-ink" : "bg-bone",
          )}
        />
      </span>
    </button>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search", className }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-graphite" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(inputCls, "rounded-full py-2.5 pl-11")}
      />
    </div>
  );
}

/** Pill filter buttons with counts. */
export function Tabs({ value, onChange, items, label }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {items.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(t.value)}
            className={cn(
              "label-mono inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.625rem] transition-colors",
              active
                ? "border-brass bg-brass text-ink"
                : "border-white/15 text-graphite hover:border-white/35 hover:text-bone",
            )}
          >
            {t.label}
            {t.count !== undefined ? (
              <span className={cn("tabular-nums", active ? "text-ink/70" : "text-graphite")}>{t.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/** A list of short strings (package features): add, edit, remove, reorder. */
export function StringListEditor({ label, items, onChange, max, itemMax, addLabel, placeholder, error }) {
  const id = useId();
  const set = (i, v) => onChange(items.map((x, j) => (j === i ? v : x)));
  const move = (i, dir) => {
    const to = i + dir;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[i], next[to]] = [next[to], next[i]];
    onChange(next);
  };
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span id={id} className="label-mono text-graphite">
          {label}
        </span>
        <span className="text-[0.6875rem] tabular-nums text-graphite">
          {items.length}/{max}
        </span>
      </div>
      <ul className="mt-2 space-y-2" aria-labelledby={id}>
        {items.map((value, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              value={value}
              onChange={(e) => set(i, e.target.value)}
              maxLength={itemMax}
              placeholder={placeholder}
              aria-label={`${label} ${i + 1}`}
              className={cn(inputCls, "py-2.5")}
            />
            <IconButton label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
              <ArrowUp className="size-4" aria-hidden="true" />
            </IconButton>
            <IconButton label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
              <ArrowDown className="size-4" aria-hidden="true" />
            </IconButton>
            <IconButton label="Remove" tone="danger" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <X className="size-4" aria-hidden="true" />
            </IconButton>
          </li>
        ))}
      </ul>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {error}
        </p>
      ) : null}
      <Button
        variant="secondary"
        size="sm"
        className="mt-3 disabled:pointer-events-none disabled:opacity-40"
        disabled={items.length >= max}
        onClick={() => onChange([...items, ""])}
      >
        <Plus className="size-3.5" aria-hidden="true" /> {addLabel}
      </Button>
    </div>
  );
}

/** Chip input: type a tag, press Enter or comma. Backspace on an empty box removes the last one. */
export function TagInput({ label, tags, onChange, max, tagMax, hint, error, placeholder }) {
  const id = useId();
  const draftRef = useRef(null);

  const commit = (raw) => {
    const value = raw.trim().replace(/,$/, "").trim().slice(0, tagMax);
    if (!value) return;
    if (tags.length >= max || tags.some((t) => t.toLowerCase() === value.toLowerCase())) return;
    onChange([...tags, value]);
  };

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-xl border border-white/15 bg-ink px-3 py-2.5 focus-within:border-brass focus-within:ring-2 focus-within:ring-brass/25",
          error && "border-red-400/70",
        )}
        onClick={() => draftRef.current?.focus()}
      >
        {tags.map((t) => (
          <span
            key={t}
            className="label-mono inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-1 pl-3 pr-1.5 text-[0.625rem] text-bone"
          >
            {t}
            <button
              type="button"
              aria-label={`Remove ${t}`}
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="inline-flex size-4 items-center justify-center rounded-full text-graphite hover:bg-white/10 hover:text-bone"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={id}
          ref={draftRef}
          disabled={tags.length >= max}
          placeholder={tags.length ? "" : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm text-bone placeholder:text-graphite/70 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit(e.currentTarget.value);
              e.currentTarget.value = "";
            } else if (e.key === "Backspace" && !e.currentTarget.value && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={(e) => {
            commit(e.currentTarget.value);
            e.currentTarget.value = "";
          }}
        />
      </div>
    </FieldShell>
  );
}

/* ---------- Status & feedback ---------- */

const STATUS_TONE = {
  new: "border-brass/60 bg-brass/10 text-brass",
  read: "border-white/20 bg-white/5 text-bone",
  replied: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  archived: "border-white/10 bg-transparent text-graphite",
};

export function StatusBadge({ value }) {
  return (
    <span
      className={cn(
        "label-mono inline-block rounded-full border px-2.5 py-1 text-[0.625rem]",
        STATUS_TONE[value] ?? STATUS_TONE.read,
      )}
    >
      {value ?? "—"}
    </span>
  );
}

export function Badge({ children, tone = "default", className }) {
  return (
    <span
      className={cn(
        "label-mono inline-block rounded-full border px-2.5 py-1 text-[0.625rem]",
        tone === "brass" ? "border-brass/50 bg-brass/10 text-brass" : "border-white/15 text-graphite",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Spinner({ className }) {
  return <LoaderCircle className={cn("size-4 animate-spin", className)} aria-hidden="true" />;
}

/** Placeholder rows while a list loads. */
export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="admin-pulse h-24 rounded-2xl border border-white/10 bg-ink-soft" />
      ))}
    </div>
  );
}

export function ErrorState({ title = "Couldn't load this", message, onRetry }) {
  return (
    <div role="alert" className="rounded-2xl border border-destructive/60 bg-destructive/10 p-8">
      <div className="flex items-start gap-4">
        <TriangleAlert className="mt-1 size-5 shrink-0 text-red-300" aria-hidden="true" />
        <div>
          <h2 className="display-tight text-2xl">{title}</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-graphite">{message}</p>
          {onRetry ? (
            <Button variant="secondary" size="sm" className="mt-6" onClick={onRetry}>
              Try again
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
      {Icon ? (
        <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/10 bg-ink-soft text-brass">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      ) : null}
      <h2 className="display-tight mt-6 text-2xl">{title}</h2>
      {children ? <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-graphite">{children}</p> : null}
      {action ? <div className="mt-8 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ToastStack({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.tone === "error" ? "alert" : "status"}
          className={cn(
            "admin-pop pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-ink-soft px-4 py-3.5 text-sm shadow-2xl sm:w-auto",
            t.tone === "error" ? "border-red-400/50" : "border-white/15",
          )}
        >
          {t.tone === "error" ? (
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-300" aria-hidden="true" />
          ) : (
            <Check className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden="true" />
          )}
          <span className="flex-1 leading-relaxed text-bone">{t.message}</span>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => onDismiss(t.id)}
            className="text-graphite transition-colors hover:text-bone"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------- Overlays ---------- */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Overlays can stack (a confirm box over a drawer). Only the top one answers Escape and Tab,
// and the page scroll lock is released only when the last one closes.
const overlayStack = [];
let scrollLocks = 0;
let savedOverflow = "";

/** Escape closes, Tab stays inside the panel, page scroll is locked, and focus returns on close. */
function useOverlay(open, onClose, panelRef) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const token = {};
    overlayStack.push(token);
    const previous = document.activeElement;
    if (scrollLocks++ === 0) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    const panel = panelRef.current;
    const first = panel?.querySelector("[data-autofocus], input, textarea, select");
    (first ?? panel)?.focus();

    const onKey = (e) => {
      if (overlayStack[overlayStack.length - 1] !== token) return;
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault();
        lastNode.focus();
      } else if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault();
        firstNode.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      overlayStack.splice(overlayStack.indexOf(token), 1);
      if (--scrollLocks === 0) document.body.style.overflow = savedOverflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open, panelRef]);
}

/** Right-hand slide-over for editors and detail views. Put the form's submit button in `footer`. */
export function Drawer({ open, onClose, eyebrow, title, children, footer, width = "max-w-2xl" }) {
  const panelRef = useRef(null);
  const titleId = useId();
  useOverlay(open, onClose, panelRef);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end [color-scheme:dark]">
      <div className="admin-fade absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "admin-slide relative flex h-full w-full flex-col border-l border-white/10 bg-ink-soft shadow-2xl outline-none",
          width,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
          <div className="min-w-0">
            {eyebrow ? <p className="label-code text-brass">{eyebrow}</p> : null}
            <h2 id={titleId} className="display-tight mt-2 break-words text-2xl sm:text-3xl">
              {title}
            </h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X className="size-4" aria-hidden="true" />
          </IconButton>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">{children}</div>
        {footer ? (
          <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 px-6 py-4 sm:px-8">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}

/** Centred "are you sure" box for deletes. */
export function ConfirmDialog({ open, title, children, confirmLabel = "Delete", busy = false, onConfirm, onCancel }) {
  const panelRef = useRef(null);
  const titleId = useId();
  useOverlay(open, onCancel, panelRef);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5 [color-scheme:dark]">
      <div className="admin-fade absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onCancel} aria-hidden="true" />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="admin-pop relative w-full max-w-md rounded-3xl border border-white/10 bg-ink-soft p-7 shadow-2xl outline-none sm:p-8"
      >
        <span className="flex size-11 items-center justify-center rounded-full border border-red-400/40 bg-red-400/10 text-red-300">
          <TriangleAlert className="size-5" aria-hidden="true" />
        </span>
        <h2 id={titleId} className="display-tight mt-6 text-2xl">
          {title}
        </h2>
        <div className="mt-3 text-sm leading-relaxed text-graphite">{children}</div>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onCancel} data-autofocus>
            Cancel
          </Button>
          <Button
            variant="brass"
            size="sm"
            onClick={onConfirm}
            disabled={busy}
            className="bg-red-400 hover:bg-red-300 disabled:pointer-events-none disabled:opacity-60"
          >
            {busy ? <Spinner className="size-3.5" /> : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Round initial for a person. */
export function Avatar({ name, className }) {
  const initial = (name ?? "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full border border-brass/30 bg-brass/10 text-sm font-bold text-brass",
        className,
      )}
    >
      {initial}
    </span>
  );
}

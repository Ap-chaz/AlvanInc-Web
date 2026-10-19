import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AlvanInc button system (pill buttons, optional arrow).
 *
 * variant: "primary"   brass pill on dark surfaces, ink pill on light surfaces
 *          "secondary" outlined pill
 *          "brass"     always brass (legacy BrassButton behaviour)
 * tone:    the SURFACE the button sits on: "dark" (default) | "light"
 * size:    "md" (default) | "sm"
 * icon:    "arrow" | "up-right" | null
 * Renders <Link> when `to` is given, <a> when `href` is given, otherwise <button>.
 */
const BASE =
  "label-display inline-flex items-center justify-center gap-3 rounded-full transition-[transform,background-color,border-color,color] duration-200";

const SIZES = { md: "px-6 py-3.5", sm: "px-4 py-2.5" };

const VARIANTS = {
  primary: {
    dark: "bg-brass text-ink hover:-translate-y-0.5 hover:bg-bone",
    light: "bg-ink text-bone hover:-translate-y-0.5 hover:bg-brass hover:text-ink",
  },
  secondary: {
    dark: "border border-white/20 text-bone hover:border-brass hover:text-brass",
    light: "border border-black/20 text-black hover:border-black/50 hover:text-brass",
  },
  brass: {
    dark: "bg-brass font-medium text-ink hover:-translate-y-0.5",
    light: "bg-brass font-medium text-ink hover:-translate-y-0.5",
  },
};

const ICONS = { arrow: ArrowRight, "up-right": ArrowUpRight };

function Button({
  variant = "primary",
  tone = "dark",
  size = "md",
  icon = null,
  to,
  href,
  children,
  className,
  ...rest
}) {
  const cls = cn(BASE, SIZES[size] ?? SIZES.md, VARIANTS[variant]?.[tone] ?? VARIANTS.primary.dark, className);
  const Icon = icon ? ICONS[icon] : null;
  const content = (
    <>
      {children}
      {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  );
}

export { Button };

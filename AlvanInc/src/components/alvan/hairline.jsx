import { cn } from "@/lib/utils";

/**
 * Grid of cells separated by 1px hairlines (no shadows).
 * Put column classes on className, e.g. "md:grid-cols-3".
 * tone = surface it sits on, so cells match the background.
 */
function HairlineGrid({ children, tone = "dark", className, as: As = "div" }) {
  return (
    <As
      className={cn(
        "hairline-grid",
        tone === "light" ? "[--hairline-bg:var(--bone)]" : "[--hairline-bg:var(--ink)]",
        className,
      )}
    >
      {children}
    </As>
  );
}

export { HairlineGrid };

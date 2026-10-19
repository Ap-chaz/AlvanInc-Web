import { cn } from "@/lib/utils";
import { LOGO_PATH, LOGO_VIEWBOX, MARK_PATH, MARK_VIEWBOX } from "./logo-paths";

/**
 * The AlvanInc logo, drawn as inline SVG so it takes the surrounding text colour
 * (text-bone on ink surfaces, text-ink on bone surfaces).
 *
 * variant="full": mark + "AlvanInC" lockup (nav, footer, menu)
 * variant="mark": the A mark alone (tight spaces)
 * Size it with a height class, e.g. className="h-6". Width follows the artwork.
 */
function Wordmark({ className, variant = "full" }) {
  const full = variant === "full";
  return (
    <svg
      role="img"
      aria-label="AlvanInc"
      viewBox={full ? LOGO_VIEWBOX : MARK_VIEWBOX}
      fill="currentColor"
      fillRule="evenodd"
      className={cn("block h-6 w-auto text-bone", className)}
    >
      <path d={full ? LOGO_PATH : MARK_PATH} />
    </svg>
  );
}

export { Wordmark };

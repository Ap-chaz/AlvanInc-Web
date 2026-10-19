import { ArrowUpRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

/**
 * "View site" option for a project, driven by project.liveUrl in alvan-data.js:
 *   "https://..."  → opens the live site in a new tab
 *   null           → shows "coming soon" (link not ready yet)
 *   (field absent) → renders nothing
 * variant: "link" (text + arrow) | "button" (pill). tone = surface: "light" | "dark".
 */
function ViewSiteLink({
  project,
  variant = "link",
  buttonVariant = "secondary",
  tone = "light",
  className,
}) {
  const url = project.liveUrl;
  if (url === undefined) return null;
  const dark = tone === "dark";

  if (url === null) {
    return variant === "button" ? (
      <span
        className={cn(
          "label-display inline-flex items-center justify-center rounded-full border px-6 py-3.5",
          dark ? "border-white/15 text-graphite" : "border-black/15 text-black/40",
          className,
        )}
      >
        Live site coming soon
      </span>
    ) : (
      <span className={cn("label-code", dark ? "text-graphite" : "text-black/40", className)}>
        Link coming soon
      </span>
    );
  }

  const label = `View ${project.name} site (opens in a new tab)`;
  if (variant === "button") {
    return (
      <Button
        href={url}
        variant={buttonVariant}
        tone={tone}
        icon="up-right"
        aria-label={label}
        className={className}
      >
        View site
      </Button>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "label-display inline-flex items-center gap-2 transition-colors hover:text-brass",
        dark ? "text-bone" : "text-black",
        className,
      )}
    >
      View site <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </a>
  );
}

export { ViewSiteLink };

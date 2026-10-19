import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible accordion row: button (aria-expanded / aria-controls) + animated answer region.
 * Collapsed content is `inert`, so it can't be tabbed to or read while hidden.
 * tone = the surface it sits on: "light" | "dark".
 */
function AccordionItem({ q, a, defaultOpen = false, tone = "light" }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const dark = tone === "dark";
  return (
    <div className={cn("border-b", dark ? "border-border" : "border-black/10")}>
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-brass sm:py-7"
        >
          <span className="display-tight text-xl sm:text-2xl">{q}</span>
          <span
            aria-hidden="true"
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full border",
              dark ? "border-white/20" : "border-black/20",
            )}
          >
            {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p
            className={cn(
              "max-w-2xl pb-8 text-base leading-relaxed",
              dark ? "text-bone/70" : "text-black/65",
            )}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export { AccordionItem };

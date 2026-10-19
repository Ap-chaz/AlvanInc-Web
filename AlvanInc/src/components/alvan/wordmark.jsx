import { cn } from "@/lib/utils";

/**
 * The AlvanInc text wordmark. Single place to swap in a logo later:
 * replace the body of this component with an <img>/<svg> and keep the className prop.
 */
function Wordmark({ className }) {
  return (
    <span className={cn("label-mono font-bold tracking-[0.3em] text-bone", className)}>
      ALVAN<span className="text-brass">INC</span>
    </span>
  );
}

export { Wordmark };

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
function Reveal({ children, delay = 0, className, as: As = "div" }) {
  const { ref, shown } = useReveal();
  return (
    <As
      ref={ref}
      data-shown={shown}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </As>
  );
}
export { Reveal };

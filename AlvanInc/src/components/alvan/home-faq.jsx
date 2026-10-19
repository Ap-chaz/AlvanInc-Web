import { Link } from "react-router-dom";
import { Reveal } from "./reveal";
import { AccordionItem } from "./accordion";
import { Eyebrow } from "./ui";
import { FAQ_GROUPS } from "@/lib/alvan-data";

// Questions shown on the home page (matched by text, so a reworded or removed one just drops out)
const PICKS = [
  "What if I need more pages than my package includes?",
  "Do you offer payment plans?",
  "What happens if I'm not happy with the first draft?",
  "Do I own the final website?",
  "What platform do you build on?",
];

/** Home: a short FAQ on a light-deep surface, with a link to the full list. */
function HomeFaq() {
  const all = FAQ_GROUPS.flatMap((g) => g.items);
  const items = PICKS.map((q) => all.find((it) => it.q === q)).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <section id="faq" className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow index="08">FAQ</Eyebrow>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <h2 className="type-h1 sm:text-6xl">
              Asked <span className="text-brass">before</span> we start.
            </h2>
          </Reveal>
          <Reveal delay={160} className="mt-8">
            <Link to="/faq" className="link-underline text-black">
              All questions <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="border-t border-black/10">
            {items.map((it) => (
              <AccordionItem key={it.q} q={it.q} a={it.a} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export { HomeFaq };

import { Link } from "react-router-dom";
import { Reveal } from "./reveal";
import { Eyebrow } from "./ui";
import { LineArt } from "./line-art";
import { SERVICES } from "@/lib/alvan-data";

// One diagram per service, in SERVICES order
const ART = ["browser", "layers", "flow", "network"];

/** Home: numbered capability rows with a small line diagram (dark). */
function Capabilities() {
  return (
    <section id="capabilities" className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <Eyebrow index="02">Capabilities</Eyebrow>
      </Reveal>

      <ol className="mt-12 border-t border-black/15 sm:mt-16">
        {SERVICES.map((s, i) => (
          <Reveal as="li" key={s.name} delay={i * 80}>
            <div className="group grid items-center gap-6 border-b border-black/15 py-9 sm:py-11 md:grid-cols-[4.5rem_minmax(0,1fr)_9rem] md:gap-10 lg:grid-cols-[4.5rem_minmax(0,1fr)_auto]">
              <span className="label-code text-black/65">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <h3 className="type-h2 text-[2rem] sm:text-5xl">{s.name}</h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-black/65">{s.body}</p>
                <Link
                  to="/services"
                  className="link-underline mt-6 text-black"
                  aria-label={`Explore ${s.name}`}
                >
                  Explore <span aria-hidden="true">→</span>
                </Link>
              </div>
              <LineArt
                name={ART[i % ART.length]}
                className="mt-2 h-32 w-48 justify-self-center text-brass transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:mt-0 md:h-20 md:w-[7.5rem] md:justify-self-auto"
              />
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export { Capabilities };

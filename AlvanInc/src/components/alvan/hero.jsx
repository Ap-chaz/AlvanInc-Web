import { Link } from "react-router-dom";
import { Reveal } from "./reveal";
import { Words } from "./motion";
function HeroWire() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <div
        className="absolute left-1/2 top-1/2 size-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="wire-spin absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                transform: `rotateY(${i * 30}deg) scale(${1 - i * 0.09})`,
                border: "1px solid rgba(203,161,53,0.16)",
                boxShadow: "0 0 40px rgba(203,161,53,0.05) inset",
              }}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`h${i}`}
              className="absolute inset-x-0 top-1/2 h-px"
              style={{
                transform: `rotateZ(${i * 45}deg)`,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(242,240,234,0.22) 45%, rgba(203,161,53,0.35) 55%, transparent 100%)",
              }}
            />
          ))}
        </div>
        <div
          className="glow-slow absolute inset-[18%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 35%, rgba(203,161,53,0.14) 0%, transparent 65%)",
            filter: "blur(30px)",
          }}
        />
      </div>
    </div>
  );
}
function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pb-28"
    >
      <HeroWire />

      <div className="relative">
        <h1 className="display-tight max-w-5xl text-[3.25rem] leading-[0.92] sm:text-[6rem] lg:text-[7.5rem]">
          <Words text="Built to be *trusted*." start={100} step={90} />
          <br />
          <Words text="Built to *sell*." start={520} step={90} />
        </h1>

        <Reveal delay={220} className="mt-10">
          <Link to="/contact" className="link-underline text-bone">
            Start a project <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>

      <div className="relative mt-24 grid gap-8 sm:mt-32 lg:grid-cols-2 lg:items-end">
        <Reveal delay={320}>
          <p className="label-mono text-graphite">
            Startups <span className="text-brass">·</span> <span className="text-brass">SMEs</span>{" "}
            <span className="text-brass">·</span> Law firms <span className="text-brass">·</span>{" "}
            <span className="text-brass">Real estate</span> <span className="text-brass">·</span>{" "}
            Fintech
          </p>
        </Reveal>
        <Reveal delay={400} className="lg:justify-self-end lg:text-right">
          <p className="max-w-sm text-sm leading-relaxed text-bone/75 lg:pr-64">
            Websites, brand systems, and product design built for mobile-first customers — from
            Nairobi to Lagos.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
export { Hero, HeroWire };

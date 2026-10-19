const PALETTES = {
  portfolio: { bg: "#E9E3DA", ink: "#1A1A1A", accent: "#CBA135", label: "Studio Boma" },
  commerce: { bg: "#141619", ink: "#F2F0EA", accent: "#CBA135", label: "Tulia Coffee" },
  music: { bg: "#17121A", ink: "#F2F0EA", accent: "#C9615F", label: "Baze Nights" },
  dashboard: { bg: "#F2F0EA", ink: "#1A1A1A", accent: "#3D6B62", label: "Kilimani Homes" },
  editorial: { bg: "#1B1D21", ink: "#F2F0EA", accent: "#8FA9C4", label: "Field Notes" },
};
function MockUI({ variant, headline, className }) {
  const p = PALETTES[variant];
  return (
    <div className={className} style={{ backgroundColor: p.bg, color: p.ink }} aria-hidden="true">
      <div className="flex h-full w-full flex-col p-[6%]">
        <div className="flex items-center justify-between text-[0.5rem] tracking-[0.2em] uppercase opacity-70">
          <span style={{ fontFamily: "var(--font-mono)" }}>{p.label}</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>Menu</span>
        </div>

        <div
          className="mt-[8%] rounded-[6px]"
          style={{
            height: "42%",
            background: `radial-gradient(120% 100% at 20% 10%, ${p.accent}33 0%, transparent 60%), linear-gradient(135deg, ${p.ink}1a 0%, ${p.accent}22 45%, ${p.ink}0d 100%)`,
            border: `1px solid ${p.ink}1f`,
          }}
        />

        <div
          className="mt-auto pt-[6%] text-[1.1vw] leading-[0.95] font-bold sm:text-[0.9rem]"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
        >
          {headline}
        </div>

        <div className="mt-[5%] grid grid-cols-3 gap-[3%]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[4px]"
              style={{
                height: "0.8rem",
                background: i === 1 ? `${p.accent}66` : `${p.ink}14`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export { MockUI };

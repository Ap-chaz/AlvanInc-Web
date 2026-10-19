import { cn } from "@/lib/utils";

/** Small line-art diagrams (120×80). Stroke = currentColor, so colour with text-*. */
const mono = { fontFamily: "var(--font-mono)" };
const ART = {
  nodes: (
    <>
      <circle cx="27" cy="12" r="5" />
      <circle cx="93" cy="12" r="5" />
      <rect x="14" y="26" width="26" height="26" rx="3" />
      <rect x="80" y="26" width="26" height="26" rx="3" />
      <text x="27" y="44" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" style={mono}>A</text>
      <text x="93" y="44" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" style={mono}>B</text>
      <path d="M40 39H80" strokeDasharray="2 4" />
      <circle className="la-slide" cx="40" cy="39" r="2.5" fill="currentColor" stroke="none" />
      <circle className="la-pulse" cx="60" cy="66" r="4" />
    </>
  ),
  network: (
    <>
      <path d="M60 40L26 17M60 40L94 17M60 40L26 63M60 40L94 63" />
      <circle className="la-hub" cx="60" cy="40" r="9" fill="currentColor" />
      <circle className="la-node la-d1" cx="22" cy="14" r="5" />
      <circle className="la-node la-d2" cx="98" cy="14" r="5" />
      <circle className="la-node la-d3" cx="98" cy="66" r="5" />
      <circle className="la-node la-d4" cx="22" cy="66" r="5" />
    </>
  ),
  bars: (
    <>
      <rect x="28" y="8" width="64" height="64" rx="4" />
      <path className="la-bar la-d0" d="M40 22H80" strokeWidth="4" />
      <path className="la-bar la-d1" d="M40 32H76" strokeWidth="4" />
      <path className="la-bar la-d2" d="M40 42H70" strokeWidth="4" />
      <path className="la-bar la-d3" d="M40 52H64" strokeWidth="4" />
      <path className="la-bar la-d4" d="M40 62H56" strokeWidth="4" />
    </>
  ),
  browser: (
    <>
      <rect x="10" y="12" width="100" height="56" rx="5" />
      <path d="M10 26H110" />
      <circle cx="18" cy="19" r="1.5" fill="currentColor" />
      <circle cx="25" cy="19" r="1.5" fill="currentColor" />
      <circle cx="32" cy="19" r="1.5" fill="currentColor" />
      <rect x="20" y="34" width="36" height="26" rx="2" />
      <path className="la-line la-d0" d="M64 38H100" />
      <path className="la-line la-d2" d="M64 46H100" />
      <path className="la-line la-d4" d="M64 54H88" />
    </>
  ),
  flow: (
    <>
      <rect className="la-box la-d0" x="6" y="28" width="26" height="24" rx="3" />
      <rect className="la-box la-d2" x="47" y="28" width="26" height="24" rx="3" />
      <rect className="la-box la-d4" x="88" y="28" width="26" height="24" rx="3" />
      <path d="M32 40H47M43 37L47 40L43 43M73 40H88M84 37L88 40L84 43" />
      <circle className="la-travel" cx="19" cy="40" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  layers: (
    <>
      <path className="la-float la-d2" d="M60 10L100 26L60 42L20 26Z" />
      <path className="la-float la-d1" d="M20 38L60 54L100 38" />
      <path className="la-float la-d0" d="M20 50L60 66L100 50" />
    </>
  ),
  device: (
    <>
      <rect x="40" y="6" width="40" height="68" rx="6" />
      <path d="M54 12H66" />
      <rect x="47" y="22" width="26" height="18" rx="2" />
      <path d="M47 48H73M47 55H66" />
      <circle cx="60" cy="67" r="2" />
    </>
  ),
  chart: (
    <>
      <path d="M14 10V68H108" />
      <path d="M22 56L42 44L60 50L80 28L102 18" />
      <circle cx="102" cy="18" r="3" fill="currentColor" />
    </>
  ),
  chat: (
    <>
      <rect x="10" y="10" width="76" height="40" rx="8" />
      <path d="M28 50L24 66L44 50" />
      <path d="M24 26H70M24 36H56" />
      <path d="M100 46L103 55L112 58L103 61L100 70L97 61L88 58L97 55Z" />
    </>
  ),
};

const LINE_ART_NAMES = Object.keys(ART);

function LineArt({ name, className, title }) {
  const art = ART[name];
  if (!art) return null;
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      className={cn("la-anim h-20 w-[7.5rem]", className)}
    >
      {title ? <title>{title}</title> : null}
      {art}
    </svg>
  );
}

export { LINE_ART_NAMES, LineArt };

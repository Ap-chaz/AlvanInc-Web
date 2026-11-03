/**
 * PRICE LIST for the pricing calculator.
 *
 * This is the ONLY file you need to edit to change any number the calculator shows.
 * All amounts are Kenyan shillings (KES). Each price is a [low, high] range.
 *
 * Every item carries:
 *   source: where the figure comes from (a key in SOURCES below), and
 *   basis:  "published"  = taken from a published Kenyan price guide
 *           "partly"     = one end is published, the other end is our estimate
 *           "estimate"   = no published figure found, our own estimate (CHECK THESE)
 *
 * Researched 3 Nov 2026. Prices change, so re-check about once a year.
 */

export const SOURCES = {
  underscore: {
    label: "Underscore Digital, How much does a website cost in Kenya in 2026 (May 2026)",
    url: "https://underscore.co.ke/how-much-does-a-website-cost-in-kenya-in-2026/",
  },
  tasflex: {
    label: "Tasflex, Website Design Price in Kenya, 2026 estimates (Jun 2026)",
    url: "https://tasflex.co.ke/website-design-price-in-kenya-2026-estimates-the-definitive-cost-breakdown-for-nairobi-mombasa-and-beyond/",
  },
  baobab: {
    label: "The Baobab Collective, Custom website cost in Kenya 2026 (Apr 2026)",
    url: "https://baobabcollective.com/blog/custom-website-cost-kenya-2026.html",
  },
  novahost: {
    label: "NovaHost, Website Design Cost Kenya (updated Oct 2026)",
    url: "https://novahost.co.ke/blog/website-design-cost-kenya/",
  },
  cdc2026: {
    label: "Creative Divine Concepts, Web design cost in Kenya 2026 (Jul 2026)",
    url: "https://creativedivineconcepts.com/blog/web-design-cost-in-kenya-2026-complete-pricing-guide",
  },
  cdc2025: {
    label: "Creative Divine Concepts, Web design cost in Kenya (Aug 2025)",
    url: "https://creativedivineconcepts.com/blog/web-design-prices-in-kenya-2026",
  },
  kolonellMpesa: {
    label: "Kolonell, Accepting M-Pesa payments in Kenya (Aug 2026)",
    url: "https://kolonell.com/en/blog/accept-mpesa-payments-website-kenya-setup-fees-2026",
  },
  kolonellBooking: {
    label: "Kolonell, Travel agency website cost with booking in Kenya (Aug 2026)",
    url: "https://kolonell.com/en/blog/travel-agency-website-cost-booking-kenya-2026",
  },
  kolonellSwahili: {
    label: "Kolonell, English and Swahili website cost (Aug 2026)",
    url: "https://kolonell.com/en/blog/multilingual-website-cost-english-swahili-kenya-2026",
  },
  achiLogo: {
    label: "Achi Systems, Logo design and brand identity prices",
    url: "https://achisystems.co.ke/book/logo-design-service.html",
  },
  achiCare: {
    label: "Achi Systems, Website management packages",
    url: "https://achisystems.co.ke/service/website-management-service-package/",
  },
  truehost: {
    label: "Truehost, Hosting and domain prices in Kenya",
    url: "https://www.truehost.co.ke/how-much-does-web-hosting-cost/",
  },
};

export const PAGE_COUNT = { one: 1, small: 5, medium: 8 };

export const SIZES = [
  {
    id: "one",
    label: "One page",
    help: "One long page with everything on it. Good for a single offer, event or a simple introduction to your business.",
    price: [45000, 60000],
    basis: "published",
    note: "Published range for one-page sites is KES 25,000 to 60,000. Our Launch price starts at 45,000.",
    source: ["underscore", "tasflex"],
  },
  {
    id: "small",
    label: "Up to 5 pages",
    help: "For example: Home, About, Services, Gallery and Contact.",
    price: [60000, 100000],
    basis: "published",
    note: "Published ranges: 50,000 to 120,000 (Underscore), 50,000 to 80,000 (Tasflex), packages at 55,000, 85,000 and 130,000 (NovaHost).",
    source: ["underscore", "tasflex", "novahost"],
  },
  {
    id: "medium",
    label: "Up to 8 pages",
    help: "A fuller website for a business with several things to say.",
    price: [100000, 160000],
    basis: "published",
    note: "Published ranges: 100,000 to 280,000 for 6 to 15 pages (Underscore), 80,000 to 180,000 for 5 to 8 pages (Baobab), 80,000 to 150,000 for 10 pages with a blog (Tasflex).",
    source: ["underscore", "baobab", "tasflex"],
  },
  {
    id: "large",
    label: "More than 8 pages",
    help: "A big website. We will plan this one together on a call.",
    price: [180000, 300000],
    custom: true,
    basis: "published",
    note: "Published ranges: 180,000 to 450,000 for 10 to 20 pages (Baobab), up to 280,000 for 6 to 15 pages (Underscore).",
    source: ["baobab", "underscore"],
  },
];

// Things the website can DO, in everyday words.
export const FEATURES = [
  {
    id: "whatsapp",
    label: "A button that opens WhatsApp chat with you",
    help: "One tap and the customer is talking to you.",
    price: [0, 0],
    included: true,
    basis: "published",
    note: "Listed as part of a normal business website, not charged separately.",
    source: ["underscore"],
  },
  {
    id: "loadproducts",
    label: "Add lots of products for me (about 100)",
    help: "We upload your products with photos, names and prices so you do not have to.",
    price: [20000, 20000],
    basis: "published",
    note: "Product import of 100 products: 20,000.",
    source: ["tasflex"],
  },
  {
    id: "booking",
    label: "Let people send a booking or quote request",
    help: "A form for bookings, quotes or appointments, sent straight to you. A plain contact form is free.",
    price: [14000, 35000],
    basis: "published",
    note: "Custom quote form: 14,000 to 35,000 (found in a travel site price list).",
    source: ["kolonellBooking"],
  },
  {
    id: "mpesa",
    label: "Take payments with M-Pesa on the website",
    help: "Customers pay on the site and you get confirmation automatically.",
    price: [10000, 48000],
    custom: true,
    basis: "published",
    note: "Simple payment add-on from 10,000; online payment feature 20,000 to 48,000. A fully custom M-Pesa build is 60,000 to 140,000, which we would quote on a call.",
    source: ["cdc2026", "kolonellBooking", "kolonellMpesa"],
  },
  {
    id: "login",
    label: "Customer accounts (people sign in to see their own things)",
    help: "For example: order history, saved details or a members area.",
    price: [20000, 40000],
    custom: true,
    basis: "partly",
    note: "Published: user login from 20,000. The top end is our estimate.",
    source: ["cdc2026"],
  },
  {
    id: "editing",
    label: "Let me change the words and pictures myself",
    help: "You can update the site yourself without calling anyone.",
    price: [10000, 20000],
    basis: "estimate",
    note: "No published price found. Our estimate. Staff training sessions are published at 5,000 to 10,000.",
    source: ["tasflex"],
  },
  {
    id: "blog",
    label: "A news or blog section",
    help: "A place to post updates and helpful articles.",
    price: [2000, 5000],
    basis: "partly",
    note: "Priced like one extra page (2,000 to 5,000 each). Published guides include a blog in bigger packages without a separate price.",
    source: ["cdc2026", "tasflex"],
  },
  {
    id: "google",
    label: "Extra help getting found on Google",
    help: "One-time search setup so nearby customers find you. Basic search basics are already included.",
    price: [5000, 20000],
    basis: "published",
    note: "SEO initial setup: 5,000 to 20,000 (2025 guide). Ongoing monthly SEO is a different, much larger cost.",
    source: ["cdc2025"],
  },
];

// Words on the site. Price is PER PAGE, so it grows with the size you chose.
export const WRITING = [
  { id: "own", label: "I will write the words myself", price: [0, 0] },
  {
    id: "edit",
    label: "I have rough notes, please tidy them up",
    perPage: [500, 1500],
    basis: "partly",
    note: "Published: copywriting from 500 per page. The top end is our estimate.",
    source: ["cdc2026"],
  },
  {
    id: "write",
    label: "Please write everything for me",
    perPage: [1500, 5000],
    basis: "published",
    note: "1,500 to 5,000 per 500-word page (2025 guide); a 5-page, 1,000-word invoice example was 10,000.",
    source: ["cdc2025", "tasflex"],
  },
];

export const BRANDING = [
  { id: "have", label: "I already have a logo and colours", price: [0, 0] },
  {
    id: "logo",
    label: "I need a logo",
    price: [5000, 30000],
    basis: "published",
    note: "Basic logo 5,000 to 15,000, standard logo 15,000 to 30,000.",
    source: ["achiLogo"],
  },
  {
    id: "brand",
    label: "A full look for my business (logo, colours, business card, letterhead)",
    price: [60000, 150000],
    basis: "published",
    note: "Complete brand identity package: 60,000 to 150,000.",
    source: ["achiLogo"],
  },
];

// Swahili + English adds this share on top of the website price.
export const SECOND_LANGUAGE = {
  label: "Add Swahili (English + Swahili)",
  uplift: [0.25, 0.4],
  basis: "published",
  note: "An English and Swahili site adds 25% to 40% to the quote.",
  source: ["kolonellSwahili"],
};

// Rush delivery is NOT priced. No published Kenyan figure exists for websites, so we quote it on the call.
export const RUSH = {
  label: "I need it fast (live in under 2 weeks)",
  note: "Quoted on the call",
};

// Monthly care, shown separately from the one-time price.
export const CARE = [
  { id: "none", label: "No, I will manage it myself", monthly: [0, 0] },
  {
    id: "basic",
    label: "Basic care: hosting, backups, small text changes",
    monthly: [3000, 9500],
    basis: "published",
    note: "Market retainers start around 3,000 to 5,000 a month; one agency charges 9,500 for updates and maintenance.",
    source: ["cdc2026", "underscore", "achiCare"],
  },
  {
    id: "plus",
    label: "Full care: everything in Basic plus regular updates and checks",
    monthly: [9500, 20000],
    basis: "published",
    note: "Maintenance retainers run 5,000 to 20,000 a month (Underscore); agency packages 9,000 to 12,500 each (Achi).",
    source: ["underscore", "achiCare"],
  },
];

// Paid to the domain / hosting company, not to AlvanInc.
export const RUNNING_COSTS = {
  yearly: [4000, 20000],
  basis: "published",
  note: "Domain (.co.ke) 1,200 to 3,500 a year plus shared hosting about 3,000 to 15,000 a year, up to 30,000 on bigger plans.",
  source: ["novahost", "truehost", "underscore", "cdc2026"],
};

// Photography is not in the estimate: published at 15,000 to 50,000 per shoot (Tasflex).
export const PHOTO_NOTE = "professional photography (usually KES 15,000 to 50,000 a shoot)";

const round = (n) => Math.round(n / 1000) * 1000;

/**
 * Turns the visitor's choices into an estimate.
 * choices: { size, features: string[], writing, branding, swahili, rush, care }
 */
export function estimate(choices) {
  const size = SIZES.find((s) => s.id === choices.size) ?? SIZES[0];
  const pages = PAGE_COUNT[size.id] ?? 10;
  const lines = [];
  let custom = Boolean(size.custom);

  const add = (label, [l, h]) => {
    if (l === 0 && h === 0) return;
    lines.push({ label, low: l, high: h });
  };

  add(`Website: ${size.label.toLowerCase()}`, size.price);

  if (choices.swahili) {
    add(SECOND_LANGUAGE.label, [
      size.price[0] * SECOND_LANGUAGE.uplift[0],
      size.price[1] * SECOND_LANGUAGE.uplift[1],
    ]);
  }

  for (const f of FEATURES) {
    if (choices.features.includes(f.id)) {
      add(f.label, f.price);
      if (f.custom) custom = true;
    }
  }

  const w = WRITING.find((x) => x.id === choices.writing);
  if (w?.perPage) {
    add(`Words for ${pages} page${pages > 1 ? "s" : ""}`, [w.perPage[0] * pages, w.perPage[1] * pages]);
  }

  const b = BRANDING.find((x) => x.id === choices.branding);
  if (b) add(b.label, b.price);

  const care = CARE.find((c) => c.id === choices.care) ?? CARE[0];

  // Show rounded numbers, and make the breakdown add up to the rounded total.
  const rounded = lines.map((l) => ({ ...l, low: round(l.low), high: round(l.high) }));
  const totalLow = rounded.reduce((s, l) => s + l.low, 0);
  const totalHigh = rounded.reduce((s, l) => s + l.high, 0);

  if (totalHigh > 400000) custom = true;

  const mid = (totalLow + totalHigh) / 2;
  const budget =
    mid < 50000
      ? "Under KES 50,000"
      : mid < 150000
        ? "KES 50,000 – 150,000"
        : mid < 400000
          ? "KES 150,000 – 400,000"
          : "KES 400,000+";

  const pkg = custom ? "Custom" : size.id === "one" && totalHigh < 90000 ? "Launch" : "Studio";

  return {
    lines: rounded,
    low: totalLow,
    high: totalHigh,
    monthly: care.monthly,
    careLabel: care.label,
    rush: Boolean(choices.rush),
    custom,
    pkg,
    budget,
  };
}

export const kes = (n) => `KES ${Math.round(n).toLocaleString("en-KE")}`;

/** Plain-text summary sent along with the enquiry so the owner sees what the visitor chose. */
export function summarise(choices, est) {
  const names = (list, ids) => list.filter((x) => ids.includes(x.id)).map((x) => x.label);
  const parts = [
    `Calculator estimate: ${kes(est.low)} to ${kes(est.high)} (one-time)`,
    est.monthly[1] > 0 ? `Monthly care: ${kes(est.monthly[0])} to ${kes(est.monthly[1])}` : null,
    `Chosen: ${[
      SIZES.find((s) => s.id === choices.size)?.label,
      ...names(FEATURES, choices.features),
      choices.swahili ? "Swahili + English" : null,
      choices.writing !== "own" ? WRITING.find((x) => x.id === choices.writing)?.label : null,
      choices.branding !== "have" ? BRANDING.find((x) => x.id === choices.branding)?.label : null,
      choices.rush ? "Rush delivery (quote on call)" : null,
    ]
      .filter(Boolean)
      .join("; ")}`,
  ];
  return parts.filter(Boolean).join("\n");
}

/** Every priced item with its source, used for the "Where these prices come from" table. */
export function priceTable() {
  const rows = [];
  const push = (group, label, range, item) =>
    rows.push({ group, label, range, basis: item.basis, note: item.note, source: item.source ?? [] });
  const fmt = ([l, h]) => (l === h ? kes(l) : `${kes(l)} – ${kes(h)}`);
  SIZES.forEach((s) => push("Website size", s.label, fmt(s.price), s));
  push("Language", SECOND_LANGUAGE.label, "+25% to +40%", SECOND_LANGUAGE);
  FEATURES.forEach((f) => push("What it does", f.label, f.included ? "Included" : fmt(f.price), f));
  WRITING.filter((w) => w.perPage).forEach((w) => push("Words", w.label, `${fmt(w.perPage)} per page`, w));
  BRANDING.filter((b) => b.basis).forEach((b) => push("Brand", b.label, fmt(b.price), b));
  CARE.filter((c) => c.basis).forEach((c) => push("Monthly care", c.label, `${fmt(c.monthly)} / month`, c));
  push("Yearly running costs", "Domain and hosting (paid to the provider)", `${fmt(RUNNING_COSTS.yearly)} / year`, RUNNING_COSTS);
  return rows;
}

const PROJECTS = [
  {
    slug: "rommie",
    liveUrl: "https://rommieweb.vercel.app",
    name: "Rommie",
    category: "E-commerce",
    summary:
      "Student rooms and hostels marketplace in Nairobi, with listings, an admin panel and simple sign-in.",
    tags: ["E-commerce", "Web app"],
    // TODO(owner): add a timeline tag, results and a quote once you have real ones.
    brief:
      "Rommie helps students find rooms and hostels near where they study. Listings had to be easy to browse, and cover every school in an area, not just one: the Karen hostels guide, for example, covers all nearby schools, not only JKUAT.",
    approach: [
      {
        title: "Listings organised by area",
        body: "Hostels are grouped by where they are, so a student sees what is near their own school instead of searching one big list.",
      },
      {
        title: "An admin panel to run it",
        body: "The people running Rommie manage listings and accounts themselves, in a panel built out feature by feature rather than all at once.",
      },
      {
        title: "Sign-in that stays out of the way",
        body: "Email and password, or Continue with Google, with a show/hide toggle on the password field.",
      },
    ],
    results: [],
  },
  {
    slug: "zuno",
    liveUrl: "https://escrowzuno.vercel.app",
    name: "Zuno Escrow",
    category: "SaaS & Product",
    summary:
      "Escrow payment platform for online marketplace deals — funds held until delivery is confirmed.",
    tags: ["SaaS & Product", "4 months"],
    brief:
      "Zuno Escrow needed to make an abstract idea — a neutral third party holding a payment until both sides are satisfied — feel simple enough that a first-time buyer would trust it in seconds, not after reading a terms page.",
    approach: [
      {
        title: "The mechanism stated up front",
        body: "The core promise sits directly in the hero rather than buried in an FAQ: funds are locked until the buyer confirms delivery, and every seller is KYC-verified before they can list.",
      },
      {
        title: "One clear path to signing up",
        body: "A single primary action — Get Started — with login kept secondary, so first-time visitors aren't asked to choose between paths before they understand the product.",
      },
      {
        title: "A dark, deliberate visual language",
        body: "A near-black background with a single amber accent keeps the focus on the two things that matter: the promise, and the action.",
      },
    ],
  },
  {
    slug: "sharks-clinic",
    // TODO(owner): put the real live URL here. null shows "Link coming soon".
    // (An earlier build used https://ap-chaz.github.io/SharksClinic; removed on request.)
    liveUrl: null,
    name: "Sharks Clinic",
    category: "Brand & Marketing",
    summary:
      "Clinic website with service departments and online appointment booking.",
    tags: ["Brand & Marketing"],
    brief:
      "Sharks Clinic needed a site that could carry the weight of a healthcare decision — clear service departments and a straightforward way to book.",
    approach: [
      {
        title: "Departments, not a single service list",
        body: "General health checkups, treatment for minor illnesses, and vaccinations each get their own clear entry point, so a visitor with a specific need doesn't have to hunt for it.",
      },
      {
        title: "Booking as the primary action",
        body: "Book Appointment sits ahead of everything else in the hero, with Our Services as the secondary path for people who want to look first.",
      },
    ],
  },
];
const CATEGORIES = ["All", "E-commerce", "SaaS & Product", "Real Estate", "Brand & Marketing"];
const TIERS = [
  {
    name: "Launch",
    price: "KES 45,000",
    priceNote: "starting",
    pitch: "A single offer or event, live in a week.",
    features: ["Single-page site", "Copy & content pass", "Mobile-first build", "5-day turnaround"],
    featured: false,
  },
  {
    name: "Studio",
    price: "KES 150,000",
    priceNote: "starting",
    pitch: "An ongoing business with more than one thing to say.",
    features: [
      "Full site architecture (up to 8 pages)",
      "CMS for self-editing",
      "On-page SEO foundations",
      "3 rounds of revisions",
    ],
    featured: true,
  },
  {
    name: "Custom",
    price: "Scoped after call",
    priceNote: "",
    pitch: "Anything with logins, payments, or a database.",
    features: [
      "E-commerce or app-like builds",
      "Brand system included",
      "Ongoing support retainer available",
    ],
    featured: false,
  },
];
const SERVICES = [
  {
    name: "Storefront",
    tier: "Studio",
    body: "Product-first sites built to sell: catalog, M-Pesa-ready checkout, and the copy to back it up. We design the path from first click to paid, then build it.",
  },
  {
    name: "Studio",
    tier: "Studio",
    body: "Portfolio and case-study systems for agencies, consultants, and professional service firms. Your work argued properly, in a structure your team can keep adding to.",
  },
  {
    name: "Launch",
    tier: "Launch",
    body: "Single-page sites for a new product, offer, or event, built and shipped in under a week. Fixed scope, one round of feedback, live before your announcement.",
  },
  {
    name: "Custom",
    tier: "Custom",
    body: "E-commerce, fintech, logistics, or full brand systems scoped after a discovery call. For anything with logins, payments, or a database behind it.",
  },
];
const ALWAYS_INCLUDED = [
  "Responsive build from 320px up — designed for the phone first",
  "On-page SEO basics",
  "A short launch walkthrough over a call or WhatsApp",
  "30 days of post-launch support",
];
const PROCESS_STEPS = [
  {
    n: "01",
    name: "Discover",
    duration: "Week 1",
    body: "A 45-minute call plus a short written brief — over Zoom or a WhatsApp voice note, whichever is easier. We agree the goal, the pages, and what counts as done before anyone opens a design file.",
  },
  {
    n: "02",
    name: "Design",
    duration: "Weeks 2–3",
    body: "Direction first, then full page designs. You see the real layout with real copy — no grey boxes, no mood boards standing in for decisions.",
  },
  {
    n: "03",
    name: "Build",
    duration: "Weeks 4–5",
    body: "We build responsive, fast, and accessible on ordinary 4G speeds, with your content loaded in the CMS as we go. You get a staging link from day one of this step.",
  },
  {
    n: "04",
    name: "Launch",
    duration: "Week 6",
    body: "Domain, analytics, and SEO basics wired up, plus a walkthrough recording. Thirty days of support start the day you go live.",
  },
];
const CLIENT_INPUTS = [
  "Content and copy inputs, or a decision to have us write them",
  "Brand assets if you have them — logo files, fonts, photography",
  "One point of contact who can approve feedback, ideally reachable on WhatsApp",
];
const PRINCIPLES = [
  {
    name: "We design for revenue, not awards",
    body: "Every layout decision is measured against whether it helps someone buy, book, or enquire. Nothing on the page is there because it looked good in a case study.",
  },
  {
    name: "Fixed scope beats open retainers",
    body: "You know the price and the finish line before we start. If the scope genuinely changes, we quote the change rather than absorbing it into a vague monthly fee.",
  },
  {
    name: "Speed is a design constraint",
    body: "A site that ships in five weeks and earns is worth more than a perfect one that ships in five months. We plan around the launch date, not around us.",
  },
  {
    name: "You own everything",
    body: "Files, code, domain, accounts. No proprietary builder you can only leave by rebuilding from scratch.",
  },
];
// TODO(owner): add real client quotes here. The home-page Testimonials section stays hidden while
// this list is empty. Shape: { text: "What they said", name: "Full name", role: "Role, Company" }
const TESTIMONIALS = [];

const FAQ_GROUPS = [
  {
    group: "Scope & pricing",
    items: [
      {
        q: "What if I need more pages than my package includes?",
        a: "We quote the extra pages before we build them, at a fixed rate per page. You approve it in writing, and it goes into the same timeline. Nothing gets added to your invoice after the fact.",
      },
      {
        q: "What's not included in a package?",
        a: "Photography, video production, copywriting beyond one editing pass, and third-party licences such as fonts or stock. We'll flag anything you need in the discovery call and give you a number.",
      },
      {
        q: "Do you offer payment plans?",
        a: "Yes. Standard terms are 50% to book the slot and 50% on launch, paid by M-Pesa or bank transfer. For Custom projects we split it across three or four milestones.",
      },
    ],
  },
  {
    group: "Timeline & process",
    items: [
      {
        q: "What happens if I'm not happy with the first draft?",
        a: "You tell us plainly and we revise. Studio includes three rounds. If a direction is wrong, we redraw it rather than defending it.",
      },
      {
        q: "How much of my time will this take?",
        a: "About four hours total for a Launch project and six to eight for Studio: one kickoff call, two feedback rounds, and a launch walkthrough. Everything else happens on our side.",
      },
      {
        q: "Can you work with my existing brand?",
        a: "Yes, and we prefer to when the brand is working. We'll extend your existing type, colour, and logo into a web system rather than replacing them for the sake of it.",
      },
    ],
  },
  {
    group: "Ownership & after launch",
    items: [
      {
        q: "Do I own the final website?",
        a: "You do — code, design files, domain, and every account. We hand over admin access at launch and remove ourselves whenever you ask.",
      },
      {
        q: "What platform do you build on?",
        a: "Custom-built front ends with a headless CMS for editable content, and Shopify when the project is a straightforward store. We pick the one you can run without us, even on a basic laptop or a phone.",
      },
      {
        q: "Do you offer ongoing maintenance?",
        a: "Thirty days of support are included with every package. After that, retainers start at KES 15,000 a month for updates, monitoring, and small changes.",
      },
    ],
  },
];
export {
  ALWAYS_INCLUDED,
  CATEGORIES,
  CLIENT_INPUTS,
  FAQ_GROUPS,
  PRINCIPLES,
  PROCESS_STEPS,
  PROJECTS,
  SERVICES,
  TESTIMONIALS,
  TIERS,
};

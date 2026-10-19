const PROJECTS = [
  {
    slug: "tulia-coffee",
    placeholder: true, // TODO(owner): template project, replace with real work or delete
    name: "Tulia Coffee Co.",
    category: "E-commerce",
    summary: "Repeat-subscription coffee storefront in Nairobi — 3.2× checkout conversion.",
    variant: "commerce",
    headline: "Roasted this week, at your door on Friday.",
    tags: ["E-commerce", "Studio tier", "6 weeks"],
    brief:
      "Tulia sold excellent coffee through a template store that treated a subscription like an afterthought. Repeat orders were tracked on WhatsApp by hand, and the checkout lost roughly half of mobile buyers before M-Pesa payment.",
    approach: [
      {
        title: "Subscription as the default path",
        body: "We rebuilt the product page around roast date and delivery cadence instead of a generic add-to-cart, so the recurring option is the obvious one rather than a checkbox at the end.",
      },
      {
        title: "A checkout that fits one thumb",
        body: "Three steps became one scrolling sheet with M-Pesa and card payment first. Every field earns its place; nothing asks twice.",
      },
      {
        title: "Copy written next to the roaster",
        body: "Product copy came out of a morning at the roastery in Kiambu, not a brief. Each blend reads like the person who roasts it is describing it to you.",
      },
    ],
    results: [
      {
        label: "Checkout conversion",
        stat: "3.2×",
        caption: "Mobile checkout completion vs. the old store.",
      },
      {
        label: "Subscribers",
        stat: "1,400",
        caption: "Active recurring deliveries within four months.",
      },
      { label: "Load time", stat: "0.9s", caption: "Largest contentful paint on 4G." },
    ],
    quote: {
      text: "We stopped explaining our subscription to people. The site does it now, and it does it better than we did.",
      name: "Dana Okwiri",
      role: "Founder, Tulia Coffee Co.",
    },
    gallery: [
      {
        variant: "commerce",
        headline: "Choose your blend.",
        alt: "Tulia Coffee Co. product listing page",
      },
      {
        variant: "editorial",
        headline: "The Friday delivery.",
        alt: "Tulia Coffee Co. subscription explainer page",
      },
      {
        variant: "dashboard",
        headline: "Manage your roast.",
        alt: "Tulia Coffee Co. customer account dashboard",
      },
    ],
  },
  {
    slug: "kilimani-homes",
    placeholder: true, // TODO(owner): template project, replace with real work or delete
    name: "Kilimani Homes",
    category: "Real Estate",
    summary: "Listings platform for a boutique Nairobi brokerage — 41% more viewing requests.",
    variant: "dashboard",
    headline: "Live life in the right address.",
    tags: ["Real Estate", "Custom tier", "10 weeks"],
    brief:
      "Kilimani Homes listed forty properties across Nairobi and Mombasa in a spreadsheet-driven site nobody enjoyed using. Buyers messaged on WhatsApp to ask for details that were already on the page.",
    approach: [
      {
        title: "One view for every listing",
        body: "Map, gallery, and specification live on a single screen, so a buyer never loses their place while comparing two homes.",
      },
      {
        title: "Agent-editable, without a developer",
        body: "Listings publish from a structured CMS with photo ordering, status badges, and open-house scheduling built in.",
      },
      {
        title: "Requests that qualify themselves",
        body: "The viewing request form captures budget and timing up front, so agents call warm leads first.",
      },
    ],
    results: [
      {
        label: "Viewing requests",
        stat: "+41%",
        caption: "Qualified requests in the first quarter.",
      },
      { label: "Time to publish", stat: "6 min", caption: "Average time to list a new property." },
      { label: "Bounce rate", stat: "-28%", caption: "On listing detail pages." },
    ],
    gallery: [
      {
        variant: "dashboard",
        headline: "Every listing, one view.",
        alt: "Kilimani Homes listings index",
      },
      {
        variant: "portfolio",
        headline: "Book a viewing.",
        alt: "Kilimani Homes viewing request flow",
      },
      {
        variant: "editorial",
        headline: "Neighbourhood notes.",
        alt: "Kilimani Homes neighbourhood guide page",
      },
    ],
  },
  {
    slug: "amana-pay",
    placeholder: true, // TODO(owner): template project, replace with real work or delete
    name: "Amana Pay",
    category: "SaaS & Product",
    summary: "Fintech onboarding product — positioning, site, and interface system.",
    variant: "editorial",
    headline: "Onboard your customers in under a minute.",
    tags: ["SaaS & Product", "Custom tier", "8 weeks"],
    brief:
      "Amana had a working product and no way to explain it to businesses. The old site led with the technology and buried the outcome, and demo requests came almost entirely from existing referrals.",
    approach: [
      {
        title: "Lead with the job, not the tech",
        body: "We rewrote the top of the funnel around the thing customers actually buy: onboarding that verifies identity and finishes itself.",
      },
      {
        title: "A live product surface on the page",
        body: "The hero runs a scripted product moment rather than a screenshot, so the value is visible in under five seconds.",
      },
      {
        title: "An interface system the team can extend",
        body: "Components, type scale, and states shipped as a documented kit used across both marketing and app.",
      },
    ],
    results: [
      { label: "Demo requests", stat: "+68%", caption: "Inbound demos month over month." },
      { label: "Time on page", stat: "2m 40s", caption: "Median session on the home page." },
      { label: "Ship time", stat: "8 wks", caption: "Positioning through launch." },
    ],
    quote: {
      text: "It's the first version of our site a salesperson can just send.",
      name: "Faith Karanja",
      role: "Co-founder, Amana Pay",
    },
    gallery: [
      { variant: "editorial", headline: "Hi, I'm Amana.", alt: "Amana Pay home page hero" },
      {
        variant: "dashboard",
        headline: "Onboarding, finished.",
        alt: "Amana Pay product interface",
      },
      { variant: "portfolio", headline: "Built for teams.", alt: "Amana Pay pricing page" },
    ],
  },
  {
    slug: "baze-nights",
    placeholder: true, // TODO(owner): template project, replace with real work or delete
    name: "Baze Nights",
    category: "Brand & Marketing",
    summary: "Independent Nairobi music series — 2,100 tickets sold in the first month.",
    variant: "music",
    headline: "Enter the sound.",
    tags: ["Brand & Marketing", "Launch tier", "5 days"],
    brief:
      "A new Westlands club night needed an identity and a single page that could sell tickets before the first event, with a launch date already fixed.",
    approach: [
      {
        title: "One page, one job",
        body: "Line-up, date, price, and an M-Pesa ticket button that never leaves the screen.",
      },
      {
        title: "A mark that works at 40px",
        body: "The identity was drawn for a phone lock screen and a door poster first.",
      },
      {
        title: "Shipped in five days",
        body: "Fixed scope, one round of feedback, live before the announcement.",
      },
    ],
    results: [
      { label: "Tickets sold", stat: "2,100", caption: "In the first month of sales." },
      { label: "Build time", stat: "5 days", caption: "Brief to live site." },
      { label: "Sell-through", stat: "94%", caption: "Of capacity across the opening season." },
    ],
    gallery: [
      { variant: "music", headline: "Enter the sound.", alt: "Baze Nights landing page" },
      { variant: "editorial", headline: "The line-up.", alt: "Baze Nights line-up section" },
      { variant: "commerce", headline: "Get tickets.", alt: "Baze Nights ticket checkout" },
    ],
  },
  {
    slug: "studio-boma",
    placeholder: true, // TODO(owner): template project, replace with real work or delete
    name: "Studio Boma",
    category: "Brand & Marketing",
    summary: "Architecture practice portfolio — case studies that win commissions.",
    variant: "portfolio",
    headline: "We bring imagination to life.",
    tags: ["Brand & Marketing", "Studio tier", "6 weeks"],
    brief:
      "Boma's work was strong and their site showed it as a grid of thumbnails with no story. Prospective clients could not tell what a project cost or how long it took.",
    approach: [
      {
        title: "Projects as arguments",
        body: "Every case study opens with the constraint and closes with the outcome.",
      },
      {
        title: "Photography given room",
        body: "Full-bleed imagery with type that stays out of the way.",
      },
      {
        title: "A CMS the studio runs",
        body: "New projects publish in an afternoon without a developer.",
      },
    ],
    results: [
      { label: "Enquiries", stat: "+55%", caption: "Qualified commission enquiries." },
      { label: "Pages per visit", stat: "4.6", caption: "Average across new visitors." },
      { label: "Publish time", stat: "1 day", caption: "For a full new case study." },
    ],
    gallery: [
      {
        variant: "portfolio",
        headline: "We bring imagination to life.",
        alt: "Studio Boma home page",
      },
      { variant: "editorial", headline: "Harbour House.", alt: "Studio Boma project case study" },
      { variant: "dashboard", headline: "The practice.", alt: "Studio Boma about page" },
    ],
  },
  {
    slug: "kilele-advocates",
    placeholder: true, // TODO(owner): template project, replace with real work or delete
    name: "Kilele Advocates",
    category: "Brand & Marketing",
    summary: "Boutique Nairobi law firm site — consultations booked without a phone call.",
    variant: "editorial",
    headline: "Advice you can act on.",
    tags: ["Professional services", "Studio tier", "5 weeks"],
    brief:
      "Kilele's clients wanted to know whether the firm handled their situation and what a first meeting cost. Neither answer was on the old site.",
    approach: [
      {
        title: "Answer the two real questions",
        body: "Practice areas and fee structure sit above everything else.",
      },
      {
        title: "Booking instead of a contact form",
        body: "Consultations schedule directly against the partners' calendars.",
      },
      {
        title: "Plain-language writing",
        body: "Every page rewritten out of legalese and into sentences.",
      },
    ],
    results: [
      { label: "Consultations", stat: "+37%", caption: "Booked directly through the site." },
      { label: "Phone triage", stat: "-60%", caption: "Fewer unqualified intake calls." },
      { label: "Launch", stat: "5 wks", caption: "From kickoff to live." },
    ],
    gallery: [
      {
        variant: "editorial",
        headline: "Advice you can act on.",
        alt: "Kilele Advocates home page",
      },
      {
        variant: "portfolio",
        headline: "Practice areas.",
        alt: "Kilele Advocates practice areas page",
      },
      {
        variant: "dashboard",
        headline: "Book a consultation.",
        alt: "Kilele Advocates booking flow",
      },
    ],
  },
  {
    slug: "jikoni-kitchen",
    placeholder: true, // TODO(owner): template project, replace with real work or delete
    name: "Jikoni Kitchen",
    category: "E-commerce",
    summary: "Neighbourhood Nairobi restaurant — reservations up 48% off a single page.",
    variant: "commerce",
    headline: "Dinner, five nights a week.",
    tags: ["Hospitality", "Launch tier", "5 days"],
    brief:
      "Jikoni was fully booked by word of mouth on weekends and quiet midweek. They needed a page that made a Tuesday table feel like a plan, bookable straight from Instagram.",
    approach: [
      {
        title: "Menu first, always current",
        body: "The seasonal menu updates from the kitchen, not a designer.",
      },
      {
        title: "Reservations in two taps",
        body: "Booking widget in the hero, no scrolling required.",
      },
      {
        title: "Photography direction",
        body: "A short shot list the team can re-shoot each season themselves.",
      },
    ],
    results: [
      { label: "Reservations", stat: "+48%", caption: "Midweek covers within two months." },
      { label: "Mobile share", stat: "86%", caption: "Of all bookings made on a phone." },
      { label: "Build time", stat: "5 days", caption: "Brief to live." },
    ],
    gallery: [
      {
        variant: "commerce",
        headline: "Dinner, five nights a week.",
        alt: "Jikoni Kitchen home page",
      },
      { variant: "editorial", headline: "This week's menu.", alt: "Jikoni Kitchen menu page" },
      { variant: "portfolio", headline: "Book a table.", alt: "Jikoni Kitchen reservation screen" },
    ],
  },
  {
    slug: "nguvu-fitness",
    placeholder: true, // TODO(owner): template project, replace with real work or delete
    name: "Nguvu Fitness",
    category: "SaaS & Product",
    summary: "Coaching platform — member signups doubled after the rebuild.",
    variant: "dashboard",
    headline: "Train the plan, not the mood.",
    tags: ["Fitness", "Custom tier", "9 weeks"],
    brief:
      "Nguvu ran coaching over spreadsheets and an M-Pesa paybill number. Members churned because progress was invisible between sessions.",
    approach: [
      {
        title: "Progress you can see",
        body: "Every session logs against a visible block, so the plan explains itself.",
      },
      {
        title: "Billing built in",
        body: "Membership tiers, pauses, and cancellations handled without a manual M-Pesa reconciliation.",
      },
      {
        title: "Coach tooling",
        body: "Programme templates that take minutes rather than an evening.",
      },
    ],
    results: [
      { label: "Signups", stat: "2×", caption: "New members per month." },
      { label: "Churn", stat: "-31%", caption: "Monthly member churn." },
      { label: "Admin time", stat: "-6 hrs", caption: "Saved per coach, per week." },
    ],
    gallery: [
      { variant: "dashboard", headline: "Train the plan.", alt: "Nguvu Fitness member dashboard" },
      {
        variant: "portfolio",
        headline: "Your block, week 3.",
        alt: "Nguvu Fitness programme view",
      },
      {
        variant: "commerce",
        headline: "Choose a membership.",
        alt: "Nguvu Fitness membership pricing",
      },
    ],
  },
  {
    slug: "tumaini-trust",
    placeholder: true, // TODO(owner): template project, replace with real work or delete
    name: "Tumaini Trust",
    category: "Brand & Marketing",
    summary: "NGO rebuild — recurring donations up 2.4× year on year.",
    variant: "portfolio",
    headline: "Small gifts, compounding.",
    tags: ["Nonprofit", "Studio tier", "6 weeks"],
    brief:
      "Tumaini's donation page asked for a one-off M-Pesa amount and told donors nothing about where it went. Recurring giving was under a tenth of revenue.",
    approach: [
      {
        title: "Show the unit of impact",
        body: "Every amount is paired with what it funds, in one sentence.",
      },
      {
        title: "Monthly as the default",
        body: "The recurring option is pre-selected and easy to change.",
      },
      {
        title: "Reporting on the page",
        body: "Annual outcomes published as a live section, not a buried PDF.",
      },
    ],
    results: [
      {
        label: "Recurring giving",
        stat: "2.4×",
        caption: "Year-on-year monthly donation revenue.",
      },
      { label: "Average gift", stat: "+22%", caption: "Across all donation types." },
      {
        label: "Donor retention",
        stat: "78%",
        caption: "Twelve-month retention on monthly gifts.",
      },
    ],
    gallery: [
      {
        variant: "portfolio",
        headline: "Small gifts, compounding.",
        alt: "Tumaini Trust home page",
      },
      { variant: "commerce", headline: "Give monthly.", alt: "Tumaini Trust donation flow" },
      { variant: "editorial", headline: "Where it goes.", alt: "Tumaini Trust impact report page" },
    ],
  },
  {
    slug: "kaskazi-logistics",
    placeholder: true, // TODO(owner): template project, replace with real work or delete
    name: "Kaskazi Logistics",
    category: "SaaS & Product",
    summary: "Cross-border logistics quoting tool — quotes returned in seconds, not a day.",
    variant: "editorial",
    headline: "Price the load before you take the call.",
    tags: ["SaaS & Product", "Custom tier", "11 weeks"],
    brief:
      "Kaskazi quoted freight by email and WhatsApp. Customers waited a day, and half of them booked with whoever answered first — often a competitor across the border.",
    approach: [
      {
        title: "An instant quote engine",
        body: "Route, weight, and date return a price on the page immediately.",
      },
      {
        title: "A marketing site that trusts the tool",
        body: "The quoting widget is the hero — there is nothing to explain.",
      },
      { title: "Ops handoff", body: "Accepted quotes drop straight into the dispatch queue." },
    ],
    results: [
      { label: "Quote turnaround", stat: "8s", caption: "Median, down from roughly 20 hours." },
      { label: "Win rate", stat: "+29%", caption: "On inbound quote requests." },
      { label: "Manual quotes", stat: "-74%", caption: "Handled by the operations team." },
    ],
    gallery: [
      { variant: "editorial", headline: "Price the load.", alt: "Kaskazi Logistics quoting hero" },
      {
        variant: "dashboard",
        headline: "Dispatch queue.",
        alt: "Kaskazi Logistics operations dashboard",
      },
      { variant: "portfolio", headline: "Lanes we run.", alt: "Kaskazi Logistics coverage page" },
    ],
  },
  {
    slug: "rommie",
    liveUrl: "https://rommieweb.vercel.app",
    name: "Rommie",
    category: "E-commerce",
    summary:
      "Student rooms and hostels marketplace in Nairobi, with listings, an admin panel and simple sign-in.",
    variant: "commerce",
    headline: "Find a room near your school.",
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
    gallery: [],
  },
  {
    slug: "zuno",
    liveUrl: "https://escrowzuno.vercel.app",
    name: "ZUNO",
    category: "SaaS & Product",
    summary:
      "Escrow payment platform for online marketplace deals — funds held until delivery is confirmed.",
    variant: "dashboard",
    headline: "Every transaction, secured.",
    image: "/zuno-hero.webp",
    tags: ["SaaS & Product", "4 months"],
    brief:
      "ZUNO needed to make an abstract idea — a neutral third party holding a payment until both sides are satisfied — feel simple enough that a first-time buyer would trust it in seconds, not after reading a terms page.",
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
    gallery: [
      {
        variant: "dashboard",
        headline: "Every transaction, secured.",
        alt: "ZUNO landing page",
        image: "/zuno-escrow-confirmed.webp",
      },
      {
        variant: "editorial",
        headline: "Funds locked until delivery.",
        alt: "ZUNO escrow explainer",
        image: "/zuno-tracking.webp",
      },
      {
        variant: "portfolio",
        headline: "Verified sellers only.",
        alt: "ZUNO seller verification",
        image: "/zuno-sellers.webp",
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
      "Healthcare marketing site with online booking — 10K+ patients served, 98% satisfaction.",
    variant: "editorial",
    headline: "Your health, our priority.",
    image: "/sharks-clinic-hero.webp",
    tags: ["Brand & Marketing", "3 weeks"],
    brief:
      "Sharks Clinic needed a site that could carry the weight of a healthcare decision — clear service departments, a straightforward way to book, and enough real patient trust signals that a first-time visitor felt comfortable choosing them over a name they already knew.",
    approach: [
      {
        title: "Departments, not a single service list",
        body: "General health checkups, treatment for minor illnesses, and vaccinations each get their own clear entry point, so a visitor with a specific need doesn't have to hunt for it.",
      },
      {
        title: "Booking as the primary action",
        body: "Book Appointment sits ahead of everything else in the hero, with Our Services as the secondary path for people who want to look first.",
      },
      {
        title: "Real patients, not stock reassurance",
        body: "Testimonials carry names and ratings rather than generic praise, next to the clinic's actual patient and satisfaction figures.",
      },
    ],
    results: [
      { label: "Patients served", stat: "10K+", caption: "Treated through the clinic to date." },
      { label: "Patient satisfaction", stat: "98%", caption: "Reported across patient feedback." },
      { label: "Support availability", stat: "24/7", caption: "Emergency and patient support." },
    ],
    quote: {
      text: "The doctors were extremely professional and caring. The booking process was smooth and I received excellent care.",
      name: "Collins King'oina",
      role: "Patient, Sharks Clinic",
    },
    gallery: [
      {
        variant: "editorial",
        headline: "Your health, our priority.",
        alt: "Sharks Clinic home page",
        image: "/sharks-clinic-gallery-1.webp",
      },
      {
        variant: "portfolio",
        headline: "Departments.",
        alt: "Sharks Clinic services page",
        image: "/sharks-clinic-gallery-2.webp",
      },
      {
        variant: "dashboard",
        headline: "Book an appointment.",
        alt: "Sharks Clinic appointment booking",
        image: "/sharks-clinic-gallery-3.webp",
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
// TODO(owner): TEAM is template data, replace with your real bio
const TEAM = [
  {
    name: "Amani Otieno",
    role: "Founder & design lead",
    specialty: "Positioning and page architecture",
    variant: "portfolio",
  },
  {
    name: "Brian Mwangi",
    role: "Build lead",
    specialty: "Front-end performance and CMS systems",
    variant: "dashboard",
  },
  {
    name: "Faiza Abdi",
    role: "Writer",
    specialty: "Product copy and case studies",
    variant: "editorial",
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
  TEAM,
  TESTIMONIALS,
  TIERS,
};

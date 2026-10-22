/**
 * Home "Live sites" list. The URLs come from each project's `liveUrl` in alvan-data.js,
 * so there is one place to edit a link. Order = order on the page.
 * url === null means "link coming soon".
 */
const BLURBS = {
  zuno: "Escrow for online marketplace deals. Funds are held until delivery is confirmed.",
  rommie: "Student rooms and hostels, found and compared in one place.",
  "sharks-clinic": "Clinic website with departments and online appointment booking.",
};

export function buildLiveSites(projects) {
  return ["zuno", "rommie", "sharks-clinic"]
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean)
    .map((p) => ({ slug: p.slug, name: p.name, url: p.liveUrl ?? null, blurb: BLURBS[p.slug] }));
}
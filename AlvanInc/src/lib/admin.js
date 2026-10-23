import { API_URL } from "@/lib/api";

/**
 * Backend calls for the admin dashboard.
 *
 * Every request sends `credentials: "include"`, which is what attaches the `admin_token`
 * cookie the backend sets on login — without it the browser leaves the cookie behind and
 * every protected route answers 401.
 *
 * Failures are thrown as AdminError, whose `status` is the HTTP code (0 when the backend
 * could not be reached at all), so pages can tell "signed out" from "server down".
 */
export class AdminError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "AdminError";
    this.status = status;
  }
}

export async function adminFetch(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new AdminError("Can't reach the backend. Is it running on " + (API_URL || "this host") + "?", 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // 204 / empty body: nothing to read, and that is fine.
  }
  if (!res.ok) throw new AdminError(data?.error ?? `HTTP ${res.status}`, res.status);
  return data;
}

/** "Is this session cookie still valid?" -> resolves when signed in, throws 401 when not. */
export const adminMe = () => adminFetch("/api/admin/me");

export const adminLogin = (email, password) =>
  adminFetch("/api/admin/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const adminLogout = () => adminFetch("/api/admin/logout", { method: "POST" });

export const adminEnquiries = () => adminFetch("/api/enquiries");

/* ------------------------------------------------------------------------------------------
 * Enquiries
 * ---------------------------------------------------------------------------------------- */

export const ENQUIRY_STATUSES = ["new", "read", "replied", "archived"];

export const setEnquiryStatus = (id, status) =>
  adminFetch(`/api/admin/enquiries/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });

export const deleteEnquiry = (id) => adminFetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });

/* ------------------------------------------------------------------------------------------
 * Content writes. Every editable table has the same three verbs, so one factory builds them.
 * ---------------------------------------------------------------------------------------- */

const crud = (path) => ({
  create: (body) => adminFetch(`/api/admin/${path}`, { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => adminFetch(`/api/admin/${path}/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id) => adminFetch(`/api/admin/${path}/${id}`, { method: "DELETE" }),
});

export const api = {
  services: crud("services"),
  process: crud("process"),
  categories: crud("categories"),
  packages: crud("packages"),
  projects: crud("projects"),
  faqGroups: crud("faq/groups"),
  faqItems: crud("faq/items"),
};

/* ------------------------------------------------------------------------------------------
 * Content reads. The editor lists come from the same public endpoints the website uses, so
 * what you see here is exactly what visitors see. Each loader returns plain arrays whose rows
 * carry a numeric `sort_order`, which is what the reorder buttons work from.
 * ---------------------------------------------------------------------------------------- */

const sortOf = (row) => Number(row.sortOrder ?? row.sort_order ?? 0);

export const loadServices = async () =>
  (await adminFetch("/api/services")).services.map((s) => ({ ...s, sort_order: sortOf(s) }));

export const loadProcess = async () =>
  (await adminFetch("/api/process")).steps.map((s) => ({ ...s, sort_order: Number(s.n) || 0 }));

export const loadCategories = async () =>
  (await adminFetch("/api/categories")).categories.map((c) => ({ ...c, sort_order: sortOf(c) }));

export const loadPackages = async () =>
  (await adminFetch("/api/packages")).packages.map((p) => ({ ...p, sort_order: sortOf(p) }));

export const loadFaq = async () =>
  (await adminFetch("/api/faq")).groups.map((g) => ({
    id: g.id,
    title: g.group,
    sort_order: sortOf(g),
    items: g.items.map((i) => ({ id: i.id, question: i.q, answer: i.a, sort_order: sortOf(i) })),
  }));

/** Projects page needs the category list too (for the dropdown and the filter tabs). */
export const loadProjects = async () => {
  const [projects, categories] = await Promise.all([adminFetch("/api/projects"), loadCategories()]);
  return {
    categories,
    projects: projects.projects.map((p) => ({ ...p, sort_order: sortOf(p) })),
  };
};

/** Counts for the overview cards. */
export const loadOverview = async () => {
  const [projects, services, process, packages, faq, categories] = await Promise.all([
    adminFetch("/api/projects"),
    loadServices(),
    loadProcess(),
    loadPackages(),
    loadFaq(),
    loadCategories(),
  ]);
  return {
    projects: projects.projects.length,
    services: services.length,
    process: process.length,
    packages: packages.length,
    categories: categories.length,
    faqGroups: faq.length,
    faqQuestions: faq.reduce((n, g) => n + g.items.length, 0),
  };
};

/* ------------------------------------------------------------------------------------------
 * Helpers shared by the editors
 * ---------------------------------------------------------------------------------------- */

/**
 * Moves `items[index]` one place (dir = -1 up, +1 down) and renumbers the list 1..n.
 * Returns only the rows whose sort_order actually changed, as { item, sort_order }, so the caller
 * saves the minimum. Renumbering (rather than swapping) also repairs lists with duplicate numbers.
 */
export function reorder(items, index, dir) {
  const to = index + dir;
  if (to < 0 || to >= items.length) return [];
  const next = [...items];
  [next[index], next[to]] = [next[to], next[index]];
  return next
    .map((item, i) => ({ item, sort_order: i + 1 }))
    .filter(({ item, sort_order }) => item.sort_order !== sort_order);
}

/** The sort_order a newly created row should get: after everything that exists. */
export const nextOrder = (items) => items.reduce((max, i) => Math.max(max, i.sort_order || 0), 0) + 1;

export const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

export function timeAgo(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const seconds = (Date.now() - d.getTime()) / 1000;
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", ...(sameYear ? {} : { year: "numeric" }) });
}

export function formatDateTime(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}


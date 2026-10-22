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

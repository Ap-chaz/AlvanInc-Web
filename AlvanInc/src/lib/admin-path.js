// Where the admin panel lives. Set VITE_ADMIN_PATH (for example "/studio-k7q2m") in the host's
// environment variables to move it off the guessable /admin. Defaults to /admin for local work.
// "?." matters: Node (the SEO build) has no import.meta.env, and some files are loaded there too.
const raw = import.meta.env?.VITE_ADMIN_PATH || "/admin";

export const ADMIN = "/" + raw.replace(/^\/+|\/+$/g, "");

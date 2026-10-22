// Where the backend lives. In development it comes from .env.development; in production
// we'll set it on the host. This is only a URL, so it's fine for it to be public.
export const API_URL = import.meta.env.VITE_API_URL ?? "";
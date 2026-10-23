import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminEnquiries } from "@/lib/admin";
import { ToastStack } from "./ui";

const AdminContext = createContext(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}

/**
 * State every admin screen shares:
 *  - toasts (`notify`)
 *  - 401 handling: any request that comes back "not signed in" sends you to the login page
 *  - `act()`: run a save/delete, toast the outcome, tell the caller whether it worked
 *  - the enquiries list, because the sidebar badge, the overview and the inbox all read it
 */
export function AdminProvider({ children }) {
  const navigate = useNavigate();

  /* ---- toasts ---- */
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Set());

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const notify = useCallback(
    (message, tone = "success") => {
      const id = ++nextId.current;
      setToasts((list) => [...list.slice(-2), { id, message, tone }]);
      const timer = setTimeout(() => {
        timers.current.delete(timer);
        dismiss(id);
      }, tone === "error" ? 7000 : 3500);
      timers.current.add(timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const live = timers.current;
    return () => live.forEach(clearTimeout);
  }, []);

  /* ---- auth + mutations ---- */
  // useNavigate() gets a new identity on every navigation under <BrowserRouter>. Everything below
  // (and every page's loader effect) depends on handleAuth, so it must stay stable: go through a ref.
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  });

  const handleAuth = useCallback((err) => {
    if (err?.status === 401) {
      navigateRef.current("/admin/login", { replace: true });
      return true;
    }
    return false;
  }, []);

  const act = useCallback(
    async (fn, success) => {
      try {
        await fn();
        if (success) notify(success);
        return true;
      } catch (err) {
        if (!handleAuth(err)) notify(err?.message || "Something went wrong.", "error");
        return false;
      }
    },
    [handleAuth, notify],
  );

  /* ---- enquiries ---- */
  const [enquiryState, setEnquiryState] = useState({ status: "loading", items: [], error: "" });

  const loadEnquiries = useCallback(async () => {
    try {
      const data = await adminEnquiries();
      setEnquiryState({ status: "ready", items: data.enquiries ?? [], error: "" });
    } catch (err) {
      if (handleAuth(err)) return;
      setEnquiryState((s) => ({ ...s, status: "error", error: err.message }));
    }
  }, [handleAuth]);

  const patchEnquiry = useCallback(
    (id, patch) =>
      setEnquiryState((s) => ({ ...s, items: s.items.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
    [],
  );

  const removeEnquiry = useCallback(
    (id) => setEnquiryState((s) => ({ ...s, items: s.items.filter((e) => e.id !== id) })),
    [],
  );

  const value = useMemo(
    () => ({
      notify,
      act,
      handleAuth,
      enquiries: enquiryState.items,
      enquiryStatus: enquiryState.status,
      enquiryError: enquiryState.error,
      loadEnquiries,
      patchEnquiry,
      removeEnquiry,
    }),
    [notify, act, handleAuth, enquiryState, loadEnquiries, patchEnquiry, removeEnquiry],
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </AdminContext.Provider>
  );
}

/**
 * Loads data for a screen. `loader` must be a stable function (the loaders in lib/admin.js are).
 * `data` stays on screen while a reload is running, so saving doesn't flash the page empty.
 */
export function useResource(loader) {
  const { handleAuth } = useAdmin();
  const [state, setState] = useState({ status: "loading", data: null, error: "" });

  const load = useCallback(async () => {
    try {
      const data = await loader();
      setState({ status: "ready", data, error: "" });
    } catch (err) {
      if (handleAuth(err)) return;
      setState({ status: "error", data: null, error: err.message });
    }
  }, [loader, handleAuth]);

  useEffect(() => {
    let alive = true;
    loader()
      .then((data) => alive && setState({ status: "ready", data, error: "" }))
      .catch((err) => {
        if (!alive || handleAuth(err)) return;
        setState({ status: "error", data: null, error: err.message });
      });
    return () => {
      alive = false;
    };
  }, [loader, handleAuth]);

  const retry = useCallback(() => {
    setState({ status: "loading", data: null, error: "" });
    load();
  }, [load]);

  return { ...state, reload: load, retry };
}

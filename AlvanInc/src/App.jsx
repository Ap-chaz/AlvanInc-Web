import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "@/components/error-boundary";
import Index from "@/pages/index";

// Home loads with the app (it is the landing page). Every other route is its own chunk,
// fetched on first visit, so the first load only ships what the home page needs.
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Faq = lazy(() => import("@/pages/faq"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Process = lazy(() => import("@/pages/process"));
const Services = lazy(() => import("@/pages/services"));
const WorkIndex = lazy(() => import("@/pages/work-index"));
const CaseStudy = lazy(() => import("@/pages/case-study"));
const NotFound = lazy(() => import("@/pages/not-found"));
// Admin screens are public JavaScript but private data: noindex, and every request behind them
// is gated by the backend's 401, not by the route.
const AdminLogin = lazy(() => import("@/pages/admin/login"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
// Dev-only: the dynamic import sits behind import.meta.env.DEV, so production builds drop it.
const Styleguide = import.meta.env.DEV ? lazy(() => import("@/pages/styleguide")) : null;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Shown for the instant a route chunk loads: same background as the page, so nothing flashes. */
function RouteFallback() {
  return (
    <div className="min-h-screen bg-background" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/process" element={<Process />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<WorkIndex />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {Styleguide && <Route path="/styleguide" element={<Styleguide />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

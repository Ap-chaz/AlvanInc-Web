import { SiteNav, CookieBar, CornerBadge, CursorRing, SkipLink } from "./chrome";
import { SiteFooter } from "./site-footer";
function PageShell({ children, cta = true, badge = false }) {
  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <SiteNav />
      <main id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter cta={cta} />
      <CookieBar />
      {badge && <CornerBadge />}
      <CursorRing />
    </div>
  );
}
export { PageShell };

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useHead } from "@/lib/use-head";
import { adminLogin, adminMe } from "@/lib/admin";
import { Button } from "@/components/alvan/button";
import { Eyebrow } from "@/components/alvan/ui";

const inputCls =
  "mt-2 w-full rounded-xl border border-white/15 bg-ink-soft px-4 py-3 text-base text-bone placeholder:text-graphite focus:border-brass";

/** Turns a failed login into something the person at the keyboard can act on. */
function messageFor(err) {
  if (err.status === 401) return "That email and password don't match. Check both, then try again.";
  if (err.status === 429) return "Too many attempts. Wait 15 minutes before trying again.";
  if (err.status === 403)
    return "This address isn't allowed to call the admin API. Check CORS_ORIGINS in backend/.env.";
  return err.message || "Sign in failed.";
}

/**
 * /admin/login — the only admin page reachable while signed out.
 * On success the backend sets an httpOnly cookie; nothing is stored in the browser.
 */
export default function AdminLogin() {
  useHead({ title: "Admin sign in — AlvanInc", noindex: true });

  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // A returning admin with a live cookie should land on the dashboard, not retype a password.
  useEffect(() => {
    let alive = true;
    adminMe()
      .then(() => {
        if (alive) navigate("/admin", { replace: true });
      })
      .catch(() => {
        if (alive) setChecking(false);
      });
    return () => {
      alive = false;
    };
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter both your email and your password.");
      return;
    }
    setSending(true);
    try {
      await adminLogin(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(messageFor(err));
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink px-5 py-8 sm:px-8">
      <Link
        to="/"
        className="label-mono inline-flex w-fit items-center gap-2 text-graphite transition-colors hover:text-brass"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to site
      </Link>

      <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-16 py-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Admin</Eyebrow>
          <h1 className="display-tight mt-6 text-4xl leading-[0.95] sm:text-5xl">
            Sign in to <span className="text-brass">manage</span> the site.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-graphite">
            Enquiries, projects, services, packages and FAQ content all live in the database behind
            this login. Nothing on this screen is public.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-ink-soft p-8 sm:p-10">
          {checking ? (
            <p className="label-mono text-graphite" role="status">
              Checking your session…
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <h2 className="display-tight text-2xl">Admin login</h2>

              <div className="mt-8">
                <label htmlFor="admin-email" className="label-mono text-graphite">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  autoFocus
                  required
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  className={inputCls}
                  placeholder="you@alvaninc.com"
                  aria-invalid={Boolean(error)}
                />
              </div>

              <div className="mt-6">
                <label htmlFor="admin-password" className="label-mono text-graphite">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className={inputCls}
                  placeholder="••••••••••••"
                  aria-invalid={Boolean(error)}
                />
              </div>

              {error ? (
                <p
                  role="alert"
                  className="mt-6 rounded-xl border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-bone"
                >
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="brass"
                icon="arrow"
                disabled={sending}
                className="mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Signing in…" : "Sign in"}
              </Button>

              <p className="mt-6 text-xs leading-relaxed text-graphite">
                Sessions last 8 hours. Ten wrong attempts in fifteen minutes locks this screen until
                the window passes — that limit is on the API, not in the page.
              </p>
            </form>
          )}
        </div>
      </main>

      <p className="label-mono mx-auto w-full max-w-5xl text-graphite">
        AlvanInc · staff only
      </p>
    </div>
  );
}

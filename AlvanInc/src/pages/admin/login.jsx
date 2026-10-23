import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useHead } from "@/lib/use-head";
import { adminLogin, adminMe } from "@/lib/admin";
import { Button } from "@/components/alvan/button";
import { Eyebrow } from "@/components/alvan/ui";
import { Wordmark } from "@/components/alvan/wordmark";
import { inputCls } from "@/components/admin/ui";

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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-ink px-5 py-8 [color-scheme:dark] sm:px-8">
      {/* Soft brass glow behind the card; decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 -right-40 top-1/4 size-[36rem] rounded-full bg-brass/10 blur-[120px]"
      />
      <Link
        to="/"
        className="label-mono inline-flex w-fit items-center gap-2 text-graphite transition-colors hover:text-brass"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to site
      </Link>

      <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-16 py-12 lg:grid-cols-2">
        <div>
          <Wordmark className="mb-12 h-7" />
          <Eyebrow>Admin</Eyebrow>
          <h1 className="display-tight mt-6 text-4xl leading-[0.95] sm:text-5xl">
            Sign in to <span className="text-brass">manage</span> the site.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-graphite">
            Enquiries, projects, services, packages and FAQ content all live in the database behind
            this login. Nothing on this screen is public.
          </p>
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-ink-soft p-8 shadow-2xl sm:p-10">
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
                  className={`${inputCls} mt-2`}
                  placeholder="you@alvaninc.com"
                  aria-invalid={Boolean(error)}
                />
              </div>

              <div className="mt-6">
                <label htmlFor="admin-password" className="label-mono text-graphite">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={`${inputCls} mt-2 pr-12`}
                    placeholder="••••••••••••"
                    aria-invalid={Boolean(error)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-[calc(50%+0.25rem)] -translate-y-1/2 rounded-full p-1.5 text-graphite transition-colors hover:text-bone"
                  >
                    {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                  </button>
                </div>
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

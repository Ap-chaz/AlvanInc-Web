import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useHead } from "@/lib/use-head";
import { adminEnquiries, adminLogout, adminMe } from "@/lib/admin";
import { Button } from "@/components/alvan/button";
import { Eyebrow } from "@/components/alvan/ui";

const STATUS_TONE = {
  new: "border-brass/60 bg-brass/10 text-brass",
  read: "border-white/20 bg-white/5 text-bone",
  replied: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  archived: "border-white/10 bg-transparent text-graphite",
};

const when = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

function Status({ value }) {
  return (
    <span
      className={`label-mono inline-block rounded-full border px-2.5 py-1 text-[0.625rem] ${
        STATUS_TONE[value] ?? STATUS_TONE.read
      }`}
    >
      {value ?? "—"}
    </span>
  );
}

/**
 * /admin — the dashboard shell.
 *
 * It asks the API "am I still signed in?" before it shows anything, because the page itself is
 * just static JavaScript: the guard is the 401 from /api/enquiries, not the route.
 */
export default function AdminDashboard() {
  useHead({ title: "Admin — AlvanInc", noindex: true });

  const navigate = useNavigate();
  const [state, setState] = useState("checking"); // checking | ready | error
  const [enquiries, setEnquiries] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setState("checking");
    setError("");
    try {
      await adminMe();
      const data = await adminEnquiries();
      setEnquiries(data.enquiries ?? []);
      setState("ready");
    } catch (err) {
      if (err.status === 401) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err.message);
      setState("error");
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const signOut = async () => {
    try {
      await adminLogout();
    } catch {
      // The cookie may survive a failed logout, but leaving the page still hides the data.
    }
    navigate("/admin/login", { replace: true });
  };

  const fresh = enquiries.filter((e) => e.status === "new").length;

  return (
    <div className="min-h-screen bg-ink px-5 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <Eyebrow>Admin</Eyebrow>
            <h1 className="display-tight mt-4 text-4xl leading-[0.95] sm:text-5xl">Enquiries</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button href="/" variant="secondary" icon="up-right" size="sm">
              View site
            </Button>
            <Button variant="secondary" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </header>

        {state === "checking" && (
          <p className="label-mono mt-16 text-graphite" role="status">
            Loading enquiries…
          </p>
        )}

        {state === "error" && (
          <div className="mt-16 rounded-2xl border border-destructive/60 bg-destructive/10 p-8">
            <h2 className="display-tight text-2xl">Couldn't load enquiries</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-graphite">{error}</p>
            <Button variant="secondary" size="sm" className="mt-6" onClick={load}>
              Try again
            </Button>
          </div>
        )}

        {state === "ready" && (
          <>
            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-ink-soft p-6">
                <dt className="label-mono text-graphite">Total</dt>
                <dd className="display-tight mt-4 text-4xl">{enquiries.length}</dd>
                <p className="mt-2 text-xs text-graphite">Most recent 100 from the database.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-ink-soft p-6">
                <dt className="label-mono text-graphite">Waiting on you</dt>
                <dd className="display-tight mt-4 text-4xl text-brass">{fresh}</dd>
                <p className="mt-2 text-xs text-graphite">Status “new”.</p>
              </div>
            </dl>

            {enquiries.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-white/10 p-10">
                <h2 className="display-tight text-2xl">No enquiries yet</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-graphite">
                  Submit the contact form and this table fills in. A new row is proof the whole chain
                  works: form → API → MySQL → this page.
                </p>
              </div>
            ) : (
              <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[64rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-ink-soft">
                      {["Received", "Status", "Name", "Email", "Company", "Selling", "Package", "Budget", "Timeline"].map(
                        (h) => (
                          <th key={h} scope="col" className="label-mono px-5 py-4 font-normal text-graphite">
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((e) => (
                      <tr key={e.id} className="border-b border-white/5 last:border-0 align-top">
                        <td className="whitespace-nowrap px-5 py-4 text-graphite">{when(e.created_at)}</td>
                        <td className="px-5 py-4">
                          <Status value={e.status} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-bone">{e.name}</td>
                        <td className="px-5 py-4">
                          <a href={`mailto:${e.email}`} className="link-underline text-bone">
                            {e.email}
                          </a>
                        </td>
                        <td className="px-5 py-4 text-graphite">{e.company || "—"}</td>
                        <td className="px-5 py-4 text-bone">
                          <span className="line-clamp-3 max-w-[22rem] whitespace-pre-line">{e.selling || "—"}</span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-graphite">{e.package_interest || "—"}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-graphite">{e.budget || "—"}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-graphite">{e.timeline || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="label-mono mt-8 flex items-center gap-2 text-graphite">
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
              Editors for projects, services, packages and FAQ come next
            </p>
          </>
        )}
      </div>
    </div>
  );
}

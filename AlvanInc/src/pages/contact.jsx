import { useHead } from "@/lib/use-head";
import { useState } from "react";
import { PageShell } from "@/components/alvan/page-shell";
import { Reveal } from "@/components/alvan/reveal";
import { Button } from "@/components/alvan/button";
import { PageHeader, Eyebrow } from "@/components/alvan/ui";
import { SITE, whatsappLink } from "@/lib/site";

const title = "Contact — start a fixed-price project | AlvanInc";
const description =
  "Tell us what you're selling and we'll build the site for it. Share your package, budget, and timeline and we reply within one business day.";

const EMPTY = { name: "", email: "", company: "", selling: "", pkg: "", budget: "", timeline: "" };

const inputCls =
  "mt-3 w-full rounded-xl border border-black/15 bg-transparent px-4 py-3.5 text-base text-black placeholder:text-black/35 focus:border-black/40";

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "We need a name so we know who we're replying to.";
  if (!v.email.trim()) e.email = "Add an email address so we can reply.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email))
    e.email = "That email is missing an @ or a domain — check it once more.";
  if (!v.selling.trim()) e.selling = "One line is enough — what are you selling?";
  if (!v.pkg) e.pkg = "Pick a package, or choose “Not sure” and we'll advise.";
  return e;
}

const buildBrief = (v) =>
  [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.company && `Company: ${v.company}`,
    `Selling: ${v.selling}`,
    `Package: ${v.pkg}`,
    v.budget && `Budget: ${v.budget}`,
    v.timeline && `Timeline: ${v.timeline}`,
  ]
    .filter(Boolean)
    .join("\n");

const mailtoHref = (v) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(`Project enquiry from ${v.name}`)}&body=${encodeURIComponent(buildBrief(v))}`;

const waHref = (v) => whatsappLink(`Hello AlvanInc, I'd like to start a project.\n\n${buildBrief(v)}`);

/**
 * status: "idle" | "sending" | "sent" | "fallback" | "error"
 *  - sent      the form service accepted it (needs SITE.formEndpoint)
 *  - fallback  no form service configured: we opened the visitor's email app. NOTHING is sent yet.
 *  - error     the form service failed; details are kept so they can retry or use email/WhatsApp
 */
export default function Contact() {
  useHead({ title, description });
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [honey, setHoney] = useState("");
  const set = (k) => (ev) => setValues((v) => ({ ...v, [k]: ev.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (honey) {
      setStatus("sent"); // a bot filled the hidden field: pretend success, send nothing
      return;
    }
    if (!SITE.formEndpoint) {
      window.location.href = mailtoHref(values);
      setStatus("fallback");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, _subject: `Project enquiry from ${values.name}` }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
  };

  return (
    <PageShell cta={false}>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Tell us what you&apos;re <span className="text-brass">selling</span>.
            <br />
            We&apos;ll build the site for it.
          </>
        }
        intro="A short brief is enough to start. We reply within one business day with a call time and a rough shape."
      />

      <section className="surface-light px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-24">
          <div>
            {status === "sent" && (
              <Reveal>
                <div
                  role="status"
                  className="rounded-2xl border border-brass/50 bg-bone-deep p-10"
                >
                  <h2 className="display-tight text-3xl">Thanks. We&apos;ve got your brief.</h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-black/65">
                    We&apos;ll reply within one business day with a call time. If it&apos;s urgent,
                    WhatsApp us and say so up front.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <Button href={waHref(values)} variant="secondary" tone="light">
                      WhatsApp us
                    </Button>
                    <button type="button" onClick={reset} className="link-underline text-black">
                      Send another brief <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              </Reveal>
            )}

            {status === "fallback" && (
              <Reveal>
                <div
                  role="status"
                  className="rounded-2xl border border-black/15 bg-bone-deep p-10"
                >
                  <h2 className="display-tight text-3xl">One more step.</h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-black/65">
                    We opened your email app with your brief filled in. Press <strong>Send</strong>{" "}
                    there to finish. Nothing has been sent yet. No email app? Use WhatsApp instead.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button href={mailtoHref(values)} variant="primary" tone="light">
                      Open email again
                    </Button>
                    <Button href={waHref(values)} variant="secondary" tone="light">
                      Send on WhatsApp
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="link-underline mt-10 text-black"
                  >
                    Edit my brief <span aria-hidden="true">→</span>
                  </button>
                </div>
              </Reveal>
            )}

            {(status === "idle" || status === "sending" || status === "error") && (
              <form noValidate onSubmit={onSubmit} className="grid gap-8 sm:grid-cols-2">
                <Field label="Name" error={errors.name}>
                  <input
                    className={inputCls}
                    value={values.name}
                    onChange={set("name")}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    placeholder="Your name"
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    className={inputCls}
                    type="email"
                    value={values.email}
                    onChange={set("email")}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    placeholder="you@yourbusiness.com"
                  />
                </Field>
                <Field label="Company or project name" className="sm:col-span-2">
                  <input
                    className={inputCls}
                    value={values.company}
                    onChange={set("company")}
                    placeholder="Your business name"
                  />
                </Field>
                <Field
                  label="What are you selling?"
                  error={errors.selling}
                  className="sm:col-span-2"
                >
                  <textarea
                    className={`${inputCls} min-h-32 resize-y`}
                    value={values.selling}
                    onChange={set("selling")}
                    aria-invalid={Boolean(errors.selling)}
                    placeholder="What you sell, and who you sell it to."
                  />
                </Field>
                <Field label="Which package?" error={errors.pkg}>
                  <select
                    className={inputCls}
                    value={values.pkg}
                    onChange={set("pkg")}
                    aria-invalid={Boolean(errors.pkg)}
                  >
                    <option value="">Choose one</option>
                    <option>Launch</option>
                    <option>Studio</option>
                    <option>Custom</option>
                    <option>Not sure</option>
                  </select>
                </Field>
                <Field label="Budget range">
                  <select className={inputCls} value={values.budget} onChange={set("budget")}>
                    <option value="">Choose one</option>
                    <option>Under KES 50,000</option>
                    <option>KES 50,000 – 150,000</option>
                    <option>KES 150,000 – 400,000</option>
                    <option>KES 400,000+</option>
                  </select>
                </Field>
                <Field label="Timeline" className="sm:col-span-2 sm:max-w-xs">
                  <select className={inputCls} value={values.timeline} onChange={set("timeline")}>
                    <option value="">Choose one</option>
                    <option>Within 2 weeks</option>
                    <option>1–2 months</option>
                    <option>3+ months</option>
                    <option>Still planning</option>
                  </select>
                </Field>

                {/* Honeypot: hidden from people, bots tend to fill it */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label>
                    Leave this empty
                    <input
                      name="_gotcha"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honey}
                      onChange={(ev) => setHoney(ev.target.value)}
                    />
                  </label>
                </div>

                <div className="sm:col-span-2">
                  {status === "error" && (
                    <p
                      role="alert"
                      className="mb-6 max-w-lg rounded-xl border border-[#B4472F]/40 p-4 text-sm leading-relaxed text-[#B4472F]"
                    >
                      Something went wrong sending that. Your details are still here: try again, or
                      send it by{" "}
                      <a href={mailtoHref(values)} className="underline">
                        email
                      </a>{" "}
                      or{" "}
                      <a
                        href={waHref(values)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        WhatsApp
                      </a>
                      .
                    </p>
                  )}
                  <Button
                    type="submit"
                    variant="brass"
                    icon={status === "sending" ? null : "arrow"}
                    disabled={status === "sending"}
                    className="disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Start a project"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-12">
            <div>
              <Eyebrow>Direct</Eyebrow>
              <ul className="mt-5 space-y-2 text-sm text-black/70">
                <li>
                  <a href={`mailto:${SITE.email}`} className="hover:text-brass">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a href={SITE.phoneHref} className="hover:text-brass">
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brass"
                  >
                    WhatsApp
                  </a>
                </li>
                <li className="text-black/50">{SITE.location}</li>
              </ul>
            </div>
            <div>
              <Eyebrow>Social</Eyebrow>
              <ul className="mt-5 space-y-2 text-sm text-black/70">
                {SITE.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brass"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, error, className, children }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="label-mono text-black/50">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-2 block text-xs text-[#B4472F]">
          {error}
        </span>
      )}
    </label>
  );
}

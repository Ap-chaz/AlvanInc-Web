import { useEffect, useState } from "react";
import { Button } from "./button";
import { CAREERS } from "@/lib/alvan-data";
import { API_URL } from "@/lib/api";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  city: "",
  role: "",
  portfolio: "",
  social: "",
  intro: "",
};

const inputCls =
  "mt-3 w-full rounded-xl border border-black/15 bg-transparent px-4 py-3.5 text-base text-black placeholder:text-black/65 focus:border-black/40";

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Add your full name.";
  if (!v.email.trim()) e.email = "Add an email address.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) e.email = "That email looks incomplete.";
  if (!v.phone.trim()) e.phone = "Add a phone or WhatsApp number.";
  if (!v.city.trim()) e.city = "Tell us where you are based.";
  if (!v.role) e.role = "Choose a role.";
  if (!v.intro.trim()) e.intro = "Write a few lines about yourself.";
  return e;
}

function Field({ label, error, className, children }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="label-mono text-black/65">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-2 block text-xs text-[#B4472F]">
          {error}
        </span>
      )}
    </label>
  );
}

/** Careers application form. Step 5: validation only; sending is added in a later step. */
function CareersForm({ selectedRole = "" }) {
  const [values, setValues] = useState(EMPTY);

  // When someone clicks "Apply now" on a role, pre-select that role in the dropdown.
  useEffect(() => {
    if (selectedRole) setValues((v) => ({ ...v, role: selectedRole }));
  }, [selectedRole]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const set = (k) => (ev) => setValues((v) => ({ ...v, [k]: ev.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("bad response");
      setValues({ ...EMPTY, role: values.role });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-8 sm:grid-cols-2">
      <Field label="Full name *" error={errors.name}>
        <input className={inputCls} value={values.name} onChange={set("name")} autoComplete="name" />
      </Field>
      <Field label="Email address *" error={errors.email}>
        <input className={inputCls} type="email" value={values.email} onChange={set("email")} autoComplete="email" />
      </Field>
      <Field label="Phone / WhatsApp *" error={errors.phone}>
        <input className={inputCls} value={values.phone} onChange={set("phone")} autoComplete="tel" />
      </Field>
      <Field label="Current city *" error={errors.city}>
        <input className={inputCls} value={values.city} onChange={set("city")} />
      </Field>
      <Field label="Role *" error={errors.role} className="sm:col-span-2">
        <select className={inputCls} value={values.role} onChange={set("role")}>
          <option value="">Choose a role</option>
          {CAREERS.map((r) => (
            <option key={r.slug} value={r.title}>
              {r.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Link to a profile or past work (optional)" error={errors.portfolio}>
        <input className={inputCls} value={values.portfolio} onChange={set("portfolio")} placeholder="LinkedIn, Instagram or a website link" />
      </Field>
      <Field label="Other profile (optional)">
        <input className={inputCls} value={values.social} onChange={set("social")} placeholder="LinkedIn or another link" />
      </Field>
      <Field label="Short introduction *" error={errors.intro} className="sm:col-span-2">
        <textarea
          className={`${inputCls} min-h-32 resize-y`}
          value={values.intro}
          onChange={set("intro")}
          placeholder="What you create, the tools you use (Canva, video editing), and why you want this role."
        />
      </Field>

      <div className="sm:col-span-2">
        {status === "sent" && (
          <p role="status" className="mb-6 max-w-lg rounded-xl border border-black/15 p-4 text-sm leading-relaxed text-black/70">
            Thanks, we've got your application. We'll be in touch.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="mb-6 max-w-lg rounded-xl border border-[#B4472F]/40 p-4 text-sm leading-relaxed text-[#B4472F]">
            Something went wrong and your application was not sent. Your details are still here, so please try again.
          </p>
        )}
        <Button type="submit" variant="brass" icon="arrow" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Submit application"}
        </Button>
      </div>
    </form>
  );
}

export { CareersForm };
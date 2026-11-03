import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reveal } from "./reveal";
import { Eyebrow } from "./ui";
import { Button } from "./button";
import {
  SIZES,
  FEATURES,
  WRITING,
  BRANDING,
  CARE,
  SECOND_LANGUAGE,
  RUSH,
  RUNNING_COSTS,
  SOURCES,
  PHOTO_NOTE,
  priceTable,
  estimate,
  summarise,
  kes,
} from "@/lib/calculator-data";

const INITIAL = {
  size: "one",
  features: [],
  writing: "own",
  branding: "have",
  swahili: false,
  rush: false,
  care: "none",
};

const OPTION_BASE =
  "flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors has-[:checked]:border-brass has-[:checked]:bg-bone-deep has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brass border-black/10 hover:border-black/30";

function Option({ type, name, checked, onChange, label, help, price }) {
  return (
    <label className={OPTION_BASE}>
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 size-4 shrink-0 accent-brass"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium leading-snug text-black">{label}</span>
        {help && <span className="mt-1 block text-sm leading-relaxed text-black/65">{help}</span>}
      </span>
      {price && <span className="label-mono shrink-0 text-right text-black/65">{price}</span>}
    </label>
  );
}

function Step({ n, title, children }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="label-mono mb-4 text-black/65">
        <span className="text-brass">{n}</span> &nbsp;{title}
      </legend>
      <div className="grid gap-3">{children}</div>
    </fieldset>
  );
}

const range = ([l, h]) => (l === h ? kes(l) : `${l.toLocaleString("en-KE")} – ${h.toLocaleString("en-KE")}`);

export function PriceCalculator() {
  const [c, setC] = useState(INITIAL);
  const navigate = useNavigate();
  const est = useMemo(() => estimate(c), [c]);

  const toggleFeature = (id) =>
    setC((v) => ({
      ...v,
      features: v.features.includes(id) ? v.features.filter((f) => f !== id) : [...v.features, id],
    }));

  const send = () =>
    navigate("/contact", {
      state: {
        estimate: {
          text: summarise(c, est),
          pkg: est.pkg,
          budget: est.budget,
          low: est.low,
          high: est.high,
        },
      },
    });

  return (
    <section id="calculator" className="surface-light-deep px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <Eyebrow>Price calculator</Eyebrow>
        <h2 className="display-tight mt-8 max-w-3xl text-4xl sm:text-5xl">
          Build your website, <span className="text-brass">see the price</span>.
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-black/65">
          Tick what you want. The estimate updates as you go, so you know roughly what to expect
          before we ever speak. No technical words, no obligation.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
        <div className="space-y-12">
          <Step n="01" title="How big is your website?">
            {SIZES.map((s) => (
              <Option
                key={s.id}
                type="radio"
                name="size"
                checked={c.size === s.id}
                onChange={() => setC((v) => ({ ...v, size: s.id }))}
                label={s.label}
                help={s.help}
                price={`from ${s.price[0].toLocaleString("en-KE")}`}
              />
            ))}
          </Step>

          <Step n="02" title="What should it do? (pick any)">
            {FEATURES.map((f) => (
              <Option
                key={f.id}
                type="checkbox"
                name={f.id}
                checked={c.features.includes(f.id)}
                onChange={() => toggleFeature(f.id)}
                label={f.label}
                help={f.help}
                price={f.included ? "Included" : f.price[0] === f.price[1] ? `${f.price[0].toLocaleString("en-KE")}` : `+ ${f.price[0].toLocaleString("en-KE")}`}
              />
            ))}
            <Option
              type="checkbox"
              name="swahili"
              checked={c.swahili}
              onChange={() => setC((v) => ({ ...v, swahili: !v.swahili }))}
              label={SECOND_LANGUAGE.label}
              help="Your visitors can read the whole site in either language."
              price="+ 25–40%"
            />
          </Step>

          <Step n="03" title="Who writes the words?">
            {WRITING.map((w) => (
              <Option
                key={w.id}
                type="radio"
                name="writing"
                checked={c.writing === w.id}
                onChange={() => setC((v) => ({ ...v, writing: w.id }))}
                label={w.label}
                price={w.perPage ? `+ ${w.perPage[0].toLocaleString("en-KE")} / page` : undefined}
              />
            ))}
          </Step>

          <Step n="04" title="Do you have a logo and brand look?">
            {BRANDING.map((b) => (
              <Option
                key={b.id}
                type="radio"
                name="branding"
                checked={c.branding === b.id}
                onChange={() => setC((v) => ({ ...v, branding: b.id }))}
                label={b.label}
                price={b.price[1] > 0 ? `+ ${b.price[0].toLocaleString("en-KE")}` : undefined}
              />
            ))}
          </Step>

          <Step n="05" title="How soon do you need it?">
            <Option
              type="checkbox"
              name="rush"
              checked={c.rush}
              onChange={() => setC((v) => ({ ...v, rush: !v.rush }))}
              label={RUSH.label}
              help="Otherwise we plan it at a normal, comfortable pace. A fast build is priced on the call."
              price="Quoted on call"
            />
          </Step>

          <Step n="06" title="Want us to look after it once it is live?">
            {CARE.map((x) => (
              <Option
                key={x.id}
                type="radio"
                name="care"
                checked={c.care === x.id}
                onChange={() => setC((v) => ({ ...v, care: x.id }))}
                label={x.label}
                price={x.monthly[1] > 0 ? `${x.monthly[0].toLocaleString("en-KE")} / mo` : undefined}
              />
            ))}
          </Step>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
          <div className="rounded-2xl border border-brass/60 bg-bone p-7 sm:p-8">
            <p className="label-mono text-black/65">Your estimate</p>
            <p className="display-tight mt-5 text-3xl leading-tight sm:text-4xl">
              {kes(est.low)}
              <span className="text-black/40"> – </span>
              {kes(est.high)}
            </p>
            <p className="label-mono mt-3 text-black/65">One-time, for the website</p>

            {est.monthly[1] > 0 && (
              <p className="mt-6 border-t border-black/10 pt-6 text-sm leading-relaxed text-black/75">
                <strong className="font-medium text-black">
                  Then {kes(est.monthly[0])} – {kes(est.monthly[1])} a month
                </strong>{" "}
                for looking after it.
              </p>
            )}

            <ul className="mt-6 space-y-2.5 border-t border-black/10 pt-6">
              {est.lines.map((l) => (
                <li key={l.label} className="flex justify-between gap-4 text-sm text-black/75">
                  <span className="min-w-0">{l.label}</span>
                  <span className="shrink-0 tabular-nums text-black/65">{range([l.low, l.high])}</span>
                </li>
              ))}
            </ul>

            {est.rush && (
              <p className="mt-6 text-sm leading-relaxed text-black/75">
                <strong className="font-medium text-black">Fast delivery:</strong> not included in
                the numbers above. We will give you the extra cost on the call.
              </p>
            )}

            {est.custom && (
              <p className="mt-6 rounded-xl border border-black/10 p-4 text-sm leading-relaxed text-black/75">
                What you picked sounds like a <strong className="font-medium text-black">Custom</strong>{" "}
                project. That is normal for payments, customer accounts and bigger sites. We will
                confirm the exact price together on a short call.
              </p>
            )}

            <p className="mt-6 text-xs leading-relaxed text-black/65">
              This is an estimate, not a final quote. The exact price is confirmed after a short
              call. Not included: your domain name and hosting (about{" "}
              {kes(RUNNING_COSTS.yearly[0])} – {kes(RUNNING_COSTS.yearly[1])} a year, paid to the
              provider), {PHOTO_NOTE} and paid stock images. We tell you the exact amount for these
              up front.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <Button type="button" variant="brass" tone="light" icon="arrow" onClick={send}>
                Send this to Alvan
              </Button>
              <button
                type="button"
                onClick={() => setC(INITIAL)}
                className="link-underline self-start text-sm text-black/65"
              >
                Start again
              </button>
            </div>
          </div>
        </aside>
      </div>

      <Reveal className="mt-16">
        <details className="max-w-4xl text-sm text-black/65">
          <summary className="label-mono cursor-pointer text-black/65">
            Where these prices come from
          </summary>
          <p className="mt-4 max-w-2xl leading-relaxed">
            These ranges come from published Kenyan price guides checked in 2026. Where we could
            not find a published price, we say so. Real projects vary, so treat this as a guide.
          </p>
          <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
            {priceTable().map((r) => (
              <li key={r.group + r.label} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-8">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug text-black">{r.label}</p>
                  <p className="mt-1 text-sm tabular-nums text-black/75">{r.range}</p>
                </div>
                <div className="min-w-0 text-xs leading-relaxed">
                  <p className="text-sm text-black/75">
                    {r.basis === "published"
                      ? "Published prices"
                      : r.basis === "partly"
                        ? "Partly published, partly our estimate"
                        : "Our estimate (no published price found)"}
                  </p>
                  <p className="mt-1 break-words">{r.note}</p>
                  <p className="mt-1 break-words">
                    {r.source.map((k, i) => (
                      <span key={k}>
                        {i > 0 && ", "}
                        <a
                          href={SOURCES[k].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-brass"
                        >
                          {SOURCES[k].label.split(",")[0]}
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </details>
      </Reveal>
    </section>
  );
}

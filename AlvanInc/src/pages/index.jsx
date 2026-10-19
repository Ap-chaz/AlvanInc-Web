import { useHead } from "@/lib/use-head";
import { PageShell } from "@/components/alvan/page-shell";
import { Hero } from "@/components/alvan/hero";
import { Intro } from "@/components/alvan/intro";
import { Capabilities } from "@/components/alvan/capabilities";
import { Featured } from "@/components/alvan/featured";
import { SelectedWork } from "@/components/alvan/selected-work";
import { ProcessSteps } from "@/components/alvan/process-steps";
import { LiveSites } from "@/components/alvan/live-sites";
import { Testimonials } from "@/components/alvan/testimonials";
import { HomeFaq } from "@/components/alvan/home-faq";
import { PricingTeaser } from "@/components/alvan/work";
const title = "AlvanInc — Websites that sell, built for Kenyan businesses";
const description =
  "AlvanInc designs and builds websites that build trust and win customers for SMEs, fintechs, law firms, and real estate brands across Kenya and East Africa. Fixed-price packages, live in weeks.";
export default function Index() {
  useHead({ title, description });
  return (
    <PageShell badge>
      <Hero />
      <Intro />
      <Capabilities />
      <Featured />
      <SelectedWork />
      <ProcessSteps />
      <LiveSites />
      <Testimonials />
      <PricingTeaser />
      <HomeFaq />
    </PageShell>
  );
}

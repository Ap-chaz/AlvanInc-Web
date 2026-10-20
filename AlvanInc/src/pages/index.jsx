import { useHead } from "@/lib/use-head";
import { SEO } from "@/lib/seo";
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
import { PricingTeaser } from "@/components/alvan/pricing-teaser";
export default function Index() {
  useHead(SEO["/"]);
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

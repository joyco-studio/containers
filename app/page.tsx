import { ContainerProvider } from "./container";
import { VariantPicker } from "@/components/variant-picker/variant-picker";
import { Header } from "@/components/section/header";
import { Hero } from "@/components/section/hero";
import { ZigzagFeatures } from "@/components/section/zigzag-features";
import { Together } from "@/components/section/together";
import { FeatureGrid } from "@/components/section/feature-grid";
import { Cards } from "@/components/section/cards";
import { Pricing } from "@/components/section/pricing";
import { CTA } from "@/components/section/cta";
import { Footer } from "@/components/section/footer";

export default function Home() {
  return (
    <ContainerProvider>
      {/* Sticky picker */}
      <div className="sticky [--text-scale:1] top-0 z-10 border-b border-zinc-200 bg-background dark:border-zinc-800">
        <VariantPicker />
      </div>

      <Header />
      <Hero />
      <ZigzagFeatures />
      <Together />
      <FeatureGrid />
      <Cards />
      <Pricing />
      <CTA />
      <Footer />
    </ContainerProvider>
  );
}

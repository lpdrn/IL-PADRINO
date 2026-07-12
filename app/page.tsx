import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { PromoCode } from "@/components/PromoCode";
import { RegistrationBand } from "@/components/RegistrationBand";
import { AppButtons } from "@/components/AppButtons";
import { Trust } from "@/components/Trust";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { LinkEnhancer } from "@/components/LinkEnhancer";
import { MetaPixel } from "@/components/MetaPixel";
import { StructuredData } from "@/components/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <TopBar />
      <main>
        <Hero />
        <AppButtons />
        <PromoCode />
        <RegistrationBand />
        <Trust />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
      <LinkEnhancer />
      <MetaPixel />
    </>
  );
}

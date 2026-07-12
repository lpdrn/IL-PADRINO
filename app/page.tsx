import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { BonusCard } from "@/components/BonusCard";
import { PromoCode } from "@/components/PromoCode";
import { RegistrationBand } from "@/components/RegistrationBand";
import { AppButtons } from "@/components/AppButtons";
import { Telegram } from "@/components/Telegram";
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
        <BonusCard />
        <PromoCode />
        <RegistrationBand />
        <Trust />
        <Faq />
        <FinalCta />
        <Telegram />
      </main>
      <Footer />
      <StickyCta />
      <LinkEnhancer />
      <MetaPixel />
    </>
  );
}

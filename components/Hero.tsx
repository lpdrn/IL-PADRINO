import { HERO, BONUS, CTA } from "@/lib/content";
import { CtaButton } from "./ui/CtaButton";
import { CountUp } from "./ui/CountUp";
import { Spade, Check } from "./ui/Icons";

/**
 * Above-the-fold: crest → headline (with the count-up 2000 as the focal
 * number) → sub-headline → primary CTA → micro-trust row.
 * Delivers instant ad-to-LP message match; the money leads.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-8 text-center">
      {/* Gold mesh blob behind the crest — depth, no imagery */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.32), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="shell relative flex flex-col items-center">
        {/* Crest */}
        <div className="crest-glow mb-5">
          <div
            className="foil grid size-16 place-items-center rounded-full"
            style={{ boxShadow: "0 0 40px rgba(212,175,55,0.25)" }}
          >
            <Spade className="size-8" />
          </div>
        </div>

        <h1 className="mb-4 font-display">
          <span className="block text-[1.6rem] font-bold leading-tight text-ivory">
            {HERO.headlineBefore}
          </span>
          <span className="my-1 flex items-baseline justify-center gap-2 leading-none">
            <CountUp
              end={2000}
              className="text-foil text-[4.1rem] font-black tracking-tight"
            />
            <span className="text-foil text-[1.6rem] font-bold">
              {BONUS.currency}
            </span>
          </span>
          <span className="block text-[1.6rem] font-bold leading-tight text-ivory">
            {HERO.headlineAfter}
          </span>
        </h1>

        <p className="mb-6 max-w-[22rem] text-[15px] leading-[1.6] text-muted">
          {HERO.subheadline}
        </p>

        <CtaButton className="max-w-[24rem]">{CTA.primary}</CtaButton>
        {/* Sentinel: sticky CTA appears once this scrolls out of view */}
        <span id="hero-cta-sentinel" aria-hidden="true" className="block h-px w-full" />

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-muted">
          {HERO.microTrust.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div
          aria-hidden="true"
          className="mt-8 h-px w-12"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)",
          }}
        />
      </div>
    </section>
  );
}

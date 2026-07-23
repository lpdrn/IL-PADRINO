import { CLOSING, CTA } from "@/lib/content";
import { CtaButton } from "./ui/CtaButton";
import { SecondaryCta } from "./ui/SecondaryCta";
import { Reveal } from "./ui/Reveal";

/** Closing conversion beat right before the footer. */
export function FinalCta() {
  return (
    <section className="section text-center">
      <div className="shell">
        <Reveal>
          <h2 className="mb-2 font-display text-[1.4rem] text-ivory">
            {CLOSING.title}
          </h2>
          <p className="mx-auto mb-6 max-w-[24rem] text-[14px] leading-relaxed text-muted">
            {CLOSING.sub}
          </p>
          <CtaButton className="mx-auto max-w-[24rem]">{CTA.primary}</CtaButton>
          <div className="mt-3">
            <SecondaryCta />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

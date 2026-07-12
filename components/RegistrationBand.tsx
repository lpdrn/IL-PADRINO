import { STEPS, CTA } from "@/lib/content";
import { CtaButton } from "./ui/CtaButton";
import { Reveal } from "./ui/Reveal";

/**
 * Shows how short the path to a withdrawal is (3-step timeline) then repeats
 * the single primary CTA — reinforcing speed and one consistent action.
 */
export function RegistrationBand() {
  return (
    <section id="register" className="section border-y border-line bg-panel/40">
      <div className="shell text-center">
        <Reveal>
          <h2 className="mb-7 font-display text-[1.5rem] text-ivory">
            {STEPS.heading}
          </h2>

          <ol className="mx-auto mb-8 max-w-[22rem] text-start">
            {STEPS.items.map((step, i) => (
              <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                {i < STEPS.items.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 top-[46px] start-[22.5px] w-px bg-hairline"
                  />
                )}
                <span className="coin font-display text-[1.15rem] font-black">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="mb-0.5 font-display text-[1.05rem] text-ivory">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-muted">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <CtaButton className="mx-auto max-w-[24rem]">{CTA.primary}</CtaButton>
          <p className="mt-3 text-[13px] text-muted">
            {CTA.registerReassurance}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

import type { ComponentType, SVGProps } from "react";
import { TRUST } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import {
  Bolt,
  ShieldCheck,
  Headset,
  Gift,
  Lock,
  Users,
  Check,
} from "./ui/Icons";

const ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  Bolt,
  ShieldCheck,
  Headset,
  Gift,
  Lock,
  Users,
];

/**
 * Answers the three cold-traffic fears — is it safe, will they pay me, is it
 * legit — with restrained, believable coin badges (no fake testimonials).
 */
export function Trust() {
  return (
    <section id="trust" className="section">
      <div className="shell">
        <Reveal>
          <h2 className="mb-6 text-center font-display text-[1.5rem] text-ivory">
            {TRUST.heading}
          </h2>

          <ul className="grid grid-cols-2 gap-3">
            {TRUST.points.map((point, i) => {
              const Icon = ICONS[i];
              return (
                <li
                  key={point.title}
                  className="panel flex flex-col items-center px-3 py-5 text-center"
                >
                  <span className="coin mb-3">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mb-1 font-display text-[15px] leading-tight text-ivory">
                    {point.title}
                  </h3>
                  <p className="text-[12px] leading-snug text-muted">
                    {point.desc}
                  </p>
                  {"payout" in point && point.payout && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-success">
                      <Check className="size-3.5" />
                      <span>مضمون</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="mt-5 text-center text-[13px] text-muted">
            {TRUST.socialProof}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

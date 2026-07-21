import type { ComponentType, SVGProps } from "react";
import { TRUST } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { Bolt, ShieldCheck, Headset, Gift, Lock, Users } from "./ui/Icons";

const ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  Bolt,
  ShieldCheck,
  Headset,
  Gift,
  Lock,
  Users,
];

/**
 * Answers why the channel is worth joining — predictions, prizes, exclusive
 * content, community — with restrained, believable coin badges (no fake
 * testimonials).
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

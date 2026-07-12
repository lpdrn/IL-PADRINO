import { BONUS } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { Gift, Bolt } from "./ui/Icons";

/**
 * Ticket-stub voucher: makes the 2000 dirham feel physical and already
 * reserved, and front-loads the "credits instantly / fast withdrawal"
 * objection-crusher.
 */
export function BonusCard() {
  return (
    <section id="bonus" className="section">
      <div className="shell">
        <Reveal>
          <div className="panel corner-ticks relative px-6 py-8 text-center">
            {/* Ticket-stub side notches */}
            <span
              aria-hidden="true"
              className="absolute top-1/2 -start-2 size-4 -translate-y-1/2 rounded-full border border-hairline bg-ink"
            />
            <span
              aria-hidden="true"
              className="absolute top-1/2 -end-2 size-4 -translate-y-1/2 rounded-full border border-hairline bg-ink"
            />

            <div className="coin mx-auto mb-4">
              <Gift className="size-6" />
            </div>

            <h2 className="mb-3 font-display text-[1.35rem] text-ivory">
              {BONUS.title}
            </h2>

            <p className="font-display font-black leading-none">
              <span className="num text-foil text-[3rem]">{BONUS.amount}</span>{" "}
              <span className="text-foil text-[1.3rem]">{BONUS.currency}</span>
            </p>

            <div className="my-5 border-t border-dashed border-hairline-strong" />

            <p className="mb-1 text-[15px] leading-relaxed text-ivory">
              {BONUS.support}
            </p>
            <p className="mb-5 text-[12px] text-muted">{BONUS.condition}</p>

            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-chip px-3.5 py-1.5 text-[13px] text-ivory">
              <Bolt className="size-4 text-gold" />
              <span>{BONUS.speed}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

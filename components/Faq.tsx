import { FAQ } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { ChevronDown } from "./ui/Icons";

/**
 * Objection-crushing FAQ using native <details>/<summary> — fully keyboard
 * accessible and works with zero JavaScript.
 */
export function Faq() {
  return (
    <section id="faq" className="section">
      <div className="shell">
        <Reveal>
          <h2 className="mb-6 text-center font-display text-[1.5rem] text-ivory">
            {FAQ.heading}
          </h2>

          <div className="panel divide-y divide-line overflow-hidden">
            {FAQ.items.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-[15px] leading-snug text-ivory">
                    {item.q}
                  </span>
                  <ChevronDown className="size-5 flex-none text-gold transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-4 text-[14px] leading-[1.75] text-muted">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

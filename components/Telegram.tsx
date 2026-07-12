import { LINKS } from "@/lib/config";
import { TELEGRAM } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { Telegram as TelegramIcon, ArrowLeft } from "./ui/Icons";

/** Tier-3 retention channel — lowest visual weight, ghost styling. */
export function Telegram() {
  return (
    <section id="telegram" className="section">
      <div className="shell">
        <Reveal>
          <a
            href={LINKS.telegram}
            data-append-params=""
            rel="noopener nofollow sponsored"
            className="btn-outline !bg-transparent"
          >
            <span className="grid size-9 flex-none place-items-center rounded-full border border-hairline text-gold">
              <TelegramIcon className="size-5" />
            </span>
            <span className="flex-1 text-start">
              <span className="block text-[15px] font-semibold text-ivory">
                {TELEGRAM.label}
              </span>
              <span className="block text-[12px] text-muted">
                {TELEGRAM.sub}
              </span>
            </span>
            <ArrowLeft className="size-4 flex-none text-muted" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

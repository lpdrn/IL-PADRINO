import { REGISTER_LINK } from "@/lib/config";
import { CTA } from "@/lib/content";

/**
 * Secondary, understated CTA — direct registration on the platform for
 * visitors who are ready to sign up now and don't want the Telegram step.
 * Deliberately a ghost/outline treatment so it never competes with the
 * primary Telegram CTA (the page keeps a single dominant action).
 *
 * Marked `data-register-link` so `components/LinkEnhancer.tsx` can append the
 * visitor's fbclid to the reffpa tracking tag for Meta attribution. Renders
 * as a plain anchor, so it works without JS (fbclid is only an enhancement).
 */
export function SecondaryCta({ className = "" }: { className?: string }) {
  return (
    <a
      href={REGISTER_LINK}
      data-register-link=""
      rel="noopener nofollow sponsored"
      className={`inline-flex items-center justify-center rounded-full border border-hairline px-6 py-2.5 text-[13px] font-medium text-muted transition-colors hover:border-gold/50 hover:text-ivory ${className}`}
    >
      {CTA.registerDirect}
    </a>
  );
}

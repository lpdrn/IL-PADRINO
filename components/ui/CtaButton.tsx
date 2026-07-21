import type { ReactNode } from "react";
import { LINKS } from "@/lib/config";
import { ArrowLeft, Telegram } from "./Icons";

/**
 * The single primary call-to-action, reused across the page (Tier 1).
 * Defaults to the Telegram channel — it's the primary funnel entry point,
 * with registration happening downstream via the channel. Styled in
 * Telegram's own brand blue with the Telegram glyph so the action reads
 * unambiguously.
 * Renders an anchor so it works without JS; `data-append-params` lets the
 * client-side LinkEnhancer forward Meta campaign params for attribution.
 */
export function CtaButton({
  href = LINKS.telegram,
  children,
  className = "",
  id,
  withArrow = true,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  withArrow?: boolean;
}) {
  return (
    <a
      href={href}
      id={id}
      data-append-params=""
      rel="noopener nofollow sponsored"
      className={`cta foil-telegram ${className}`}
    >
      <Telegram className="size-5 flex-none" aria-hidden="true" />
      <span>{children}</span>
      {withArrow && <ArrowLeft className="size-5" aria-hidden="true" />}
    </a>
  );
}

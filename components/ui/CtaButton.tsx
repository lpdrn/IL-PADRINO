import type { ReactNode } from "react";
import { LINKS } from "@/lib/config";
import { ArrowLeft } from "./Icons";

/**
 * The single primary call-to-action, reused across the page (Tier 1).
 * Renders an anchor so it works without JS; `data-append-params` lets the
 * client-side LinkEnhancer forward Meta campaign params for attribution.
 */
export function CtaButton({
  href = LINKS.register,
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
      className={`cta foil ${className}`}
    >
      <span>{children}</span>
      {withArrow && <ArrowLeft className="size-5" aria-hidden="true" />}
    </a>
  );
}

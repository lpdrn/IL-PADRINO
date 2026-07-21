/**
 * Central site configuration for IL PADRINO.
 * All external links, the promo code, and brand constants live here so copy /
 * tracking links can be updated in one place.
 */

export const PROMO_CODE = "SBA3" as const;

/** Canonical production origin, no trailing slash. Swap on domain launch (see CLAUDE.md). */
export const SITE_URL = "https://il-padrino.com" as const;

export const LINKS = {
  /** Primary registration link (carries the promo sub-id in its tracking tag).
   *  Not linked directly on the page — the funnel routes through Telegram first. */
  register:
    "https://1xlite-48727.bar/en/registration?tag=d_3622779m_97c_SBA3&type=fast&bonus=SPORT&currency=MAD",
  /** Telegram invite link created specifically for this site — the primary
   *  funnel entry point (joins via this link are attributable to the site). */
  telegram: "https://t.me/+JTOdPxmvj6g0MzNk",
} as const;

export const BRAND = {
  name: "IL PADRINO",
  /** Latin wordmark shown in the header/footer. */
  wordmark: "IL PADRINO",
} as const;

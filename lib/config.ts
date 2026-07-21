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

/**
 * Per-campaign Telegram invite links, so each ad campaign's joins show up
 * separately in Telegram's channel stats.
 *
 * Usage: create a new invite link in Telegram (القناة ← إدارة ← روابط الدعوة)،
 * add a short key for it below, then use https://<site>/?ch=<key> as that
 * campaign's ad destination URL. The CTA buttons swap to the matching link
 * automatically; unknown or missing keys fall back to LINKS.telegram.
 * Keys are a safety whitelist — never put raw invite links in ad URLs.
 *
 * Example:
 *   ig1: "https://t.me/+AbCdEfGh123",
 */
export const TELEGRAM_CAMPAIGNS: Record<string, string> = {
  /** Instagram-only test campaign. */
  ig1: "https://t.me/+AFMe1DZLmnwwODA8",
};

export const BRAND = {
  name: "IL PADRINO",
  /** Latin wordmark shown in the header/footer. */
  wordmark: "IL PADRINO",
} as const;

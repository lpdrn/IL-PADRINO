/**
 * Central site configuration for IL PADRINO.
 * All external links, the promo code, and brand constants live here so copy /
 * tracking links can be updated in one place.
 */

export const PROMO_CODE = "SBA3" as const;

/** Canonical production origin, no trailing slash. Swap on domain launch (see CLAUDE.md). */
export const SITE_URL = "https://il-padrino.com" as const;

export const LINKS = {
  /** Primary registration link (carries the promo sub-id in its tracking tag). */
  register: "https://1xlite-48727.bar/en?tag=d_3622779m_97c_",
  /** Android APK / affiliate tracking link. */
  android: "https://reffpa.com/L?tag=d_3622779m_70865c_&site=3622779&ad=70865",
  /** iOS install-walkthrough video (Telegram post), not a TestFlight link. */
  iphone: "https://t.me/lpdrn/8285",
  /** Official Telegram channel. */
  telegram: "https://t.me/lpdrn",
} as const;

export const BRAND = {
  name: "IL PADRINO",
  /** Latin wordmark shown in the header/footer. */
  wordmark: "IL PADRINO",
} as const;

export type SiteLinks = typeof LINKS;

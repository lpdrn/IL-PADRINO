/**
 * Central site configuration for IL PADRINO.
 * All external links, the promo code, and brand constants live here so copy /
 * tracking links can be updated in one place.
 */

export const PROMO_CODE = "SBA3" as const;

/** Canonical production origin, no trailing slash. Swap on domain launch (see CLAUDE.md). */
export const SITE_URL = "https://il-padrino.com" as const;

export const LINKS = {
  /** Primary registration link (carries the promo sub-id in its path). */
  register: `https://goooplay.online/${PROMO_CODE}`,
  /** Android APK / affiliate tracking link. */
  android: `https://gooobetaffiliate.com/L?tag=d_3952514m_78631c_${PROMO_CODE}&site=3952514&ad=78631`,
  /** iOS install via TestFlight. */
  iphone: "https://testflight.apple.com/join/D748X15c",
  /** Official Telegram channel. */
  telegram: "https://t.me/lpdrn",
} as const;

export const BRAND = {
  name: "IL PADRINO",
  /** Latin wordmark shown in the header/footer. */
  wordmark: "IL PADRINO",
} as const;

export type SiteLinks = typeof LINKS;

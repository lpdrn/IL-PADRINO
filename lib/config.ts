/**
 * Central site configuration for IL PADRINO.
 * All external links, the promo code, and brand constants live here so copy /
 * tracking links can be updated in one place.
 */

export const PROMO_CODE = "SBA3" as const;

/** Canonical production origin, no trailing slash (apex 308-redirects to www). */
export const SITE_URL = "https://www.pronosociety.com" as const;

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
 * Direct-registration link for the SECONDARY CTA — the reffpa tracking link
 * for site 5859750 carrying the registration postback token (`pb`). This is
 * the link 1xPartners generates as the "Example tracking URL"; a real
 * conversion through it fires the CompleteRegistration/Purchase postback to
 * `/api/capi`.
 *
 * `components/LinkEnhancer.tsx` sets the visitor's `fbclid` as reffpa's own
 * `&click_id=` query param (the field the tracker echoes back). It round-trips
 * via the postback's `{{click_id}}` macro → `/api/capi` builds `fbc` → Meta
 * attributes the conversion to the exact ad. To wire the round-trip, just
 * enable the `{{click_id}}` checkbox on both postbacks (the route reads the
 * `click_id` param directly — no rename needed).
 */
export const REGISTER_LINK =
  "https://reffpa.com/L?tag=d_5859750m_97c_&pb=8ba89642f63a4214bfab6c95ff3b8f8a" as const;

/**
 * Per-campaign Telegram invite links, so each ad campaign's joins show up
 * separately in Telegram's channel stats. Platform-agnostic — a key can be
 * any ad, on any platform (Instagram, Facebook, TikTok, …); nothing here
 * restricts a key to one network. Naming keys after the platform (ig1, fb1)
 * is just a convenience, not a technical constraint.
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
  sip1: "https://t.me/+fCxuPg-ik-llNjc0",
  sifp1: "https://t.me/+3RJgZMzaKkozMjk0",
  sfp1: "https://t.me/+S6HXxNkyYto3Mzlk",
  tip1: "https://t.me/+X-vTRqhvy1w2NzM0",
  tfp1: "https://t.me/+ftQuJrE5Lnw1YTE0",
  "ti18-36p1": "https://t.me/+pfc_cP4KPCRiZTE0",
  "ti18-36tp1": "https://t.me/+L5kSoxYe48I4Y2I0",
  "si18-36tp1": "https://t.me/+Dp1mF1uscvwyZWRk",
  "si18-36p1": "https://t.me/+T-cD9XijEb5iNTQ0",
  "si18-44p1": "https://t.me/+f-xY1M8WZDdhOTJk",
  "si18-44ap1": "https://t.me/+MpS8d6sEFJBhNGNk",
};

export const BRAND = {
  name: "IL PADRINO",
  /** Latin wordmark shown in the header/footer. */
  wordmark: "IL PADRINO",
} as const;

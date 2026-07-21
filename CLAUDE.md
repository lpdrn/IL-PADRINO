# CLAUDE.md — IL PADRINO

Arabic (RTL) luxury black-&-gold landing page for the IL PADRINO
betting-predictions Telegram channel. The funnel is **channel-first**: every
primary CTA joins the Telegram channel; registration + deposit (promo code
SBA3) happen downstream inside the channel. See `README.md` for the full overview.

## Stack (pinned)

- **Next.js 15** (App Router / RSC), React 19, TypeScript strict.
- **Tailwind v4** — CSS-first. Design tokens live in the `@theme` block of `app/globals.css`, not a JS config.
- Fonts via `next/font/google`: Noto Kufi Arabic (`--font-kufi`, display) + IBM Plex Sans Arabic (`--font-plex`, body).

## Conventions

- **RTL:** `<html lang="ar" dir="rtl">`. Use logical utilities (`ps-*`/`pe-*`, `ms-*`/`me-*`, `start-*`/`end-*`, `text-start`/`text-end`) — never physical `left`/`right`.
- **Latin tokens** (2000, SBA3, 18) go inside `<span className="num">` — it sets `direction: ltr; unicode-bidi: isolate; tabular-nums` so they don't break the RTL flow.
- **Colors:** reference tokens (`bg-ink`, `text-ivory`, `text-muted`, `text-gold`, `border-hairline`, …). Gold surfaces use `.foil`; gold text uses `.text-foil` on the leaf span holding the text. The primary CTA uses `.foil-telegram` (Telegram-blue, same emboss treatment).
- **Motion:** all decorative animation is gated by `prefers-reduced-motion`. Keep it that way.
- **Server-first:** page + sections are RSC; only interactive islands are `"use client"` (StickyCta, CountUp, Reveal, LinkEnhancer, MetaPixel).
- **Copy** belongs in `lib/content.ts`; **links/promo** in `lib/config.ts`. Don't hardcode strings/URLs in components.

## Gotchas

- **ESLint:** `eslint-config-next@15` has no `exports` map, so the flat config uses **`FlatCompat`** (`@eslint/eslintrc`) in `eslint.config.mjs`. Don't switch to the Next-16 `eslint-config-next/core-web-vitals` subpath imports — they won't resolve on 15. Lint script is `eslint .`.
- Always run `npm run lint` and `npm run typecheck` after changes; both are currently clean.

## Deploy notes

The canonical origin is `SITE_URL` in `lib/config.ts` (`https://www.pronosociety.com`); layout metadataBase, robots.ts, sitemap.ts, StructuredData, and the CAPI webhook all read from it. Meta Pixel/CAPI activate via env vars (see README); outbound param passthrough is handled by `LinkEnhancer`.

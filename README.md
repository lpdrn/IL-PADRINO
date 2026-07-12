# IL PADRINO — Landing Page

Production landing page for the **IL PADRINO** affiliate betting brand. Arabic
(RTL), luxury black & gold, mobile-first, engineered to maximize qualified
First-Time Depositors (FTD) from Meta Ads traffic.

## Stack

- **Next.js 15** (App Router, React Server Components) · **React 19**
- **TypeScript** (strict) · **Tailwind CSS v4** (CSS-first `@theme`)
- Fonts: **Noto Kufi Arabic** (display) + **IBM Plex Sans Arabic** (body), via `next/font`
- Zero image assets — every visual is CSS (gradients, pseudo-elements, one SVG grain)

## Commands

```bash
npm run dev        # start dev server (http://localhost:3000)
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (flat config, next/core-web-vitals + typescript)
npm run typecheck  # tsc --noEmit
```

## Where things live

| What | File |
| --- | --- |
| External links + promo code | `lib/config.ts` |
| All Arabic copy | `lib/content.ts` |
| Design tokens & signature styles | `app/globals.css` |
| Fonts, SEO metadata, RTL shell | `app/layout.tsx` |
| Page composition | `app/page.tsx` |
| Section components | `components/` |
| Reusable primitives (CTA, CountUp, Reveal, Icons) | `components/ui/` |

## Editing content

- **Promo code / links:** edit `lib/config.ts` (`PROMO_CODE`, `LINKS`). The
  registration link already carries the `SBA3` sub-id in its path.
- **Copy:** edit `lib/content.ts`. The primary CTA string is fixed by the brief.
- **Colors / fonts:** edit the `@theme` block in `app/globals.css` and the font
  config in `app/layout.tsx`.

## Before going live

1. Replace the placeholder domain `https://il-padrino.com` in `app/layout.tsx`
   (`metadataBase`), `app/robots.ts`, `app/sitemap.ts`, and
   `components/StructuredData.tsx` with the real production domain.
2. Add your **Meta Pixel + Conversions API** for the registration/deposit
   events. Incoming Meta campaign params (`fbclid`, `utm_*`, sub-ids) are already
   forwarded onto every outbound link by `components/LinkEnhancer.tsx`.

## Conversion & compliance notes

- Single primary CTA (gold foil) repeated across the page + a sticky mobile bar.
  App downloads are Tier-2, Telegram is Tier-3 — none competes with registration.
- App buttons are OS-detected (Android/iPhone surfaced first for the visitor's device).
- Copy-to-clipboard has an in-app-webview fallback (Meta traffic runs inside the
  FB/IG browser).
- 18+ / responsible-gambling messaging is present in the top bar and footer.

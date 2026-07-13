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
2. Set up the Meta Pixel + Conversions API (see below).

## Meta Pixel + Conversions API (CAPI)

Two pieces, both already built — activate by setting env vars.

**1. Client-side Pixel** (`components/MetaPixel.tsx`) — fires `PageView` on
load and `Lead` when any register/app/Telegram button is tapped. No-op until
you set:

```
NEXT_PUBLIC_META_PIXEL_ID=<your pixel id>
```

Find it in Meta Events Manager → Data Sources → Pixels.

**2. Server-side CAPI webhook** (`app/api/capi/route.ts`) — because the real
conversion (registration/deposit) happens on the affiliate's site, not this
domain, it can only reach Meta if the affiliate network calls this endpoint as
a **postback URL** when a referred user converts. Set:

```
META_CAPI_ACCESS_TOKEN=<generate in Events Manager → your pixel → Settings → Conversions API>
CAPI_WEBHOOK_SECRET=<invent your own secret string>
```

Then in your affiliate network's dashboard, set two postback URLs (exact
param names/macros depend on what that network supports — check their docs):

```
https://<your-domain>/api/capi?secret=<CAPI_WEBHOOK_SECRET>&event=CompleteRegistration
https://<your-domain>/api/capi?secret=<CAPI_WEBHOOK_SECRET>&event=Purchase&value={payout}&currency=MAD
```

Optionally append `&fbclid={click_id}` if the network can echo back whatever
`LinkEnhancer.tsx` forwarded onto the outbound link, and
`&test_event_code=...` (from Meta's Test Events tool) while verifying.

**Locally:** copy `.env.example` to `.env.local` and fill in the three values.
**On Vercel:** set the same three under Project → Settings → Environment
Variables — `.env.local` is never uploaded there.

Incoming Meta campaign params (`fbclid`, `utm_*`, sub-ids) are already
forwarded onto every outbound link by `components/LinkEnhancer.tsx`.

## Conversion & compliance notes

- Single primary CTA (gold foil) repeated across the page + a sticky mobile bar.
  App downloads are Tier-2, Telegram is Tier-3 — none competes with registration.
- App buttons are OS-detected (Android/iPhone surfaced first for the visitor's device).
- Copy-to-clipboard has an in-app-webview fallback (Meta traffic runs inside the
  FB/IG browser).
- 18+ / responsible-gambling messaging is present in the top bar and footer.

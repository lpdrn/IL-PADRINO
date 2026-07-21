# IL PADRINO — Landing Page

Production landing page for the **IL PADRINO** betting-predictions Telegram
channel. Arabic (RTL), luxury black & gold, mobile-first. The funnel is
**channel-first**: every primary CTA joins the Telegram channel, and
registration/deposit (with promo code `SBA3`) happens downstream from there.

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
| Section components (Hero, StepsBand, Trust, Faq, …) | `components/` |
| Reusable primitives (CtaButton, CountUp, Reveal, Icons) | `components/ui/` |

## Editing content

- **Links / promo code:** edit `lib/config.ts` (`PROMO_CODE`, `LINKS`).
  `LINKS.telegram` is the primary CTA target; `LINKS.register` is kept for
  reference/downstream use but is not linked directly on the page.
- **Per-campaign Telegram links:** to track each ad campaign's joins
  separately, create an invite link in Telegram, add it to
  `TELEGRAM_CAMPAIGNS` in `lib/config.ts` under a short key (e.g.
  `ig1: "https://t.me/+…"`), and use `https://<site>/?ch=ig1` as that
  campaign's ad URL — the CTA swaps to the matching link automatically.
  Unknown keys safely fall back to `LINKS.telegram`.
- **Copy:** edit `lib/content.ts` — all Arabic strings live there.
- **Colors / fonts:** edit the `@theme` block in `app/globals.css` and the font
  config in `app/layout.tsx`. The primary CTA uses the `.foil-telegram`
  (Telegram-blue) surface; gold `.foil` remains for the crest and coins.

## Before going live

1. Replace the placeholder domain `https://il-padrino.com` in `app/layout.tsx`
   (`metadataBase`), `app/robots.ts`, `app/sitemap.ts`, and
   `components/StructuredData.tsx` with the real production domain.
2. Set up the Meta Pixel + Conversions API (see below).

## Meta Pixel + Conversions API (CAPI)

Two pieces, both already built — activate by setting env vars.

**1. Client-side Pixel** (`components/MetaPixel.tsx`) — fires `PageView` on
load and `CompleteRegistration` when the Telegram CTA is tapped. No-op until
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

- One primary CTA (Telegram-blue, with the Telegram glyph) repeated across the
  page + a sticky mobile bar — a single action, no competing buttons.
- The page funnels 100% into the Telegram channel; registration links, promo
  code walkthroughs, and app downloads are handled inside the channel.
- 18+ / responsible-gambling messaging is present in the footer.

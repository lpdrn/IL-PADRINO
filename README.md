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

## Production domain

The canonical origin is `SITE_URL` in `lib/config.ts` (currently
`https://www.pronosociety.com` — the apex 308-redirects to www). Layout
`metadataBase`, `robots.ts`, `sitemap.ts`, StructuredData, and the CAPI
webhook all read from it, so a future domain change is a one-line edit.

## Meta Pixel + Conversions API (CAPI)

Two pieces, both already built — activate by setting env vars.

**1. Client-side Pixel** (`components/MetaPixel.tsx`) — fires `PageView` on
load and `Lead` when the Telegram CTA is tapped (a click is only interest,
not a real registration — see below). No-op until you set:

```
NEXT_PUBLIC_META_PIXEL_ID=<your pixel id>
```

Find it in Meta Events Manager → Data Sources → Pixels.

**2. Server-side CAPI webhook** (`app/api/capi/route.ts`) — because the real
conversion (registration/deposit) happens on the affiliate's site, not this
domain, it can only reach Meta if the affiliate network calls this endpoint as
a **postback URL** when a referred user converts. This is the only source of
the real `CompleteRegistration` and `Purchase` events — the client-side Pixel
deliberately does not fire `CompleteRegistration` on its own, to avoid
double-counting every button click as a registration. Set:

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

Optionally append `&test_event_code=...` (from Meta's Test Events tool)
while verifying. Note: `LinkEnhancer.tsx` deliberately does not forward
`fbclid`/`utm_*` onto the outbound Telegram link (a decorated `t.me` link
can come back from Telegram's webhook as a non-matching invite link), so
there's currently no click-id continuity between the ad click and the
affiliate conversion — these events reach Meta with weak match quality
rather than being attributed to a specific ad.

**Locally:** copy `.env.example` to `.env.local` and fill in the three values.
**On Vercel:** set the same three under Project → Settings → Environment
Variables — `.env.local` is never uploaded there.

Incoming Meta campaign params (`fbclid`, `utm_*`, sub-ids) are already
forwarded onto every outbound link by `components/LinkEnhancer.tsx`.

## Telegram join notifications

`app/api/telegram-webhook/route.ts` sends you a Telegram message every time
someone joins the channel, naming which campaign invite link (from
`TELEGRAM_CAMPAIGNS` in `lib/config.ts`) they used. It's a standalone
notification tool — no Meta Pixel/CAPI, no effect on the site or visitor
experience.

**Setup:**

1. Create a bot with [@BotFather](https://t.me/BotFather) (`/newbot`), copy
   its token.
2. Add the bot as an **admin** of the channel — required for it to receive
   join/leave updates at all (Channel → Administrators → Add Admin).
3. Find the chat id that should receive notifications (usually your own DM
   with the bot): send the bot any message, then open
   `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and read
   `"chat":{"id": ...}` from the response.
4. Set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET` (invent your own), and
   `TELEGRAM_NOTIFY_CHAT_ID` in Vercel → Project → Settings → Environment
   Variables (and `.env.local` for local testing).
5. Register the webhook so Telegram calls this route (`allowed_updates` must
   include `chat_member`, otherwise Telegram won't send join events at all):
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook" \
     -d "url=https://www.pronosociety.com/api/telegram-webhook" \
     -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>" \
     -d "allowed_updates=[\"chat_member\"]"
   ```

Note: this can only attribute a join to a **campaign** (which invite link
was used), not to an individual ad click/browser — Telegram exposes no
per-user tracking data at join time.

## Conversion & compliance notes

- One primary CTA (Telegram-blue, with the Telegram glyph) repeated across the
  page + a sticky mobile bar — a single action, no competing buttons.
- The page funnels 100% into the Telegram channel; registration links, promo
  code walkthroughs, and app downloads are handled inside the channel.
- 18+ / responsible-gambling messaging is present in the footer.

import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/config";

/**
 * Server-side relay for affiliate postback → ad-platform conversion APIs
 * (Meta Conversions API and TikTok Events API).
 *
 * This is the webhook URL you give your affiliate network's "postback URL"
 * setting (one for registration, one for deposit/FTD — see README). The
 * affiliate network calls this when a referred user converts; we forward the
 * event to Meta and/or TikTok from the server, which is the only way the real
 * deposit event can reach them (it happens entirely off this domain).
 *
 * The conversion is routed to the platform the click came from, using the
 * prefix LinkEnhancer put on the click id: `fb_…` → Meta, `tt_…` → TikTok
 * (a bare value with no prefix is treated as a Meta fbclid for back-compat).
 *
 * Required env vars (set in Vercel → Project → Settings → Environment
 * Variables, not just locally):
 *   CAPI_WEBHOOK_SECRET         — a secret string you invent; must match the
 *                                 `secret` param the affiliate network sends.
 *   NEXT_PUBLIC_META_PIXEL_ID   — same pixel id used by components/MetaPixel.tsx
 *   META_CAPI_ACCESS_TOKEN      — from Meta Events Manager → Conversions API
 *   NEXT_PUBLIC_TIKTOK_PIXEL_ID — same pixel id used by TikTokPixel.tsx
 *   TIKTOK_EVENTS_API_TOKEN     — from TikTok Events Manager → Events API
 *
 * Query params accepted (GET or POST, same shape):
 *   secret     (required) must equal CAPI_WEBHOOK_SECRET
 *   event      standard event name — "CompleteRegistration" or "Purchase".
 *              Defaults to "Lead". (Mapped to TikTok's names when routed there.)
 *   value      numeric deposit amount (only meaningful for "Purchase")
 *   currency   ISO currency code, e.g. "MAD" (defaults to "MAD")
 *   click_id   the round-tripped click id (fb_<fbclid> or tt_<ttclid>)
 *   fbp        the _fbp browser cookie value, if available
 *   test_event_code  optional — paste from the platform's Test Events tool
 *                     while verifying, omit in production
 */

const GRAPH_VERSION = "v21.0";
const TIKTOK_EVENTS_URL =
  "https://business-api.tiktok.com/open_api/v1.3/event/track/";

/** Maps our Meta-style event names to TikTok's standard event names. */
const TIKTOK_EVENT_MAP: Record<string, string> = {
  CompleteRegistration: "CompleteRegistration",
  Purchase: "CompletePayment",
};

/**
 * Splits the round-tripped click id into its ad platform and raw id.
 * LinkEnhancer prefixes it: `fb_<fbclid>` (Meta) or `tt_<ttclid>` (TikTok).
 * A bare value (no prefix) is treated as a Meta fbclid for back-compat.
 */
function parseClickId(
  raw: string | null,
): { platform: "meta" | "tiktok"; id: string | null } {
  if (!raw) return { platform: "meta", id: null };
  if (raw.startsWith("tt_")) return { platform: "tiktok", id: raw.slice(3) };
  if (raw.startsWith("fb_")) return { platform: "meta", id: raw.slice(3) };
  return { platform: "meta", id: raw };
}

/**
 * Pings YOUR Telegram (reusing the notification bot) whenever a postback
 * arrives, so a real 1xbet postback is confirmed instantly without opening
 * Vercel logs. Plain text (no parse_mode) so unexpected macro values can't
 * break formatting. No-op if the bot env vars aren't set.
 */
async function pingTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_NOTIFY_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch(() => {});
}

function buildEventPayload(
  params: URLSearchParams,
  req: NextRequest,
  fbclid: string | null,
) {
  // Defensive: keep only the clean event name even if a stray "?…" survived
  // parsing, so Meta logs the standard CompleteRegistration/Purchase event
  // rather than a custom one like "CompleteRegistration?reg=true".
  const event = (params.get("event") || "Lead").split("?")[0].trim();
  const value = params.get("value");
  const currency = params.get("currency") || "MAD";
  const fbp = params.get("fbp");

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
  const userAgent = req.headers.get("user-agent") || undefined;

  const userData: Record<string, string> = {};
  if (ip) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbclid) userData.fbc = `fb.1.${Date.now()}.${fbclid}`;
  if (fbp) userData.fbp = fbp;

  const customData: Record<string, string> = { currency };
  if (value) customData.value = value;

  return {
    event_name: event,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: SITE_URL,
    user_data: userData,
    custom_data: customData,
  };
}

/**
 * Forwards the conversion to the TikTok Events API. Mirrors the Meta path but
 * uses TikTok's payload shape (event_source/event_source_id, user.ttclid) and
 * event names (Purchase → CompletePayment). Success is code 0 in the body.
 */
async function sendTikTok(
  params: URLSearchParams,
  req: NextRequest,
  ttclid: string | null,
  testEventCode: string | undefined,
) {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const token = process.env.TIKTOK_EVENTS_API_TOKEN;
  if (!pixelId || !token) {
    return { ok: false, error: "tiktok not configured" };
  }

  const rawEvent = (params.get("event") || "Lead").split("?")[0].trim();
  const event = TIKTOK_EVENT_MAP[rawEvent] || rawEvent;
  const value = params.get("value");
  const currency = params.get("currency") || "MAD";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = req.headers.get("user-agent") || undefined;

  const user: Record<string, string> = {};
  if (ttclid) user.ttclid = ttclid;
  if (ip) user.ip = ip;
  if (userAgent) user.user_agent = userAgent;

  const properties: Record<string, unknown> = { currency };
  if (value) properties.value = Number(value);

  const body: Record<string, unknown> = {
    event_source: "web",
    event_source_id: pixelId,
    data: [
      {
        event,
        event_time: Math.floor(Date.now() / 1000),
        user,
        properties,
      },
    ],
  };
  if (testEventCode) body.test_event_code = testEventCode;

  const res = await fetch(TIKTOK_EVENTS_URL, {
    method: "POST",
    headers: { "Access-Token": token, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as {
    code?: number;
    message?: string;
  };
  return { ok: res.ok && json.code === 0, status: res.status, json };
}

async function handle(req: NextRequest, params: URLSearchParams, method: string) {
  // Log EVERY incoming request (before auth) so a real affiliate postback is
  // always visible in Vercel Runtime Logs — even if the secret is wrong or
  // the payload is malformed. The secret value itself is redacted; we only
  // record whether it matched, so we can tell a genuine 1xbet call from a
  // random probe. This is the primary tool for confirming postbacks fire.
  const secret = params.get("secret");
  const secretOk = !!secret && secret === process.env.CAPI_WEBHOOK_SECRET;
  const seen: Record<string, string> = {};
  params.forEach((value, key) => {
    seen[key] = key === "secret" ? (secret ? "«provided»" : "«missing»") : value;
  });
  console.log(
    "capi: incoming postback",
    JSON.stringify({ method, secretOk, params: seen, rawUrl: req.url }),
  );

  // Ping Telegram for anything that looks like a real postback attempt (has a
  // secret or event param), so 1xbet postbacks are confirmed live — including
  // wrong-secret ones, which is exactly the case we're blind to otherwise.
  // A random probe with no params won't ping.
  const looksLikePostback = params.has("secret") || params.has("event");
  const eventName = (params.get("event") || "(بدون حدث)").split("?")[0].trim();
  const value = params.get("value");
  const currency = params.get("currency") || "MAD";
  const amount = value ? ` — القيمة: ${value} ${currency}` : "";
  // Which ad platform the click came from, and its raw id — tells you if the
  // platform can attribute this conversion to a specific ad.
  const { platform, id } = parseClickId(
    params.get("fbclid") || params.get("click_id"),
  );
  const platformName = platform === "tiktok" ? "TikTok" : "Meta";
  const attribution = id
    ? `🎯 ${platformName} (id ينتهي بـ …${id.slice(-12)})`
    : `⚪ بدون click id — ${platformName} بنسبة ضعيفة`;

  if (!secretOk) {
    if (looksLikePostback) {
      await pingTelegram(
        `⚠️ وصل postback لكن secret غير صحيح\nالحدث: ${eventName}${amount}\nتأكد أن CAPI_WEBHOOK_SECRET في 1xPartners = القيمة في Vercel.`,
      );
    }
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const testEventCode = params.get("test_event_code") || undefined;

  // Route to the ad platform the click came from.
  if (platform === "tiktok") {
    const result = await sendTikTok(params, req, id, testEventCode);
    const summary = result.ok
      ? "TikTok: ✅ استقبل"
      : `TikTok: ⚠️ ${JSON.stringify(result.json ?? result).slice(0, 200)}`;
    await pingTelegram(
      `✅ وصل postback (secret صحيح)\nالحدث: ${eventName}${amount}\n${attribution}\n${summary}`,
    );
    return NextResponse.json(
      { forwarded: true, platform: "tiktok", tiktok: result },
      { status: result.ok ? 200 : 502 },
    );
  }

  // Meta (default / fb_ prefix / no prefix).
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    return NextResponse.json(
      { error: "CAPI not configured — set NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_ACCESS_TOKEN" },
      { status: 503 },
    );
  }

  const body: Record<string, unknown> = {
    data: [buildEventPayload(params, req, id)],
    access_token: accessToken,
  };
  if (testEventCode) body.test_event_code = testEventCode;

  const metaRes = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const metaJson = (await metaRes.json()) as { events_received?: number };

  const metaSummary = metaRes.ok
    ? `Meta: ✅ استقبل ${metaJson.events_received ?? 1}`
    : `Meta: ⚠️ ${JSON.stringify(metaJson).slice(0, 200)}`;
  await pingTelegram(
    `✅ وصل postback (secret صحيح)\nالحدث: ${eventName}${amount}\n${attribution}\n${metaSummary}`,
  );

  return NextResponse.json(
    { forwarded: true, meta: metaJson },
    { status: metaRes.ok ? 200 : 502 },
  );
}

/**
 * 1xPartners appends an extra "?<name>={macro}" after the configured
 * postback URL — e.g. "...&event=CompleteRegistration?reg={reg}" or
 * "...&currency=MAD?value={sumdep}&ftd={ftd}". Standard URL parsing treats
 * only the first "?" as the query delimiter, so that trailing pair gets
 * swallowed into the previous param's value (mangling the event name, or
 * dropping the deposit value).
 *
 * Crucially, by the time this reaches us the stray "?" and its following
 * "=" arrive PERCENT-ENCODED (%3F / %3D) — the runtime normalizes req.url —
 * so replacing only a literal "?" isn't enough. Decode those two delimiters
 * first, then fold every secondary "?" into "&", so the appended pair parses
 * as its own param. (The real postback params here never legitimately
 * contain an encoded "?" or "=", so decoding them globally is safe.)
 */
function robustSearchParams(rawUrl: string): URLSearchParams {
  const qIndex = rawUrl.indexOf("?");
  if (qIndex === -1) return new URLSearchParams();
  const qs = rawUrl
    .slice(qIndex + 1)
    .replace(/%3F/gi, "?")
    .replace(/%3D/gi, "=")
    .replace(/\?/g, "&");
  return new URLSearchParams(qs);
}

export async function GET(req: NextRequest) {
  return handle(req, robustSearchParams(req.url), "GET");
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let params: URLSearchParams;
  if (contentType.includes("application/json")) {
    const json = (await req.json().catch(() => ({}))) as Record<string, string>;
    params = new URLSearchParams(json);
  } else {
    params = robustSearchParams(req.url);
  }
  return handle(req, params, "POST");
}

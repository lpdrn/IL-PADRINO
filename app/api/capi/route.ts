import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/config";

/**
 * Server-side relay for Meta Conversions API (CAPI).
 *
 * This is the webhook URL you give your affiliate network's "postback URL"
 * setting (one for registration, one for deposit/FTD — see README). The
 * affiliate network calls this when a referred user converts; we forward the
 * event to Meta's Graph API from the server, which is the only way the real
 * deposit event can reach Meta (it happens entirely off this domain).
 *
 * Required env vars (set in Vercel → Project → Settings → Environment
 * Variables, not just locally):
 *   NEXT_PUBLIC_META_PIXEL_ID  — same pixel id used by components/MetaPixel.tsx
 *   META_CAPI_ACCESS_TOKEN     — from Meta Events Manager → Conversions API
 *   CAPI_WEBHOOK_SECRET        — a secret string you invent; must match the
 *                                `secret` param the affiliate network sends,
 *                                so random callers can't spam fake events in.
 *
 * Query params accepted (GET or POST, same shape):
 *   secret     (required) must equal CAPI_WEBHOOK_SECRET
 *   event      Meta standard event name — "CompleteRegistration" or
 *              "Purchase" are the two you'll actually use. Defaults to "Lead".
 *   value      numeric deposit amount (only meaningful for "Purchase")
 *   currency   ISO currency code, e.g. "MAD" (defaults to "MAD")
 *   fbclid     the Meta click id, if the affiliate network can echo back
 *              whatever LinkEnhancer.tsx appended to the outbound link
 *   fbp        the _fbp browser cookie value, if available
 *   test_event_code  optional — paste from Meta's "Test Events" tool while
 *                     verifying the integration, omit in production
 */

const GRAPH_VERSION = "v21.0";

function buildEventPayload(params: URLSearchParams, req: NextRequest) {
  const event = params.get("event") || "Lead";
  const value = params.get("value");
  const currency = params.get("currency") || "MAD";
  const fbclid = params.get("fbclid");
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

async function handle(req: NextRequest, params: URLSearchParams) {
  const secret = params.get("secret");
  if (!secret || secret !== process.env.CAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    return NextResponse.json(
      { error: "CAPI not configured — set NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_ACCESS_TOKEN" },
      { status: 503 },
    );
  }

  const testEventCode = params.get("test_event_code") || undefined;
  const body: Record<string, unknown> = {
    data: [buildEventPayload(params, req)],
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
  const metaJson = await metaRes.json();

  return NextResponse.json(
    { forwarded: true, meta: metaJson },
    { status: metaRes.ok ? 200 : 502 },
  );
}

export async function GET(req: NextRequest) {
  return handle(req, req.nextUrl.searchParams);
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let params: URLSearchParams;
  if (contentType.includes("application/json")) {
    const json = (await req.json().catch(() => ({}))) as Record<string, string>;
    params = new URLSearchParams(json);
  } else {
    params = req.nextUrl.searchParams;
  }
  return handle(req, params);
}

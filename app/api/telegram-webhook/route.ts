import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { LINKS, SITE_URL, TELEGRAM_CAMPAIGNS } from "@/lib/config";

/**
 * Telegram Bot webhook — on every real channel join:
 *   1. Sends YOU a Telegram notification naming the new member and which
 *      campaign invite link (if any) they used.
 *   2. Fires a Meta Conversions API "Subscribe" event tagged with that
 *      campaign, reusing the same Graph API call as app/api/capi/route.ts
 *      and the same env vars — no new Meta credentials needed.
 *
 * Limitation (same as the rest of the Telegram integration): this can only
 * attribute a join to a CAMPAIGN (which invite link was used), not to an
 * individual ad click/browser — Telegram exposes no browser-identifying data
 * at join time. The CAPI event's user_data carries a hashed Telegram user id
 * (required so Meta doesn't reject the event as unmatchable) but that id
 * can't be linked to any Facebook ad viewer. It still gives Meta a real
 * "this campaign produces joins" signal, beyond the click-only
 * CompleteRegistration event fired from the landing page.
 *
 * No effect on the site or visitor experience either way.
 *
 * Setup (see README):
 *   1. Create a bot via @BotFather (/newbot), copy its token.
 *   2. Add the bot as an ADMIN of the channel — required for it to receive
 *      join/leave updates at all.
 *   3. Find the chat id that should receive notifications (usually your own
 *      DM with the bot): send the bot any message, then open
 *      https://api.telegram.org/bot<TOKEN>/getUpdates in a browser and read
 *      "chat":{"id": ...} from the response.
 *   4. Register the webhook so Telegram calls this route:
 *      curl "https://api.telegram.org/bot<TOKEN>/setWebhook" \
 *        -d "url=https://<site>/api/telegram-webhook" \
 *        -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>" \
 *        -d "allowed_updates=[\"chat_member\"]"
 *
 * Env vars required: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET,
 * TELEGRAM_NOTIFY_CHAT_ID. For the CAPI "Subscribe" event, also (already set
 * for /api/capi): NEXT_PUBLIC_META_PIXEL_ID, META_CAPI_ACCESS_TOKEN.
 */

const GRAPH_VERSION = "v21.0";

interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface ChatMemberUpdate {
  old_chat_member?: { status?: string };
  new_chat_member?: { status?: string; user?: TelegramUser };
  invite_link?: { invite_link?: string };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Maps an invite link back to its campaign key, or null if not recognized. */
function findCampaignKey(inviteLink?: string): string | null {
  if (!inviteLink) return null;
  if (inviteLink === LINKS.telegram) return "الرابط الافتراضي";
  const entry = Object.entries(TELEGRAM_CAMPAIGNS).find(
    ([, link]) => link === inviteLink,
  );
  return entry ? entry[0] : "رابط غير مسجّل بالكود";
}

async function notify(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_NOTIFY_CHAT_ID;
  if (!token || !chatId) return { skipped: true };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  return { ok: res.ok, status: res.status };
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/**
 * Fires a campaign-tagged "Subscribe" event to Meta CAPI for a real join.
 * Meta rejects events with zero user_data (treats them as unmatchable), so
 * this sends the Telegram user's numeric id as a hashed external_id — Meta's
 * documented pattern for server-side events with no browser identifiers.
 * It can't match to a specific ad viewer, but satisfies Meta's requirement
 * and still carries the campaign signal via custom_data.
 */
async function sendSubscribeEvent(
  campaignKey: string | null,
  telegramUserId?: number,
) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return { skipped: true };
  if (!telegramUserId) return { skipped: true, reason: "no user id" };

  const body = {
    data: [
      {
        event_name: "Subscribe",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "system_generated",
        event_source_url: SITE_URL,
        user_data: { external_id: sha256(String(telegramUserId)) },
        custom_data: { content_name: campaignKey ?? "unknown" },
      },
    ],
    access_token: accessToken,
  };

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  return { ok: res.ok, status: res.status };
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (!secret || secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const update = (await req.json().catch(() => null)) as {
    chat_member?: ChatMemberUpdate;
  } | null;
  const chatMember = update?.chat_member;
  if (!chatMember) {
    return NextResponse.json({ ok: true }); // not a membership update, ignore
  }

  const oldStatus = chatMember.old_chat_member?.status;
  const newStatus = chatMember.new_chat_member?.status;
  const justJoined =
    (oldStatus === "left" || oldStatus === "kicked" || !oldStatus) &&
    (newStatus === "member" || newStatus === "restricted");

  if (!justJoined) {
    return NextResponse.json({ ok: true });
  }

  const user = chatMember.new_chat_member?.user;
  const name = escapeHtml(
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "مستخدم",
  );
  const username = user?.username ? `@${escapeHtml(user.username)}` : "بدون username";
  const inviteLink = chatMember.invite_link?.invite_link;
  const campaignKey = findCampaignKey(inviteLink);

  const lines = [
    "🎉 <b>عضو جديد انضم للقناة</b>",
    `الاسم: ${name} (${username})`,
  ];
  if (campaignKey) lines.push(`الحملة: <b>${escapeHtml(campaignKey)}</b>`);

  const [notified, capi] = await Promise.all([
    notify(lines.join("\n")),
    sendSubscribeEvent(campaignKey, user?.id),
  ]);

  return NextResponse.json({ ok: true, campaignKey, notified, capi });
}

/** Telegram may probe with GET while you're setting things up. */
export async function GET() {
  return NextResponse.json({ ok: true, service: "telegram-webhook" });
}

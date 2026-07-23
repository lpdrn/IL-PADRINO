import { NextRequest, NextResponse } from "next/server";

/**
 * Telegram Bot webhook — sends YOU a Telegram notification every time
 * someone joins the channel (name + username). Pure notification tool: no
 * Meta Pixel/CAPI, no effect on the site or visitor experience.
 *
 * Per-campaign attribution is intentionally NOT done here anymore: matching
 * the reported invite link against a config list proved unreliable, and
 * campaign performance is now tracked via the 1xPartners Sub ID in the
 * conversion funnel instead.
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
 * TELEGRAM_NOTIFY_CHAT_ID.
 */

interface TelegramUser {
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface ChatMemberUpdate {
  old_chat_member?: { status?: string };
  new_chat_member?: { status?: string; user?: TelegramUser };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

  const result = await notify(
    `🎉 <b>عضو جديد انضم للقناة</b>\nالاسم: ${name} (${username})`,
  );

  return NextResponse.json({ ok: true, notified: result });
}

/** Telegram may probe with GET while you're setting things up. */
export async function GET() {
  return NextResponse.json({ ok: true, service: "telegram-webhook" });
}

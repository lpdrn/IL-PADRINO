"use client";

import { useEffect } from "react";
import { LINKS, TELEGRAM_CAMPAIGNS } from "@/lib/config";

/**
 * Per-campaign Telegram swap on the outbound CTA links marked with
 * `data-append-params` (links work fine without JS): if the page was opened
 * with ?ch=<key> and the key exists in TELEGRAM_CAMPAIGNS, every Telegram
 * CTA points to that campaign's invite link instead, so joins are
 * attributable per campaign in Telegram's stats. Only whitelisted keys are
 * honored.
 *
 * Deliberately does NOT append fbclid, utm_ params, or anything else onto
 * the link: Telegram doesn't consume them for anything, and a decorated
 * `t.me/+HASH?...` URL can come back from Telegram's chat_member webhook as
 * a non-matching invite_link, breaking campaign attribution entirely.
 */
export function LinkEnhancer() {
  useEffect(() => {
    const campaignKey = new URLSearchParams(window.location.search).get("ch");
    const campaignLink = campaignKey ? TELEGRAM_CAMPAIGNS[campaignKey] : undefined;
    if (!campaignLink) return;

    const anchors =
      document.querySelectorAll<HTMLAnchorElement>("a[data-append-params]");
    anchors.forEach((a) => {
      if (a.href === LINKS.telegram) a.href = campaignLink;
    });
  }, []);

  return null;
}

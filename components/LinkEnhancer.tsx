"use client";

import { useEffect } from "react";
import { LINKS, TELEGRAM_CAMPAIGNS } from "@/lib/config";

/**
 * Two client-side enhancements (both no-ops without JS — links work as-is):
 *
 * 1. Telegram CTAs (`data-append-params`): per-campaign swap. If the page was
 *    opened with ?ch=<key> and the key exists in TELEGRAM_CAMPAIGNS, point
 *    every Telegram CTA at that campaign's invite link. Only whitelisted keys
 *    are honored. Deliberately appends NOTHING else — Telegram doesn't consume
 *    query params, and a decorated t.me link comes back from the chat_member
 *    webhook as a non-matching invite_link.
 *
 * 2. Direct-registration CTAs (`data-register-link`): set the visitor's ad
 *    click id as the reffpa `click_id` query param (the tracker's own field —
 *    its "Example tracking URL" ends with `&click_id={click_id}`). The id is
 *    prefixed by source — `fb_<fbclid>` (Meta) or `tt_<ttclid>` (TikTok) — so
 *    /api/capi can route the conversion back to the right platform. It
 *    round-trips via the postback's {{click_id}} macro. Unlike Telegram, 1xbet
 *    DOES consume this, and the click goes straight from our domain (where the
 *    click id is live) to the platform.
 */
export function LinkEnhancer() {
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);

    // 1. Telegram per-campaign swap
    const campaignKey = search.get("ch");
    const campaignLink = campaignKey ? TELEGRAM_CAMPAIGNS[campaignKey] : undefined;
    if (campaignLink) {
      document
        .querySelectorAll<HTMLAnchorElement>("a[data-append-params]")
        .forEach((a) => {
          if (a.href === LINKS.telegram) a.href = campaignLink;
        });
    }

    // 2. Direct-registration click-id pass-through — set reffpa's own click_id
    //    field (the tracker echoes it back via the postback's {{click_id}}).
    //    Prefix by source so /api/capi routes the conversion to the right
    //    platform: fb_<fbclid> (Meta) or tt_<ttclid> (TikTok). Append as a raw
    //    string rather than via the URL API, so the existing link is preserved
    //    verbatim — the URL API would re-encode the landing path
    //    (r=en/registration → r=en%2Fregistration).
    const fbclid = search.get("fbclid");
    const ttclid = search.get("ttclid");
    const clickId = fbclid ? `fb_${fbclid}` : ttclid ? `tt_${ttclid}` : null;
    if (clickId) {
      const suffix = `click_id=${encodeURIComponent(clickId)}`;
      document
        .querySelectorAll<HTMLAnchorElement>("a[data-register-link]")
        .forEach((a) => {
          if (a.href.includes("click_id=")) return; // don't double-append
          a.href += (a.href.includes("?") ? "&" : "?") + suffix;
        });
    }
  }, []);

  return null;
}

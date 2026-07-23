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
 * 2. Direct-registration CTAs (`data-register-link`): append the visitor's
 *    fbclid into the reffpa tracking tag's sub-id slot (`tag=…97c_<fbclid>`).
 *    That sub-id round-trips back via the postback's {{click_id}} macro →
 *    /api/capi builds `fbc` → Meta attributes the real registration/deposit to
 *    the exact ad. Unlike Telegram, 1xbet DOES consume this, and the click
 *    goes straight from our domain (where fbclid is live) to the platform.
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

    // 2. Direct-registration fbclid pass-through
    const fbclid = search.get("fbclid");
    if (fbclid) {
      document
        .querySelectorAll<HTMLAnchorElement>("a[data-register-link]")
        .forEach((a) => {
          try {
            const url = new URL(a.href);
            const tag = url.searchParams.get("tag");
            // Only append when the sub-id slot is empty (tag ends with "_"),
            // so re-runs and pre-filled tags aren't double-appended.
            if (tag && tag.endsWith("_")) {
              url.searchParams.set("tag", tag + fbclid);
              a.href = url.toString();
            }
          } catch {
            /* leave untouched on a malformed href */
          }
        });
    }
  }, []);

  return null;
}

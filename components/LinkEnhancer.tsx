"use client";

import { useEffect } from "react";
import { LINKS, TELEGRAM_CAMPAIGNS } from "@/lib/config";

/**
 * Two progressive enhancements on the outbound CTA links marked with
 * `data-append-params` (links work fine without JS):
 *
 * 1. Per-campaign Telegram swap — if the page was opened with ?ch=<key> and
 *    the key exists in TELEGRAM_CAMPAIGNS, every Telegram CTA points to that
 *    campaign's invite link instead, so joins are attributable per campaign
 *    in Telegram's stats. Only whitelisted keys are honored.
 * 2. Forwards incoming Meta campaign parameters (fbclid, utm_*, sub-ids, …)
 *    onto the links, so downstream conversions attribute back to the ad set.
 */
export function LinkEnhancer() {
  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search);
    if ([...incoming.keys()].length === 0) return;

    const campaignKey = incoming.get("ch");
    const campaignLink = campaignKey
      ? TELEGRAM_CAMPAIGNS[campaignKey]
      : undefined;

    const anchors =
      document.querySelectorAll<HTMLAnchorElement>("a[data-append-params]");
    anchors.forEach((a) => {
      try {
        if (campaignLink && a.href === LINKS.telegram) {
          a.href = campaignLink;
        }
        const url = new URL(a.href);
        incoming.forEach((value, key) => {
          if (!url.searchParams.has(key)) url.searchParams.set(key, value);
        });
        a.href = url.toString();
      } catch {
        /* leave untouched on malformed URLs */
      }
    });
  }, []);

  return null;
}

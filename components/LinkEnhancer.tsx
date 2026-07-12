"use client";

import { useEffect } from "react";

/**
 * Forwards incoming Meta campaign parameters (fbclid, utm_*, sub-ids, …) from
 * the current URL onto every outbound registration/app link marked with
 * `data-append-params`, so first-time-deposit conversions attribute back to the
 * ad set. Progressive enhancement: links work fine without this.
 */
export function LinkEnhancer() {
  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search);
    if ([...incoming.keys()].length === 0) return;

    const anchors =
      document.querySelectorAll<HTMLAnchorElement>("a[data-append-params]");
    anchors.forEach((a) => {
      try {
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

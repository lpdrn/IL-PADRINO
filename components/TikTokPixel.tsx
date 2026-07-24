"use client";

import Script from "next/script";
import { useEffect } from "react";
import { PROMO_CODE } from "@/lib/config";

/**
 * TikTok Pixel — the client half of TikTok ad tracking, mirroring
 * components/MetaPixel.tsx. No-op unless NEXT_PUBLIC_TIKTOK_PIXEL_ID is set,
 * so the build stays clean until a real pixel id is provided. Fires the page
 * view on load and "CompleteRegistration" when the Telegram CTA is tapped.
 *
 * The real registration/deposit conversions happen off-domain on 1xbet and
 * arrive server-side via the affiliate postback (see app/api/capi/route.ts).
 * Forwarding those to TikTok additionally requires an Events API access
 * token — not wired yet.
 */
export function TikTokPixel() {
  const id = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  useEffect(() => {
    if (!id) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a[data-append-params]");
      if (!link) return;
      const ttq = (
        window as unknown as { ttq?: { track: (...args: unknown[]) => void } }
      ).ttq;
      ttq?.track("CompleteRegistration", { content_name: PROMO_CODE });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [id]);

  if (!id) return null;

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`!function (w, d, t) {
w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
ttq.load('${id}');
ttq.page();
}(window, document, 'ttq');`}
    </Script>
  );
}

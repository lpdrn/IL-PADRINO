"use client";

import Script from "next/script";
import { useEffect } from "react";
import { PROMO_CODE } from "@/lib/config";

/**
 * Meta (Facebook/Instagram) Pixel — the client half of funnel tracking.
 * No-op unless NEXT_PUBLIC_META_PIXEL_ID is set, so the build stays clean
 * until a real pixel id is provided. Fires PageView on load and
 * "CompleteRegistration" when the Telegram CTA is tapped, giving the ad
 * delivery a client-side conversion signal. (Note: the 1xbet affiliate
 * postback also fires CompleteRegistration server-side via /api/capi, so
 * this event can carry both click-intent and real registrations — dedupe
 * on event_id later if precise counts become important.)
 */
export function MetaPixel() {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    if (!id) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a[data-append-params]");
      if (!link) return;
      const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void })
        .fbq;
      fbq?.("track", "CompleteRegistration", { content_name: PROMO_CODE });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [id]);

  if (!id) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${id}');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

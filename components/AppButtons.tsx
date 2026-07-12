"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LINKS } from "@/lib/config";
import { APPS, TELEGRAM } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { Android, Apple, ArrowLeft, Telegram as TelegramIcon } from "./ui/Icons";

function AppButton({
  href,
  icon,
  label,
  sub,
  recommended,
  accentClassName = "border-hairline text-gold",
}: {
  href: string;
  icon: ReactNode;
  label: string;
  sub: string;
  recommended: boolean;
  /** Icon-circle border + icon color classes; defaults to the gold accent. */
  accentClassName?: string;
}) {
  return (
    <a
      href={href}
      data-append-params=""
      rel="noopener nofollow sponsored"
      className={`btn-outline ${recommended ? "!border-hairline-strong" : ""}`}
    >
      <span
        className={`grid size-9 flex-none place-items-center rounded-full border bg-ink ${accentClassName}`}
      >
        {icon}
      </span>
      <span className="flex-1 text-start">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-ivory">{label}</span>
          {recommended && (
            <span className="rounded-full border border-hairline-strong px-1.5 py-0.5 text-[10px] font-medium text-gold">
              موصى به لجهازك
            </span>
          )}
        </span>
        <span className="block text-[12px] text-muted">{sub}</span>
      </span>
      <ArrowLeft className="size-4 flex-none text-muted" />
    </a>
  );
}

/**
 * Secondary (Tier 2) download route + the Telegram channel, grouped in one
 * tight list so all three feel like one family of buttons. Both apps always
 * available; the visitor's OS is surfaced first and flagged, but never
 * competes with the primary CTA. Telegram keeps its own brand-blue icon
 * accent so the channel reads as recognizably Telegram.
 */
export function AppButtons() {
  const [os, setOs] = useState<"ios" | "android" | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/android/i.test(ua)) setOs("android");
    else if (/iphone|ipad|ipod/i.test(ua)) setOs("ios");
  }, []);

  const android = (
    <AppButton
      key="android"
      href={LINKS.android}
      icon={<Android className="size-5" />}
      label={APPS.android.label}
      sub={APPS.android.sub}
      recommended={os === "android"}
    />
  );
  const iphone = (
    <AppButton
      key="iphone"
      href={LINKS.iphone}
      icon={<Apple className="size-5" />}
      label={APPS.iphone.label}
      sub={APPS.iphone.sub}
      recommended={os === "ios"}
    />
  );
  const telegram = (
    <AppButton
      key="telegram"
      href={LINKS.telegram}
      icon={<TelegramIcon className="size-5" />}
      label={TELEGRAM.label}
      sub={TELEGRAM.sub}
      recommended={false}
      accentClassName="border-[#2AABEE]/45 text-[#2AABEE]"
    />
  );

  const ordered = os === "ios" ? [iphone, android] : [android, iphone];

  return (
    <section id="apps" className="section">
      <div className="shell">
        <Reveal>
          <h2 className="mb-5 text-center font-display text-[1.35rem] text-ivory">
            {APPS.heading}
          </h2>
          <div className="flex flex-col gap-3">
            {ordered}
            {telegram}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

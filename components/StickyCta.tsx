"use client";

import { useEffect, useState } from "react";
import { CTA } from "@/lib/content";
import { PROMO_CODE } from "@/lib/config";
import { CtaButton } from "./ui/CtaButton";

/**
 * Persistent bottom CTA. Appears once the hero CTA scrolls out of view and
 * hides again over the footer so it never covers the 18+ / legal text.
 * Single action (join Telegram), safe-area aware.
 */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-cta-sentinel");
    const footer = document.getElementById("footer");

    if (typeof IntersectionObserver === "undefined") {
      const onScroll = () => setPastHero(window.scrollY > 620);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observers: IntersectionObserver[] = [];
    if (sentinel) {
      const io = new IntersectionObserver(
        ([entry]) => setPastHero(!entry.isIntersecting),
        { rootMargin: "-8px 0px 0px 0px" },
      );
      io.observe(sentinel);
      observers.push(io);
    }
    if (footer) {
      const io = new IntersectionObserver(
        ([entry]) => setFooterVisible(entry.isIntersecting),
      );
      io.observe(footer);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const show = pastHero && !footerVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-hairline-strong bg-ink shadow-[0_-6px_24px_rgba(0,0,0,0.55)] transition-all duration-200 ${
        show
          ? "translate-y-0 opacity-100"
          : "invisible pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="px-4 py-3">
        <div className="shell">
          <CtaButton className="!min-h-[52px]" withArrow={false}>
            <span className="flex items-center gap-2">
              <span>{CTA.sticky}</span>
              <span className="num rounded bg-black/15 px-1.5 py-0.5 text-[12px] font-semibold">
                {PROMO_CODE}
              </span>
            </span>
          </CtaButton>
        </div>
      </div>
    </div>
  );
}

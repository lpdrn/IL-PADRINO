"use client";

import { useEffect, useRef, useState } from "react";
import { PROMO } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { Copy, Check } from "./ui/Icons";

/** Clipboard fallback for older in-app webviews (Meta FB/IG browser). */
function legacyCopy(text: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Tap-anywhere-to-copy promo code with confirmation feedback. Ties the SBA3
 * code directly to activating the 2000 dirham bonus.
 */
export function PromoCode() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROMO.code);
      } else {
        legacyCopy(PROMO.code);
      }
    } catch {
      legacyCopy(PROMO.code);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="promo" className="section pt-0">
      <div className="shell">
        <Reveal>
          <p className="mb-3 text-center text-[14px] text-muted">
            {PROMO.label}
          </p>

          <button
            type="button"
            onClick={handleCopy}
            aria-label={`نسخ كود العرض ${PROMO.code}`}
            className={`code-chip flex w-full items-center justify-between gap-3 px-4 py-4 text-start ${
              copied ? "copied-pulse" : ""
            }`}
          >
            <span className="num text-[1.6rem] font-semibold tracking-[0.3em] text-ivory">
              {PROMO.code}
            </span>
            <span
              aria-live="polite"
              className={`foil inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[14px] font-semibold ${
                copied ? "!bg-none !bg-success !text-ink" : ""
              }`}
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  <span>{PROMO.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>{PROMO.copy}</span>
                </>
              )}
            </span>
          </button>

          <p className="mt-3 text-center text-[13px] leading-relaxed text-muted">
            {PROMO.helper}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

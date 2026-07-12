"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to `end` once the number scrolls into view AND the tab is visible.
 * Server-renders the final value, so no-JS, reduced-motion, background-tab,
 * prerender, and slow-hydration paths all show the real number at rest — the
 * animation only ever *starts* from 0, it never leaves a resting 0 on screen.
 */
export function CountUp({
  end,
  duration = 1600,
  className,
}: {
  end: number;
  duration?: number;
  className?: string;
}) {
  const [val, setVal] = useState(end);
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return; // keep the final value, no animation

    const run = () => {
      if (started.current) return;
      started.current = true;
      setVal(0);
      let start = 0;
      const tick = (t: number) => {
        if (!start) start = t;
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * end));
        if (p < 1) raf.current = requestAnimationFrame(tick);
        else setVal(end);
      };
      raf.current = requestAnimationFrame(tick);
    };

    // Hold the SSR value (`end`) until the number is on screen *and* the tab is
    // actually visible — never reset to a resting 0 in a hidden/prerender load.
    let inView = false;
    const maybeRun = () => {
      if (inView && document.visibilityState === "visible") run();
    };

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  inView = true;
                  io?.disconnect();
                  maybeRun();
                }
              }
            },
            { threshold: 0.6 },
          )
        : null;

    if (io) io.observe(el);
    else {
      inView = true;
      maybeRun();
    }

    const onVis = () => maybeRun();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf.current);
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [end, duration]);

  return (
    <span ref={ref} className={`num ${className ?? ""}`}>
      {val}
    </span>
  );
}

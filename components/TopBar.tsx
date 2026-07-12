import { BRAND } from "@/lib/config";

/** Slim brand bar: wordmark (start) + persistent 18+ compliance badge (end). */
export function TopBar() {
  return (
    <header className="border-b border-line">
      <div className="shell flex h-12 items-center justify-between px-5">
        <span className="font-display text-[15px] font-bold tracking-[0.16em] text-gold">
          {BRAND.wordmark}
        </span>
        <span className="num rounded-full border border-hairline-strong px-2 py-0.5 text-[11px] font-semibold text-gold">
          18+
        </span>
      </div>
    </header>
  );
}

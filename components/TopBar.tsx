import { BRAND } from "@/lib/config";

/** Slim brand bar with the wordmark, centered. */
export function TopBar() {
  return (
    <header className="border-b border-line">
      <div className="shell flex h-12 items-center justify-center px-5">
        <span className="font-display text-[15px] font-bold tracking-[0.16em] text-gold">
          {BRAND.wordmark}
        </span>
      </div>
    </header>
  );
}

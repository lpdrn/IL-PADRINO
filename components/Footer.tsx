import { FOOTER } from "@/lib/content";
import { BRAND } from "@/lib/config";
import { Spade } from "./ui/Icons";

/** Compliance-as-trust: brand, 18+, responsible-gambling, terms, disclaimer. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="border-t border-line px-5 pb-28 pt-12 text-center"
    >
      <div className="shell">
        <div className="foil mx-auto mb-4 grid size-10 place-items-center rounded-full">
          <Spade className="size-5" />
        </div>

        <p className="mb-3 font-display text-[15px] font-bold tracking-[0.16em] text-gold">
          {BRAND.wordmark}
        </p>

        <span className="num mb-4 inline-block rounded-full border border-hairline-strong px-2.5 py-0.5 text-[12px] font-semibold text-gold">
          18+
        </span>

        <p className="mx-auto mb-5 max-w-[27rem] text-[13px] leading-[1.75] text-muted">
          {FOOTER.responsible}
        </p>

        <nav
          aria-label="روابط قانونية"
          className="mb-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px]"
        >
          {FOOTER.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="inline-flex min-h-[44px] items-center px-2 text-muted transition-colors hover:text-ivory"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="mx-auto max-w-[27rem] text-[12px] leading-relaxed text-muted">
          {FOOTER.disclaimer}
        </p>

        <p className="mt-4 text-[12px] text-muted">
          © <span className="num">{year}</span> {BRAND.wordmark}
        </p>
      </div>
    </footer>
  );
}

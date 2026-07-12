import { FAQ, SEO } from "@/lib/content";
import { BRAND, LINKS, SITE_URL } from "@/lib/config";

/**
 * SEO structured data (JSON-LD): Organization + FAQPage. Rendered server-side.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: BRAND.name,
        description: SEO.description,
        url: SITE_URL,
        sameAs: [LINKS.telegram],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is from our own trusted constants; escape < to be safe.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

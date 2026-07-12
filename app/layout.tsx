import type { Metadata, Viewport } from "next";
import { Noto_Kufi_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { SEO } from "@/lib/content";
import { BRAND, PROMO_CODE, SITE_URL } from "@/lib/config";

const kufi = Noto_Kufi_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["700", "900"],
  variable: "--font-kufi",
  display: "swap",
});

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO.title,
  description: SEO.description,
  applicationName: BRAND.name,
  keywords: [
    "إل بادرينو",
    "IL PADRINO",
    "مكافأة",
    "2000 درهم",
    "رهان",
    PROMO_CODE,
    "بونص الإيداع الأول",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_AE",
    url: "/",
    siteName: BRAND.name,
    title: SEO.title,
    description: SEO.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${kufi.variable} ${plex.variable} h-full`}
    >
      <body className="min-h-full">
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}

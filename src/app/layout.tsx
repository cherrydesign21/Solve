import type { Metadata, Viewport } from "next";
import { Sora, KoHo } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { GlowBackground } from "@/components/layout/GlowBackground";
import { PageTransition } from "@/components/layout/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { CurrencyProvider } from "@/lib/currency-context";
import { HorizontalAdSlot } from "@/components/ui/AdSlot";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const koho = KoHo({
  variable: "--font-koho",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_DESCRIPTION =
  "A fast, mobile-friendly collection of everyday calculators and converters: EMI, SIP, tax, currency, units, solar sizing and birthday reminders.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Solve — Everyday Calculators & Converters",
    template: "%s · Solve",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Solve — Everyday Calculators & Converters",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solve — Everyday Calculators & Converters",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/twitter-image`],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${koho.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg font-sans text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <CurrencyProvider>
          <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
            <GlowBackground />
            <Navigation />
            <main className="relative z-10 min-w-0 flex-1">
              <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                <PageTransition>{children}</PageTransition>
                <HorizontalAdSlot className="mt-10" />
                <Footer />
              </div>
            </main>
          </div>
        </CurrencyProvider>
      </body>
    </html>
  );
}

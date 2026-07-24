import type { Metadata, Viewport } from "next";
import { Sora, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { CurrencyProvider } from "@/lib/currency-context";
import { AdSettingsProvider } from "@/lib/adsense-context";
import { getAdsenseSettings } from "@/lib/settings";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseSettings = await getAdsenseSettings();

  return (
    <html
      lang="en"
      className={`${sora.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <head>
        {adsenseSettings.enabled && adsenseSettings.publisherId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseSettings.publisherId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full bg-bg font-sans text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <AdSettingsProvider value={adsenseSettings}>
          <CurrencyProvider>
            <AppShell>{children}</AppShell>
          </CurrencyProvider>
        </AdSettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}

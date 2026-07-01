import type { Metadata, Viewport } from "next";
import { Sora, KoHo } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { GlowBackground } from "@/components/layout/GlowBackground";
import { PageTransition } from "@/components/layout/PageTransition";

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

export const metadata: Metadata = {
  title: {
    default: "Solve — Everyday Calculators & Converters",
    template: "%s · Solve",
  },
  description:
    "A fast, mobile-friendly collection of everyday calculators and converters: EMI, SIP, tax, currency, units, solar sizing and birthday reminders.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${koho.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg font-sans text-white">
        <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
          <GlowBackground />
          <Navigation />
          <main className="relative z-10 min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

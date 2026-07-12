"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { GlowBackground } from "./GlowBackground";
import { PageTransition } from "./PageTransition";
import { Footer } from "./Footer";
import { VisitorTracker } from "./VisitorTracker";
import { HorizontalAdSlot } from "@/components/ui/AdSlot";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The admin dashboard renders its own layout/nav entirely — it shouldn't be
  // wrapped in the public site's tool sidebar, footer or ad slots.
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
      <VisitorTracker />
      <GlowBackground />
      <Navigation />
      <main className="relative z-10 min-w-0 flex-1">
        <div className="mx-auto w-full max-w-350 px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <PageTransition>{children}</PageTransition>
          <HorizontalAdSlot className="mt-10" />
          <Footer />
        </div>
      </main>
    </div>
  );
}

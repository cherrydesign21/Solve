"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Fires a best-effort, fire-and-forget page-view beacon for the admin
// analytics view. No cookies, no IP storage on the client side — just path,
// referrer and a timestamp recorded server-side.
export function VisitorTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || null }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}

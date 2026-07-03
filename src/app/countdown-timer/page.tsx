import type { Metadata } from "next";
import CountdownTimer from "@/tools/countdown-timer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Countdown Timer",
  description: "Live countdown to any date and time.",
  path: "/countdown-timer",
});

export default function Page() {
  return <CountdownTimer />;
}

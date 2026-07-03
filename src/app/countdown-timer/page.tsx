import type { Metadata } from "next";
import CountdownTimer from "@/tools/countdown-timer";

export const metadata: Metadata = {
  title: "Countdown Timer",
  description: "Live countdown to any date and time.",
};

export default function Page() {
  return <CountdownTimer />;
}

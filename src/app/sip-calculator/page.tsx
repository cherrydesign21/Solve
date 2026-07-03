import type { Metadata } from "next";
import SipCalculator from "@/tools/sip-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SIP Calculator",
  description: "Project the future value of monthly SIP or lumpsum investments.",
  path: "/sip-calculator",
});

export default function Page() {
  return <SipCalculator />;
}

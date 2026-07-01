import type { Metadata } from "next";
import SipCalculator from "@/tools/sip-calculator";

export const metadata: Metadata = {
  title: "SIP Calculator",
  description: "Project the future value of monthly SIP or lumpsum investments.",
};

export default function Page() {
  return <SipCalculator />;
}

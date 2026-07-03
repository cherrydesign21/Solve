import type { Metadata } from "next";
import GoalSipCalculator from "@/tools/goal-sip-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Goal-Based SIP Calculator",
  description: "Find the monthly SIP needed to hit a target amount.",
  path: "/goal-sip-calculator",
});

export default function Page() {
  return <GoalSipCalculator />;
}

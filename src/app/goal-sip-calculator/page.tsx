import type { Metadata } from "next";
import GoalSipCalculator from "@/tools/goal-sip-calculator";

export const metadata: Metadata = {
  title: "Goal-Based SIP Calculator",
  description: "Find the monthly SIP needed to hit a target amount.",
};

export default function Page() {
  return <GoalSipCalculator />;
}

import type { Metadata } from "next";
import EmiCalculator from "@/tools/emi-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "EMI Calculator",
  description: "Calculate monthly loan instalments, total interest and payoff totals in real time.",
  path: "/emi-calculator",
});

export default function Page() {
  return <EmiCalculator />;
}

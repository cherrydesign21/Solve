import type { Metadata } from "next";
import EmiCalculator from "@/tools/emi-calculator";

export const metadata: Metadata = {
  title: "EMI Calculator",
  description: "Calculate monthly loan instalments, total interest and payoff totals in real time.",
};

export default function Page() {
  return <EmiCalculator />;
}

import type { Metadata } from "next";
import PercentageCalculator from "@/tools/percentage-calculator";

export const metadata: Metadata = {
  title: "Percentage Calculator",
  description: "Percentage of a value, share of a total, or percent change between two numbers.",
};

export default function Page() {
  return <PercentageCalculator />;
}

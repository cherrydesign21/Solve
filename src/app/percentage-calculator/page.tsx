import type { Metadata } from "next";
import PercentageCalculator from "@/tools/percentage-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Percentage Calculator",
  description: "Percentage of a value, share of a total, or percent change between two numbers.",
  path: "/percentage-calculator",
});

export default function Page() {
  return <PercentageCalculator />;
}

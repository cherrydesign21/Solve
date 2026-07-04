import type { Metadata } from "next";
import DateDifferenceCalculator from "@/tools/date-difference-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Date Difference Calculator",
  description: "Find the exact time span between any two dates.",
  path: "/date-difference-calculator",
});

export default function Page() {
  return <DateDifferenceCalculator />;
}

import type { Metadata } from "next";
import AgeCalculator from "@/tools/age-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Age Calculator",
  description: "Exact age in years, months and days, plus your next birthday.",
  path: "/age-calculator",
});

export default function Page() {
  return <AgeCalculator />;
}

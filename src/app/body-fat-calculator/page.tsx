import type { Metadata } from "next";
import BodyFatCalculator from "@/tools/body-fat-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Body Fat Percentage Calculator",
  description: "Estimate your body fat percentage using the U.S. Navy circumference method.",
  path: "/body-fat-calculator",
});

export default function Page() {
  return <BodyFatCalculator />;
}

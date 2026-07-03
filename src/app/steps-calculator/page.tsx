import type { Metadata } from "next";
import StepsCalculator from "@/tools/steps-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Steps to Calories/Distance Calculator",
  description: "Convert your daily step count into distance walked and calories burned.",
  path: "/steps-calculator",
});

export default function Page() {
  return <StepsCalculator />;
}

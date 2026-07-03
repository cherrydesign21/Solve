import type { Metadata } from "next";
import BmrCalculator from "@/tools/bmr-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "BMR Calculator",
  description: "Find your basal metabolic rate and calorie burn by activity level.",
  path: "/bmr-calculator",
});

export default function Page() {
  return <BmrCalculator />;
}

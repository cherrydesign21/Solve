import type { Metadata } from "next";
import CalorieCalculator from "@/tools/calorie-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Calorie Calculator",
  description: "Get your daily calorie target and macro split for your goal.",
  path: "/calorie-calculator",
});

export default function Page() {
  return <CalorieCalculator />;
}

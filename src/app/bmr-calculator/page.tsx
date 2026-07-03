import type { Metadata } from "next";
import BmrCalculator from "@/tools/bmr-calculator";

export const metadata: Metadata = {
  title: "BMR Calculator",
  description: "Find your basal metabolic rate and calorie burn by activity level.",
};

export default function Page() {
  return <BmrCalculator />;
}

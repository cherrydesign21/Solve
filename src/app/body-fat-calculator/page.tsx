import type { Metadata } from "next";
import BodyFatCalculator from "@/tools/body-fat-calculator";

export const metadata: Metadata = {
  title: "Body Fat Percentage Calculator",
  description: "Estimate your body fat percentage using the U.S. Navy circumference method.",
};

export default function Page() {
  return <BodyFatCalculator />;
}

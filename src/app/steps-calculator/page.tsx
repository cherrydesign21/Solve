import type { Metadata } from "next";
import StepsCalculator from "@/tools/steps-calculator";

export const metadata: Metadata = {
  title: "Steps to Calories/Distance Calculator",
  description: "Convert your daily step count into distance walked and calories burned.",
};

export default function Page() {
  return <StepsCalculator />;
}

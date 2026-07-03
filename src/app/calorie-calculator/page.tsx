import type { Metadata } from "next";
import CalorieCalculator from "@/tools/calorie-calculator";

export const metadata: Metadata = {
  title: "Calorie Calculator",
  description: "Get your daily calorie target and macro split for your goal.",
};

export default function Page() {
  return <CalorieCalculator />;
}

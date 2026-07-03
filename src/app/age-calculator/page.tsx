import type { Metadata } from "next";
import AgeCalculator from "@/tools/age-calculator";

export const metadata: Metadata = {
  title: "Age Calculator",
  description: "Exact age in years, months and days, plus your next birthday.",
};

export default function Page() {
  return <AgeCalculator />;
}

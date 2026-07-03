import type { Metadata } from "next";
import BiologicalAgeCalculator from "@/tools/biological-age-calculator";

export const metadata: Metadata = {
  title: "Biological Age Calculator",
  description: "Estimate your wellness age based on lifestyle habits.",
};

export default function Page() {
  return <BiologicalAgeCalculator />;
}

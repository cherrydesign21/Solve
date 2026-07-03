import type { Metadata } from "next";
import IdealBodyWeightCalculator from "@/tools/ideal-body-weight-calculator";

export const metadata: Metadata = {
  title: "Ideal Body Weight Calculator",
  description: "Compare your ideal body weight range across four medical formulas.",
};

export default function Page() {
  return <IdealBodyWeightCalculator />;
}

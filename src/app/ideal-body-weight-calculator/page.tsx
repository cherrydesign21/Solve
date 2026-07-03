import type { Metadata } from "next";
import IdealBodyWeightCalculator from "@/tools/ideal-body-weight-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ideal Body Weight Calculator",
  description: "Compare your ideal body weight range across four medical formulas.",
  path: "/ideal-body-weight-calculator",
});

export default function Page() {
  return <IdealBodyWeightCalculator />;
}

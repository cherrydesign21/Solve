import type { Metadata } from "next";
import BmiCalculator from "@/tools/bmi-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "BMI Calculator",
  description: "Check your body mass index and healthy weight range instantly.",
  path: "/bmi-calculator",
});

export default function Page() {
  return <BmiCalculator />;
}

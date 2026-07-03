import type { Metadata } from "next";
import BmiCalculator from "@/tools/bmi-calculator";

export const metadata: Metadata = {
  title: "BMI Calculator",
  description: "Check your body mass index and healthy weight range instantly.",
};

export default function Page() {
  return <BmiCalculator />;
}

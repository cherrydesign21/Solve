import type { Metadata } from "next";
import CompoundInterestCalculator from "@/tools/compound-interest-calculator";

export const metadata: Metadata = {
  title: "Compound Interest Calculator",
  description: "Project growth with flexible compounding frequency.",
};

export default function Page() {
  return <CompoundInterestCalculator />;
}

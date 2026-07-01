import type { Metadata } from "next";
import TaxCalculator from "@/tools/tax-calculator";

export const metadata: Metadata = {
  title: "Tax Calculator",
  description: "Estimate Indian income tax under the old and new regimes in real time.",
};

export default function Page() {
  return <TaxCalculator />;
}

import type { Metadata } from "next";
import TaxCalculator from "@/tools/tax-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Tax Calculator",
  description: "Estimate Indian income tax under the old and new regimes in real time.",
  path: "/tax-calculator",
});

export default function Page() {
  return <TaxCalculator />;
}

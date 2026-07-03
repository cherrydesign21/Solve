import type { Metadata } from "next";
import PropertyTaxCalculator from "@/tools/property-tax-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Property Tax Calculator",
  description: "Estimate your annual property tax from value and rate.",
  path: "/property-tax-calculator",
});

export default function Page() {
  return <PropertyTaxCalculator />;
}

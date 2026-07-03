import type { Metadata } from "next";
import PropertyTaxCalculator from "@/tools/property-tax-calculator";

export const metadata: Metadata = {
  title: "Property Tax Calculator",
  description: "Estimate your annual property tax from value and rate.",
};

export default function Page() {
  return <PropertyTaxCalculator />;
}

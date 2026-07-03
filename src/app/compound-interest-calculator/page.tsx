import type { Metadata } from "next";
import CompoundInterestCalculator from "@/tools/compound-interest-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Compound Interest Calculator",
  description: "Project growth with flexible compounding frequency.",
  path: "/compound-interest-calculator",
});

export default function Page() {
  return <CompoundInterestCalculator />;
}

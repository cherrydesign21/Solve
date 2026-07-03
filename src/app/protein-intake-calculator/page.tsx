import type { Metadata } from "next";
import ProteinIntakeCalculator from "@/tools/protein-intake-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Protein Intake Calculator",
  description: "Work out your daily protein target based on body weight and activity level.",
  path: "/protein-intake-calculator",
});

export default function Page() {
  return <ProteinIntakeCalculator />;
}

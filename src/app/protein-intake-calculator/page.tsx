import type { Metadata } from "next";
import ProteinIntakeCalculator from "@/tools/protein-intake-calculator";

export const metadata: Metadata = {
  title: "Protein Intake Calculator",
  description: "Work out your daily protein target based on body weight and activity level.",
};

export default function Page() {
  return <ProteinIntakeCalculator />;
}

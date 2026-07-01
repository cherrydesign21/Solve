import type { Metadata } from "next";
import SolarPanelCalculator from "@/tools/solar-panel-calculator";

export const metadata: Metadata = {
  title: "Solar Panel Calculator",
  description: "Size a rooftop solar system, estimate cost, payback and CO2 offset from your bill.",
};

export default function Page() {
  return <SolarPanelCalculator />;
}

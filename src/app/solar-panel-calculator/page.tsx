import type { Metadata } from "next";
import SolarPanelCalculator from "@/tools/solar-panel-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Solar Panel Calculator",
  description: "Size a rooftop solar system, estimate cost, payback and CO2 offset from your bill.",
  path: "/solar-panel-calculator",
});

export default function Page() {
  return <SolarPanelCalculator />;
}

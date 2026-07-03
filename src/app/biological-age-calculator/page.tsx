import type { Metadata } from "next";
import BiologicalAgeCalculator from "@/tools/biological-age-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Biological Age Calculator",
  description: "Estimate your wellness age based on lifestyle habits.",
  path: "/biological-age-calculator",
});

export default function Page() {
  return <BiologicalAgeCalculator />;
}

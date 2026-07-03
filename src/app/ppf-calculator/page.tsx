import type { Metadata } from "next";
import PpfCalculator from "@/tools/ppf-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "PPF Calculator",
  description: "Project your Public Provident Fund maturity value.",
  path: "/ppf-calculator",
});

export default function Page() {
  return <PpfCalculator />;
}

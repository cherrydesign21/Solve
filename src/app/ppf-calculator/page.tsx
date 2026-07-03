import type { Metadata } from "next";
import PpfCalculator from "@/tools/ppf-calculator";

export const metadata: Metadata = {
  title: "PPF Calculator",
  description: "Project your Public Provident Fund maturity value.",
};

export default function Page() {
  return <PpfCalculator />;
}

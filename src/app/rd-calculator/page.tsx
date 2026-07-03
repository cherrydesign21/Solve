import type { Metadata } from "next";
import RdCalculator from "@/tools/rd-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Recurring Deposit (RD) Calculator",
  description: "Work out the maturity value of a recurring deposit.",
  path: "/rd-calculator",
});

export default function Page() {
  return <RdCalculator />;
}

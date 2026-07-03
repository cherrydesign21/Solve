import type { Metadata } from "next";
import FdCalculator from "@/tools/fd-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Fixed Deposit (FD) Calculator",
  description: "Work out the maturity value of a fixed deposit.",
  path: "/fd-calculator",
});

export default function Page() {
  return <FdCalculator />;
}

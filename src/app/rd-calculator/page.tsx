import type { Metadata } from "next";
import RdCalculator from "@/tools/rd-calculator";

export const metadata: Metadata = {
  title: "Recurring Deposit (RD) Calculator",
  description: "Work out the maturity value of a recurring deposit.",
};

export default function Page() {
  return <RdCalculator />;
}

import type { Metadata } from "next";
import FdCalculator from "@/tools/fd-calculator";

export const metadata: Metadata = {
  title: "Fixed Deposit (FD) Calculator",
  description: "Work out the maturity value of a fixed deposit.",
};

export default function Page() {
  return <FdCalculator />;
}

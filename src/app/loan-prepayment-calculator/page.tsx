import type { Metadata } from "next";
import LoanPrepaymentCalculator from "@/tools/loan-prepayment-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Loan Prepayment Calculator",
  description: "See how a part-payment reduces your loan tenure or EMI.",
  path: "/loan-prepayment-calculator",
});

export default function Page() {
  return <LoanPrepaymentCalculator />;
}

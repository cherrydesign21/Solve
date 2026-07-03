import type { Metadata } from "next";
import LoanPrepaymentCalculator from "@/tools/loan-prepayment-calculator";

export const metadata: Metadata = {
  title: "Loan Prepayment Calculator",
  description: "See how a part-payment reduces your loan tenure or EMI.",
};

export default function Page() {
  return <LoanPrepaymentCalculator />;
}

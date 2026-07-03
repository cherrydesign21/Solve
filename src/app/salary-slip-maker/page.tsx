import type { Metadata } from "next";
import SalarySlipMaker from "@/tools/salary-slip-maker";

export const metadata: Metadata = {
  title: "Salary Slip Maker",
  description: "Create a professional salary slip with your logo and details, then export it as JPG or PDF.",
};

export default function Page() {
  return <SalarySlipMaker />;
}

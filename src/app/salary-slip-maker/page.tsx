import type { Metadata } from "next";
import SalarySlipMaker from "@/tools/salary-slip-maker";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Salary Slip Maker",
  description: "Create a professional salary slip with your logo and details, then export it as JPG or PDF.",
  path: "/salary-slip-maker",
});

export default function Page() {
  return <SalarySlipMaker />;
}

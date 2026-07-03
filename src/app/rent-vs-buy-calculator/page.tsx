import type { Metadata } from "next";
import RentVsBuyCalculator from "@/tools/rent-vs-buy-calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Rent vs Buy Calculator",
  description: "Compare the true cost of renting against buying a home.",
  path: "/rent-vs-buy-calculator",
});

export default function Page() {
  return <RentVsBuyCalculator />;
}

import type { Metadata } from "next";
import RentVsBuyCalculator from "@/tools/rent-vs-buy-calculator";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator",
  description: "Compare the true cost of renting against buying a home.",
};

export default function Page() {
  return <RentVsBuyCalculator />;
}

import type { Metadata } from "next";
import CurrencyConverter from "@/tools/currency-converter";

export const metadata: Metadata = {
  title: "Currency Converter",
  description: "Convert between world currencies using exchange rates updated hourly.",
};

export default function Page() {
  return <CurrencyConverter />;
}

import type { Metadata } from "next";
import CurrencyConverter from "@/tools/currency-converter";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Currency Converter",
  description: "Convert between world currencies using exchange rates updated hourly.",
  path: "/currency-converter",
});

export default function Page() {
  return <CurrencyConverter />;
}

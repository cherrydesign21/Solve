import type { Metadata } from "next";
import UnitConverter from "@/tools/unit-converter";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Unit Converter",
  description: "Convert length, weight, temperature, volume, speed, time, area and data instantly.",
  path: "/unit-converter",
});

export default function Page() {
  return <UnitConverter />;
}

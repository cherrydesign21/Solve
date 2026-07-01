import type { Metadata } from "next";
import UnitConverter from "@/tools/unit-converter";

export const metadata: Metadata = {
  title: "Unit Converter",
  description: "Convert length, weight, temperature, volume, speed, time, area and data instantly.",
};

export default function Page() {
  return <UnitConverter />;
}

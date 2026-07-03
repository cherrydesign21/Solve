import type { Metadata } from "next";
import TimezoneConverter from "@/tools/timezone-converter";

export const metadata: Metadata = {
  title: "Time Zone Converter",
  description: "Convert a date and time between any two time zones.",
};

export default function Page() {
  return <TimezoneConverter />;
}

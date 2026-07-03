import type { Metadata } from "next";
import TimezoneConverter from "@/tools/timezone-converter";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Time Zone Converter",
  description: "Convert a date and time between any two time zones.",
  path: "/timezone-converter",
});

export default function Page() {
  return <TimezoneConverter />;
}

import type { Metadata } from "next";
import BirthdayReminder from "@/tools/birthday-reminder";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Birthday Reminder",
  description: "Track upcoming birthdays and see who's next at a glance.",
  path: "/birthday-reminder",
});

export default function Page() {
  return <BirthdayReminder />;
}

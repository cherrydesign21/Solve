import type { Metadata } from "next";
import BirthdayReminder from "@/tools/birthday-reminder";

export const metadata: Metadata = {
  title: "Birthday Reminder",
  description: "Track upcoming birthdays and see who's next at a glance.",
};

export default function Page() {
  return <BirthdayReminder />;
}

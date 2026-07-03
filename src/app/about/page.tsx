import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage, SectionHeading, Paragraph, BulletList } from "@/components/ui/StaticPage";

export const metadata: Metadata = {
  title: "About",
  description: "What Solve is, and why it exists.",
};

export default function AboutPage() {
  return (
    <StaticPage title="About Solve">
      <Paragraph>
        Solve is a free collection of everyday calculators and converters — built to be fast,
        mobile-friendly, and refreshingly simple. No sign-ups, no clutter: pick a tool, enter your
        numbers, and watch the result update instantly as you type or drag.
      </Paragraph>

      <div>
        <SectionHeading>What you&apos;ll find here</SectionHeading>
        <Paragraph>Solve currently covers 30+ tools across seven categories:</Paragraph>
        <div className="mt-3">
          <BulletList
            items={[
              "Health and Fitness — BMI, BMR, calorie, body fat, ideal weight, protein intake, steps, and biological age calculators.",
              "Finance — EMI, SIP, tax, loan prepayment, compound interest, FD, RD, PPF, goal-based SIP, and percentage calculators.",
              "Business — salary slips, QR codes, time zone conversion, countdown timers, and age calculation.",
              "Real Estate — rent vs. buy comparisons and property tax estimates.",
              "Social Media — an image cropper with AI-assisted auto-cropping for social presets.",
              "Measurements — a general-purpose unit converter.",
              "Miscellaneous — solar panel sizing, currency conversion, and birthday reminders.",
            ]}
          />
        </div>
      </div>

      <div>
        <SectionHeading>How it works</SectionHeading>
        <Paragraph>
          Most calculators run entirely in your browser — your inputs are never sent to a server. A
          couple of tools genuinely need a server: the Birthday Reminder feature stores your entry so
          it can email a reminder later, and the Currency Converter fetches exchange rates from a
          third-party API. Both are described in detail in our{" "}
          <Link href="/privacy-policy" className="text-accent underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Why we built it</SectionHeading>
        <Paragraph>
          Most calculator sites online are slow, cluttered with pop-ups, or hide the result behind a
          &ldquo;Calculate&rdquo; button. Solve is the opposite: a dark, distraction-free interface
          where every value updates live, on any device.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Get in touch</SectionHeading>
        <Paragraph>
          Found a bug, or want to suggest a new tool? Visit our{" "}
          <Link href="/contact" className="text-accent underline underline-offset-2">
            Contact page
          </Link>
          .
        </Paragraph>
      </div>
    </StaticPage>
  );
}

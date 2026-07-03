import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage, SectionHeading, Paragraph, BulletList } from "@/components/ui/StaticPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Solve collects, uses and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <StaticPage title="Privacy Policy" updated="July 2026">
      <Paragraph>
        This Privacy Policy explains what information Solve (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects when you use this website,
        how we use it, and the choices you have. Solve is a free collection of calculators and converters —
        most tools run entirely in your browser and never send your inputs anywhere.
      </Paragraph>

      <div>
        <SectionHeading>Information we collect</SectionHeading>
        <div className="mt-3 flex flex-col gap-4">
          <Paragraph>
            <strong className="text-white">Calculator inputs.</strong> The numbers and options you enter into
            our calculators (loan amounts, dates, measurements, etc.) are processed locally in your browser and
            are not sent to or stored on our servers, unless stated otherwise below.
          </Paragraph>
          <Paragraph>
            <strong className="text-white">Birthday Reminder feature.</strong> If you choose to use the
            Birthday Reminder tool, we store the name, date of birth, and email address you provide in a
            database so we can send you a one-time reminder email ahead of that birthday. Your email address
            is used only for sending that reminder — it is never displayed publicly on the site, never
            returned by any of our public data endpoints, and never sold or shared with third parties for
            marketing. You can delete any entry (and the data associated with it) at any time directly from
            the Birthday Reminder page.
          </Paragraph>
          <Paragraph>
            <strong className="text-white">Local preferences.</strong> We store your selected display currency
            in your browser&apos;s local storage so it&apos;s remembered on your next visit. This stays on your device
            and is not sent to our servers.
          </Paragraph>
          <Paragraph>
            <strong className="text-white">Automatically collected data.</strong> Like most websites, our
            hosting provider (Vercel) may log standard technical information such as IP address, browser type,
            and pages visited, for security and reliability purposes.
          </Paragraph>
        </div>
      </div>

      <div>
        <SectionHeading>Cookies and advertising</SectionHeading>
        <Paragraph>
          Solve displays advertisements served by Google AdSense and its partners. Google and its partners may
          use cookies or similar technologies to serve ads based on your prior visits to this or other
          websites. You can learn more about how Google uses this data, and opt out of personalized
          advertising, at{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            policies.google.com/technologies/ads
          </a>
          . We do not currently run our own analytics or tracking scripts; if that changes, we&apos;ll update this
          policy.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Third-party service providers</SectionHeading>
        <Paragraph>We rely on a small number of trusted providers to run Solve:</Paragraph>
        <div className="mt-3">
          <BulletList
            items={[
              "Vercel — hosting and serverless infrastructure.",
              "Supabase (Postgres) — stores Birthday Reminder entries.",
              "Resend — delivers birthday reminder emails.",
              "exchangerate-api.com — supplies currency conversion rates (no personal data is sent to this service).",
              "Google AdSense — serves advertisements shown on this site.",
            ]}
          />
        </div>
      </div>

      <div>
        <SectionHeading>Your choices</SectionHeading>
        <Paragraph>
          You can delete any Birthday Reminder entry yourself from the tool page at any time. To request
          deletion of any other data we may hold about you, or to ask a question about this policy, contact us
          via the details on our{" "}
          <Link href="/contact" className="text-accent underline underline-offset-2">
            Contact page
          </Link>
          .
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Children&apos;s privacy</SectionHeading>
        <Paragraph>
          Solve is not directed at children under 13, and we do not knowingly collect personal information
          from children.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Changes to this policy</SectionHeading>
        <Paragraph>
          We may update this Privacy Policy from time to time as the site evolves. We&apos;ll update the
          &ldquo;Last updated&rdquo; date above when we do.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Contact us</SectionHeading>
        <Paragraph>
          Questions about this policy? Reach out via our{" "}
          <Link href="/contact" className="text-accent underline underline-offset-2">
            Contact page
          </Link>
          .
        </Paragraph>
      </div>
    </StaticPage>
  );
}

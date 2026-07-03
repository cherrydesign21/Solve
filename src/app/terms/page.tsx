import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage, SectionHeading, Paragraph } from "@/components/ui/StaticPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of Solve.",
};

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Use" updated="July 2026">
      <Paragraph>
        By using Solve, you agree to these terms. If you don&apos;t agree, please don&apos;t use the site.
      </Paragraph>

      <div>
        <SectionHeading>About the service</SectionHeading>
        <Paragraph>
          Solve provides free calculators and converters (EMI, SIP, tax, currency, unit conversion, and more)
          for general informational purposes only. Results are estimates based on the inputs you provide and
          the formulas we use — they are not professional financial, tax, medical, legal, or real-estate
          advice, and shouldn&apos;t be relied on as the sole basis for any decision. Always consult a
          qualified professional for advice specific to your situation.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>No warranty</SectionHeading>
        <Paragraph>
          Solve is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any kind,
          express or implied. We don&apos;t guarantee that calculations will always be accurate, that the site
          will be uninterrupted or error-free, or that it will meet your specific requirements.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Limitation of liability</SectionHeading>
        <Paragraph>
          To the fullest extent permitted by law, Solve and its operators are not liable for any indirect,
          incidental, or consequential damages arising from your use of, or inability to use, this site or any
          calculation results it produces.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Acceptable use</SectionHeading>
        <Paragraph>
          You agree not to misuse the site — for example, by attempting to disrupt its normal operation,
          scraping it at abusive scale, or using it for any unlawful purpose. The Birthday Reminder feature
          may only be used to store real reminders for real people with their consent.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Third-party content and ads</SectionHeading>
        <Paragraph>
          This site may display advertisements served by third parties, such as Google AdSense. We
          aren&apos;t responsible for the content of third-party ads or the sites they link to.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Intellectual property</SectionHeading>
        <Paragraph>
          The Solve name, design, and underlying code are owned by Solve unless otherwise noted.
          You&apos;re welcome to use the tools for personal or business purposes, but you may not copy,
          resell, or republish the site itself without permission.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Changes to these terms</SectionHeading>
        <Paragraph>
          We may update these terms from time to time. Continued use of the site after a change means you
          accept the updated terms.
        </Paragraph>
      </div>

      <div>
        <SectionHeading>Contact</SectionHeading>
        <Paragraph>
          Questions about these terms? Reach out via our{" "}
          <Link href="/contact" className="text-accent underline underline-offset-2">
            Contact page
          </Link>
          .
        </Paragraph>
      </div>
    </StaticPage>
  );
}

import type { Metadata } from "next";
import { StaticPage, Paragraph } from "@/components/ui/StaticPage";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with the Solve team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <StaticPage title="Contact">
      <Paragraph>
        Have a question, found a bug, or want to suggest a new tool? Send us a message below and we&apos;ll
        get back to you within a few business days.
      </Paragraph>

      <ContactForm />
    </StaticPage>
  );
}

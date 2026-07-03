import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { StaticPage, Paragraph } from "@/components/ui/StaticPage";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Solve team.",
};

const CONTACT_EMAIL = "singhparminder2192@gmail.com";

export default function ContactPage() {
  return (
    <StaticPage title="Contact">
      <Paragraph>
        Have a question, found a bug, or want to suggest a new tool? We&apos;d love to hear from you.
      </Paragraph>

      <Card className="flex items-center gap-4 p-5 sm:p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Email us</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-lg font-medium text-white hover:text-accent">
            {CONTACT_EMAIL}
          </a>
        </div>
      </Card>

      <Paragraph>We try to respond within a few business days.</Paragraph>
    </StaticPage>
  );
}

"use client";

import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import { getToolBySlug, type ToolCategory } from "@/lib/tools-registry";

interface ToolHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CATEGORY_SCHEMA_MAP: Record<ToolCategory, string> = {
  "Health and Fitness": "HealthApplication",
  Finance: "FinanceApplication",
  "Real Estate": "FinanceApplication",
  Business: "BusinessApplication",
  Measurements: "UtilitiesApplication",
  "Social Media": "MultimediaApplication",
  Miscellaneous: "UtilitiesApplication",
};

export function ToolHeader({ icon: Icon, title, description }: ToolHeaderProps) {
  const pathname = usePathname();
  const tool = getToolBySlug(pathname.replace(/^\//, ""));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    url: `${SITE_URL}${pathname}`,
    applicationCategory: tool ? CATEGORY_SCHEMA_MAP[tool.category] : "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="mb-8 flex items-start gap-4 sm:mb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-white sm:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-white/50">{description}</p>
      </div>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Cake,
  TrendingUp,
  Receipt,
  Ruler,
  ArrowLeftRight,
  Sun,
} from "lucide-react";

export interface ToolMeta {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
}

export const tools: ToolMeta[] = [
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    shortName: "EMI",
    description: "Work out monthly loan instalments, interest and payoff totals.",
    icon: Calculator,
  },
  {
    slug: "birthday-reminder",
    name: "Birthday Reminder",
    shortName: "Birthdays",
    description: "Never miss a birthday — track upcoming ones at a glance.",
    icon: Cake,
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    shortName: "SIP",
    description: "Project the future value of your monthly investments.",
    icon: TrendingUp,
  },
  {
    slug: "tax-calculator",
    name: "Tax Calculator",
    shortName: "Tax",
    description: "Estimate income tax under the old and new regimes.",
    icon: Receipt,
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    shortName: "Units",
    description: "Convert length, weight, temperature, speed and more.",
    icon: Ruler,
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    shortName: "Currency",
    description: "Live exchange rates across major world currencies.",
    icon: ArrowLeftRight,
  },
  {
    slug: "solar-panel-calculator",
    name: "Solar Panel Calculator",
    shortName: "Solar",
    description: "Size a rooftop solar system from your electricity bill.",
    icon: Sun,
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find((tool) => tool.slug === slug);
}

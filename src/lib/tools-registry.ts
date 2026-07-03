import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Cake,
  TrendingUp,
  Receipt,
  Ruler,
  ArrowLeftRight,
  Sun,
  Crop,
  FileSpreadsheet,
} from "lucide-react";

export const categoryOrder = [
  "Health and Fitness",
  "Finance",
  "Social Media",
  "Measurements",
  "Real Estate",
  "Miscellaneous",
  "Business",
] as const;

export type ToolCategory = (typeof categoryOrder)[number];

export interface ToolMeta {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
}

export const tools: ToolMeta[] = [
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    shortName: "EMI",
    description: "Work out monthly loan instalments, interest and payoff totals.",
    icon: Calculator,
    category: "Finance",
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    shortName: "SIP",
    description: "Project the future value of your monthly investments.",
    icon: TrendingUp,
    category: "Finance",
  },
  {
    slug: "tax-calculator",
    name: "Tax Calculator",
    shortName: "Tax",
    description: "Estimate income tax under the old and new regimes.",
    icon: Receipt,
    category: "Finance",
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    shortName: "Cropper",
    description: "Crop images by hand, or auto-generate perfectly sized social media assets.",
    icon: Crop,
    category: "Social Media",
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    shortName: "Units",
    description: "Convert length, weight, temperature, speed and more.",
    icon: Ruler,
    category: "Measurements",
  },
  {
    slug: "solar-panel-calculator",
    name: "Solar Panel Calculator",
    shortName: "Solar",
    description: "Size a rooftop solar system from your electricity bill.",
    icon: Sun,
    category: "Miscellaneous",
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    shortName: "Currency",
    description: "Live exchange rates across major world currencies.",
    icon: ArrowLeftRight,
    category: "Miscellaneous",
  },
  {
    slug: "birthday-reminder",
    name: "Birthday Reminder",
    shortName: "Birthdays",
    description: "Never miss a birthday — track upcoming ones at a glance.",
    icon: Cake,
    category: "Miscellaneous",
  },
  {
    slug: "salary-slip-maker",
    name: "Salary Slip Maker",
    shortName: "Salary Slip",
    description: "Build a professional salary slip and export it as JPG or PDF.",
    icon: FileSpreadsheet,
    category: "Business",
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(): { category: ToolCategory; tools: ToolMeta[] }[] {
  return categoryOrder.map((category) => ({
    category,
    tools: tools.filter((tool) => tool.category === category),
  }));
}

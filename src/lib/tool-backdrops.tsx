import type { LucideIcon } from "lucide-react";
import {
  Apple,
  ArrowLeftRight,
  Banknote,
  Beef,
  Cake,
  Calculator,
  Camera,
  Coins,
  Crop,
  FileSpreadsheet,
  FileText,
  Flame,
  Footprints,
  Grid3x3,
  HeartPulse,
  Landmark,
  LayoutGrid,
  LineChart,
  Moon,
  PartyPopper,
  Percent,
  PersonStanding,
  Receipt,
  Ruler,
  Salad,
  Scale,
  Sparkles,
  Stamp,
  Sun,
  TrendingUp,
  Utensils,
  Weight,
  Zap,
} from "lucide-react";

export interface BackdropIcon {
  icon: LucideIcon;
  className: string;
}

export const toolBackdrops: Record<string, BackdropIcon[]> = {
  home: [
    { icon: Sparkles, className: "-right-16 -top-20 h-[380px] w-[380px] rotate-12 opacity-[0.035]" },
    { icon: LayoutGrid, className: "-left-16 bottom-0 h-[300px] w-[300px] -rotate-12 opacity-[0.03]" },
  ],
  "bmi-calculator": [
    { icon: PersonStanding, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.04]" },
    { icon: Scale, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
  "bmr-calculator": [
    { icon: Flame, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.045]" },
    { icon: HeartPulse, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
  "calorie-calculator": [
    { icon: Utensils, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.04]" },
    { icon: Apple, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
  "body-fat-calculator": [
    { icon: Percent, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.04]" },
    { icon: PersonStanding, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
  "ideal-body-weight-calculator": [
    { icon: Weight, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.04]" },
    { icon: Scale, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
  "protein-intake-calculator": [
    { icon: Beef, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.04]" },
    { icon: Salad, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
  "steps-calculator": [
    { icon: Footprints, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.04]" },
    { icon: Flame, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
  "biological-age-calculator": [
    { icon: HeartPulse, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.045]" },
    { icon: Moon, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
  "emi-calculator": [
    { icon: Calculator, className: "-right-20 -top-16 h-[420px] w-[420px] rotate-6 opacity-[0.04]" },
    { icon: Landmark, className: "-left-20 bottom-10 h-[280px] w-[280px] -rotate-6 opacity-[0.03]" },
  ],
  "birthday-reminder": [
    { icon: Cake, className: "-right-16 -top-14 h-[400px] w-[400px] rotate-6 opacity-[0.045]" },
    { icon: PartyPopper, className: "-left-16 bottom-8 h-[260px] w-[260px] -rotate-12 opacity-[0.035]" },
  ],
  "sip-calculator": [
    { icon: TrendingUp, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.04]" },
    { icon: LineChart, className: "-left-20 bottom-10 h-[280px] w-[280px] -rotate-6 opacity-[0.03]" },
  ],
  "tax-calculator": [
    { icon: Receipt, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.04]" },
    { icon: FileText, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-12 opacity-[0.03]" },
  ],
  "unit-converter": [
    { icon: Ruler, className: "-right-16 -top-14 h-[400px] w-[400px] rotate-12 opacity-[0.04]" },
    { icon: Scale, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
  "currency-converter": [
    { icon: ArrowLeftRight, className: "-right-16 -top-16 h-[380px] w-[380px] rotate-6 opacity-[0.04]" },
    { icon: Banknote, className: "-left-20 bottom-10 h-[280px] w-[280px] -rotate-6 opacity-[0.03]" },
    { icon: Coins, className: "right-10 bottom-0 h-[200px] w-[200px] rotate-12 opacity-[0.03]" },
  ],
  "solar-panel-calculator": [
    { icon: Sun, className: "-right-16 -top-16 h-[420px] w-[420px] opacity-[0.045]" },
    { icon: Grid3x3, className: "-left-20 bottom-10 h-[280px] w-[280px] -rotate-6 opacity-[0.03]" },
    { icon: Zap, className: "right-14 bottom-4 h-[180px] w-[180px] rotate-12 opacity-[0.03]" },
  ],
  "image-cropper": [
    { icon: Crop, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.04]" },
    { icon: Camera, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
  "salary-slip-maker": [
    { icon: FileSpreadsheet, className: "-right-16 -top-16 h-[400px] w-[400px] rotate-6 opacity-[0.04]" },
    { icon: Stamp, className: "-left-20 bottom-10 h-[260px] w-[260px] -rotate-6 opacity-[0.03]" },
  ],
};

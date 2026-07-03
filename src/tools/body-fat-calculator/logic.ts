import type { GaugeZone } from "@/components/ui/GaugeBar";
import type { Gender } from "@/lib/health";

export function calculateBodyFat(
  gender: Gender,
  heightCm: number,
  neckCm: number,
  waistCm: number,
  hipCm: number
): number {
  if (gender === "male") {
    const diff = Math.max(1, waistCm - neckCm);
    return 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm)) - 450;
  }
  const diff = Math.max(1, waistCm + hipCm - neckCm);
  return 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.221 * Math.log10(heightCm)) - 450;
}

export const bodyFatZonesMale: GaugeZone[] = [
  { label: "Essential Fat", color: "#38bdf8", upTo: 5 },
  { label: "Athletic", color: "#4ade80", upTo: 13 },
  { label: "Fitness", color: "#d9ff00", upTo: 17 },
  { label: "Average", color: "#fb923c", upTo: 24 },
  { label: "Obese", color: "#f87171", upTo: 40 },
];

export const bodyFatZonesFemale: GaugeZone[] = [
  { label: "Essential Fat", color: "#38bdf8", upTo: 13 },
  { label: "Athletic", color: "#4ade80", upTo: 20 },
  { label: "Fitness", color: "#d9ff00", upTo: 24 },
  { label: "Average", color: "#fb923c", upTo: 31 },
  { label: "Obese", color: "#f87171", upTo: 45 },
];

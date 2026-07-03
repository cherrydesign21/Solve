import type { GaugeZone } from "@/components/ui/GaugeBar";

export const bmiZones: GaugeZone[] = [
  { label: "Underweight", color: "#38bdf8", upTo: 18.5 },
  { label: "Normal", color: "#d9ff00", upTo: 25 },
  { label: "Overweight", color: "#fb923c", upTo: 30 },
  { label: "Obese", color: "#f87171", upTo: 45 },
];

export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  if (heightM <= 0) return 0;
  return weightKg / (heightM * heightM);
}

export function healthyWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return { min: 18.5 * heightM * heightM, max: 24.9 * heightM * heightM };
}

export function bmiCategory(bmi: number): string {
  const zone = bmiZones.find((z) => bmi <= z.upTo);
  return zone?.label ?? bmiZones[bmiZones.length - 1].label;
}

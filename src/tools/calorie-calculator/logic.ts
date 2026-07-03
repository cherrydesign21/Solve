import { activityLevels, calculateBmr, type Gender } from "@/lib/health";

export { activityLevels };
export type { Gender };

export type Goal = "lose" | "maintain" | "gain";

export const goalOptions: { id: Goal; label: string; adjustment: number }[] = [
  { id: "lose", label: "Lose Weight", adjustment: -500 },
  { id: "maintain", label: "Maintain", adjustment: 0 },
  { id: "gain", label: "Gain Weight", adjustment: 500 },
];

export interface CalorieResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export function calculateCalories(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
  activityMultiplier: number,
  goalAdjustment: number
): CalorieResult {
  const bmr = calculateBmr(gender, weightKg, heightCm, age);
  const tdee = bmr * activityMultiplier;
  const targetCalories = Math.max(1200, tdee + goalAdjustment);

  const proteinG = weightKg * 1.8;
  const proteinCal = proteinG * 4;
  const fatCal = targetCalories * 0.25;
  const fatG = fatCal / 9;
  const carbsCal = Math.max(0, targetCalories - proteinCal - fatCal);
  const carbsG = carbsCal / 4;

  return { bmr, tdee, targetCalories, proteinG, carbsG, fatG };
}

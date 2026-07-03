import type { Gender } from "@/lib/health";

export interface StepsResult {
  distanceKm: number;
  calories: number;
  activeMinutes: number;
}

export function calculateSteps(steps: number, weightKg: number, heightCm: number, gender: Gender): StepsResult {
  const strideConstant = gender === "male" ? 0.415 : 0.413;
  const strideLengthM = (heightCm / 100) * strideConstant;
  const distanceKm = (steps * strideLengthM) / 1000;
  const calories = weightKg * distanceKm * 0.75; // approx kcal per kg per km walking
  const activeMinutes = steps / 100; // ~100 steps/minute at an average walking pace

  return { distanceKm, calories, activeMinutes };
}

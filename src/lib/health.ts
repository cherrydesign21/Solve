export type Gender = "male" | "female";

export function calculateBmr(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export interface ActivityLevel {
  id: string;
  label: string;
  description: string;
  multiplier: number;
}

export const activityLevels: ActivityLevel[] = [
  { id: "sedentary", label: "Sedentary", description: "Little or no exercise", multiplier: 1.2 },
  { id: "light", label: "Light", description: "Exercise 1–3 days/week", multiplier: 1.375 },
  { id: "moderate", label: "Moderate", description: "Exercise 3–5 days/week", multiplier: 1.55 },
  { id: "active", label: "Active", description: "Exercise 6–7 days/week", multiplier: 1.725 },
  { id: "very-active", label: "Very Active", description: "Physical job or 2x/day training", multiplier: 1.9 },
];

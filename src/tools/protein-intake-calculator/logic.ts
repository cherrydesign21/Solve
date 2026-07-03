export interface ProteinLevel {
  id: string;
  label: string;
  description: string;
  gPerKg: number;
}

export const proteinLevels: ProteinLevel[] = [
  { id: "sedentary", label: "Sedentary", description: "Minimal exercise", gPerKg: 0.8 },
  { id: "light", label: "Lightly Active", description: "Light exercise 1–3x/week", gPerKg: 1.2 },
  { id: "active", label: "Active", description: "Regular training, 4–6x/week", gPerKg: 1.6 },
  { id: "athlete", label: "Athlete", description: "Intense training or muscle gain", gPerKg: 2.0 },
];

export function calculateProtein(weightKg: number, gPerKg: number): number {
  return weightKg * gPerKg;
}

export interface FactorOption {
  id: string;
  label: string;
  modifier: number;
}

export const smokingOptions: FactorOption[] = [
  { id: "never", label: "Never Smoked", modifier: -1 },
  { id: "former", label: "Former Smoker", modifier: 1 },
  { id: "current", label: "Current Smoker", modifier: 6 },
];

export const exerciseOptions: FactorOption[] = [
  { id: "none", label: "Rarely", modifier: 3 },
  { id: "light", label: "1–2 Days/Week", modifier: 1 },
  { id: "regular", label: "3–5 Days/Week", modifier: -3 },
  { id: "daily", label: "Daily", modifier: -5 },
];

export const dietOptions: FactorOption[] = [
  { id: "poor", label: "Mostly Processed", modifier: 3 },
  { id: "average", label: "Balanced", modifier: 0 },
  { id: "good", label: "Mostly Whole Foods", modifier: -2 },
  { id: "excellent", label: "Whole Foods, Home-cooked", modifier: -4 },
];

export const alcoholOptions: FactorOption[] = [
  { id: "none", label: "None / Rare", modifier: -1 },
  { id: "moderate", label: "Moderate", modifier: 1 },
  { id: "heavy", label: "Heavy", modifier: 4 },
];

export const stressOptions: FactorOption[] = [
  { id: "low", label: "Low", modifier: -2 },
  { id: "moderate", label: "Moderate", modifier: 0 },
  { id: "high", label: "High", modifier: 3 },
];

export function sleepModifier(hours: number): number {
  if (hours < 5) return 3;
  if (hours < 6) return 1;
  if (hours <= 9) return -2;
  return 0;
}

export function bmiModifier(bmi: number): number {
  if (bmi < 18.5) return 1;
  if (bmi < 25) return -1;
  if (bmi < 30) return 1;
  return 3;
}

export interface BiologicalAgeInputs {
  chronologicalAge: number;
  bmi: number;
  sleepHours: number;
  smokingModifier: number;
  exerciseModifier: number;
  dietModifier: number;
  alcoholModifier: number;
  stressModifier: number;
}

export function calculateBiologicalAge(inputs: BiologicalAgeInputs): number {
  const total =
    inputs.smokingModifier +
    inputs.exerciseModifier +
    inputs.dietModifier +
    inputs.alcoholModifier +
    inputs.stressModifier +
    sleepModifier(inputs.sleepHours) +
    bmiModifier(inputs.bmi);

  const biologicalAge = inputs.chronologicalAge + total;
  return Math.max(inputs.chronologicalAge - 15, Math.min(inputs.chronologicalAge + 20, biologicalAge));
}

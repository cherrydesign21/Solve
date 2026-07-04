export type LengthUnit = "cm" | "in" | "ft";

const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;

export function cmToUnit(cm: number, unit: LengthUnit): number {
  if (unit === "cm") return cm;
  if (unit === "in") return cm / CM_PER_INCH;
  return cm / CM_PER_FOOT;
}

export function unitToCm(value: number, unit: LengthUnit): number {
  if (unit === "cm") return value;
  if (unit === "in") return value * CM_PER_INCH;
  return value * CM_PER_FOOT;
}

export function formatFeetInches(cm: number): string {
  const totalInches = cm / CM_PER_INCH;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

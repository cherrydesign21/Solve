export interface CompoundingOption {
  id: string;
  label: string;
  timesPerYear: number;
}

export const compoundingOptions: CompoundingOption[] = [
  { id: "annually", label: "Annually", timesPerYear: 1 },
  { id: "semiannually", label: "Semi-Annually", timesPerYear: 2 },
  { id: "quarterly", label: "Quarterly", timesPerYear: 4 },
  { id: "monthly", label: "Monthly", timesPerYear: 12 },
];

export interface CompoundInterestResult {
  maturityAmount: number;
  totalInterest: number;
}

export function calculateCompoundInterest(
  principal: number,
  annualRatePct: number,
  years: number,
  timesPerYear: number
): CompoundInterestResult {
  const maturityAmount = principal * Math.pow(1 + annualRatePct / 100 / timesPerYear, timesPerYear * years);
  return { maturityAmount, totalInterest: maturityAmount - principal };
}

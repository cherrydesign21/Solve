export interface RdResult {
  maturityAmount: number;
  totalInvested: number;
  totalInterest: number;
}

export function calculateRd(monthlyDeposit: number, annualRatePct: number, tenureMonths: number): RdResult {
  const totalInvested = monthlyDeposit * tenureMonths;
  const totalInterest = (monthlyDeposit * (annualRatePct / 100) * (tenureMonths * (tenureMonths + 1))) / (2 * 12);
  const maturityAmount = totalInvested + totalInterest;
  return { maturityAmount, totalInvested, totalInterest };
}

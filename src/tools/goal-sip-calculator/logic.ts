export interface GoalSipResult {
  requiredMonthlyInvestment: number;
  totalInvested: number;
  totalReturns: number;
}

export function calculateGoalSip(targetAmount: number, annualRatePct: number, years: number): GoalSipResult {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualRatePct / 12 / 100;

  const requiredMonthlyInvestment =
    monthlyRate === 0
      ? targetAmount / months
      : targetAmount / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

  const totalInvested = requiredMonthlyInvestment * months;
  return { requiredMonthlyInvestment, totalInvested, totalReturns: targetAmount - totalInvested };
}

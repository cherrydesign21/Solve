export interface PpfResult {
  maturityAmount: number;
  totalInvested: number;
  totalInterest: number;
}

export function calculatePpf(annualContribution: number, annualRatePct: number, years: number): PpfResult {
  let balance = 0;
  for (let year = 1; year <= years; year++) {
    balance += annualContribution;
    balance += balance * (annualRatePct / 100);
  }
  const totalInvested = annualContribution * years;
  return { maturityAmount: balance, totalInvested, totalInterest: balance - totalInvested };
}

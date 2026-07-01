export type SipMode = "sip" | "lumpsum";

export interface SipResult {
  invested: number;
  returns: number;
  total: number;
}

export function calculateSip(monthlyAmount: number, annualRatePct: number, years: number): SipResult {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualRatePct / 12 / 100;
  const invested = monthlyAmount * months;

  const total =
    monthlyRate === 0
      ? invested
      : monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

  return { invested, returns: total - invested, total };
}

export function calculateLumpsum(principal: number, annualRatePct: number, years: number): SipResult {
  const total = principal * Math.pow(1 + annualRatePct / 100, years);
  return { invested: principal, returns: total - principal, total };
}

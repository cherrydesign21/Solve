export interface FdResult {
  maturityAmount: number;
  totalInterest: number;
}

// Indian bank FDs compound quarterly by convention.
const COMPOUNDS_PER_YEAR = 4;

export function calculateFd(principal: number, annualRatePct: number, years: number): FdResult {
  const maturityAmount = principal * Math.pow(1 + annualRatePct / 100 / COMPOUNDS_PER_YEAR, COMPOUNDS_PER_YEAR * years);
  return { maturityAmount, totalInterest: maturityAmount - principal };
}

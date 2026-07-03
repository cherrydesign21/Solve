export type PrepaymentMode = "reduce-tenure" | "reduce-emi";

export interface PrepaymentResult {
  originalEmi: number;
  originalTenureMonths: number;
  originalTotalInterest: number;
  newEmi: number;
  newTenureMonths: number;
  newTotalInterest: number;
  interestSaved: number;
  tenureReducedMonths: number;
}

function emiFormula(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function calculatePrepayment(
  loanAmount: number,
  annualRatePct: number,
  tenureYears: number,
  prepaymentAmount: number,
  mode: PrepaymentMode
): PrepaymentResult {
  const monthlyRate = annualRatePct / 12 / 100;
  const originalTenureMonths = Math.max(1, Math.round(tenureYears * 12));
  const originalEmi = emiFormula(loanAmount, monthlyRate, originalTenureMonths);
  const originalTotalInterest = originalEmi * originalTenureMonths - loanAmount;

  const cappedPrepayment = Math.min(prepaymentAmount, loanAmount * 0.98);
  const newPrincipal = Math.max(0, loanAmount - cappedPrepayment);

  let newEmi: number;
  let newTenureMonths: number;

  if (mode === "reduce-tenure") {
    newEmi = originalEmi;
    if (monthlyRate === 0) {
      newTenureMonths = newEmi > 0 ? newPrincipal / newEmi : 0;
    } else if (newEmi > newPrincipal * monthlyRate) {
      newTenureMonths = Math.log(newEmi / (newEmi - newPrincipal * monthlyRate)) / Math.log(1 + monthlyRate);
    } else {
      newTenureMonths = originalTenureMonths;
    }
  } else {
    newTenureMonths = originalTenureMonths;
    newEmi = emiFormula(newPrincipal, monthlyRate, newTenureMonths);
  }

  const totalPaidNew = cappedPrepayment + newEmi * newTenureMonths;
  const newTotalInterest = totalPaidNew - loanAmount;
  const interestSaved = originalTotalInterest - newTotalInterest;

  return {
    originalEmi,
    originalTenureMonths,
    originalTotalInterest,
    newEmi,
    newTenureMonths,
    newTotalInterest,
    interestSaved,
    tenureReducedMonths: Math.max(0, originalTenureMonths - newTenureMonths),
  };
}

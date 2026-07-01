export type LoanType = "personal" | "home" | "car";

export interface LoanTypeConfig {
  label: string;
  amountMin: number;
  amountMax: number;
  amountStep: number;
  defaultAmount: number;
  rateMin: number;
  rateMax: number;
  defaultRate: number;
  tenureMin: number;
  tenureMax: number;
  defaultTenure: number;
}

export const loanTypeConfig: Record<LoanType, LoanTypeConfig> = {
  personal: {
    label: "Personal Loan EMI Calculator",
    amountMin: 100_000,
    amountMax: 1_00_00_000,
    amountStep: 5_000,
    defaultAmount: 10_00_000,
    rateMin: 1,
    rateMax: 30,
    defaultRate: 7,
    tenureMin: 1,
    tenureMax: 30,
    defaultTenure: 10,
  },
  home: {
    label: "Home Loan EMI Calculator",
    amountMin: 5_00_000,
    amountMax: 5_00_00_000,
    amountStep: 10_000,
    defaultAmount: 40_00_000,
    rateMin: 6,
    rateMax: 15,
    defaultRate: 8.5,
    tenureMin: 5,
    tenureMax: 30,
    defaultTenure: 20,
  },
  car: {
    label: "Car Loan EMI Calculator",
    amountMin: 1_00_000,
    amountMax: 50_00_000,
    amountStep: 5_000,
    defaultAmount: 8_00_000,
    rateMin: 6,
    rateMax: 20,
    defaultRate: 9,
    tenureMin: 1,
    tenureMax: 8,
    defaultTenure: 5,
  },
};

export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  principal: number;
}

export function calculateEmi(
  principal: number,
  annualRatePct: number,
  tenureYears: number
): EmiResult {
  const months = Math.max(1, Math.round(tenureYears * 12));
  const monthlyRate = annualRatePct / 12 / 100;

  const emi =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  const totalAmount = emi * months;
  const totalInterest = totalAmount - principal;

  return { emi, totalInterest, totalAmount, principal };
}

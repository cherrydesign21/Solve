import { calculateEmi } from "@/tools/emi-calculator/logic";

export interface RentVsBuyInputs {
  homePrice: number;
  downPaymentPct: number;
  loanRatePct: number;
  loanTenureYears: number;
  monthlyRent: number;
  rentIncreasePct: number;
  homeAppreciationPct: number;
  investmentReturnPct: number;
  horizonYears: number;
}

export interface RentVsBuyResult {
  downPayment: number;
  emi: number;
  totalEmiPaid: number;
  totalRentPaid: number;
  homeEquity: number;
  investmentCorpus: number;
  buyNetCost: number;
  rentNetCost: number;
  difference: number;
  cheaper: "buy" | "rent";
  breakevenYear: number | null;
}

export function calculateRentVsBuy(inputs: RentVsBuyInputs): RentVsBuyResult {
  const {
    homePrice,
    downPaymentPct,
    loanRatePct,
    loanTenureYears,
    monthlyRent,
    rentIncreasePct,
    homeAppreciationPct,
    investmentReturnPct,
    horizonYears,
  } = inputs;

  const downPayment = homePrice * (downPaymentPct / 100);
  const loanAmount = homePrice - downPayment;
  const { emi } = calculateEmi(loanAmount, loanRatePct, loanTenureYears);
  const monthlyLoanRate = loanRatePct / 12 / 100;
  const monthlyInvestReturn = investmentReturnPct / 12 / 100;
  const loanMonths = Math.round(loanTenureYears * 12);
  const totalMonths = Math.round(horizonYears * 12);

  let loanBalance = loanAmount;
  let investmentCorpus = downPayment;
  let totalEmiPaid = 0;
  let totalRentPaid = 0;
  let rent = monthlyRent;
  let breakevenYear: number | null = null;

  for (let month = 1; month <= totalMonths; month++) {
    if (month <= loanMonths && loanBalance > 0) {
      const interestPortion = loanBalance * monthlyLoanRate;
      const principalPortion = Math.min(loanBalance, emi - interestPortion);
      loanBalance = Math.max(0, loanBalance - principalPortion);
      totalEmiPaid += emi;
    }

    totalRentPaid += rent;
    const investableDiff = Math.max(0, emi - rent);
    investmentCorpus = investmentCorpus * (1 + monthlyInvestReturn) + investableDiff;

    if (month % 12 === 0) {
      rent = rent * (1 + rentIncreasePct / 100);

      if (breakevenYear === null) {
        const yearsElapsed = month / 12;
        const homeValue = homePrice * Math.pow(1 + homeAppreciationPct / 100, yearsElapsed);
        const equity = homeValue - loanBalance;
        const buyNetCostSoFar = downPayment + totalEmiPaid - equity;
        const rentNetCostSoFar = totalRentPaid - investmentCorpus;
        if (buyNetCostSoFar <= rentNetCostSoFar) breakevenYear = yearsElapsed;
      }
    }
  }

  const homeValue = homePrice * Math.pow(1 + homeAppreciationPct / 100, horizonYears);
  const homeEquity = homeValue - loanBalance;
  const buyNetCost = downPayment + totalEmiPaid - homeEquity;
  const rentNetCost = totalRentPaid - investmentCorpus;
  const difference = rentNetCost - buyNetCost;

  return {
    downPayment,
    emi,
    totalEmiPaid,
    totalRentPaid,
    homeEquity,
    investmentCorpus,
    buyNetCost,
    rentNetCost,
    difference,
    cheaper: difference >= 0 ? "buy" : "rent",
    breakevenYear,
  };
}
